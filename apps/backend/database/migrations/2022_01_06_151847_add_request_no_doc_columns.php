<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRequestNoDocColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table(
            'requests',
            function (Blueprint $table) {
                $table->string('documents_reason')->nullable()->after('due_at_na')->comment('Reason for no documents.');
                $table->boolean('documents_na')->default(0)->after('due_at_na')->comment('Request has no documents flag.');
            }
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table(
            'users',
            function (Blueprint $table) {
                $table->dropColumn('documents_reason');
                $table->dropColumn('documents_na');
            }
        );
    }
}
