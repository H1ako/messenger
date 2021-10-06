<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dialog extends Model
{
    use HasFactory;

    protected $fillable = [
        'members',
        'last_message',
        'last_message_date',
        'last_message_user'
    ];

    protected $attributes = [
        'last_message' => '',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'dialogs';
}
