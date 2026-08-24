<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'farazsms' => [
        'api_key'     => env('FARAZSMS_API_KEY'),
        'sender'      => env('FARAZSMS_SENDER'),
        'otp_pattern' => env('FARAZSMS_OTP_PATTERN'),
    ],

    'woocommerce' => [
        'url' => env('WC_STORE_URL'),
        'key' => env('WC_CONSUMER_KEY'),
        'secret' => env('WC_CONSUMER_SECRET'),
        'webhook_secret' => env('WC_WEBHOOK_SECRET'),
    ],

    'social' => [
        'telegram' => env('SOCIAL_TELEGRAM_URL', 'https://t.me/NabzSalamatMedia'),
        'bale'     => env('SOCIAL_BALE_URL', 'https://ble.ir/nabze_salamat'),
        'whatsapp' => env('SOCIAL_WHATSAPP_URL', 'https://chat.whatsapp.com/EiBcCxmF5TFAWahncFGRkS?s=sw&p=a&ilr=1&amv=3'),
    ],

    'bale' => [
        'enabled'    => env('BALE_ENABLED', false),
        'bot_token'  => env('BALE_BOT_TOKEN'),
        'channel_id' => env('BALE_CHANNEL_ID'),
    ],

    /*
    | WhatsApp Channel broadcast — disabled by default (requires paid gateway).
    */
    'whatsapp' => [
        'enabled'       => env('WHATSAPP_ENABLED', false),
        'api_token'     => env('WHATSAPP_API_TOKEN'),
        'api_base_url'  => env('WHATSAPP_API_BASE_URL', 'https://gate.whapi.cloud'),
        'channel_id'    => env('WHATSAPP_CHANNEL_ID'),
    ],

    /*
    | Telegram channel broadcast (official Bot API — channels only, not groups).
    | 1. Create bot via @BotFather
    | 2. Create a Telegram channel
    | 3. Add bot as channel admin with "Post messages" permission
    | 4. Set TELEGRAM_CHANNEL_ID to @channel_username or -100... numeric ID
    */
    'telegram' => [
        'enabled'        => env('TELEGRAM_ENABLED', false),
        'bot_token'      => env('TELEGRAM_BOT_TOKEN'),
        'channel_id'     => env('TELEGRAM_CHANNEL_ID'),
        'footer_channel' => env('TELEGRAM_FOOTER_CHANNEL', 'کانال تلگرام رسانه خبری نبض سلامت'),
        // Outbound proxy for Iranian VPS (e.g. socks5://host:port or http://host:port)
        'http_proxy'     => env('TELEGRAM_HTTP_PROXY'),
    ],

];
