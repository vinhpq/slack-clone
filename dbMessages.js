import mongoose from 'mongoose'

const slackSchema = mongoose.Schema({
    channelName: String,
    conversation: [
        {
            message: String,
            user: String,
            timestamp: String,
            userImage: String,
        }
    ]
});

// Collection inside the db
export default mongoose.model('conversation', slackSchema);