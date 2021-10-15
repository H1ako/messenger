<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
Broadcast::channel('dialog.{dialog_id}', function ($user, $dialog_id) {
    $check = false;
    if (Auth::check()) {
        $check = $user->dialogs->where('dialog_id', $dialog_id)->first() ? true : false;
    }
    return $check;
});

Broadcast::channel('chat.{chat_id}', function ($user, $chat_id) {
    $check = false;
    if (Auth::check()) {
        $check = $user->chats->where('chat_id', $chat_id)->first() ? true : false;
    }
    return $check;
});