#!/usr/bin/env bash
# =============================================================================
# pm2-logrotate-setup.sh — One-time PM2 log rotation setup for this server
# -----------------------------------------------------------------------------
# SAFE: idempotent — re-running just re-applies the same config values.
# SCOPE: applies to the PM2 daemon for the CURRENT user only. Every app under
#        that PM2 daemon benefits — no per-app config needed.
#
# Usage:
#   bash scripts/pm2-logrotate-setup.sh
# =============================================================================
set -euo pipefail

echo "============================================"
echo "  PM2 Log Rotation Setup"
echo "  User: $(whoami)"
echo "============================================"

if ! pm2 list 2>/dev/null | grep -q "pm2-logrotate"; then
    echo "Installing pm2-logrotate module..."
    pm2 install pm2-logrotate
else
    echo "✅ pm2-logrotate already installed"
fi

pm2 set pm2-logrotate:max_size 20M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'   # daily at midnight, belt-and-braces alongside size-based rotation

echo "✅ Log rotation configured (20M max, 7 retained, compressed)"