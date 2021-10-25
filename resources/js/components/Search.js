import React from 'react';
import ReactDOM from 'react-dom';

class Search extends React.Component{

    state = {
        users: []
    }

    input_change = async () => {
        const text = document.getElementById('search-field').value;
        const data = {
            text_field: text,
        }
        await fetch('/get_users', {
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
            <div className='search-area' id='search-area'>
                <input id='search-field' type='text' className='search-field' placeholder='Search' onChange={this.input_change}/>
                <div className='search-results'>
                    {this.state.users.map(user => 
                    <SearchResult 
                    func={this.input_change}
                    key={user.id}
                    id={user.id}
                    name={user.name}
                    status={user.status}
                    cur_user_id={this.state.users[this.state.users.length - 1]}
                    /> 
                    )}
                </div>
            </div>
        )
    }
}

class SearchResult extends React.Component{

    FriendAction = async (action) => {
        const data = {
            action: action,
            user_id: this.props.id
        }
        await fetch('/friends/actions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        })
        .then((response) => {
            this.props.func();
        })
    }

    render () {
        return (
            <div className='search-result'>
                <div className='main-info'>
                    <div className='main-info__pic'></div>
                    <div className='main-info__name'>{this.props.name}</div>
                </div>
                
                <div className='result-btn'>
                    {this.props.status == 'friend' &&
                        <button className='user-btn btn-remove' onClick={() => this.FriendAction('removeFriend')}>Remove</button>
                    }
                    {this.props.status == 'request' &&
                        <button className='user-btn btn-remove' onClick={() => this.FriendAction('removeRequest')}>Remove request</button>
                    }
                    {this.props.status == 'request_to_me' &&
                        <div>
                            <button className='user-btn btn-add' onClick={() => this.FriendAction('acceptRequest')}>Accept</button>
                            <button className='user-btn btn-remove' onClick={() => this.FriendAction('declineRequest')}>Cancel</button>
                        </div>
                    }
                    {this.props.status == 'notFriend' &&
                        <button className='user-btn btn-add' onClick={() => this.FriendAction('addFriend')}>Add</button>
                    }
                </div>
            </div>
        )
    }
}

export default Search;