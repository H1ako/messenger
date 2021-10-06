<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

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
                    Schema::create("friendsList-$user->id", function (Blueprint $table) {
                        $table->id();
                        $table->unsignedBigInteger('user_id')->nullable(false)->default(0);
                        $table->string('status', 100);
                    });
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
        else {
            return json_encode(['url' => route('login')]);
        }
    }
}
