import React from 'react';

class Friends extends React.Component{

    state = {
        users: [],
        check_box: this.props.check_box ? true : false
    }

    get_friends = async (type='friend') => {
        const data = {
            type: type,
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
            console.log("response: " + response)
            this.setState({users: response})
        })
        .catch(err => console.log(err))
    }

    render () {
        console.log(this.state.users)
        return (
            <div id='friends-area' className='friends-area'>
                <div className='btns-area'>
                    <button className='btns-area__btn' onClick={() => this.get_friends()}>Friends</button>
                    <button className='btns-area__btn' onClick={() => this.get_friends("request")}>Requests</button>
                </div>
                <form className='friends' method='post'>
                    {this.state.users.map(user => 
                        <Friend 
                        key={user.id}
                        friend_id={user.friend_id}
                        name={user.name}
                        status={user.status}
                        /> 
                    )}
                </form>
            </div>
        )
    }

    componentDidMount() {
        this.get_friends()
    }
}

class Friend extends React.Component{

    FriendAction = async (action) => {
        const data = {
            action: action,
            user_id: this.props.friend_id
        }
        console.log(action, this.props.friend_id);
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
                <a href={`/message/${this.props.friend_id}`} className='main-info'>
                    <div className='main-info__pic'></div>
                    <div className='main-info__name'>{this.props.name}</div>
                </a>
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

                {this.props.status == 'request_to_me' &&
                <div className='result-btn'>
                    <button className='user-btn btn-add' onClick={() => this.FriendAction('acceptRequest')}>Accept</button>
                    <button className='user-btn btn-remove' onClick={() => this.FriendAction('declineRequest')}>Cancel</button>
                </div>
                }
            </div>
        )
    }
}

export default Friends;