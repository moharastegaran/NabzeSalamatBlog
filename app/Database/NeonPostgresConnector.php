<?php

namespace App\Database;

use Illuminate\Database\Connectors\PostgresConnector;

class NeonPostgresConnector extends PostgresConnector
{
    protected function getDsn(array $config): string
    {
        $dsn = parent::getDsn($config);

        if (!empty($config['endpoint'])) {
            $dsn .= ';options=endpoint=' . $config['endpoint'];
        }

        return $dsn;
    }
}
