import { filter } from 'lodash';
import React from 'react';

class Messages extends React.Component {
    state = {
        cur_user_id: '',
        messages: [],
    }

    getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    getMessages = async () => {
        await fetch('/message_action/get_messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
            }
        })
        .then(response => response.json())
        .then((response) => {
            if (response) {
                this.setState({messages: response});
            }
        })
        .catch(err => console.log(err))
    }

    sendMessage = async () => {
        let input = document.getElementById('new_message_text')
        let input_value = input.value;
        if (filter(input_value) != '') {
            let full_time = new Date();
            let time = `${full_time.getHours()}:${full_time.getMinutes()}`
            let data = {
                message_text: input_value,
            }
            input.value = '';
            this.setState({
                messages: [...this.state.messages, {
                    id: `user_mess_${full_time}`,
                    text: input_value,
                    from_id: this.state.cur_user_id,
                    created_at: time
                }]
            })
            
            await fetch('/message_action/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content'),
                    "X-Socket-Id": window.Echo.socketId(),
                },
                body: JSON.stringify(data)
            })
        }
        
    }

    componentDidMount() {
        let id = this.getCookie('messages_id');
        let type = this.getCookie('message_type');
        this.setState({
            cur_user_id: this.getCookie('cur_user_id'),
        });
        this.getMessages()
        if (type == 'dialog') {
            window.Echo.private(`dialog.${id}`)
            .listen('MessageSend', (e) => {
                e.message.sender_name = e.user.name;
                this.setState({
                    messages: [...this.state.messages, e.message]
                })
            });
        }
        else if (type == 'chat') {
            window.Echo.private(`chat.${id}`)
            .listen('ChatMessageSend', (e) => {
                e.message.sender_name = e.user.name;
                this.setState({
                    messages: [...this.state.messages, e.message]
                })
            });
        }
        
        

    }

    render() {
        return (
            <div>
                <div id='message-area' className='message-area'>
                    <div className='messages'>
                        {this.state.messages.map(message => 
                            <Message
                            key={message.id}
                            id={message.id}
                            name={message.sender_name}
                            text={message.text}
                            time={message.created_at}
                            sender={message.from_id}
                            main_user_id={this.state.cur_user_id}

                            /> 
                        )}
                    </div>

                    <div className='new_message-area'>
                        <input id='new_message_text' type='text' name='new_message_text' className='new_message' placeholder='Type Here' />
                        <button onClick={this.sendMessage} className='new_message-btn' id='message_send'>Send</button>
                    </div>
                </div>
            </div>
        )
    }
}

class Message extends React.Component {
    render() {
        if (this.props.sender != this.props.main_user_id) {
            return (
                <div className='messages__message'>
                    <div className='user-info'>
                        <div className='message-pic'></div>
                        <div className='message-name'>{this.props.name}</div>
                    </div>
                    <div className='message-text'>{this.props.text}</div>
                    <div className='message-time'>{this.props.time}</div>
                </div>
            );
        }
        else {
            return (
                <div className='message-area__message user-message'>
                    <div className='message-content__time'>{this.props.time}</div>
                    <div className='message-content__text'>{this.props.text}</div>
                </div>
            );
        }
        
    }
}

export default Messages;