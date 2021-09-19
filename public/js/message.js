const send_btn = document.getElementById('message_send');

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

send_btn.addEventListener('click', async () => {
    console.log('click');
    const message_input = document.getElementById('new_message_text');
    const message_text = message_input.value;
    message_input.value = '';
    const second_user_id = getCookie('second_user_id');
    const date = new Date();
    let hours = date.getHours();
    if (hours < 10) hours = `0${hours}`;
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;

    const message_area = document.getElementById('message-area');
    message_area.innerHTML += `<div class='message-area__message user-message'><div class='message-content'><div class='message-content__time'>${hours}:${minutes}</div><div class='message-content__text'>${message_text}</div></div></div>`;

    const data = {
        second_user_id: second_user_id,
        message_text: message_text,
        time: `${hours}:${minutes}`
    }

    await fetch('/message/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
        },
        body: JSON.stringify(data)
    });
})



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