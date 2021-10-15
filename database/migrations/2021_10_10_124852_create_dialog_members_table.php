<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDialogMembersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dialog_members', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dialog_id')->index();
            $table->foreign('dialog_id')->references('id')->on('dialogs')->onDelete('cascade');
            $table->unsignedBigInteger('from_id')->index();
            $table->unsignedBigInteger('to_id')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('dialog_members');
    }
}
