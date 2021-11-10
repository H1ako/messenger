import React from 'react';

class Chats extends React.Component {

    state = {
        messages: [],
        message_type: 'dialog',
    }

    messageBtnClick = async (message_type) => {
        await this.setState({
            message_type: message_type
        });
        await this.getMessages();
    }

    getMessages = async (e) => {
        const data = {
            message_type: this.state.message_type
        };
        await fetch('/message_action/get_chats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then((response) => {
            if (response) {
                this.setState({messages: response});
                console.log(response);
            }
        })
        .catch(err => console.log(err))
    }

    componentDidMount() {
        this.getMessages();
    }

    render() {
        return (
            <div>
                <div id='chats' className='chats'>
                    <div className="chats__btns-area">
                        <button className="ui-btn" onClick={() => this.messageBtnClick('dialog')}>Dialogs</button>
                        <button className="ui-btn" onClick={() => this.messageBtnClick('chat')}>Chats</button>
                        <button className='ui-btn' onClick={this.props.new_chat_func}>New Chat</button>
                    </div>
                    <div className='chats__messages'>
                        {this.state.messages.map(message => 
                            <Chat 
                            key={message.id}
                            id={message.chat_id}
                            type={this.state.message_type}
                            text={message.last_message}
                            user_name={message.user_name}
                            last_message_user={message.last_message_user}
                            mess_id={message.mess_id}
                            chat_name={message.name}
                            user_id={message.to_id}
                            /> 
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

class Chat extends React.Component {
    render() {
        if (this.props.type == 'chat') {
            return (
                <div className='message'>
                    <div className='message__pic'></div>
                    <div className='message__wrapper'>
                        <a href={`/message/${this.props.id}?chat`}>
                            <div className='message__wrapper__name'>{this.props.chat_name}</div>
                        </a>
                        <div className='message__wrapper__content'>
                            <div className='content__user__name'>{this.props.user_name}</div>
                            <div className='content__user__message'>
                                <span className='content__text'>{this.props.text}</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            );
        }

        else if (this.props.type == 'dialog') {
            return (
                <div className='message'>
                    <div className='message__pic'></div>
                    <div className='message__wrapper'>
                        <a href={`/message/${this.props.user_id}`}>
                            <div className='message__name'>{this.props.user_name}</div>
                        </a>
                        <div className='message__wrapper__content'>
                            <span className='content__text'>{this.props.text}</span>
                        </div>
                    </div>
                </div>
            );
        }
        
    }
}

export default Chats;