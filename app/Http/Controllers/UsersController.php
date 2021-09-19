<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UsersController extends Controller
{
    public function get_users(Request $request) {
        $cur_user = Auth::user();
        $text = $request->input('text_field');
        // $text = 'Oleg';
        $users = User::where('id', '!=' , Auth::user()->id)->where('name', $text)->get();
        // $data = '';
        foreach ($users as $user) {
            $is_friend = DB::table("friendsList-$cur_user->id")->where('user_id', $user->id)->first();
            if ($is_friend) $user->status = $is_friend->status;
            else $user->status = 'Not Friend';
        }
        return json_encode($users);
        // return $data;
    }
}
