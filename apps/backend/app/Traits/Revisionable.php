<?php


namespace App\Traits;


use Venturecraft\Revisionable\RevisionableTrait;

trait Revisionable
{
    use RevisionableTrait;

    protected $revisionEnabled = true;
    protected $revisionCleanup = true; //Remove old revisions (works only when used with $historyLimit)
    protected $historyLimit = 500;
    protected $revisionForceDeleteEnabled = true;
    protected $revisionCreationsEnabled = true;
}
