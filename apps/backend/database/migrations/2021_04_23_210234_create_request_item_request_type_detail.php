<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestItemRequestTypeDetail extends Migration
{
    /**
     * Run the migrations.
     * This is a pivot table for request_items and request_item_details.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_item_request_type_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('request_item_id')->comment('The related request item');
            $table->foreignId('request_type_detail_id')->comment('The related request type item');

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
        Schema::dropIfExists('request_item_request_type_detail');
    }
}
