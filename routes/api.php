<?php

use App\Http\Controllers\ReadingTimeController;
use Illuminate\Support\Facades\Route;

Route::post('/reading-time', [ReadingTimeController::class, 'store']);
