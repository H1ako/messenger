<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;



function new_user() {
    $new_user = new User();
    $new_user->name = 'Nikita';
    $new_user->email = '';
    $new_user->password = md5('25256789');
    $new_user->save();
}

/* =+=+=+= Login/Register =+=+=+= */
Route::get('/login', function () {
    // $chat = new Chat();
    // $chat->members = json_encode([1]);
    // $chat->name = 'Rabotyagi';
    // $chat->admins = json_encode([1 => 'creator']);
    // $chat->last_message_date = Carbon::now()->format('Y-m-d H:i:s');
    // $chat->last_message_user = 0;
    // $chat->save();

    
    // $new_user = new User();
    // $new_user->name = 'Egor';
    // $new_user->email = 'sd';
    // $new_user->password = md5('25256789');
    // $new_user->save();
    // $user = User::where('Name', 'Egor')->first();
    // Schema::create("friendsList-$user->id", function (Blueprint $table) {
    //     $table->id();
    //     $table->unsignedBigInteger('user_id')->nullable(false)->default(0);
    //     $table->string('status', 100);
    // });
    
    
    // Auth::login($user, true);
    // $data = [
    //     1 => 'dialog-1-2'
    // ];
    // $user_id = Auth::user()->id;
    // $user = User::where('id', $user_id)->update(['messages' => json_encode($data)]);
    // $user->save();
    $data = [
        'login' => Auth::check()
    ];
    return view('login', $data);
})->name('login');
Route::post('/login', [AuthController::class, 'auth']);


/* =+=+=+= Home =+=+=+= */
Route::get('/', function () {
    if (Auth::check()){
        $data = [
            'user' => Auth::user()
        ];
        return view('index', $data);
    }
    else return redirect('/login');
    
})->name('home');
Route::post('/get_users', [UserController::class, 'get_users']);

/* =+=+=+= Friends =+=+=+= */
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
    return redirect('/login');
    
});
Route::post('/friends/get', [UserController::class, 'get_friends']);
Route::post('/friends/actions', [UserController::class, 'friendAction']);

/* =+=+=+= Message =+=+=+= */
Route::get('/message', function() {
    if (Auth::check()) {
        $data = [];
        return view('message', $data);
    }
    return redirect('/login');
    
});
Route::post('/message_action/get_messages', [MessageController::class, 'get_messages']);
Route::get('/message/{id}', [MessageController::class, 'show_message']);
Route::post('/message_action/get_chats', [MessageController::class, 'get_chats']);
Route::post('/message_action/send', [MessageController::class, 'new_message']);