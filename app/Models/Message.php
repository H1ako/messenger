<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'text'
    ];

    public function dialog() {
        return $this->belongsTo(Dialog::class);
    }

    public function chat() {
        return $this->belongsTo(Chat::class);
    }
}
