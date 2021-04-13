<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEntitiesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (null === ($db = config('database.connections.eag')) || 'nada' === $db['database']) {
            return;
        }

        if (Schema::connection('eag')->hasTable('entities')) { // do not re-run in eag
            return;
        }

        Schema::connection('eag')->create('entities', function (Blueprint $table) {
            $table->id();

            $table->string('entity')->comment('table name');
            $table->string('column_name')->comment('name of column');
            $table->string('data_type')->comment('like varchar(255)');
            $table->string('key')->comment('is primary key or not');
            $table->string('nullable')->comment('is nullable');
            $table->string('comments')->comment('comment from column');

            $table->json('cache_json')->comment('Whole role describe');

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
        if (null === ($db = config('database.connections.eag')) || 'nada' === $db['database']) {
            return;
        }
        Schema::connection('eag')->dropIfExists('entities');
    }
}
