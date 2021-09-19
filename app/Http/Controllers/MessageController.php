<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class MessageController extends Controller
{
    public function show_message() {
        if (Auth::check()){
            if (isset($_GET['id'])) $second_userID = $_GET['id'];
            else return redirect('/friends');
    
            if ($second_userID && User::where('id', $second_userID)->get()){
                $userID = Auth::user()->id;
                
                if (DB::getSchemaBuilder()->hasTable("dialog-$userID-$second_userID")) {
                    $messages_DB = DB::table("dialog-$userID-$second_userID");
                }
                else $messages_DB = DB::table("dialog-$second_userID-$userID");
                $messages = $messages_DB->get();
    
                foreach($messages as $message){
                    $message->sender_name = User::where('id', $message->sender)->first()->name;
                }
                setcookie('second_user_id', $second_userID, time()+3600);
                $data = [
                    'user_id' => $userID,
                    'second_user_id' => $second_userID,
                    'messages' => $messages,
                ];
                return view('message', $data);
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
        if (DB::getSchemaBuilder()->hasTable("dialog-$user_id-$second_user_id")) {
            $dialog = DB::table("dialog-$user_id-$second_user_id");
        }
        else $dialog = DB::table("dialog-$second_user_id-$user_id");
        $dialog->insert([
            'text' => $text,
            'sender' => $user_id,
            'time' => $time
        ]);
    }
}
