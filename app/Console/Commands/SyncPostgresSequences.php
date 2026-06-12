<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncPostgresSequences extends Command
{
    protected $signature   = 'db:sync-sequences';
    protected $description = 'Reset PostgreSQL id sequences to match the current MAX(id) in each table';

    private array $tables = [
        'product_categories',
        'products',
        'product_attribute_types',
        'product_attributes',
        'product_variations',
        'product_variant_attributes',
        'orders',
        'order_metas',
        'order_products',
        'users',
        'bankings',
        'notes',
    ];

    public function handle(): int
    {
        foreach ($this->tables as $table) {
            try {
                DB::statement("
                    SELECT setval(
                        pg_get_serial_sequence('{$table}', 'id'),
                        COALESCE((SELECT MAX(id) FROM \"{$table}\"), 0) + 1,
                        false
                    )
                ");
                $this->line("  synced: {$table}");
            } catch (\Throwable $e) {
                $this->warn("  skipped: {$table} ({$e->getMessage()})");
            }
        }

        $this->info('Done.');

        return self::SUCCESS;
    }
}
