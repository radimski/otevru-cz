<?php
require __DIR__ . '/send-headers.php';

$file = isset($_GET['file']) ? str_replace('\\', '/', (string) $_GET['file']) : '';
$file = ltrim($file, '/');
$code = isset($_GET['code']) ? (int) $_GET['code'] : 0;

$valid = $file !== '' && strpos($file, '..') === false && preg_match('/^[A-Za-z0-9._-]+\.html$/', $file);
$path = $valid ? (__DIR__ . DIRECTORY_SEPARATOR . $file) : '';

if ($code === 404 || !$valid || !is_file($path)) {
    http_response_code(404);
    $path = __DIR__ . DIRECTORY_SEPARATOR . '404.html';
    if (!is_file($path)) {
        exit;
    }
}

header('Content-Type: text/html; charset=UTF-8');
readfile($path);
