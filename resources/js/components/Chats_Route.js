import React from 'react';
import Chats from './Chats';

class Chats_Route extends React.Component {

    state = {
        friends_modal: false,
        users: [],
        chosen_friends: [],
        chat_name: '',
    }

    // MODAL
    createChat = async (e) => {
        let data = {
            chosen_friends: this.state.chosen_friends,
            chat_name: this.state.chat_name
        }
        await fetch('/message_action/create_chat', {
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
                console.log(response)
                location.replace(response.url)
            }
        })
        .catch(err => console.log(err))
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


    chatNameOnChange = async (e) => {
        this.setState({chat_name: e.target.value})
    }

    checkboxOnChange = async (e) => {
        // current array of options
        const chosen_friends = this.state.chosen_friends
        let index
        // check if the check box is checked or unchecked
        if (e.target.checked) {
            // add the numerical value of the checkbox to options array
            chosen_friends.push(+e.target.value)
        } 
        else {
            // or remove the value from the unchecked checkbox from the array
            index = chosen_friends.indexOf(+e.target.value)
            chosen_friends.splice(index, 1)
        }

        // update the state with the new array of options
        this.setState({chosen_friends: chosen_friends})
    }

    setModalState = async () => {
        let checkboxes = document.querySelectorAll('.friend-checkbox:checked')
        checkboxes.forEach(el => el.checked = false)

        this.get_friends()
        this.setState({friends_modal: !this.state.friends_modal, chat_name: ''})
    }

    componentDidMount() {
        this.get_friends()
    }

    render() {
        return (
            <div id='chats-area' className='chats-area'>
                <Chats new_chat_func={this.setModalState}/>
                <div className={`modal-friends${this.state.friends_modal ? ' active' : ''}`}>
                    <div className='modal-friends__top'>
                        <img onClick={this.setModalState} className='modal-friends__top__close' src='../images/icons/close.svg'/>
                        <h2>New Chat</h2>
                    </div>
                    <input onChange={this.chatNameOnChange.bind(this)} className='modal-friends__input' id='modal-friends__chat-name' type='text' value={this.state.chat_name} placeholder='Chat Name'/>
                    <form className='modal-friends__friends' method='post'>
                        {this.state.users.map(user => 
                            <div className='friends__friend' key={user.id}>
                                <div className='friends__friend__content'>
                                <div className='content__pic'></div>
                                <a href={`/message/${user.friend_id}`} className='content__name'>{user.name}</a>
                                </div>
                                <label>
                                    <input onChange={this.checkboxOnChange.bind(this)} name='modal-friend' className='friends__friend__checkbox' type='checkbox' value={user.friend_id}/>
                                    <img src="../images/icons/checked.svg" alt="V" />
                                </label>
                            </div>
                        )}
                    </form>
                    <button className='ui-btn' onClick={this.createChat}>Create</button>
                </div>
            </div>
        )
    }
}

export default Chats_Route;