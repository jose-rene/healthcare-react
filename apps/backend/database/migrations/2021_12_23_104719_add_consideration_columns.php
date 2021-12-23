<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddConsiderationColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('considerations', function (Blueprint $table) {
            $table->boolean('is_recommended')->nullable()->after('is_default')->comment('If the default consideration is recommended');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('considerations', function (Blueprint $table) {
            if (Schema::hasColumn('considerations', 'is_recommended')) {
                $table->dropColumn('is_recommended');
            }
        });
    }
}
