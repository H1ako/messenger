<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;

/* =+=+=+= Login/Register =+=+=+= */
Route::get('/login', function () {
    $data = [
        'login' => Auth::check()
    ];
    return view('login', $data);
})->name('login');
Route::post('/login', [AuthController::class, 'auth']);


/* =+=+=+= Home =+=+=+= */
Route::get('/', function () {
    if (Auth::check()){
        return view('index');
    }
    else return redirect('/login');
    
})->name('home');
Route::post('/get_users', [UserController::class, 'get_users']);

/* =+=+=+= Friends =+=+=+= */
Route::get('/friends', function () {
    if (Auth::check()){
        return view('friends');
        
    }
    return redirect('/login');
    
});
Route::post('/friends/get', [UserController::class, 'get_friends']);
Route::post('/friends/actions', [UserController::class, 'friendAction']);

/* =+=+=+= Message =+=+=+= */
Route::get('/message', function() {
    if (Auth::check()) {
        // $chat = new Chat(['name' => 'Rabotyagi']);
        // $chat->save();
        // $chat->members()->create(['user_id' => 1, 'role' => 'creator']);
        return view('chats');
    }
    return redirect('/login');
    
});
Route::post('/message_action/get_messages', [MessageController::class, 'get_messages']);
Route::get('/message/{id}', [MessageController::class, 'show_message'])->name('messages');
Route::post('/message_action/get_chats', [MessageController::class, 'get_chats']);
Route::post('/message_action/create_chat', [MessageController::class, 'new_chat']);
Route::post('/message_action/send', [MessageController::class, 'new_message']);