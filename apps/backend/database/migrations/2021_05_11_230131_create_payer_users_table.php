<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayerUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payer_users', function (Blueprint $table) {
            $table->id();

            $table->string('title')->comment('job title');
            $table->foreignId('payer_id')->comment('id of parent payer');
            $table->foreignId('user_id')->comment('id of related user record');
            $table->boolean('is_locked')->comment('prevented from entering new requests');
            $table->boolean('is_test')->comment('test record');

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
        Schema::dropIfExists('payer_users');
    }
}
