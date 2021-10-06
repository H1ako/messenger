class Messages extends React.Component {
    state = {
        cur_user_id: '',
        messages_id: '',
        messages: []
    }

    getMessages = async () => {
        var data = {
            messages_id: this.state.messages_id
        }
        await fetch('/message_action/get_messages', {
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

    sendMessage = async () => {
        let input = document.getElementById('new_message_text');
        let input_value = input.value;
        const data = {
            second_user_id: this.state.messages_id,
            message_text: input_value,
        }

        await fetch('/message_action/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        });
        input.value = '';
    }

    componentDidMount() {
        function getCookie(name) {
            let matches = document.cookie.match(new RegExp(
              "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
            ));
            return matches ? decodeURIComponent(matches[1]) : undefined;
        }
        this.setState({
            cur_user_id: getCookie('cur_user_id'),
            messages_id: getCookie('messages_id')
        });
        setInterval(() => this.getMessages(), 1000);

    }

    render() {
        return (
            <div>
                <div className='messages'>
                    {this.state.messages.map(message => 
                        <Message 
                        key={message.id}
                        id={message.id}
                        name={message.sender_name}
                        text={message.text}
                        time={message.time}
                        sender={message.sender}
                        main_user_id={this.state.cur_user_id}

                        /> 
                    )}
                </div>
                <input id='new_message_text' type='text' name='new_message_text' placeholder='Type Here' />
                <label htmlFor="new_message_text">
                    <button onClick={this.sendMessage} id='message_send'>Send</button>
                </label>
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

ReactDOM.render(
    <Messages />,
    document.getElementById('message-area')
);

// const send_btn = document.getElementById('message_send');

// const second_user_id = getCookie('second_user_id');
// var data = {
//     second_user_id: second_user_id,
//     last_message_id: 'start'
// }

// setInterval(async () => {
//     await fetch('/message_action/check', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json;charset=utf-8',
//             'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
//         },
//         body: JSON.stringify(data)
//     })
//     .then(response => response.json())
//     .then((response) => {
//         if (response) {
//             if (response.last_message_id !== 'start' && response.status === 200) {
//                 console.log(response);
//                 data.last_message_id = response.last_message_id;
//                 const message_area = document.getElementById('message-area');
//                 message_area.innerHTML += `<div class='message-area__message'><div class='message-name'>${response.sender}</div><div class='message-content'><div class='message-content__time'>${response.time}</div><div class='message-content__text'>${response.text}</div></div></div>`;
//             }
//             else {
//                 console.log(response);
//                 data.last_message_id = response.last_message_id;
//             }
//         }
//     })
//     .catch(err => console.log(err))
// }, 1500);

// function getCookie(name) {
//     let matches = document.cookie.match(new RegExp(
//       "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
//     ));
//     return matches ? decodeURIComponent(matches[1]) : undefined;
// }

// send_btn.addEventListener('click', async () => {
//     const message_input = document.getElementById('new_message_text');
//     const message_text = message_input.value;
//     message_input.value = '';
//     const date = new Date();
//     let hours = date.getHours();
//     if (hours < 10) hours = `0${hours}`;
//     let minutes = date.getMinutes();
//     if (minutes < 10) minutes = `0${minutes}`;

//     const message_area = document.getElementById('message-area');
//     message_area.innerHTML += `<div class='message-area__message user-message'><div class='message-content'><div class='message-content__time'>${hours}:${minutes}</div><div class='message-content__text'>${message_text}</div></div></div>`;

//     const data = {
//         second_user_id: second_user_id,
//         message_text: message_text,
//         time: `${hours}:${minutes}`
//     }

//     await fetch('/message_action/send', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json;charset=utf-8',
//             'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
//         },
//         body: JSON.stringify(data)
//     });
// })



// class MessageAreaComponent extends React.Component{

//     state = {
//         messages: []
//     }

//     get_messages = async () => {
//         const hostname = window.location.hostname;
//         const id = document.getElementById('body').getAttribute('data-id');
//         const data = await fetch(`/messages/?id=${id}`);
//         const data_json = await data.json();
//         this.setState({
//             messages: data_json
//         });
//     }

//     componentDidMount() {
//         this.get_messages();
//     }

//     render() {
//         return (
//             <div>
//                 {this.state.messages.map(message => 
//                     <MessageComponent 
//                     key={message.id}
//                     sender={message.sender}
//                     text={message.text}
//                     time={message.time}
//                     />
//                 )}
//             </div>
//         )
//     }
// }

// class MessageComponent extends React.Component{

//     render() {
//         return (
//             <div className='message-area__message'>
//                 <div className='message-name'>{this.props.sender}</div>
//                 <div className='message-content'>
//                     <div className='message-content__time'>{this.props.time}</div>
//                     <div className='message-content__text'>{this.props.text}</div>
//                 </div>
//             </div>
//         )
//     }
// }


// ReactDOM.render(
//     <MessageAreaComponent />,
//     document.getElementById('message-area')
// );