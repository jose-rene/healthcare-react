<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLobPayerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lob_payer', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payer_id');
            $table->foreignId('lob_id');
            // pivot table props
            $table->string('alias_name')->default('')->comment('The payer alias for the lob name');
            $table->boolean('is_tat_enabled')->default(0)->comment('Flag is TAT is enabled');
            $table->boolean('is_tat_default_na')->default(0)->comment('Flag is TAT defaulted to n/a');
            $table->boolean('is_tat_required')->default(0)->comment('Flag is TAT required');
            $table->float('payer_rate', 6, 2)->nullable()->comment('The rate charged to the payer');
            $table->float('clinician_rate', 6, 2)->nullable()->comment('The rate paid to the clinician');
            $table->float('reviewer_rate', 6, 2)->nullable()->comment('The rate paid to the reviewer');
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
        Schema::dropIfExists('lob_payer');
    }
}
