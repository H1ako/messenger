/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

import Chats_Route from './components/Chats_Route';
import Friends from './components/Friends';
import Login from './components/Login';
import Messages from './components/Messages';
import Search from './components/Search';
import ReactDOM from 'react-dom';
import Header from './components/Header';
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <Route exact path="/friends">
      <Header cur_url={'friends'} urls={['home', 'messages']} />
    </Route>
    <Route exact path="/login">
      <Header cur_url={'login'} urls={[]} />
    </Route>
    <Route exact path="/message">
      <Header cur_url={'messages'} urls={['home', 'friends']} />
    </Route>
    <Route exact path="/message/:id">
      <Header cur_url={'messages_id'} urls={['home', 'messages', 'friends']} />
    </Route>
    <Route exact path="/">
      <Header cur_url={'home'} urls={['messages', 'friends']} />
    </Route>
    <main>
      <Route exact path="/friends">
        <Friends />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/message">
        <Chats_Route />
      </Route>
      <Route exact path="/message/:id">
        <Messages />
      </Route>
      <Route exact path="/">
        <Search />
      </Route>
    </main>
  </BrowserRouter>,
  document.getElementById('app')
);
