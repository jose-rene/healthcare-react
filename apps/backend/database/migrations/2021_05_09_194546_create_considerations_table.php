<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConsiderationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('considerations', function (Blueprint $table) {
            $table->id();

            $table->string('hcpcs')->comment('hcpcs code');
            $table->string('request_item_id')->comment('id of parent request item');
            $table->string('request_type_id')->comment('id of related request type');

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
        Schema::dropIfExists('considerations');
    }
}
