<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

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
                else if (DB::getSchemaBuilder()->hasTable("dialog-$second_userID-$userID")) {
                    $messages_DB = DB::table("dialog-$second_userID-$userID");
                }
                else {
                    Schema::create("dialog-$userID-$second_userID", function (Blueprint $table) {
                        $table->id();
                        $table->text('text')->nullable();
                        $table->unsignedBigInteger('sender')->nullable(false);
                        $table->string('time', 100)->nullable(false);
                    });
                    $messages_DB = DB::table("dialog-$userID-$second_userID");
                }
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

    public function check_message(Request $request) {
        $user_id = Auth::user()->id;
        $second_user_id = $request->input('second_user_id');
        $last_message_id = $request->input('last_message_id');
        $data = [];
        // $second_user_id = 4;
        // $last_message_id = 9;
        
        if (DB::getSchemaBuilder()->hasTable("dialog-$user_id-$second_user_id")) {
            $dialog = DB::table("dialog-$user_id-$second_user_id");
        }
        else $dialog = DB::table("dialog-$second_user_id-$user_id");
        $last_message = $dialog->where('sender', $second_user_id)->orderBy('id', 'desc')->first();
        if ($last_message_id === 'start') {
            $data = [
                'last_message_id' => $last_message->id
            ];
            return json_encode($data);
        }
        
        if ($last_message->id != $last_message_id) {
            $data = [
                'text' => $last_message->text,
                'sender' => User::where('id', $last_message->sender)->first()->name,
                'time' => $last_message->time,
                'last_message_id' => $last_message->id,
                'status' => 200
            ];
        }
        return json_encode($data);
    }
}
