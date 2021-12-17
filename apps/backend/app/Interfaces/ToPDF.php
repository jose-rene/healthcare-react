<?php

namespace App\Interfaces;

abstract class ToPDF
{
    protected $configs = [];
    protected $data = [];
    protected $font_checker;

    abstract public function __construct($configs);

    abstract public function toReport($data = []);

    /**
     * @param array $data
     * @return ToPDF
     */
    public function setData(array $data): ToPDF
    {
        $this->data = $data;
        return $this;
    }
}
