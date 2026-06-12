<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\FarazSmsService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CustomerOtpController extends Controller
{
    public function __construct(private FarazSmsService $sms) {}

    /** Show the customer login page. */
    public function create(): Response
    {
        return Inertia::render('Auth/CustomerLogin');
    }

    /** Send OTP to the given mobile number. */
    public function sendOtp(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'mobile' => ['required', 'regex:/^09[0-9]{9}$/'],
        ], [
            'mobile.regex' => 'شماره موبایل معتبر نیست.',
        ]);

        $mobile = $request->input('mobile');
        $ratKey = 'otp_send|' . $mobile;

        // One OTP per 2 minutes per number
        if (RateLimiter::tooManyAttempts($ratKey, 1)) {
            $seconds = RateLimiter::availableIn($ratKey);
            return response()->json([
                'message' => "لطفاً {$seconds} ثانیه دیگر تلاش کنید.",
            ], 429);
        }

        $code    = (string) random_int(10000, 99999);
        $cacheKey = 'otp_code|' . $mobile;

        Cache::put($cacheKey, $code, now()->addSeconds(120));
        RateLimiter::hit($ratKey, 120);

        if (! config('services.farazsms.api_key')) {
            Log::info("OTP for {$mobile}: {$code}");
        } else {
            $sent = $this->sms->sendOtp($mobile, $code);

            if (! $sent) {
                return response()->json(['message' => 'ارسال پیامک با خطا مواجه شد. لطفاً دوباره تلاش کنید.'], 500);
            }
        }

        return response()->json(['message' => 'کد تایید ارسال شد.']);
    }

    /** Verify OTP and log the customer in. */
    public function verifyOtp(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'mobile' => ['required', 'regex:/^09[0-9]{9}$/'],
            'code'   => ['required', 'digits:5'],
        ]);

        $mobile   = $request->input('mobile');
        $code     = $request->input('code');
        $cacheKey = 'otp_code|' . $mobile;

        $storedCode = Cache::get($cacheKey);

        if (! $storedCode || $storedCode !== $code) {
            throw ValidationException::withMessages([
                'code' => 'کد وارد شده اشتباه یا منقضی شده است.',
            ]);
        }

        Cache::forget($cacheKey);

        $user = User::firstOrCreate(
            ['mobile' => $mobile],
            [
                'name'              => $mobile,
                'password'          => Hash::make(Str::random(32)),
                'email_verified_at' => now(),
            ]
        );

        if (! $user->hasRole('customer')) {
            $user->assignRole('customer');
        }

        if ($user->is_suspended) {
            throw ValidationException::withMessages([
                'mobile' => 'حساب کاربری شما تعلیق شده است.',
            ]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('customer.activities'));
    }
}
