<?php

namespace App\Console\Commands;

use Illuminate\Foundation\Console\ServeCommand as BaseServeCommand;
use Symfony\Component\Console\Input\InputOption;

class ServeCommand extends BaseServeCommand
{
    /**
     * Get the console command options.
     *
     * @return array
     */
    protected function getOptions()
    {
        return array_merge(parent::getOptions(), [
            ['external', null, InputOption::VALUE_NONE, 'Listen on external IP (0.0.0.0)'],
        ]);
    }

    /**
     * Get the host for the server.
     *
     * @return string
     */
    protected function host()
    {
        // If --external flag is provided, bind to all interfaces
        if ($this->option('external')) {
            return '0.0.0.0';
        }

        // Otherwise use the provided host or default to localhost
        return $this->option('host') ?? 'localhost';
    }

    /**
     * Get the port for the server.
     *
     * @return string
     */
    protected function port()
    {
        return $this->option('port') ?? env('SERVE_PORT', 8000);
    }
}
