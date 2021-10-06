class Messages extends React.Component {

    state = {
        messages: [],
        type: 'dialog'
    }

    messageBtnClick = async (type) => {
        await this.setState({
            type: type
        });
        console.log(this.state.type)
        await this.getMessages();
    }



    getMessages = async (e) => {
        e.preventDefault();
        const data = {
            type: this.state.type
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
                <div className="message-btns-area">
                    <button className="message-btn" onClick={() => this.messageBtnClick('dialog')}>Dialogs</button>
                    <button className="message-btn" onClick={() => this.messageBtnClick('chat')}>Chats</button>
                </div>
                <div className='messages'>
                    {this.state.messages.map(message => 
                        <Message 
                        key={message.id}
                        id={message.id}
                        type={this.state.type}
                        text={message.last_message}
                        date={message.last_message_date}
                        user={message.last_message_user}
                        user_name={message.user_name}
                        name={message.name}
                        user_id={message.user_id}
                        /> 
                    )}
                </div>
            </div>
        );
    }
}

class Message extends React.Component {
    render() {
        if (this.props.type == 'chat') {
            return (
                <div className='message'>
                    <a href={`/message/${this.props.id}?chat`}>
                        <div className='message__name'>{this.props.name}</div>
                    </a>
                    <div className='message__content'>
                        <div className='message__user-name'>{this.props.user_name}</div>
                        <div className='message__user-message'>
                            <span className='message__date'>{this.props.date}</span>
                            <span className='message__text'>{this.props.text}</span>
                        </div>
                    </div>
                </div>
            );
        }

        else if (this.props.type == 'dialog') {
            return (
                <div className='message'>
                    
                    <a href={`/message/${this.props.user_id}`}>
                        <div className='message__name'>{this.props.user_name}</div>
                    </a>
                    <div className='message__content'>
                        <span className='message__date'>{this.props.date}</span>
                        <span className='message__text'>{this.props.text}</span>
                    </div>
                </div>
            );
        }
        
    }
}

ReactDOM.render(
    <Messages />,
    document.getElementById('messages-area')
);