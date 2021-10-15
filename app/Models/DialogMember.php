<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DialogMember extends Model
{
    use HasFactory;

    protected $table = 'dialog_members';

    protected $fillable = [
        'dialog_id',
        'from_id',
        'to_id',
    ];

    public function dialog() {
        return $this->belongsTo(Dialog::class);
    }

    public function user() {
        return $this->belongsTo(User::class, 'from_id');
    }
}
