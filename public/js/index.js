var logout = document.getElementById('logOut');
logout.onclick =function() {
    const data = {
        type: 'logOut',
    }
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then((response) => {
        console.log(response);
        location.replace(response);
    })
    .catch(err => console.log(err))
}
class Search extends React.Component{

    state = {
        users: []
    }

    input_change = async (e) => {
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
            <div className='search'>
                <input id='search-field' type='text' className='search-field' onChange={this.input_change}/>
                <div className='search-results'>
                    {this.state.users.map(user => 
                    <SearchResult 
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
        console.log(action, this.props.id);
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
            <div className='search-result'>
                <div className='main-info'>
                    <div className='main-info__name'>{this.props.name}</div>
                    <div className='main-info__id'>{this.props.id}</div>
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

                {this.props.status == 'notFriend' &&
                <div className='result-btn'>
                    <button className='user-btn btn-add' onClick={() => this.FriendAction('addFriend')}>Add</button>
                </div>
                }

                <div className='status'>{this.props.status}</div>
            </div>
        )
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('search-area')
);