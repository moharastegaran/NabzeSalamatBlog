# TLS is terminated at the CDN / reverse proxy in front of this app.
# Do not place certificates here for production nginx — origin speaks HTTP.
#
# Mixed-content safety is handled in the app via:
#   APP_URL=https://nabzsn.ir
#   SESSION_SECURE_COOKIE=true
#   URL::forceScheme('https')
#   TrustProxies (X-Forwarded-Proto from CDN)
