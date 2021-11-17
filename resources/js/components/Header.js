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

class ChatMember extends React.Component {
    render () {
        return (
            <div className='modal-chatInfo-window__members_member'>
                <div className='member__mainInfo'>
                    <div className='member__mainInfo__pic'/>
                    <div className='member__mainInfo__name'>{this.props.user.user_name}</div>
                </div>
                <div className='member__role'>{this.props.user.role}</div>
                {this.props.user_role == 'creator' &&
                <div className='member__btns'>
                    <button className='ui-btn'>Kick</button>
                    <button className='ui-btn'>Ban</button>
                </div>
                }
                
            </div>
        )
    }
}

class Header extends React.Component {

    state = {
        menu_open: false,
        modal_open: false,
        user: {},
        user_role: '',
        message_type: '',
        message_name: '',
        users: [],
    }

    getHeaderData = async () => {
        fetch('/message_action/get_message_info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
            }
        })
        .then(response => response.json())
        .then((response) => {
            // if (this.props.cur_url == 'messages_id') {
                
                
            // }
            // else {
            //     dict = {message_name: this.props.cur_url, user: response.user}
            // }
            console.log(response)
            this.setState({
                user: response.user,
                user_role: response.user_role,
                message_type: response.type,
                message_name: response.message_name,
                users: response.users,
            })
        })
        .catch(err => console.log(err))
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

    setModalState = async () => {
        if (!this.state.modal_open) {
            this.getHeaderData()
        }
        this.setState({modal_open: !this.state.modal_open})
    }

    chatNameOnChange = async (text) => {
        const data = {
            new_chat_name: text
        }
        fetch('/message_action/update_chat_name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content')
            },
            body: JSON.stringify(data)
        })
        .catch(err => console.log(err))
        
    }
    
    input_change_interval = async (e) => {
        const text = e.target.value;
        this.setState({message_name: text})
        clearTimeout(this.id)
        this.id = setTimeout(() => this.chatNameOnChange(text), 200)
    }

    componentDidMount() {
        this.getHeaderData();
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
                {this.state.message_type == 'chat' && this.props.cur_url == 'messages_id' &&
                    <button className='ui-btn info' onClick={this.setModalState}>Info</button>
                }
                <div className={`modal-chatInfo${this.state.modal_open ? ' active' : ''}`}>
                    <div className='modal-chatInfo-window'>
                        <div className='modal-chatInfo-window__main'>
                            <div className='modal-chatInfo-window__main__pic'/>
                            <input id='chat-name-input' readOnly={this.state.user_role == 'creator' ? false : true} value={this.state.message_name} onChange={this.input_change_interval} className='modal-chatInfo-window__main__name'/>
                            <img onClick={this.setModalState} className='modal-chatInfo-window__main__close' src='../images/icons/close.svg'/>
                        </div>
                        <div className='modal-chatInfo-window__members'>
                            {this.state.users.map(user =>
                                <ChatMember key={user.user_id} user_role={this.state.user_role} user={user}/>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}

export default Header;
