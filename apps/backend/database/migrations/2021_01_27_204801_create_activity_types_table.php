<?php

use App\Models\Activity\ActivityType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateActivityTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('activity_types', function (Blueprint $table) {
            $table->id();
            $table->string('name', 24);
            $table->string('slug', 24)->comment('private, cancelled, on_hold, reopened, rate_change_therapist, etc');
            $table->string('permission')->nullable();
            $table->integer('privacy_level')->nullable()->default(4)->comment('1 = private, 2 = internal, 3 = financial, 4 = all');
            $table->timestamps();
            $table->softDeletes();
        });


        $types = collect([
            'Private',
            'Cancelled',
            'On hold',
            'Reopened',
            'Rate change therapist',
        ]);

        $types->each(fn ($name) => ActivityType::create(compact('name')));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('types');
    }
}
