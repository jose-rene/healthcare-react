<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExpensesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();

            $table->double('amount')->comment('expense amount');
            $table->string('description')->comment('description');
            $table->foreignId('expense_type_id')->constrained()->comment('id of related expense type');
            $table->morphs('expenseable');
            $table->foreignId('request_id')->nullable()->constrained()->comment('id of related request (if any)');

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
        Schema::dropIfExists('expenses');
    }
}
