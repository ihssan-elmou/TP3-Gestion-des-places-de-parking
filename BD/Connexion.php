<?php
date_default_timezone_set('UTC');
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function getConnexion(): mysqli
{
    static $conn = null;

    if ($conn === null) {
        $conn = new mysqli('localhost', 'root', '', 'parking');
        $conn->set_charset('utf8mb4');
    }
    return $conn;
}