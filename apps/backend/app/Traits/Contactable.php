<?php

namespace App\Traits;

use const FILTER_VALIDATE_EMAIL;

trait Contactable
{
    /**
     * Add contacts to the model.
     *
     * @param array $contacts
     * @return void
     */
    public function addContacts(array $contacts)
    {
        foreach ($contacts as $index => $item) {
            if (!strstr($item['value'], '@') || !filter_var($item['value'], FILTER_VALIDATE_EMAIL)) {
                $this->phones()->create([
                    'number'         => $item['value'],
                    'is_primary'     => 0 === $index ? 1 : 0,
                    'contact_type'   => $item['type'],
                    'phoneable_type' => self::class,
                    'phoneable_id'   => $this->id,
                ]);
            } else {
                $this->emails()->create([
                    'email'          => $item['value'],
                    'is_primary'     => 0 === $index ? 1 : 0,
                    'contact_type'   => $item['type'],
                    'emailable_type' => self::class,
                    'emailable_id'   => $this->id,
                ]);
            }
        }
    }
}
