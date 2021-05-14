<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestDatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_dates', function (Blueprint $table) {
            $table->id();

            $table->foreignId('request_id')->constrained()->comment('id of parent request');
            $table->unsignedBigInteger('request_date_type_id')->comment('id of related request date type');
            $table->string('note')->nullable()->comment('note, if applicable');
            $table->dateTime('date')->comment('date');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('request_dates');
    }
}
