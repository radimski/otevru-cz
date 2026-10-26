<?php
/**
 * Loads config.php over a set of defaults and reads the declarative form
 * definitions from forms.json.
 */
final class FE_Config
{
    /** @var array */
    private $cfg;
    /** @var array */
    private $forms;

    private function __construct(array $cfg, array $forms)
    {
        $this->cfg = $cfg;
        $this->forms = $forms;
    }

    /**
     * @param string $dir directory holding config.php and forms.json (the api/ folder)
     * @throws FE_Exception when the site has not been configured yet
     */
    public static function load($dir)
    {
        $defaults = array(
            'secret' => '',
            'allowedOrigins' => array(),
            // Empty means "outside the webroot", resolved in dataDir() below.
            'dataDir' => '',
            'retentionDays' => 365,
            'nonceTtl' => 7200,
            // Tokens handed out per visitor IP. A browser needs one per page
            // view with a form, so these only bite a script farming them.
            'tokenMaxPerHour' => 60,
            'tokenMaxPerDay' => 300,
            // Quarantined (spam-scored) submissions per IP that still get
            // stored. Past this they are dropped, so a bot cannot fill the disk.
            'spamMaxPerHour' => 10,
            'spamMaxPerDay' => 30,
            // Visitor confirmations per recipient address. Stops the form from
            // being used to mail-bomb an address that is not the visitor's.
            'autoreplyMaxPerHour' => 2,
            'autoreplyMaxPerDay' => 5,
            'store' => true,
            'exportToken' => '',
            'debug' => false,
            'mail' => array(
                'enabled' => true,
                'transport' => 'auto',
                'from' => '',
                'fromName' => '',
                'smtp' => array(
                    'host' => '',
                    'port' => 587,
                    'security' => 'tls',
                    'user' => '',
                    'pass' => '',
                    'timeout' => 15,
                ),
            ),
        );

        $file = $dir . '/config.php';
        if (!is_file($file)) {
            throw new FE_Exception('server', 'config.php is missing — copy config.example.php and fill it in.');
        }

        $user = require $file;
        if (!is_array($user)) {
            throw new FE_Exception('server', 'config.php must return an array.');
        }

        $cfg = array_merge($defaults, $user);
        $cfg['mail'] = array_merge($defaults['mail'], isset($user['mail']) ? $user['mail'] : array());
        $cfg['mail']['smtp'] = array_merge(
            $defaults['mail']['smtp'],
            isset($user['mail']['smtp']) ? $user['mail']['smtp'] : array()
        );
        $cfg['dataDir'] = self::dataDir($dir, (string) $cfg['dataDir']);

        if ($cfg['secret'] === '' || strpos($cfg['secret'], 'CHANGE-ME') !== false) {
            throw new FE_Exception('server', "config.php still has the placeholder 'secret'.");
        }

        $formsFile = $dir . '/forms.json';
        if (!is_file($formsFile)) {
            throw new FE_Exception('server', 'forms.json is missing.');
        }

        $json = json_decode(file_get_contents($formsFile), true);
        if (!is_array($json) || !isset($json['forms']) || !is_array($json['forms'])) {
            throw new FE_Exception('server', 'forms.json is not valid JSON, or has no "forms" key.');
        }

        return new self($cfg, $json['forms']);
    }

    /**
     * Submissions hold names, phones and e-mails, so by default they live one
     * level above the webroot (api/ is in the webroot, so two levels up from
     * here): <parent of webroot>/form-data. .htaccess and web.config still deny
     * api/data/, but a host that ignores them would serve it as plain files.
     *
     * Hosts that do not let PHP write above the webroot get api/data instead —
     * a stored booking behind .htaccess beats a lost one. The fallback is
     * visible: Storage logs it and the export prints it.
     */
    private static function dataDir($apiDir, $configured)
    {
        if (trim($configured) !== '') {
            return $configured;
        }
        $outside = dirname(dirname($apiDir)) . '/form-data';
        // Checked, not created: Storage makes the folder on first write.
        if (is_dir($outside) ? is_writable($outside) : is_writable(dirname($outside))) {
            return $outside;
        }
        return $apiDir . '/data';
    }

    /** @return mixed */
    public function get($key, $fallback = null)
    {
        return array_key_exists($key, $this->cfg) ? $this->cfg[$key] : $fallback;
    }

    /** Dotted lookup for the nested settings, e.g. mail.smtp.host */
    public function path($dotted, $fallback = null)
    {
        $node = $this->cfg;
        foreach (explode('.', $dotted) as $part) {
            if (!is_array($node) || !array_key_exists($part, $node)) {
                return $fallback;
            }
            $node = $node[$part];
        }
        return $node;
    }

    /** True when the stored data ended up inside the webroot (the api/data fallback). */
    public function dataInWebroot($apiDir)
    {
        // dataDir may not exist yet (Storage creates it on first write), so
        // resolve its nearest existing ancestor and keep the rest as written.
        $path = rtrim(str_replace('\\', '/', (string) $this->get('dataDir')), '/');
        $rest = '';
        while ($path !== '' && realpath($path) === false) {
            $rest = '/' . basename($path) . $rest;
            $parent = dirname($path);
            if ($parent === $path) {
                return false;
            }
            $path = $parent;
        }
        $data = str_replace('\\', '/', (string) realpath($path)) . $rest;
        $root = str_replace('\\', '/', (string) realpath(dirname($apiDir)));
        return $root !== '' && strpos(strtolower($data) . '/', strtolower($root) . '/') === 0;
    }

    public function hasForm($id)
    {
        return is_string($id) && $id !== '' && isset($this->forms[$id]);
    }

    public function formIds()
    {
        return array_keys($this->forms);
    }

    public function form($id)
    {
        $f = $this->forms[$id];
        $f += array(
            'label' => $id,
            'to' => array(),
            'cc' => array(),
            'subject' => 'Formulár: ' . $id,
            'replyTo' => '',
            'minSeconds' => 3,
            'maxPerHour' => 5,
            'maxPerDay' => 20,
            'fields' => array(),
        );
        if (!isset($f['store'])) {
            $f['store'] = (bool) $this->get('store', true);
        }
        $f['to'] = (array) $f['to'];
        $f['cc'] = (array) $f['cc'];
        return $f;
    }
}
