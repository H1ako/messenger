<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatList extends Model
{
    use HasFactory;

    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'chat_lists';

    protected $attributes = [
        'user_id',
        'chat_id',
        'role',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'id', 'user_id');
    }

    public function chats() {
        return $this->hasMany(Chat::class, 'id', 'chat_id');
    }
}
