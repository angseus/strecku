<?php

use Phalcon\Loader;
use Phalcon\Mvc\Micro;
use Phalcon\DI\FactoryDefault;
use Phalcon\Db\Adapter\Pdo\Mysql as PdoMysql;
use Phalcon\Http\Response;

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

//////////////////////////////
// ACTUAL ROUTES STARTS HERE /
//////////////////////////////

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
$app->get('/v1/users/name/{name}', function ($name) use ($app) {

    $phql = "SELECT * FROM Users WHERE firstname LIKE :name: OR lastname LIKE :name: ORDER BY firstname";
    $users = $app->modelsManager->executeQuery(
        $phql,
        array(
            'name' => '%' . $name . '%'
        )
    );

    $data = array();
    foreach ($users as $user) {
        $data[] = array(
            'id'   => $user->id,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname
        );
    }

    echo json_encode($data);
});

// Searches for users with $post
$app->get('/v1/users/post/{post}', function ($post) use ($app) {

    $phql = "SELECT * FROM Users WHERE position = :post: ORDER BY year";
    $users = $app->modelsManager->executeQuery(
        $phql,
        array(
            'post' => $post
        )
    );

    $data = array();
    foreach ($users as $user) {
        $data[] = array(
            'id' => $user->id,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'year' => $user->year
        );
    }

    echo json_encode($data);
});

// Retrieves user based on primary key
$app->get('/v1/users/{id:[0-9]+}', function ($id) use ($app) {

    $phql = "SELECT * FROM Users WHERE id = :id:";
    $user = $app->modelsManager->executeQuery($phql, array(
        'id' => $id
    ))->getFirst();

    // Create a response
    $response = new Response();

    if ($user == false) {
        $response->setJsonContent(
            array(
                'status' => 'NOT-FOUND'
            )
        );
    } else {
        $response->setJsonContent(
            array(
                'status' => 'FOUND',
                'data'   => array(
                    'id'   => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname
                )
            )
        );
    }

    return $response;
});

// Adds a new user
$app->post('/v1/users', function () use ($app) {

    $user = $app->request->getJsonRawBody();

    $phql = "INSERT INTO Users (group_id, firstname, lastname, position, year, email) VALUES (:group_id:, :firstname:, :lastname:, :position:, :year:, :email:)";

    $status = $app->modelsManager->executeQuery($phql, array(
        'group_id' => $user->group_id,
        'firstname' => $user->firstname,
        'lastname' => $user->lastname,
        'position' => $user->position,
        'year' => $user->year,
        'email' => $user->email
    ));

    // Create a response
    $response = new Response();

    // Check if the insertion was successful
    if ($status->success() == true) {

        // Change the HTTP status
        $response->setStatusCode(201, "Created");

        $user->id = $status->getModel()->id;

        $response->setJsonContent(
            array(
                'status' => 'OK',
                'data'   => $user
            )
        );

    } else {

        // Change the HTTP status
        $response->setStatusCode(409, "Conflict");

        // Send errors to the client
        $errors = array();
        foreach ($status->getMessages() as $message) {
            $errors[] = $message->getMessage();
        }

        $response->setJsonContent(
            array(
                'status'   => 'ERROR',
                'messages' => $errors
            )
        );
    }

    return $response;
});

// Updates user based on primary key
$app->put('/v1/users/{id:[0-9]+}', function ($id) use ($app) {

    $user = $app->request->getJsonRawBody();

    $phql = "UPDATE Users SET group_id = :group_id:, firstname = :firstname:, lastname = :lastname:, position = :position:, year = :year:, email = :email: WHERE id = :id:";
    $status = $app->modelsManager->executeQuery($phql, array(
        'id' => $id,
        'group_id' => $user->group_id,
        'firstname' => $user->firstname,
        'lastname' => $user->lastname,
        'position' => $user->position,
        'year' => $user->year,
        'email' => $user->email
    ));

    // Create a response
    $response = new Response();

    // Check if the insertion was successful
    if ($status->success() == true) {
        $response->setJsonContent(
            array(
                'status' => 'OK'
            )
        );
    } else {

        // Change the HTTP status
        $response->setStatusCode(409, "Conflict");

        $errors = array();
        foreach ($status->getMessages() as $message) {
            $errors[] = $message->getMessage();
        }

        $response->setJsonContent(
            array(
                'status'   => 'ERROR',
                'messages' => $errors
            )
        );
    }

    return $response;
});

// Deletes user based on primary key
$app->delete('/v1/users/{id:[0-9]+}', function ($id) use ($app) {

    $phql = "DELETE FROM Users WHERE id = :id:";
    $status = $app->modelsManager->executeQuery($phql, array(
        'id' => $id
    ));

    // Create a response
    $response = new Response();

    if ($status->success() == true) {
        $response->setJsonContent(
            array(
                'status' => 'OK'
            )
        );
    } else {

        // Change the HTTP status
        $response->setStatusCode(409, "Conflict");

        $errors = array();
        foreach ($status->getMessages() as $message) {
            $errors[] = $message->getMessage();
        }

        $response->setJsonContent(
            array(
                'status'   => 'ERROR',
                'messages' => $errors
            )
        );
    }

    return $response;
});

$app->handle();

?>