<?php
$settings = [];
$counter = 0;
define('DB_SERVER', "localhost");
define('DB_USERNAME', 'username');
define('DB_PASSWORD', 'password');
$db = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD);
$GLOBALS['brnumb'] = 0;
