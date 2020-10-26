import React from 'react'
import "./SidebarOption.css";
import { useHistory } from 'react-router-dom';
import db from "./firebase";
import axios from './axios';

function SidebarOption({ Icon, title, id, addChannelOption }) {

    const history = useHistory();

    const selectChannel = () => {
        console.log("========", id);
        if(id) {
            history.push(`/room/${id}`)
        } else {
            history.push(title);
        }
    }

    const addChannel = () => {
        const channelName = prompt("Please add a channel name");

        if(channelName) {
            // NOTE: FIREBASE usage
            // db.collection("rooms").add({
            //     name: channelName,
            // })

            // NOTE: MERN
            axios.post('/new/channel', {
                channelName: channelName
            })
        }
    }

    return (
        <div className="sidebarOption" onClick={addChannelOption ? addChannel : selectChannel}>
            { Icon && <Icon className="sidebarOption__icon" /> }
            { Icon ? ( <h3>{title}</h3> ) : ( <h3 className="sidebarOption__channel"><span className="sidebarOption__hash">#</span> {title}</h3> ) }
        </div>
    )
}

export default SidebarOption;