<?php

use App\Models\FeeType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class CreateFeeTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fee_types', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('slug')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });


        $types = [
            'request',
            'clinician',
            'reviewer',
            'no show',
        ];

        foreach ($types as $type) {
            $name = Str::of($type)->replace('_', ' ')->title();
            $slug = Str::of($type)->lower();

            FeeType::firstOrCreate(
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
        Schema::dropIfExists('fee_types');
    }
}
