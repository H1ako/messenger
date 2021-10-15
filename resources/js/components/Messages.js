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
        console.log('send message');
        let input = document.getElementById('new_message_text');
        let input_value = input.value;
        let time = new Date().toLocaleString();
        let data = {
            message_text: input_value,
        }
        input.value = '';
        this.setState({
            messages: [...this.state.messages, {
                id: `user_mess_${time}`,
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

    componentDidMount() {
        this.setState({
            cur_user_id: this.getCookie('cur_user_id'),
        });
        this.getMessages()
        window.Echo.private(`dialog.${dialog_id}`)
            .listen('MessageSend', (e) => {
                e.message.sender_name = e.user.name;
                this.setState({
                    messages: [...this.state.messages, e.message]
                })
            });
        // window.Echo.private(`chat.${chat_id}`)
        // .listen('ChatMessageSend', (e) => {
        //     e.message.sender_name = e.user.name;
        //     this.setState({
        //         messages: [...this.state.messages, e.message]
        //     })
        // });

    }

    render() {
        return (
            <div>
                <div id='message-area'>
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
                    <input id='new_message_text' type='text' name='new_message_text' placeholder='Type Here' />
                    <label htmlFor="new_message_text">
                        <button onClick={this.sendMessage} id='message_send'>Send</button>
                    </label>
                </div>
            </div>
        )
    }
}

class Message extends React.Component {
    render() {
        if (this.props.sender != this.props.main_user_id) {
            return (
                <div className='message-area__message'>
                    <div className='message-name'>{this.props.name}</div>
                    
                    <div className='message-content'>
                        <div className='message-content__time'>{this.props.time}</div>
                        <div className='message-content__text'>{this.props.text}</div>
                    </div>
                </div>
            );
        }
        else {
            return (
                <div className='message-area__message user-message'>
                    <div className='message-content'>
                        <div className='message-content__time'>{this.props.time}</div>
                        <div className='message-content__text'>{this.props.text}</div>
                    </div>
                </div>
            );
        }
        
    }
}

export default Messages;