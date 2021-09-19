<?php
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;


Route::get('/login', function () {
    // Schema::create('friendsList-2', function (Blueprint $table) {
    //     $table->id();
    //     $table->unsignedBigInteger('user_id')->nullable(false)->default(0);
    //     $table->string('status', 100);
    // });
});
Route::get('/', function () {
    // $new_user = new User();
    // $new_user->name = 'Oleg';
    // $new_user->email = 'demon200648@yandex.ru';
    // $new_user->password = md5('25256789');
    // $new_user->save();
    
    $user = User::where('Name', 'Nikita')->first();
    Auth::login($user, true);
    if (Auth::check()){
        return Auth::user()->id . ' ' . User::where('Name', 'Oleg')->first()->id;
    }
    
});

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
    else return redirect('/');
    
});

Route::get('/message', function () {
    if (Auth::check()){
        if (isset($_GET['id'])) $second_userID = $_GET['id'];
        else return redirect('/');

        if ($second_userID && User::where('id', $second_userID)->get()){
            $userID = Auth::user()->id;
            
            if (DB::getSchemaBuilder()->hasTable("dialog-$userID-$second_userID")) {
                $messages_DB = DB::table("dialog-$userID-$second_userID");
            }
            else $messages_DB = DB::table("dialog-$second_userID-$userID");
            $messages = $messages_DB->get();

            foreach($messages as $message){
                $message->sender_name = User::where('id', $message->sender)->first()->name;
            }
            setcookie('second_user_id', $second_userID, time()+3600);
            $data = [
                'user_id' => $userID,
                'second_user_id' => $second_userID,
                'messages' => $messages,
            ];
            return view('index', $data);
        }
        else return redirect('/');
        
    }
    else return redirect('/');
    
});

Route::post('/message/send', [MessageController::class, 'new_message']);