<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;


function new_user() {
    $new_user = new User();
    $new_user->name = 'Oleg';
    $new_user->email = 'demon200648@yandex.ru';
    $new_user->password = md5('25256789');
    $new_user->save();
}

Route::get('/login', function () {
    // Schema::create('friendsList-2', function (Blueprint $table) {
    //     $table->id();
    //     $table->unsignedBigInteger('user_id')->nullable(false)->default(0);
    //     $table->string('status', 100);
    // });
    // $user = User::where('Name', 'Nikita')->first();
    // Auth::login($user, true);
    return 'login';
});
Route::get('/', function () {
    // $user = User::where('Name', 'Nikita')->first();
    // Auth::login($user, true);
    if (Auth::check()){
        $data = [
            'user' => Auth::user()
        ];
        return view('index', $data);
    }
    else return redirect('/login');
    
});

Route::post('/get_users', [UsersController::class, 'get_users']);

Route::get('/friends', function () {
    if (Auth::check()){
        $userID = Auth::user()->id;
        $user_friends = DB::table("friendsList-$userID")->get();
        foreach($user_friends as $user_friend){
            $user_friend->user_name = User::where('id', $user_friend->user_id)->first()->name;
        }
        $data = [
            'friends' => $user_friends
        ];
        return view('friends', $data);
        
    }
    else return redirect('/login');
    
});

Route::get('/message', [MessageController::class, 'show_message']);

Route::post('/message/send', [MessageController::class, 'new_message']);