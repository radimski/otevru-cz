<?php
require __DIR__ . '/send-headers.php';

$file = isset($_GET['file']) ? str_replace('\\', '/', (string) $_GET['file']) : '';
$file = ltrim($file, '/');

if ($file === '' || strpos($file, '..') !== false || !preg_match('/^[A-Za-z0-9._-]+\.html$/', $file)) {
    http_response_code(404);
    exit;
}

$path = __DIR__ . DIRECTORY_SEPARATOR . $file;
if (!is_file($path)) {
    http_response_code(404);
    exit;
}

header('Content-Type: text/html; charset=UTF-8');
readfile($path);
