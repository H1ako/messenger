class MessageAreaComponent extends React.Component{

    state = {
        messages: []
    }

    get_messages = async () => {
        const hostname = window.location.hostname;
        const id = document.getElementById('body').getAttribute('data-id');
        const data = await fetch(`/messages/?id=${id}`);
        const data_json = await data.json();
        this.setState({
            messages: data_json
        });
    }

    componentDidMount() {
        this.get_messages();
    }

    render() {
        return (
            <div>
                {this.state.messages.map(message => 
                    <MessageComponent 
                    key={message.id}
                    sender={message.sender}
                    text={message.text}
                    time={message.time}
                    />
                )}
            </div>
        )
    }
}

class MessageComponent extends React.Component{


    render() {
        return (
            <div className='message-area__message'>
                <div className='message-name'>{this.props.sender}</div>
                <div className='message-content'>
                    <div className='message-content__time'>{this.props.time}</div>
                    <div className='message-content__text'>{this.props.text}</div>
                </div>
            </div>
        )
    }
}


ReactDOM.render(
    <MessageAreaComponent />,
    document.getElementById('message-area')
);