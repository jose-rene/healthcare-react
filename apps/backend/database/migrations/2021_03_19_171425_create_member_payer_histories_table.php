<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateMemberPayerHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('member_payer_histories', function (Blueprint $table) {
            $table->id();

            $table->string('lob_id'); // links to line of business
            $table->foreignId('member_id')->constrained();
            $table->string('member_number');
            $table->string('member_number_type');
            $table->unsignedBigInteger('payer_id');

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
        Schema::dropIfExists('member_payer_histories');
    }
}
