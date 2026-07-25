#!/usr/bin/env bash
# =============================================================================
# pm2-health-check.sh — Alerts on crash-looping or offline PM2 processes
# -----------------------------------------------------------------------------
# SAFE: read-only — never touches PM2 state, only inspects and reports.
# SCOPE: checks ALL processes under this PM2 daemon (this user), not just one app.
#
# Usage:
#   bash scripts/pm2-health-check.sh [restart-threshold] [slack-webhook-url]
#
# Arguments:
#   restart-threshold   — (optional) restart count that triggers an alert. Default: 20
#   slack-webhook-url   — (optional) if set, posts alerts to this Slack webhook.
#                          Leave blank to just log to stdout (cron will capture it).
# =============================================================================
set -euo pipefail

THRESHOLD="${1:-20}"
SLACK_WEBHOOK_URL="${2:-}"

REPORT=$(pm2 jlist 2>/dev/null | node -e '
  const data = JSON.parse(require("fs").readFileSync(0, "utf8"));
  const threshold = parseInt(process.argv[1], 10);
  const bad = data.filter(p =>
    p.pm2_env.restart_time > threshold || p.pm2_env.status !== "online"
  );
  bad.forEach(p => {
    console.log(`⚠ ${p.name} (id ${p.pm_id}): status=${p.pm2_env.status} restarts=${p.pm2_env.restart_time} mem=${Math.round(p.monit.memory/1024/1024)}MB`);
  });
' "${THRESHOLD}")

if [[ -n "${REPORT}" ]]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') — PM2 health check FAILED:"
    echo "${REPORT}"

    if [[ -n "${SLACK_WEBHOOK_URL}" ]]; then
        PAYLOAD=$(node -e '
          const lines = process.argv[1];
          console.log(JSON.stringify({ text: "🚨 PM2 health alert on '"$(hostname)"':\n" + lines }));
        ' "${REPORT}")
        curl -sf -X POST -H "Content-Type: application/json" \
            -d "${PAYLOAD}" "${SLACK_WEBHOOK_URL}" > /dev/null || \
            echo "⚠ Failed to send Slack alert"
    fi
    exit 1
else
    echo "$(date '+%Y-%m-%d %H:%M:%S') — PM2 health check OK (all processes online, restarts under ${THRESHOLD})"
fi