<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DialogList extends Model
{
    use HasFactory;
    
    protected $hidden = [
        'user_id',
        'second_user_id',
        'dialog_id'

    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function dialogs() {
        return $this->hasMany(Dialog::class, 'id', 'dialog_id');
    }
}
