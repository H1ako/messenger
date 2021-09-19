<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Auth;


class UsersController extends Controller
{
    public function get_users(Request $request) {
        $cur_user_id = Auth::user()->id;
        $text = $request->input('text_field');
        $users = User::where('id', '!=' , Auth::user()->id)->where('name', $text)->get();

        foreach ($users as $user) {
            $is_friend = DB::table("friendsList-$cur_user_id")->where('user_id', $user->id)->first();

            if ($is_friend) $user->status = $is_friend->status;
            else $user->status = 'notFriend';
        }
        return json_encode($users);
        // return $data;
    }

    public function get_friends(Request $request) {
        $cur_user_id = Auth::user()->id;
        $type = $request->input('type');
        $type = 'friend';
        $friends = DB::table("friendsList-$cur_user_id")->where('status', $type)->get();

        foreach ($friends as $friend) {
            $friend->name = User::where('id', $friend->user_id)->first()->name;
        }
        return json_encode($friends);
        // return $data;
    }

    public function friendAction(Request $request) {
        $cur_user_id = Auth::user()->id;
        $user_id = $request->input('user_id');
        $action = $request->input('action');

        if ($action === 'removeFriend' || $action === 'removeRequest' || $action === 'declineRequest') {
            DB::table("friendsList-$user_id")->where('user_id', $cur_user_id)->delete();
            DB::table("friendsList-$cur_user_id")->where('user_id', $user_id)->delete();
        }

        else if ($action === 'addFriend') {
            DB::table("friendsList-$user_id")->insert([
                'user_id' => $cur_user_id,
                'status' => 'requestToMe'
            ]);
            DB::table("friendsList-$cur_user_id")->insert([
                'user_id' => $user_id,
                'status' => 'request'
            ]);
        }

        else if ($action === 'acceptRequest') {
            DB::table("friendsList-$user_id")->where('user_id', $cur_user_id)
                ->update(['status' => 'friend']);
            DB::table("friendsList-$cur_user_id")->where('user_id', $user_id)
                ->update(['status' => 'friend']);

        }
    }
}
