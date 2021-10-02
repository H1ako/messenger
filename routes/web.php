<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Chat;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use App\Models\ChatList;


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

    $user = Auth::user();
    // $chat = new Chat();
    // $chat->name = 'Rabotyagi';
    // $chat->members = json_encode([$user->id]);
    // $chat->admins = json_encode([$user->id]);
    // $chat->save();
    // $chatList = new ChatList();
    // $chatList->chat_id = $chat->id;
    // $chatList->user_id = $user->id;
    // $chatList->role = 'admin';
    // $chatList->save();
    return dd([
        $user->chatList,
        ChatList::where('user_id', $user->id)->first()->chats->first()->messages
    ]);
});

/* =+=+=+= Home =+=+=+= */
Route::get('/', function () {
    if (Auth::check()){
        $data = [
            'user' => Auth::user()
        ];
        return view('index', $data);
    }
    else return redirect('/login');
    
});
Route::post('/get_users', [UsersController::class, 'get_users']);

/* =+=+=+= Friends =+=+=+= */
Route::get('/friends', function () {
    if (Auth::check()){
        return 'friends';
    }
    return redirect('/login');
    
});
Route::post('/friends/get', [UsersController::class, 'get_friends']);
Route::post('/friends/actions', [UsersController::class, 'friendAction']);

/* =+=+=+= Message =+=+=+= */
Route::get('/message', function() {
    if (Auth::check()) {
        $data = [];
        return view('message', $data);
    }
    return redirect('/login');
    
});
Route::get('/message/{id}', [MessageController::class, 'show_message']);
Route::post('/message/{id}', [MessageController::class, 'new_message']);
Route::post('/message_action/get_chats', [MessageController::class, 'get_chats']);