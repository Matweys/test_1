<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method']);
    exit;
}

if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['phone'] ?? ''));
$profile = trim((string)($_POST['profile'] ?? ''));
$consent = isset($_POST['consent']);
$message = trim((string)($_POST['message'] ?? ''));
$subjectIn = trim((string)($_POST['subject'] ?? ''));

if ($name === '' || strlen($name) > 80) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'name']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 120) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'email']);
    exit;
}

if (!$consent) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'consent']);
    exit;
}

if (strlen($phone) > 40) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'phone']);
    exit;
}

$to = 'Matthias@bondeskovgaardaps.com';
$isContact = $message !== '';

if ($isContact) {
    $subj = $subjectIn !== '' ? $subjectIn : 'Contact Relais Lucide';
    $body = "Contact Relais Lucide\n\n"
        . "Nom : {$name}\n"
        . "E-mail : {$email}\n"
        . "Téléphone : " . ($phone !== '' ? $phone : '—') . "\n\n"
        . $message . "\n";
    $type = 'contact';
} else {
    $subj = 'Relais Lucide — synthèse ' . ($profile !== '' ? $profile : 'profil');
    $body = "Demande de synthèse Relais Lucide\n\n"
        . "Nom : {$name}\n"
        . "E-mail : {$email}\n"
        . "Téléphone : " . ($phone !== '' ? $phone : '—') . "\n"
        . "Profil : " . ($profile !== '' ? $profile : '—') . "\n"
        . "Consentement : oui\n"
        . "Date : " . gmdate('c') . "\n"
        . "IP : " . ($_SERVER['REMOTE_ADDR'] ?? '') . "\n";
    $type = 'lead';
}

$entry = [
    'ts' => gmdate('c'),
    'type' => $type,
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'profile' => $profile,
    'subject' => $isContact ? $subj : $subj,
    'message' => $isContact ? $message : '',
    'ip' => $_SERVER['REMOTE_ADDR'] ?? '',
];

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir) && !mkdir($dataDir, 0750, true)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'storage']);
    exit;
}

$line = json_encode($entry, JSON_UNESCAPED_UNICODE) . "\n";
$stored = @file_put_contents($dataDir . '/leads.jsonl', $line, FILE_APPEND | LOCK_EX);

$subjClean = str_replace(["\r", "\n"], '', $subj);
$encodedSubject = '=?UTF-8?B?' . base64_encode($subjClean) . '?=';
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: Relais Lucide <noreply@bondeskovgaardaps.com>',
    'Reply-To: ' . $email,
];
$mailed = @mail($to, $encodedSubject, $body, implode("\r\n", $headers));

if ($stored === false) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'storage']);
    exit;
}

echo json_encode(['ok' => true, 'mail' => (bool)$mailed]);
