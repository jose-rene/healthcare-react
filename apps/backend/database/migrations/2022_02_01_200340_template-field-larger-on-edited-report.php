<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class TemplateFieldLargerOnEditedReport extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('narrative_reports', function (Blueprint $table) {
            $table->longText('text')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('narrative_reports', function (Blueprint $table) {
            $table->longText('text')->change();
        });
    }
}
