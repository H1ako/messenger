<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Friend;

class UserController extends Controller
{
    public function get_users(Request $request) {
        $cur_user = Auth::user();
        $text = $request->input('text_field');
        if ($text != '') {
            $users = User::where('id', '!=' , $cur_user->id)->where('name', 'like', "%$text%")->get();

            foreach ($users as $user) {
                $friend = Friend::where('user_id', $cur_user->id)->where('friend_id', $user->id)->first();
    
                if ($friend) $user->status = $friend->status;
                else $user->status = 'notFriend';
            }
            return json_encode($users);
        }
        return '[]';
    }

    public function get_friends(Request $request) {
        $cur_user = Auth::user();
        $type = $request->input('type');
        $friends = $cur_user->friends->where('status', $type);

        foreach ($friends as $friend) {
            $friend->name = User::where('id', $friend->friend_id)->first()->name;
        }
        return json_encode($friends);
    }

    public function friendAction(Request $request) {
        $cur_user = Auth::user();
        $user_id = $request->input('user_id');
        $action = $request->input('action');

        if ($action === 'removeFriend' || $action === 'removeRequest' || $action === 'declineRequest') {
            $friends = Friend::whereIn('user_id', [$cur_user->id, $user_id])
                            ->whereIn('friend_id', [$cur_user->id, $user_id])
                            ->get();
            foreach ($friends as $friend) {
               $friend->delete(); 
            }
        }

        else if ($action === 'addFriend') {
            $data = [
                [
                    'user_id' => $cur_user->id,
                    'friend_id' => $user_id,
                    'status' => 'request'
                ],
                [
                    'user_id' => $user_id,
                    'friend_id' => $cur_user->id,
                    'status' => 'request_to_me'
                ]

            ];
            Friend::insert($data);
        }

        else if ($action === 'acceptRequest') {
            $friends = Friend::whereIn('user_id', [$cur_user->id, $user_id])
                            ->whereIn('friend_id', [$cur_user->id, $user_id])
                            ->get();
            
            foreach ($friends as $friend) {
               $friend->status = 'friend';
               $friend->save();
            }
        }
    }
}
