class Friends extends React.Component{

    state = {
        users: []
    }

    get_friends = async (e) => {
        const data = {
            type: 'friend',
        }
        await fetch('/friends/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then((response) => {
            if (response) this.setState({users: response});
        })
        .catch(err => console.log(err))
    }

    render () {
        return (
            <div className='friends'>
                {this.state.users.map(user => 
                    <Friend 
                    key={user.id}
                    user_id={user.user_id}
                    name={user.name}
                    status={user.status}
                    /> 
                    )}
            </div>
        )
    }

    componentDidMount() {
        this.get_friends();
    }
}

class Friend extends React.Component{

    FriendAction = async (action) => {
        const data = {
            action: action,
            user_id: this.props.user_id
        }
        console.log(action, this.props.user_id);
        await fetch('/friends/actions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        });
    }

    render () {
        return (
            <div className='friends__friend'>
                <div className='main-info'>
                    <a href={`/message?id=${this.props.user_id}`}><div className='main-info__name'>{this.props.name}</div></a>
                    <div className='main-info__id'>{this.props.user_id}</div>
                </div>
                {this.props.status == 'friend' &&
                <div className='result-btn'>
                    <button className='user-btn btn-remove' onClick={() => this.FriendAction('removeFriend')}>Remove</button>
                </div>
                }

                {this.props.status == 'request' &&
                <div className='result-btn'>
                    <button className='user-btn btn-remove' onClick={() => this.FriendAction('removeRequest')}>Remove request</button>
                </div>
                }

                {this.props.status == 'requestToMe' &&
                <div className='result-btn'>
                    <button className='user-btn btn-add' onClick={() => this.FriendAction('acceptRequest')}>Accept</button>
                    <button className='user-btn btn-remove' onClick={() => this.FriendAction('declineRequest')}>Cancel</button>
                </div>
                }

                <div className='status'>{this.props.status}</div>
            </div>
        )
    }
}

ReactDOM.render(
    <Friends />,
    document.getElementById('friends-area')
);
