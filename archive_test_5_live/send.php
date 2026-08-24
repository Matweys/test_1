<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Cache-Control: no-store');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method']);
    exit;
}

if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 20000) {
    http_response_code(413);
    echo json_encode(['ok' => false, 'error' => 'request_too_large']);
    exit;
}

// HTTPS preferred; HTTP allowed on local/IP test hosts (no TLS yet).
$httpsOn = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (isset($_SERVER['SERVER_PORT']) && (string)$_SERVER['SERVER_PORT'] === '443')
    || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');

$host = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? '';
$hostNoPort = strtolower(explode(':', $host)[0]);
$isLocalOrIp = $hostNoPort === 'localhost'
    || $hostNoPort === '127.0.0.1'
    || filter_var($hostNoPort, FILTER_VALIDATE_IP) !== false;

$remote = $_SERVER['REMOTE_ADDR'] ?? '';
if (!$httpsOn && !$isLocalOrIp && $remote !== '127.0.0.1' && $remote !== '::1') {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'https_required']);
    exit;
}

if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

function postString(string $key): string
{
    $value = $_POST[$key] ?? '';
    return is_string($value) ? trim($value) : '';
}

$name = postString('name');
$email = postString('email');
$profile = postString('profile');
$consent = isset($_POST['consent']);
$message = postString('message');
$subjectIn = postString('subject');
$consentValue = $_POST['consent'] ?? '';

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

if (!$consent || !is_string($consentValue) || $consentValue !== '1') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'consent']);
    exit;
}

$to = 'Matthias@bondeskovgaardaps.com';
$isContact = $message !== '';
$profiles = [
    'Le Vérificateur' => [
        'lead' => 'Vous cherchez le passage original, le contexte et la chronologie avant de réagir.',
        'tip' => 'Gardez ce réflexe, tout en acceptant qu’une information puisse être suffisamment étayée avant que chaque détail soit disponible.',
    ],
    'L’Analyste des mots' => [
        'lead' => 'Vous repérez rapidement les généralisations et les formulations qui amplifient une information.',
        'tip' => 'Continuez à observer les mots, puis vérifiez les faits : une formule excessive ne signifie pas nécessairement que tout est faux.',
    ],
    'L’Observateur patient' => [
        'lead' => 'Vous laissez retomber l’agitation avant de vous prononcer.',
        'tip' => 'Ce recul est utile, mais gardez en tête que certaines informations demandent une vérification ou une réaction rapide.',
    ],
    'Le Lecteur pragmatique' => [
        'lead' => 'Vous cherchez d’abord les conséquences concrètes d’une information.',
        'tip' => 'Ce filtre protège du bruit, mais certains sujets ont des effets différés qui méritent aussi votre attention.',
    ],
];

$safeName = str_replace(["\r", "\n"], ' ', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$safeProfile = str_replace(["\r", "\n"], ' ', $profile);
$safeSubject = str_replace(["\r", "\n"], ' ', $subjectIn);
$safeMessage = str_replace("\0", '', $message);

if ($isContact) {
    if ($safeSubject === '' || strlen($safeSubject) > 120 || strlen($safeMessage) > 2000) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'contact_fields']);
        exit;
    }

    $subj = $safeSubject;
    $body = "Contact Relais Lucide\n\n"
        . "Nom : {$safeName}\n"
        . "E-mail : {$safeEmail}\n"
        . "Date : " . gmdate('c') . "\n\n"
        . $safeMessage . "\n";
} else {
    if (!isset($profiles[$profile])) {
        http_response_code(422);
        echo json_encode(['ok' => false, 'error' => 'profile']);
        exit;
    }

    $subj = 'Demande de synthèse Relais Lucide — ' . $safeProfile;
    $body = "Demande de synthèse Relais Lucide\n\n"
        . "Nom : {$safeName}\n"
        . "E-mail : {$safeEmail}\n"
        . "Profil : {$safeProfile}\n"
        . "Date : " . gmdate('c') . "\n"
        . "Consentement : oui\n";
}

$subjClean = str_replace(["\r", "\n"], '', $subj);
$encodedSubject = '=?UTF-8?B?' . base64_encode($subjClean) . '?=';
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: Relais Lucide <noreply@bondeskovgaardaps.com>',
    'Reply-To: ' . $safeEmail,
];
$ownerMailed = @mail($to, $encodedSubject, $body, implode("\r\n", $headers));

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0750, true);
}
$entry = [
    'ts' => gmdate('c'),
    'type' => $isContact ? 'contact' : 'lead',
    'name' => $safeName,
    'email' => $safeEmail,
    'profile' => $isContact ? '' : $safeProfile,
    'subject' => $isContact ? $safeSubject : '',
    'message' => $isContact ? $safeMessage : '',
    'ip' => $remote,
];
@file_put_contents(
    $dataDir . '/leads.jsonl',
    json_encode($entry, JSON_UNESCAPED_UNICODE) . "\n",
    FILE_APPEND | LOCK_EX
);

if ($isContact) {
    // Persist even if MTA is missing on the test host.
    echo json_encode(['ok' => true, 'mail' => (bool)$ownerMailed]);
    exit;
}

$profileText = $profiles[$profile];
$userSubject = 'Votre synthèse Relais Lucide — ' . $safeProfile;
$userBody = "Bonjour {$safeName},\n\n"
    . "Votre profil : {$safeProfile}\n\n"
    . $profileText['lead'] . "\n\n"
    . "Un point à garder en tête :\n"
    . $profileText['tip'] . "\n\n"
    . "Avant de partager un titre fort, vérifiez la source originale, la date, le contexte et le fait précis.\n\n"
    . "Vous recevez ce message après votre demande sur Relais Lucide. "
    . "Pour toute question relative à vos données : Matthias@bondeskovgaardaps.com.\n";
$userHeaders = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'From: Relais Lucide <noreply@bondeskovgaardaps.com>',
    'Reply-To: Matthias@bondeskovgaardaps.com',
];
$encodedUserSubject = '=?UTF-8?B?' . base64_encode($userSubject) . '?=';
$userMailed = @mail($safeEmail, $encodedUserSubject, $userBody, implode("\r\n", $userHeaders));

echo json_encode(['ok' => true, 'mail' => (bool)($ownerMailed && $userMailed)]);
