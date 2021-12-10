import React from 'react';

class Login extends React.Component {
    state = {
        type: 'login',
        error: ''
    }

    login = async (event, type='login') => {
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
        console.log(type);
        await fetch('/login_enter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRF-Token': document.querySelector('meta[name="_token"]').getAttribute('content'),
                'Access-Control-Allow-Origin': '*'
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
            <div className='login-area' id='login-area'>
                 <div className='btns-area'>
                    <button className='ui-btn' onClick={() => this.setState({type: 'login'})}>Sign In</button>
                    <button className='ui-btn' onClick={() => this.setState({type: 'register'})}>Sign Up</button>
                </div>
                {this.state.type == 'login' &&
                <form onSubmit={(e) => this.login(e, 'login')} className='form-login' id='form-login'>
                    <h1>Sign In</h1>
                    <input type='email' name='email' className='form-login__part email' placeholder='Email'/>
                    <input type='password' name='first_pass' className='form-login__part pass1' placeholder='Password'/>
                    <input type='submit' className='ui-btn' value='Confirm'/>
                </form>
                }
                {this.state.type == 'register' &&
                <form onSubmit={(e) => this.login(e, 'register')} className='form-login' id='form-login'>
                    <h1>Sign Up</h1>
                    <input type='text' name='name' className='form-login__part name' placeholder='Name'/>
                    <input type='email' name='email' className='form-login__part email' placeholder='Email'/>
                    <input type='password' name='first_pass' className='form-login__part pass1' id='first_pass' placeholder='Password'/>
                    <input type='password' name='second_pass' className='form-login__part pass2' id='second_pass' placeholder='Password Again'/>
                    <input type='submit' className='ui-btn' value='Confirm'/>
                </form>
                }
            </div>
        )
    }
}

export default Login;