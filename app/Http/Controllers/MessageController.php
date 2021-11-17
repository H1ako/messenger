<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Events\ChatMessageSend;
use App\Models\Dialog;
use App\Models\Chat;
use Illuminate\Support\Facades\Cookie;
use App\Events\MessageSend;
use App\Models\DialogMember;

class MessageController extends Controller
{
    //TODO: Make definition for chat

    public function __construct() {
        $this->middleware('auth');
    }

    public function update_chat_name(Request $req) {
        $cur_user = Auth::user();
        $messages_id = Cookie::get('messages_id');
        $message_type = Cookie::get('message_type');
        $new_chat_name = $req->input('new_chat_name');

        if ($message_type == 'chat' && trim($new_chat_name)) {
            $chat = Chat::find($messages_id);
            $members = $chat->members();
            $user_role = $members->where('user_id', $cur_user->id)->first()->role;
            if ($user_role == 'creator') {
                $chat->update([
                    'name' => $new_chat_name
                ]);
            }
        }
    }

    public function get_message_info() {
        $cur_user = Auth::user();
        $messages_id = Cookie::get('messages_id');
        $message_type = Cookie::get('message_type');
        $message_name = '';
        $message_users = [];
        $cur_user_role = '';
        if ($message_type == 'dialog') {
            $message_name = User::find($messages_id)->name;
            // $dialog = $cur_user->dialogs->where('to_id', $messages_id)->first()->dialog;
        }
        else if ($message_type == 'chat') {
            $message = Chat::find($messages_id);
            $message_name = $message->name;
            $message_users = $message->members;
            $cur_user_role = $message_users->where('user_id', $cur_user->id)->first()->role;
            foreach($message_users as $user) {
                $user->user_name = User::find($user->user_id)->name;
            }
        }
        return [
            'message_name' => $message_name,
            'user' => $cur_user,
            'user_role' => $cur_user_role,
            'type' => $message_type,
            'users' => $message_users
        ];
    }

    public function show_message($messages_id) {
        if (Auth::check()){
            $cur_user = Auth::user();
            $message_type = array_key_exists('chat', $_GET) ? 'chat' : 'dialog';
            if ($message_type === 'dialog') {
                if ($messages_id && User::find($messages_id)){
                    $dialog = $cur_user->dialogs
                                        ->where('to_id', $messages_id)
                                        ->first();
                    if (!$dialog) {
                        $dialog = new Dialog();
                        $dialog->save();
                        $dialog->members()->insert([
                            ['from_id' => $cur_user->id, 'to_id' => $messages_id, 'dialog_id' => $dialog->id],
                            ['to_id' => $cur_user->id, 'from_id' => $messages_id, 'dialog_id' => $dialog->id]
                        ]);
                        setcookie('messages_id', $dialog->id, time()+604800);
                    }
                    else setcookie('messages_id', $dialog->dialog_id, time()+604800);
                    
                }
                else return redirect('/friends');
            }
            else setcookie('messages_id', $messages_id, time()+604800);
            Cookie::queue('message_type', $message_type, time()+604800);
            Cookie::queue('messages_id', $messages_id, time()+604800);
            setcookie('cur_user_id', $cur_user->id, time()+604800);
            setcookie('message_type', $message_type, time()+604800);
            return view('message_user');           
        }
        else return redirect('/login');
    }

    public function new_message(Request $request) {
        if (Auth::check()) {
            $cur_user = Auth::user();
            $messages_id = Cookie::get('messages_id');
            $message_type = Cookie::get('message_type');
            $message_text = $request->input('message_text');
            if ($message_type === 'dialog') {
                $dialog = $cur_user->dialogs
                                    ->where('to_id', $messages_id)
                                    ->first()
                                    ->dialog;
                $message_data = [
                    'dialog_id' => $dialog->id,
                    'from_id' => $cur_user->id,
                    'text' => $message_text,
                ];
                $message = $dialog->messages()->create($message_data);
                $dialog->update([
                    'last_message_user' => $cur_user->id,
                    'last_message' => $message_text
                ]);
                broadcast(new MessageSend($cur_user, $message))->toOthers();
            }

            else if ($message_type === 'chat') {
                $chat = $cur_user->chats
                                ->where('chat_id', $messages_id)
                                ->first()
                                ->chat;
                $message_data = [
                    'chat_id' => $chat->id,
                    'from_id' => $cur_user->id,
                    'text' => $message_text,
                ];
                $message = $chat->messages()->create($message_data);
                $chat->update([
                    'last_message_user' => $cur_user->id,
                    'last_message' => $message_text
                ]);
                broadcast(new ChatMessageSend($cur_user, $message))->toOthers();
            }
        }        
    }

    public function new_chat(Request $req) {
        $chosen_friends = $req->input('chosen_friends');#json_decode($req->input('chosen_friends'));
        $chat_name = $req->input('chat_name');
        $cur_user = Auth::user();
        if ($chat_name != '') {
            $new_chat = new Chat(['name' => $chat_name]);
            $new_chat->save();
            $new_chat->members()->create(['user_id' => $cur_user->id, 'role' => 'creator']);
            foreach ($chosen_friends as $friend) {
                $new_chat->members()->create(['user_id' => $friend, 'role' => 'member']);
            }
            // $red_url = redirect() "{url: }"
            // return "/messages/$new_chat->id?chat";
            return ['url' => route('messages', [$new_chat->id]).'?chat'];
        }
        
    }

    public function get_messages() {
        $cur_user = Auth::user();
        $messages_id = Cookie::get('messages_id');
        $message_type = Cookie::get('message_type');
        $messages = [];
        if ($message_type === 'dialog') {
            $dialog = $cur_user->dialogs
                                ->where('to_id', $messages_id)
                                ->first()
                                ->dialog;
            $messages = $dialog->messages;
        }
        else if ($message_type === 'chat') {
            $chat = $cur_user->chats
                            ->where('chat_id', $messages_id)
                            ->first()
                            ->chat;
            $messages = $chat->messages;
        }
        foreach($messages as $message){
            $message->sender_name = User::find($message->from_id)->name;
        }
        return $messages;
    }
    

    public function get_chats(Request $request) {
        $cur_user = Auth::user();
        $message_type = $request->input('message_type');
        if ($message_type === 'dialog') {
            $dialogs = $cur_user->dialogs;
            $dialog_ids = $dialogs->pluck('dialog_id');
            $dialogs = Dialog::whereIn('id', $dialog_ids)->orderBy('updated_at', 'desc')->get();
            foreach ($dialogs as $dialog) {
                if ($dialog->last_message_user) {
                    $cur_dialog = DialogMember::where('dialog_id', $dialog->id)->where('to_id', '!=', $cur_user->id)->first();
                    $dialog->user_name = User::find($cur_dialog->to_id)->name;
                }
            }
            return $dialogs;
        }
        else if ($message_type === 'chat') {
            $chats = $cur_user->chats;
            $chat_ids = $chats->pluck('chat_id');
            $chats = Chat::whereIn('id', $chat_ids)->orderBy('updated_at', 'desc')->get();
            foreach ($chats as $chat) {
                if ($chat->last_message_user) {
                    $chat->user_name = User::find($chat->last_message_user)->name;
                }
            }
            return  $chats;
        }
        // $dialog->last_message_user = User::find($cur_dialog->last_message_user)->name;  FOR CHAT
        return "[]";     
    }
}
