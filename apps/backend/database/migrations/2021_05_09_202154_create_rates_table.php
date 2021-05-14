<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rates', function (Blueprint $table) {
            $table->id();

            $table->string('clinical_user_id')->comment('id of applicable clinical user (if any)');
            $table->string('clinician_rate')->comment('applicable clinician rate (if any)');
            $table->string('consultant_rate')->comment('applicable consultant rate (if any)');
            $table->string('lob_id')->comment('id of applicable line of business (if any)');
            $table->string('payer_id')->comment('id of applicable payer (if any)');
            $table->string('payer_rate')->comment('applicable payer rate (if any)');
            $table->string('priority')->comment('user-defined sort order');
            $table->string('request_type_id')->comment('id of applicable request type (if any)');
            $table->string('reviewer_rate')->comment('applicable reviewer rate (if any)');
            $table->string('therapy_network_id')->comment('id of applicable therapy network (if any)');

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
        Schema::dropIfExists('rates');
    }
}
