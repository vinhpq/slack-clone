import React from 'react'
import "./Chat.css";
import { useParams } from "react-router-dom";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import db from "./firebase";
import { useState, useEffect } from 'react';
import Message from "./Message";
import ChatInput from "./ChatInput";
import axios from './axios'
import Pusher from 'pusher-js'

const pusher = new Pusher('bcbbd24c8189caf5d15a', {
    cluster: 'ap1'
});

function Chat() {
    const { roomId } = useParams();
    const [roomDetails, setRoomDetails] = useState(null);
    const [roomMessages, setRoomMessages] = useState([]);

    const getConversation = () => {
        axios.get(`/get/conversation?id=${roomId}`).then((res) => {
            setRoomDetails(res.data[0].channelName)
            setRoomMessages(res.data[0].conversation)
        })
    }

    useEffect(() => {
        // NOTE: FIREBASE usage
        // if(roomId) {
        //     db.collection('rooms').doc(roomId)
        //     .onSnapshot((snapshot) => setRoomDetails(snapshot.data()))
        // }

        // db.collection('rooms')
        // .doc(roomId)
        // .collection('messages')
        // .orderBy('timestamp', 'asc')
        // .onSnapshot((snapshot) => setRoomMessages(snapshot.docs.map(doc => doc.data())))

        // NOTE: MERN usage
        if(roomId) {
            getConversation()
            const channel = pusher.subscribe('conversation');
            channel.bind('newMessage', function(data){
                getConversation()
            })
        }
    }, [roomId]);

    // console.log(roomDetails);
    console.log("MESSAGES ===>", roomMessages);
    return (
        <div className="chat">
            <div className="chat__header">
                <div className="chat__headerLeft">
                    <h4 className="chat__channelName">
                        {/* <strong>#{roomDetails?.name}</strong> */}
                        <strong>#{roomDetails}</strong>
                        <StarBorderOutlinedIcon />
                    </h4>
                </div>

                <div className="chat__headerRight">
                    <p>
                        <InfoOutlinedIcon /> Details
                    </p>
                </div>
            </div>

            <div className="chat__messages">
                {roomMessages.map(({ message, timestamp, user, userImage }) => (
                    <Message 
                        message={message}
                        timestamp={timestamp}
                        user={user}
                        userImage={userImage}
                    />
                ))} 
            </div>

            {/* <ChatInput channelName={roomDetails?.name} channelId={roomId} /> */}
            <ChatInput channelName={roomDetails} channelId={roomId} />
        </div>
    )
}

export default Chat;
