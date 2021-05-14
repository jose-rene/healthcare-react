<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestFeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_fees', function (Blueprint $table) {
            $table->id();

            $table->string('description')->comment('description, if necessary');
            $table->dateTime('date')->nullable()->comment('date of fee (if necessary) such as no-shows');
            $table->double('fee')->comment('amount of the fee');
            $table->foreignId('request_fee_type_id')->comment('id of fee type');
            $table->foreignId('request_id')->comment('id of parent request');

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
        Schema::dropIfExists('request_fees');
    }
}
