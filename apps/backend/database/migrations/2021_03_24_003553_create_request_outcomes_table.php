<?php

use App\Models\RequestOutcome;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class CreateRequestOutcomesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_outcomes', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('name');
            $table->string('slug');

            $table->timestamps();
            $table->softDeletes();
        });

        $outcomes = [
            'recommended',
            'not_recommended',
            'modified_up',
            'modified_down',
        ];


        foreach ($outcomes as $sort => $status) {
            $name = Str::of($status)->replace('_', ' ')->title();
            $slug = Str::of($status)->lower();

            RequestOutcome::firstOrCreate(
                compact('slug'),
                compact('name', 'slug', 'sort')
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
        Schema::dropIfExists('request_outcomes');
    }
}
