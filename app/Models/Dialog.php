<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dialog extends Model
{
    use HasFactory;

    protected $fillable = [
        'last_message',
        'last_message_user'
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'dialogs';

    public function members() {
        return $this->hasMany(DialogMember::class, 'dialog_id')->orderBy('from_id');
    }

    public function messages() {
        return $this->hasMany(DialogMessage::class, 'dialog_id')->orderBy('created_at');
    }
}
