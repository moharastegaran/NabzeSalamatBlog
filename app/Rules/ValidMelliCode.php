<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidMelliCode implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $this->check((string) $value)) {
            $fail('کد ملی وارد شده معتبر نیست.');
        }
    }

    private function check(string $melli): bool
    {
        if (! preg_match('/^\d{10}$/', $melli)) return false;
        if (preg_match('/^(\d)\1{9}$/', $melli)) return false;

        $cDigitLast = substr($melli, -1);
        $fMeli      = strval(intval($melli));

        if (isset($fMeli[0]) && $fMeli[0] === '0' && ! (8 <= strlen($fMeli) && strlen($fMeli) < 10)) {
            return false;
        }

        $nineLeftDigits = substr($melli, 0, strlen($melli) - 1);

        $positionNumber = 10;
        $result         = 0;

        foreach (str_split($nineLeftDigits) as $chr) {
            $result += intval($chr) * $positionNumber;
            $positionNumber--;
        }

        $remain           = $result % 11;
        $controllerNumber = $remain >= 2 ? 11 - $remain : $remain;

        return $cDigitLast == $controllerNumber;
    }
}
