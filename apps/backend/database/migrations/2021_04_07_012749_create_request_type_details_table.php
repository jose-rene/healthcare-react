<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestTypeDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_type_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_type_id')->comment('Relationship to request types');
            $table->string('name')->comment('The name of the request type');
            $table->boolean('is_default')->default(0)->comment('Flag is automatically populated  as a default value');

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
        Schema::dropIfExists('request_type_details');
    }
}
