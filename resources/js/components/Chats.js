import React from 'react';

class Chats extends React.Component {

    state = {
        messages: [],
        message_type: 'dialog',
        btns_active: false
    }

    messageBtnClick = async (message_type) => {
        await this.getMessages(message_type);
        await this.setState({
            message_type: message_type
        });
        
    }

    getMessages = async (type) => {
        const data = {
            message_type: type
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
                console.log(response)
            }
        })
        .catch(err => console.log(err))
    }

    componentDidMount() {
        this.getMessages('dialog');
        window.addEventListener('scroll', async () => {
            if (window.scrollY > 100 && !this.state.btns_active) 
                this.setState({btns_active: true})
            else if (window.scrollY < 100 && this.state.btns_active) 
                this.setState({btns_active: false})
            
        })
    }

    render() {
        return (
            <div id='chats' className='chats'>
                <div className={`chats__btns-area${this.state.btns_active ? ' active' : ''}`}>
                    <button className="ui-btn" onClick={() => this.messageBtnClick('dialog')}>Dialogs</button>
                    <button className="ui-btn" onClick={() => this.messageBtnClick('chat')}>Chats</button>
                    <button className='ui-btn' onClick={this.props.new_chat_func}>New Chat</button>
                </div>
                <div className='chats__messages'>
                    {this.state.messages.map(message => 
                        <Chat 
                        key={message.id}
                        id={message.id}
                        type={this.state.message_type}
                        text={message.last_message}
                        user_name={message.user_name}
                        last_message_user={message.last_message_user}
                        chat_name={message.name}
                        user_id={message.to_id}
                        /> 
                    )}
                </div>
            </div>
        );
    }
}

class Chat extends React.Component {
    render() {
        if (this.props.type == 'chat') {
            return (
                <a className='message' href={`/message/${this.props.id}?chat`}>
                    <div className='message__pic'></div>
                    <div className='message__wrapper'>                       
                        <div className='message__wrapper__name'>{this.props.chat_name}</div>
                        <div className='message__wrapper__content'>
                            {this.props.text && 
                            <>
                                <div className='content__user__pic'></div>
                                <div className='content__user__name'>{this.props.user_name}:</div>
                                <span className='content__user__text'>{this.props.text}</span>
                            </>
                            }
                        </div>
                    </div>
                    
                </a>
            );
        }

        else if (this.props.type == 'dialog') {
            return (
                <a className='message' href={`/message/${this.props.user_id}`}>
                    <div className='message__pic'></div>
                    <div className='message__wrapper'>
                        
                        <div className='message__wrapper__name'>{this.props.user_name}</div>
                        <div className='message__wrapper__content'>
                            <span className='content__user__text'>{this.props.text}</span>
                        </div>
                    </div>     
                </a>                          
            );
        }
        
    }
}

export default Chats;