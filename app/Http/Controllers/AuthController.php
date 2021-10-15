<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function auth(Request $request) {
        $type = $request->input('type');
        if ($type == 'login') {
            $email = $request->input('email');
            $user = User::where('email', $email)->first();
            if ($user) {
                $pass = $request->input('password');
                if (md5($pass) == $user->password) {
                    Auth::login($user, true);
                    return json_encode(['url' => route('home')]);
                }
            }
            else return json_encode(['url' => route('login')]);
            
        }
        else if ($type == 'register') {
            $email = $request->input('email');
            $user = User::where('email', $email)->first();
            if (!$user) {
                $pass = $request->input('password');
                $sec_pass = $request->input('second_pass');
                if ($pass == $sec_pass) {
                    $user = new User();
                    $user->name = $request->input('name');
                    $user->email = $email;
                    $user->password = md5($pass);
                    $user->save();
                    Auth::login($user, true);
                    return json_encode(['url' => route('home')]);
                }
            }
            else return json_encode(['url' => route('login')]);

        }
        else if ($type == 'logOut') {
            Auth::logout();
            return json_encode(['url' => route('login')]);
        }
    }
}
