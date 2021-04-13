<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index();
            $table->foreignId('member_id')->comment('The member associated with the request');
            $table->foreignId('payer_id')->nullable()->comment('The payer associated with this request');
            $table->string('auth_number', 128)->nullable()->comment('The user assigned Auth # for the request');
            $table->string('status', 16)->nullable()->comment('The current status of the request');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('requests');
    }
}
