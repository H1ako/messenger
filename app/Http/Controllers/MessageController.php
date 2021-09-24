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
    public function show_message($id) {
        if (Auth::check()){
            $second_user_id = $id;
            if ($second_user_id && User::where('id', $second_user_id)->first()){
                $user_id = Auth::user()->id;
                $cur_user_DB = User::where('id', $user_id);
                $cur_user = $cur_user_DB->first();
                $user_messages = json_decode($cur_user->messages, true);
                if (isset($user_messages[$second_user_id])) {
                    $dialog = DB::table('dialog-'.$user_messages[$second_user_id]);
                }
                else {
                    $new_dialog = new Dialog();
                    $new_dialog->members = json_encode([$user_id, intval($second_user_id)]);
                    $new_dialog->last_message_date = Carbon::now()->format('Y-m-d H:i:s');
                    $new_dialog->save();
                    Schema::create("dialog-$new_dialog->id", function (Blueprint $table) {
                        $table->id();
                        $table->text('text')->nullable();
                        $table->unsignedBigInteger('sender')->nullable(false);
                        $table->string('time', 100)->nullable(false);
                    });
                    $sec_user_DB = User::where('id', $second_user_id);
                    $sec_user = $sec_user_DB->first();
                    $sec_user_messages = json_decode($sec_user->messages, true);
                    $sec_user_messages[$user_id] = $new_dialog->id;
                    $sec_user_DB->update(['messages' => json_encode($sec_user_messages)]);

                    $user_messages[$second_user_id] = $new_dialog->id;
                    $cur_user_DB->update(['messages' => json_encode($user_messages)]);
                    $dialog = DB::table("dialog-$new_dialog->id");
                }
                $messages = $dialog->get();
    
                foreach($messages as $message){
                    $message->sender_name = User::where('id', $message->sender)->first()->name;
                }
                setcookie('second_user_id', $second_user_id, time()+3600);
                $data = [
                    'user_id' => $user_id,
                    'second_user_id' => $second_user_id,
                    'messages' => $messages,
                ];
                return view('message_user', $data);
            }
            else return redirect('/friends');
            
        }
        else return redirect('/login');
    }

    public function new_message(Request $request) {
        $user_id = Auth::user()->id;
        $second_user_id = $request->input('second_user_id');
        $text = $request->input('message_text');
        $time = $request->input('time');

        $user_id = Auth::user()->id;
        $cur_user = User::where('id', $user_id)->first();
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

    public function check_message(Request $request) {
        $user_id = Auth::user()->id;
        $second_user_id = $request->input('second_user_id');
        $last_message_id = $request->input('last_message_id');
        // $second_user_id = 2;
        // $last_message_id = 'zero';
        $data = [
            'last_message_id' => 'start'
        ];

        $cur_user = User::where('id', $user_id)->first();
        $user_messages = json_decode($cur_user->messages, true);
        if (isset($user_messages[$second_user_id])) {
            $dialog = DB::table('dialog-'.$user_messages[$second_user_id]);
        }
        
        $last_message = $dialog->where('sender', $second_user_id)->orderBy('id', 'desc')->first();
        if ($last_message_id === 'start') {
            $data = [
                'last_message_id' => $last_message != null ? $last_message->id : 'zero'
            ];
            
            return json_encode($data);
        }

        else if ($last_message_id === 'zero') {
            if ($last_message != null) {
                $data = [
                    'text' => $last_message->text,
                    'sender' => User::where('id', $last_message->sender)->first()->name,
                    'time' => $last_message->time,
                    'last_message_id' => $last_message->id,
                    'status' => 200
                ];
            }
            else {
                $data = [
                    'last_message_id' => 'zero'
                ];
            }

            return json_encode($data);
        }
        
        if (isset($last_message->id) && $last_message->id != $last_message_id) {
            $data = [
                'text' => $last_message->text,
                'sender' => User::where('id', $last_message->sender)->first()->name,
                'time' => $last_message->time,
                'last_message_id' => $last_message->id,
                'status' => 200
            ];
        }
        else {
            $data = [
                'last_message_id' => $last_message->id
            ];
        }
        return json_encode($data);
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
