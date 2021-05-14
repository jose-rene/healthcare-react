<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MemberPayerHistory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'member_id',
        'payer_id',
        'lob_id',
        'member_number',
        'member_number_type_id',
    ];

    /**
     * Relationship to member.
     *
     * @return App\Models\Member
     */
    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    /**
     * Relationship to payer.
     *
     * @return App\Models\Payer
     */
    public function payer()
    {
        return $this->belongsTo(Payer::class);
    }

    public function lob()
    {
        return $this->belongsTo(Lob::class);
    }

    public function type()
    {
        return $this->belongsTo(MemberNumberType::class);
    }
}
