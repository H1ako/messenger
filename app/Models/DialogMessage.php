<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class DialogMessage extends Model
{
    use HasFactory;

    protected $table = 'dialog_messages';

    protected $fillable = [
        'dialog_id',
        'from_id',
        'text',
    ];

    public function dialog() {
        return $this->belongsTo(Dialog::class);
    }

    public function getCreatedAtAttribute($created_at) {
        $date = Carbon::parse($created_at);
        $userTimeZone = get_local_time() ?: 'UTC';
        $date->setTimezone($userTimeZone);
        return $date->format('H:i');
    }
}
