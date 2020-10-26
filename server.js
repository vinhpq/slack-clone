import express from 'express'
import mongoose from 'mongoose'
import Pusher from 'pusher'
import mongoData from './dbMessages.js'
import cors from 'cors';

// app config
const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
    appId: '1095725',
    key: 'bcbbd24c8189caf5d15a',
    secret: '5b476328ab302a1fe024',
    cluster: 'ap1',
    encrypted: true
  });

const db = mongoose.connection

db.once("open", () => {
    console.log("DB connected");
    const msgCollection = db.collection("conversations");
    const changeStream = msgCollection.watch();
    
    changeStream.on('change', (change) => {
        console.log(change);
        if (change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('channels', 'newChannel', {
                    'change': change
            });
        } else if (change.operationType === 'update') {
            pusher.trigger('conversation', 'newMessage', {
                'change': change
            })
        } else {
            console.log("Error triggering Pusher");
        }
    });
})

// middlewares
app.use(express.json());
app.use(cors());
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*'),
//     res.setHeader('Access-Control-Allow-Headers', '*'),
//     next()
// })


// DB config
const connection_url = 'mongodb+srv://admin:IZoFYkuSIedV5SQF@cluster0.q3gtp.mongodb.net/slackdb?retryWrites=true&w=majority'

mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

// api endpoints
app.get('/', (req, res) => res.status(200).send('hello world'));
app.get('/get/channelList', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            let channels = []

            data.map((channelData) => {
                const channelInfo = {
                    id: channelData._id,
                    name: channelData.channelName
                }

                channels.push(channelInfo)
            })

            res.status(200).send(channels);
        }
    });
})

app.get('/get/conversation', (req, res) => {
    const id = req.query.id

    console.log(id)
    mongoData.find({ _id: id }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
            console.log(data)
        }
    });
})

app.post('/new/channel', (req, res) => {
    const dbChannel = req.body;

    mongoData.create(dbChannel, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
})

app.post('/new/message', (req, res) => {
    const id = req.query.id;
    const newMessage = req.body;

    mongoData.update(
        {_id: id},
        {$push: { conversation: newMessage }},
        (err, data) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(201).send(data);
            }
        }
    )
})

// Listen
app.listen(port, () => console.log(`listening on localhost:${port}`));
