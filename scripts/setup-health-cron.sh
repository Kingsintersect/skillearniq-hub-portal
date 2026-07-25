#!/usr/bin/env bash
# =============================================================================
# setup-health-cron.sh — Installs the recurring PM2 health check cron job
# -----------------------------------------------------------------------------
# SAFE: idempotent — checks for an existing entry before adding, won't duplicate.
# SCOPE: installs a crontab entry for the CURRENT user only.
#
# Usage:
#   bash scripts/setup-health-cron.sh <app-dir> [slack-webhook-url]
#
# Arguments:
#   app-dir             — absolute path where this app's scripts/ dir lives
#                          e.g. /home/qverselearning/skillearniqhub.qverselearning.org
#   slack-webhook-url    — (optional) passed through to pm2-health-check.sh
# =============================================================================
set -euo pipefail

APP_DIR="${1:?Usage: setup-health-cron.sh <app-dir> [slack-webhook-url]}"
SLACK_WEBHOOK_URL="${2:-}"

LOG_DIR="${HOME}/logs"
mkdir -p "${LOG_DIR}"

CRON_CMD="*/5 * * * * bash ${APP_DIR}/scripts/pm2-health-check.sh 20 '${SLACK_WEBHOOK_URL}' >> ${LOG_DIR}/pm2-health.log 2>&1"
CRON_MARKER="pm2-health-check.sh"   # used to detect an existing entry, avoid duplicates

if crontab -l 2>/dev/null | grep -qF "${CRON_MARKER}"; then
    echo "✅ Health check cron already installed — skipping"
else
    echo "Installing health check cron (every 5 minutes)..."
    (crontab -l 2>/dev/null; echo "${CRON_CMD}") | crontab -
    echo "✅ Cron installed — logs at ${LOG_DIR}/pm2-health.log"
fi