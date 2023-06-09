<?php

use App\Models\RequestStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class CreateRequestStatusesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_statuses', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('status name');
            $table->string('slug')->nullable()->comment('received, assigned, scheduled, assessed, submitted, completed, on_hold, cancelled, reopened');
            $table->integer('sort')->comment('sort order');

            $table->timestamps();
            $table->softDeletes();
        });

        $statuses = [
            'received',
            'assigned',
            'scheduled',
            'assessed',
            'submitted',
            'completed',
            'on_hold',
            'cancelled',
            'reopened',
        ];

        foreach ($statuses as $sort => $status) {
            $name = Str::of($status)->replace('_', ' ')->title();
            $slug = Str::of($status)->lower();

            RequestStatus::create(
                compact('name', 'slug', 'sort')
            );
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('request_statuses');
    }
}
