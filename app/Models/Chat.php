<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

class Chat extends Model
{
    use HasFactory;

    protected $attributes = [
        'name',
        'members',
        'admins'
    ];

    public function chatList() {
        return $this->belongsTo(ChatList::class);
    }

    public function messages() {
        return $chat_id = $this->chatList();
        $chat_id = $this->chatList()->chat_id;
        
        if (Schema::hasTable("messages_$chat_id")) {
            $messages = DB::table("messages_$this->id");
            return $messages;
        }
        $messages = $this->create_messages();
        return $messages;

    }

    public function create_messages() {
        $chat_id = $this->chatList()->chat_id;
        Schema::create("messages_$chat_id", function (Blueprint $table) {
            $table->id();
            $table->string('sender');
            $table->text('text');
            $table->timestamps();
        });
        return DB::table("messages_$chat_id");
    }
}
