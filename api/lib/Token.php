<?php
/**
 * Stateless, signed submission tokens.
 *
 * The browser asks for one (GET ?form=x) when the form is first interacted
 * with, then sends it back with the POST. A bot that posts without fetching a
 * token first is rejected, the embedded timestamp feeds the "too fast" check,
 * and the HMAC means nothing is kept server-side until the token is spent.
 *
 * The token is bound to the visitor's User-Agent, not to the IP: mobile
 * networks change the IP mid-session, the browser does not change its UA. A
 * token farmed by one client is useless to a client that looks different.
 */
final class FE_Token
{
    const VERSION = 'v2';

    public static function issue($formId, $secret, $binding = '', $now = null)
    {
        $ts = $now === null ? time() : (int) $now;
        $rand = bin2hex(random_bytes(8));
        return self::VERSION . '.' . $ts . '.' . $rand . '.' . self::sign($formId, $ts, $rand, $binding, $secret);
    }

    /**
     * @return int the issue timestamp
     * @throws FE_Exception
     */
    public static function verify($token, $formId, $secret, $ttl, $binding = '', $now = null)
    {
        $now = $now === null ? time() : (int) $now;
        if (!is_string($token) || $token === '') {
            throw new FE_Exception('bad_nonce', 'Missing token.');
        }
        $parts = explode('.', $token);
        if (count($parts) !== 4 || $parts[0] !== self::VERSION || !preg_match('/^[0-9a-f]{16}$/', $parts[2])) {
            throw new FE_Exception('bad_nonce', 'Malformed token.');
        }
        $ts = (int) $parts[1];
        if ((string) $ts !== $parts[1]) {
            throw new FE_Exception('bad_nonce', 'Malformed token timestamp.');
        }
        if (!hash_equals(self::sign($formId, $ts, $parts[2], $binding, $secret), $parts[3])) {
            throw new FE_Exception('bad_nonce', 'Token signature does not match.');
        }
        if ($ts > $now + 60) {
            throw new FE_Exception('bad_nonce', 'Token is from the future.');
        }
        if ($now - $ts > $ttl) {
            throw new FE_Exception('bad_nonce', 'Token expired.');
        }
        return $ts;
    }

    private static function sign($formId, $ts, $rand, $binding, $secret)
    {
        $payload = self::VERSION . '|' . $formId . '|' . $ts . '|' . $rand . '|' . hash('sha256', (string) $binding);
        return substr(hash_hmac('sha256', $payload, $secret), 0, 32);
    }
}
