<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePhonesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('phones', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');

            $table->morphs('phoneable');

            $table->string('number', 24)->comment('The phone number.');
            $table->string('contact_type', 48)->default('')->comment('The contact type for the phone number.');

            $table->boolean('is_primary')->default(0)->comment('flag for primary phone');
            $table->boolean('is_mobile')->default(0)->comment('flag for mobile phone');

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
        Schema::dropIfExists('phones');
    }
}
