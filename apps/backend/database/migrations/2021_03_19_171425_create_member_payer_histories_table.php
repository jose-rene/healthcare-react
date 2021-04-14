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
            $table->foreignId('member_id')->constrained()->comment('The member associated with this history record');
            $table->foreignId('payer_id')->comment('The payer related to this member');
            // @todo this probably has to be lob_payer_id
            $table->foreignId('lob_id')->comment('The line of business associated with this member');
            $table->string('member_number')->comment('The members ID assigned by the plan');
            $table->string('member_number_type')->comment('The member ID or number type');

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
