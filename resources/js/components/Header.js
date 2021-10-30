import React from 'react';

class NavLink extends React.Component {
    render () {
        if (this.props.type == 'home') return (<a href='/'><div className='nav__link'><img src='../images/icons/home.svg'/><h1>Home</h1></div></a>)
        else if (this.props.type == 'messages') return (<a href='/message'><div className='nav__link'><img src='../images/icons/messages.svg'/><h1>Messages</h1></div></a>)
        else if (this.props.type == 'friends') return (<a href='/friends'><div className='nav__link'><img src='../images/icons/friends.svg'/><h1>Friends</h1></div></a>)
        else return (<></>)
    }
}
class PageName extends React.Component {
    render () {
        if (this.props.type == 'home') return (<div className='menu-pageName'><img src='../images/icons/home.svg'/><h1>Home</h1></div>)
        else if (this.props.type == 'messages') return (<div className='menu-pageName'><img src='../images/icons/messages.svg'/><h1>Messages</h1></div>)
        else if (this.props.type == 'friends') return (<div className='menu-pageName'><img src='../images/icons/friends.svg'/><h1>Friends</h1></div>)
        else if (this.props.type == 'messages_id') return (<div className='menu-pageName'><div className='menu-pageName__pic'></div><h1>{this.props.name}</h1></div>)
        else return (<></>)
    }
}

class Header extends React.Component {

    state = {
        menu_open: false,
        message_name: '',
        user: {}
    }

    signOut = async () => {
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
            location.replace(response.url);
        })
        .catch(err => console.log(err))
    }

    menuOpenClose = async (e) => {
        let par = document.getElementById('header-menu');
        this.setState({menu_open: !this.state.menu_open})
        if (!this.state.menu_open) {
            let scrollHeight = par.scrollHeight;
            par.classList.add('active')
            par.style.height = scrollHeight+'px';
        }
        else {
            par.classList.remove('active')
            par.style.height = 60+'px';
        }

    }

    componentDidMount() {
        fetch('/message_action/get_message_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
            }
        })
        .then(response => response.json())
        .then((response) => {
            let dict = {}
            if (this.props.cur_url == 'messages_id') {
                dict = {
                    message_name: response.message_name,
                    user: response.user
                }
            }
            else {
                dict = {message_name: this.props.cur_url, user: response.user}
            }
            this.setState(dict)
        })
        .catch(err => console.log(err))
    }

    render () {
        return (
            <header>
                <div className='header-menu' id='header-menu'>
                    <div onClick={this.menuOpenClose} className='header-menu__firstBar'>
                        <img className='menu-arrow' src='../images/icons/arrow.svg'/>
                        <PageName type={this.props.cur_url} name={this.state.message_name} />
                        <div className='menu-profile'>
                            <div className='menu-profile__name'>{this.state.user.name}</div>
                            <div className='menu-profile__pic'></div>
                        </div>
                    </div>
                    <nav>
                        {this.props.urls.map(url =>
                            <NavLink type={url} key={url} />
                        )}
                        <a><div className='nav__link' onClick={this.signOut}><img src='../images/icons/sign_out.svg'/><h1>Sign Out</h1></div></a>
                    </nav>
                </div>
            </header>
        )
    }
}

export default Header;
