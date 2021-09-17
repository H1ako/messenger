<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GetMessagesController;

Route::get('/', function () {
    $data = [
        'second_user_id' => '02'
    ];
    return view('index', $data);
});
Route::get('/messages', [GetMessagesController::class, 'get_messages']);