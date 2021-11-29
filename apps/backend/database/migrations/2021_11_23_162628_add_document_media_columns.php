<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddDocumentMediaColumns extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->tinyInteger('position')->unsigned()->default(0)->comment('Optional position of item');
            $table->string('description')->nullable()->comment('Optional description of document');
            $table->json('exif_data')->nullable()->comment('json exif data for media files');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropColumn('position');
            $table->dropColumn('description');
            $table->dropColumn('exif_data');
        });
    }
}
