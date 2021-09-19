<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
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
