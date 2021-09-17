<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class GetMessagesController extends Controller
{
    
    public function get_messages(){
        $userID = '01';
        $second_userID = $_GET['id'];
        $messages_DB = DB::table("dialog-$userID-$second_userID");
        $messages = $messages_DB->get();
        return $messages->toJson();
    }
}
