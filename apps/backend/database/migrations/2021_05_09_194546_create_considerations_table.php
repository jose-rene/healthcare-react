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

            $table->string('hcpcs')->nullable()->comment('hcpcs code');
            $table->foreignId('request_item_id')->comment('id of parent request item');
            $table->foreignId('request_type_id')->comment('id of related request type');
            $table->boolean('is_default')->default(false)->comment('If this is the default consideration');
            $table->string('summary')->nullable()->comment('The summary');

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
