<?php
/**
 * Cloudflare Turnstile server verification.
 *
 * Config, either shape:
 *   'turnstile' => array(
 *       'enabled' => true,                       // default: true when a secret is set
 *       'siteKey' => '0x…',                       // optional, returned on GET for form.js
 *       'secret'  => '0x…',
 *       'expectedHostnames' => array('example.cz', 'www.example.cz'),  // default: allowedOrigins
 *       'expectedAction' => 'contact',            // must match form.js (data-turnstile-action)
 *   ),
 *   'turnstileSecretKey' => '0x…',               // older sites: secret only
 */
final class FE_Turnstile
{
    const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

    /**
     * What the browser may know, and the export's pre-flight check: throws when
     * Turnstile is on but the secret or the hostnames are missing.
     *
     * @return array{enabled:bool,siteKey?:string}
     * @throws FE_Exception
     */
    public static function publicConfig(FE_Config $config)
    {
        $t = self::settings($config);
        if (!$t['enabled']) {
            return array('enabled' => false);
        }
        if ($t['secret'] === '' || strpos($t['secret'], 'PASTE') !== false) {
            throw new FE_Exception('server', 'Turnstile is enabled but the secret key is missing.');
        }
        if (!$t['hostnames']) {
            throw new FE_Exception('server', 'Turnstile is enabled but no hostname is set (expectedHostnames or allowedOrigins).');
        }
        $public = array('enabled' => true);
        if ($t['siteKey'] !== '' && strpos($t['siteKey'], 'PASTE') === false) {
            $public['siteKey'] = $t['siteKey'];
        }
        return $public;
    }

    /**
     * @throws FE_Exception captcha|server
     */
    public static function verify(array $post, FE_Config $config, $ip)
    {
        $t = self::settings($config);
        if (!$t['enabled'] || $t['secret'] === '') {
            if (!$config->get('debug')) {
                throw new FE_Exception('server', 'Turnstile is not configured for this environment.');
            }
            return;
        }

        $token = isset($post['cf-turnstile-response'])
            ? trim((string) $post['cf-turnstile-response'])
            : '';
        if ($token === '') {
            throw new FE_Exception('captcha', 'Security check missing.');
        }

        $payload = http_build_query(array(
            'secret'   => $t['secret'],
            'response' => $token,
            'remoteip' => $ip,
        ));

        $response = self::post($t['verifyUrl'], $payload, $t['timeout']);
        if ($response === false) {
            throw new FE_Exception('server', 'Turnstile verification request failed.');
        }

        $data = json_decode($response, true);
        if (!is_array($data) || empty($data['success'])) {
            throw new FE_Exception('captcha', 'Security check failed.');
        }

        // A token solved on another site that uses the same widget, or for
        // another action, is a valid token — just not one for this form.
        $hostname = isset($data['hostname']) ? strtolower((string) $data['hostname']) : '';
        if (!in_array($hostname, $t['hostnames'], true)) {
            throw new FE_Exception('captcha', 'Security check was solved on ' . $hostname . '.');
        }
        $action = isset($data['action']) ? (string) $data['action'] : '';
        if ($t['action'] !== '' && $action !== $t['action']) {
            throw new FE_Exception('captcha', 'Security check action "' . $action . '" does not match.');
        }
    }

    /** Both config shapes folded into one. */
    private static function settings(FE_Config $config)
    {
        $t = (array) $config->get('turnstile', array());
        $secret = trim((string) (isset($t['secret']) ? $t['secret'] : $config->get('turnstileSecretKey', '')));

        $hostnames = isset($t['expectedHostnames']) ? (array) $t['expectedHostnames'] : array();
        if (!$hostnames) {
            // allowedOrigins entries are bare hosts; Siteverify reports the
            // exact host, so list both forms the site answers on.
            foreach ((array) $config->get('allowedOrigins', array()) as $host) {
                $host = strtolower(trim((string) $host));
                if ($host === '' || $host === 'localhost') {
                    continue;
                }
                $hostnames[] = $host;
                $hostnames[] = strpos($host, 'www.') === 0 ? substr($host, 4) : 'www.' . $host;
            }
        }
        $hostnames = array_values(array_unique(array_filter(array_map(function ($h) {
            return strtolower(trim((string) $h));
        }, $hostnames), 'strlen')));

        return array(
            'enabled'   => isset($t['enabled']) ? (bool) $t['enabled'] : $secret !== '',
            'siteKey'   => trim((string) (isset($t['siteKey']) ? $t['siteKey'] : '')),
            'secret'    => $secret,
            'hostnames' => $hostnames,
            'action'    => isset($t['expectedAction']) ? (string) $t['expectedAction'] : 'contact',
            'verifyUrl' => isset($t['verifyUrl']) && $t['verifyUrl'] !== '' ? (string) $t['verifyUrl'] : self::VERIFY_URL,
            'timeout'   => isset($t['timeout']) ? (int) $t['timeout'] : 10,
        );
    }

    /** @return string|false */
    private static function post($url, $body, $timeout)
    {
        if (function_exists('curl_init')) {
            $ch = curl_init($url);
            curl_setopt_array($ch, array(
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $body,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER     => array('Content-Type: application/x-www-form-urlencoded'),
                CURLOPT_TIMEOUT        => $timeout,
            ));
            $response = curl_exec($ch);
            if (PHP_VERSION_ID < 80000) {
                curl_close($ch); // a no-op since PHP 8, deprecated in 8.5
            }
            return $response;
        }

        $ctx = stream_context_create(array(
            'http' => array(
                'method'  => 'POST',
                'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
                'content' => $body,
                'timeout' => $timeout,
            ),
        ));
        return @file_get_contents($url, false, $ctx);
    }
}
