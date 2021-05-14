<?php

use App\Models\RequestRole;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequestRolesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('request_roles', function (Blueprint $table) {
            $table->id();

            $table->string('name')->comment('role name');
            $table->string('slug')->nullable()->comment('requestor/clinician/reviewer/consultant/admin/other');

            $table->timestamps();
            $table->softDeletes();
        });

        $types = [
            'requestor',
            'clinician',
            'reviewer',
            'consultant',
            'admin',
            'other',
        ];

        array_walk($types, fn ($name) => RequestRole::create(compact('name')));
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('request_roles');
    }
}
