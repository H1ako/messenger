class Login extends React.Component {
    state = {
        type: 'login',
        error: ''
    }

    login = async (event, type='login') => {
        const form = document.getElementById('form-login');
        if (type == 'login') {
            var data = {
                type: 'login',
                email: event.target.email.value,
                password: event.target.first_pass.value,
            }
        }
        else if (type == 'register') {
            var data = {
                type: 'register',
                name: event.target.name.value,
                email: event.target.email.value,
                password: event.target.first_pass.value,
                second_pass: event.target.second_pass.value
            }
        }
        await fetch('/login', {
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
                console.log(response);
                location.replace(response.url);
            }
        })
        .catch(err => console.log(err))
    }

    render () {
        return (
            <div>
                <div className='btns-area'>
                    <button className='btns-area__btn btn-login' onClick={() => this.setState({type: 'login'})}>Log In</button>
                    <button className='btns-area__btn btn-register' onClick={() => this.setState({type: 'register'})}>Sign Up</button>
                </div>
                {this.state.type == 'login' &&
                <form onSubmit={(e) => this.login(e, 'login')} className='form-login' id='form-login'>
                    <input type='email' name='email' className='form-login__part' placeholder='email'/>
                    <input type='password' name='first_pass' className='form-login__part' placeholder='password'/>
                    <input type='submit' className='form-login__submit' value='Log In'/>
                </form>
                }
                {this.state.type == 'register' &&
                <form onSubmit={(e) => this.login(e, 'register')} className='form-login' id='form-login'>
                    <input type='text' name='name' className='form-login__part' placeholder='Name'/>
                    <input type='email' name='email' className='form-login__part' placeholder='email'/>
                    <input type='password' name='first_pass' className='form-login__part' id='first_pass' placeholder='password'/>
                    <input type='password' name='second_pass' className='form-login__part' id='second_pass' placeholder='password again'/>
                    <input type='submit' className='form-login__submit' value='Sign Up'/>
                </form>
                }
            </div>
        )
    }
}

ReactDOM.render(
    <Login />,
    document.getElementById('main-part')
);