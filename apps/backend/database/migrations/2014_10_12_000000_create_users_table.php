<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->index();
            $table->tinyInteger('title')->unsigned()->default(0);
            $table->tinyInteger('user_type')->unsigned()->default(0);
            $table->string('first_name')->comment('first name');
            $table->string('middle_name')->nullable()->comment('middle name');
            $table->string('last_name')->comment('last name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('gender')->nullable();
            $table->rememberToken();
            $table->date('dob')->nullable();
            $table->json('notification_prefs')->nullable();

            $table->string('name_prefix')->nullable()->default('')->comment('salutation (Mr/Mrs/Ms/Miss/Dr/etc)');
            $table->string('name_suffix')->nullable()->default('')->comment('name suffix (Jr/III/Esq/Md/etc');

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
        Schema::dropIfExists('users');
    }
}
