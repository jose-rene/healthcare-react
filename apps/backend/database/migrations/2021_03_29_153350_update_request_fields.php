<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateRequestFields extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->string('auth_id', 128)->nullable()->change();
            $table->string('status', 16)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('requests', function (Blueprint $table) {
            $table->string('auth_id', 128)->change();
            $table->string('status', 16)->change();
        });
    }
}
