<?php

use Phalcon\Loader;
use Phalcon\Mvc\Micro;
use Phalcon\DI\FactoryDefault;
use Phalcon\Db\Adapter\Pdo\Mysql as PdoMysql;

// Use Loader() to autoload our model
$loader = new Loader();

$loader->registerDirs(
    array(
        __DIR__ . '/models/'
    )
)->register();

$di = new FactoryDefault();

// Set up the database service
$di->set('db', function () {
    return new PdoMysql(
        array(
            "host"     => "localhost",
            "username" => "strecku",
            "password" => "strecku",
            "dbname"   => "strecku"
        )
    );
});

// Create and bind the DI to the application
$app = new Micro($di);

// Retrieves all robots
$app->get('/v1/users', function () use ($app) {

    $phql = "SELECT * FROM Users ORDER BY id";
    $users = $app->modelsManager->executeQuery($phql);

    $data = array();
    foreach ($users as $user) {
        $data[] = array(
            'id'   => $user->id,
            'group_id' => $user->group_id,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'position' => $user->position,
            'year' => $user->year,
            'email' => $user->email
        );
    }

    echo json_encode($data);
});

// Searches for users with $name in their name
$app->get('/v1/users/search/{name}', function ($name) {

});

// Retrieves users based on primary key
$app->get('/v1/users/{id:[0-9]+}', function ($id) {

});

// Adds a new user
$app->post('/v1/users', function () {

});

// Updates user based on primary key
$app->put('/v1/users/{id:[0-9]+}', function () {

});

// Deletes user based on primary key
$app->delete('/v1/users/{id:[0-9]+}', function () {

});

$app->handle();

?>