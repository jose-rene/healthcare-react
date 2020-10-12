<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuestionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->nullable();
            $table->foreignId('valuelist_id')->nullable();
            // json friendly tag
            $table->string('name', 64)->default('')->nullable(false);
            $table->string('title')->default('')->nullable(false);
            $table->unsignedTinyInteger('position')->default(0);
            $table->string('question_type', 16)->default('');
            $table->string('ele_type', 16)->default('');
            $table->boolean('required')->default(0);
            $table->json('dependencies')->nullable();
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
        Schema::dropIfExists('questions');
    }
}
