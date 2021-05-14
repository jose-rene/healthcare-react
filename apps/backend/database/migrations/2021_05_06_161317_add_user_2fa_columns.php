<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUser2faColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_2fa')->after('notification_prefs')->default(0)->comment('Flag to enable 2 factor authentication');
            $table->string('google2fa_secret')->after('notification_prefs')->nullable()->comment('The google 2 factor secret');
            $table->string('twofactor_method')->after('notification_prefs')->nullable()->comment('The two factor method preference');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_2fa');
            $table->dropColumn('google2fa_secret');
        });
    }
}
