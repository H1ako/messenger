import React from 'react';
import ChatsFriends from "./ChatMembersList"; 
import Chats from './Chats';

class Chats_Route extends React.Component {

    state = {
        friends_modal: false,
    }

    setModalState = async () => {
        this.setState({friends_modal: !this.state.friends_modal})
    }

    render() {
        return (
            <div id='chat-area'>
                <button id='new-chat-btn' onClick={this.setModalState}>New Chat</button>
                <Chats />
                <ChatsFriends funcModal={this.setModalState} state={this.state.friends_modal}/>
            </div>
        )
    }
}

export default Chats_Route;