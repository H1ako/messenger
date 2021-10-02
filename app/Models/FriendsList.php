<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FriendsList extends Model
{
    use HasFactory;
    /**
    * The table associated with the model.
    *
    * @var string
    */
    protected $table = 'friends_lists';

    protected $attributes = [
        'user_id',
        'second_user_id',
        'status'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
    public function friends() {
        return $this->where('user_id', $this->user()->id)->get();
    }
}
