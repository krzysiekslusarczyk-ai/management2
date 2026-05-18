<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class iCloudAccount extends Model
{
    use HasFactory;

    protected $table = 'icloud_accounts';

    protected $fillable = [
        'user_id',
        'icloud_email',
        'app_password',
        'calendar_url',
        'calendar_id',
        'sync_enabled',
        'last_sync_at',
        'sync_status',
    ];

    protected $hidden = [
        'app_password',
    ];

    protected $casts = [
        'sync_enabled' => 'boolean',
        'last_sync_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
