<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayerMemberNumberTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payer_member_number_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payer_id');
            $table->string('name')->comment('An entity or slug name.');
            $table->string('title')->comment('The human-readable title for ui display.');
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
        Schema::dropIfExists('payer_member_number_types');
    }
}
