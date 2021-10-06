<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Chat;
use App\Models\Dialog;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

class MessageController extends Controller
{
    public function show_message($messages_id) {
        if (Auth::check()){
            $cur_user = Auth::user();
            $user_id = $cur_user->id;
            $cur_user_DB = User::where('id', $user_id);
            if (array_key_exists('chat', $_GET)) {
                if ($messages_id && Chat::where('id', $messages_id)->first()) {
                    $user_messages = json_decode($cur_user->chats, true);
                }
                else return redirect('/friends');
                if (isset($user_messages[$messages_id])) {
                    $chat = DB::table('chat-'.$messages_id);
                    $messages = $chat->get();
                }
            }
            else {
                if ($messages_id && User::where('id', $messages_id)->first()){
                    $user_messages = json_decode($cur_user->messages, true);
                    if (!isset($user_messages[$messages_id])) {
                        $new_dialog = new Dialog();
                        $new_dialog->members = json_encode([$user_id, intval($messages_id)]);
                        $new_dialog->last_message_date = Carbon::now()->format('Y-m-d H:i:s');
                        $new_dialog->last_message_user = $cur_user->id;
                        $new_dialog->save();
                        Schema::create("dialog-$new_dialog->id", function (Blueprint $table) {
                            $table->id();
                            $table->text('text')->nullable();
                            $table->unsignedBigInteger('sender')->nullable(false);
                            $table->string('time', 100)->nullable(false);
                        });
                        $sec_user_DB = User::where('id', $messages_id);
                        $sec_user = $sec_user_DB->first();
                        $sec_user_messages = json_decode($sec_user->messages, true);
                        $sec_user_messages[$user_id] = $new_dialog->id;
                        $sec_user_DB->update(['messages' => json_encode($sec_user_messages)]);
    
                        $user_messages[$messages_id] = $new_dialog->id;
                        $cur_user_DB->update(['messages' => json_encode($user_messages)]);
                    }
                }
                else return redirect('/friends');
            }
            setcookie('cur_user_id', $user_id, time()+3600);
            setcookie('messages_id', $messages_id, time()+3600);
            return view('message_user');           
        }
        else return redirect('/login');
    }

    public function new_message(Request $request) {
        if (Auth::check()) {
            $user_id = Auth::user()->id;
            $second_user_id = $request->input('second_user_id');
            $text = $request->input('message_text');
            $time = Carbon::now()->format('H:i');
            $user_id = Auth::user()->id;
            $cur_user = User::where('id', $user_id)->first();
            if (array_key_exists('chat', $_GET)) {
                $user_messages = json_decode($cur_user->chats, true);
                if (isset($second_user_id)) {
                    $chat_db = Chat::where('id', $second_user_id)->update([
                        'last_message_date' => Carbon::now()->format('Y-m-d H:i:s'),
                        'last_message' => $text,
                        'last_message_user' => $user_id
                    ]);
                    $chat = DB::table('chat-'.$second_user_id);
                    $chat->insert([
                        'text' => $text,
                        'sender' => $user_id,
                        'time' => $time
                    ]);
                }
            }
            else {
                $user_messages = json_decode($cur_user->messages, true);
                
                if (isset($user_messages[$second_user_id])) {
                    $dialog_db = Dialog::where('id', $user_messages[$second_user_id])->update([
                        'last_message_date' => Carbon::now()->format('Y-m-d H:i:s'),
                        'last_message' => $text,
                        'last_message_user' => $user_id
                    ]);
                    $dialog = DB::table('dialog-'.$user_messages[$second_user_id]);
                    $dialog->insert([
                        'text' => $text,
                        'sender' => $user_id,
                        'time' => $time
                    ]);
                }
            }
        }
        
    }

    public function get_messages(Request $request) {
        $user = Auth::user();
        $user_id = $user->id;
        $messages_id = $request->input('messages_id');
        $cur_user = User::where('id', $user_id)->first();
        $user_messages = json_decode($cur_user->messages, true);
        if (array_key_exists('chat', $_GET)) {
            if ($messages_id && Chat::where('id', $messages_id)->first()) {
                $user_messages = json_decode($cur_user->chats, true);
            }
            else return redirect('/friends');
            if (isset($user_messages[$messages_id])) {
                $chat = DB::table('chat-'.$messages_id);
                $messages = $chat->get();
            }
        }
        else {
            if ($messages_id && User::where('id', $messages_id)->first()){
                $user_messages = json_decode($cur_user->messages, true);
                if (isset($user_messages[$messages_id])) {
                    $dialog = DB::table('dialog-'.$user_messages[$messages_id]);
                    $messages = $dialog->get();
                }
            }
            else return redirect('/friends');
        }
        foreach($messages as $message){
            $message->sender_name = User::where('id', $message->sender)->first()->name;
        }
        return json_encode($messages);
    }
    

    public function get_chats(Request $request) {
        function dialog_user_id($array, $key) {
            if ($array[0] == $key) return $array[1];
            else return $array[0];
        }
        $type = $request->input('type');
        // $type = 'chat';
        $user = Auth::user();
        $user_id = $user->id;
        if ($type == 'chat') {
            $user_chats_ids = json_decode($user->chats, true);
            $chats = Chat::whereIn('id', $user_chats_ids)->orderBy('last_message_date')->get();
            foreach ($chats as $chat) {
                $chat->user_name = User::where('id', $chat->last_message_user)->first()->name;
            }
            return $chats;
        }
        else if ($type == 'dialog') {
            $user_messages = json_decode($user->messages, true);
            $dialogs = Dialog::whereIn('id', array_values($user_messages))->orderBy('last_message_date')->get();
            foreach ($dialogs as $dialog) {
                $dialog->user_name = User::where('id', $dialog->last_message_user)->first()->name;
                $dialog->user_id = dialog_user_id(json_decode($dialog->members, true), $user_id);
            }
            return $dialogs;
        }
    }
}
