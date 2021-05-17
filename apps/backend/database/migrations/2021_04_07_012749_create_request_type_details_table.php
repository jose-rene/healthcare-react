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
            $table->foreignId('request_type_template_id')->nullable()->comment('id of the parent request_item_template');
            $table->string('name')->comment('The name of the request type');
            $table->boolean('is_default')->default(0)->comment('Flag is automatically populated as a default value');
            $table->boolean('is_auto_include')->default(0)->comment('flag to automatically create a request_item_detail record when the parent request type is selected for a request_item. Overridable at the payer level');

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
