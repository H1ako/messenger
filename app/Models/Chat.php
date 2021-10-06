<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'members',
        'admins',
        'last_message',
        'last_message_date',
        'last_message_user'
    ];

    protected $attributes = [
        'last_message' => '',
    ];

    protected $table = 'chats';
}
