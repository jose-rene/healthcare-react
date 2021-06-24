<?php

use App\Models\ClinicalUserType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClinicalUserTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clinical_user_types', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('display name');
            $table->string('slug')->comment('clinician/reviewer/senior reviewer/etc');

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
        Schema::dropIfExists('clinical_user_types');
    }
}
