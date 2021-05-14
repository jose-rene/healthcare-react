<?php

use App\Models\DocumentType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class CreateDocumentTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('document_types', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('name');
            $table->string('slug')->nullable()->comment('request/narrative/media_picture/media_video/internal');

            $table->timestamps();
            $table->softDeletes();
        });


        $types = [
            'request',
            'media',
            'internal',
        ];

        foreach ($types as $type) {
            $name = Str::of($type)->replace('_', ' ')->title();
            $slug = Str::of($type)->lower();

            DocumentType::firstOrCreate(
                compact('slug'),
                compact('name', 'slug')
            );
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('document_types');
    }
}
