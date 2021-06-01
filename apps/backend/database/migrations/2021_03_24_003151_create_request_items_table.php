<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_items', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid');

            $table->string('name');
            $table->foreignId('request_id')->comment('The related request');
            $table->foreignId('request_type_id')->comment('The associated request type');
            $table->unsignedBigInteger('request_outcome_id')->nullable();
            $table->foreignId('hcpcs_id')->nullable()->comment('hcpcs id, looked up from the related request type');
            $table->string('note')->nullable()->comment('A note');
            $table->string('clinician_summary')->nullable()->comment('A summary provided by the clinician');
            $table->string('assessment')->nullable()->comment('The assessment summary provided by the clinician');
            $table->string('decision')->nullable()->comment('The decision ascertained by the clinician');
            $table->double('vendor_price')->nullable()->comment('null');
            $table->boolean('is_additional_consideration')->nullable()->comment('If there are additional considerations');
            $table->json('json_data')->nullable()->comment('The data of the associated assessment');

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
        Schema::dropIfExists('request_items');
    }
}
