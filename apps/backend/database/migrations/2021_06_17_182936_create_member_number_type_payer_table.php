<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMemberNumberTypePayerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('member_number_type_payer', function (Blueprint $table) {
            $table->id();
            $table->foreignId('member_number_type_id')->constrained()->comment('the related member number type');
            $table->foreignId('payer_id')->constrained()->comment('the related payer');
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
        Schema::dropIfExists('member_number_type_payer');
    }
}
