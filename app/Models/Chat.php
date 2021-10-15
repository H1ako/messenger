<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $table = 'chats';

    protected $fillable = [
        'name',
        'last_message',
        'last_message_user'
    ];

    public function members() {
        return $this->hasMany(ChatMember::class, 'chat_id');
    }

    public function messages() {
        return $this->hasMany(ChatMessage::class, 'chat_id');
    }
}
