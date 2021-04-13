<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLobsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('lobs', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('The name for this line of business');
            $table->foreignId('payer_id');
            $table->string('alias_name')->default('')->comment('The payer alias for the lob name');
            $table->boolean('is_tat_enabled')->default(0)->comment('Flag is TAT is enabled');
            $table->boolean('is_tat_default_na')->default(0)->comment('Flag is TAT defaulted to n/a');
            $table->boolean('is_tat_required')->default(0)->comment('Flag is TAT required');
            $table->float('payer_rate', 6, 2)->nullable()->comment('The rate charged to the payer');
            $table->float('clinician_rate', 6, 2)->nullable()->comment('The rate paid to the clinician');
            $table->float('reviewer_rate', 6, 2)->nullable()->comment('The rate paid to the reviewer');
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
        Schema::dropIfExists('lobs');
    }
}
