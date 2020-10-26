import React, { useState }  from 'react'
import "./ChatInput.css";
import { useStateValue } from './StateProvider';
import db from "./firebase";
import firebase from "firebase";
import axios from './axios';

function ChatInput({ channelName, channelId }) {
    const [input, setInput] = useState('');
    const [{ user }] = useStateValue();

    const sendMessage = e => {
        e.preventDefault();

        if(channelId) {
            // NOTE: FIREBASE usage
            // db.collection('rooms').doc(channelId).collection('messages').add({
            //     message: input,
            //     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            //     user: user.displayName,
            //     userImage: user.photoURL
            // })

            // NOTE: MERN
            axios.post(`/new/message?id=${channelId}`, {
                message: input,
                timestamp: Date.now(),
                user: user.displayName,
                userImage: user.photoURL
            })
        }

        setInput("");
    }
    return (
        <div className="chatInput">
            <form>
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Message #${channelName?.toLowerCase()}`}/>
                <button type="submit" onClick={sendMessage} >SEND</button>
            </form>
        </div>
    )
}

export default ChatInput
