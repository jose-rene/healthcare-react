<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLoginHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('login_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->comment('Associated user id');
            $table->string('ip')->default('')->comment('The logged IP address');
            $table->string('browser')->default('')->comment('The users browser');
            $table->string('browser_family')->default('')->comment('The browser vendor');
            $table->string('browser_version')->default('')->comment('The browser version');
            $table->string('browser_engine')->default('')->comment('The browser engine');
            $table->string('os')->default('')->comment('The users operating system');
            $table->string('os_family')->default('')->comment('The os vendor');
            $table->string('os_version')->default('')->comment('The os version');
            $table->string('device')->default('')->comment('The users device');
            $table->string('device_model')->default('')->comment('The device model');
            $table->string('ua')->default('')->comment('The users user agent string');

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
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('login_histories');
        Schema::enableForeignKeyConstraints();
    }
}
