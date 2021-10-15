import React from 'react';

class ChatsFriends extends React.Component{

    state = {
        users: [],
        choosen_friends: []
    }

    createChat = async (e) => {
        await fetch('/message_action/create_chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
            },
            body: JSON.stringify({choosen_friends: this.state.choosen_friends})
        })
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


    checkboxOnChange = async (e) => {
        // current array of options
        const choosen_friends = this.state.choosen_friends
        let index
        // check if the check box is checked or unchecked
        if (e.target.checked) {
            // add the numerical value of the checkbox to options array
            choosen_friends.push(+e.target.value)
        } 
        else {
            // or remove the value from the unchecked checkbox from the array
            index = choosen_friends.indexOf(+e.target.value)
            choosen_friends.splice(index, 1)
        }

        // update the state with the new array of options
        this.setState({choosen_friends: choosen_friends})
        console.log(this.state.choosen_friends)
    }
    
    render () {
        return (
            <div className={`modal-friends${this.props.state ? ' active' : ''}`}>
                <button onClick={this.props.funcModal}>Close</button>
                <form className='friends' method='post'>
                    {this.state.users.map(user => 
                        <div className='friends__friend' key={user.id}>
                            <div className='friend-content'>
                                <div className='main-info'>
                                    <a href={`/message/${user.friend_id}`}><div className='main-info__name'>{user.name}</div></a>
                                    <div className='main-info__id'>{user.friend_id}</div>
                                </div>
                                <div className='status'>{user.status}</div>
                            </div>
                            <input onChange={this.checkboxOnChange.bind(this)} className='friend-checkbox' type='checkbox' name='chosen-friend-id' value={this.props.friend_id}/>
                        </div>
                    )}
                </form>
                <button onClick={this.createChat}>Create</button>
            </div>
        )
    }

    componentDidMount() {
        this.get_friends();
    }
}


export default ChatsFriends;