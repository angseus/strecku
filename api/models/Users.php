<?php

use Phalcon\Mvc\Model;
use Phalcon\Mvc\Model\Message;
use Phalcon\Mvc\Model\Validator\Uniqueness;
use Phalcon\Mvc\Model\Validator\InclusionIn;

class Users extends Model
{
    public function validation()
    {
        // User id must be unique
        $this->validate(
            new Uniqueness(
                array(
                    "field"   => "id",
                    "message" => "The user id must be unique!"
                )
            )
        );

        // Year cannot be less than zero
        if ($this->year < 0) {
            $this->appendMessage(new Message("The year cannot be less than zero"));
        }

        // Check if any messages have been produced
        if ($this->validationHasFailed() == true) {
            return false;
        }
    }
}