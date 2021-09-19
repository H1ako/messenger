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
    render () {
        return (
            <div className='search-result'>
                <div className='main-info'>
                    <div className='main-info__name'>{this.props.name}</div>
                    <div className='main-info__name'>{this.props.id}</div>
                </div>
                <div className='status'>{this.props.status}</div>
            </div>
        )
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('search-area')
);