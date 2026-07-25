#!/usr/bin/env bash
# =============================================================================
# bootstrap-vps.sh — One-time VPS setup for skillearniqhub.qverselearning.org
# -----------------------------------------------------------------------------
# Run ONCE on a fresh VPS before the first deploy, then never again.
# SAFE: completely idempotent — re-running is harmless.
# SCOPE: only installs missing global tools (Node, PM2, Nginx, Certbot).
#        Does NOT modify other apps, other Nginx vhosts, or other PM2 processes.
#
# Supports:
#   - Debian/Ubuntu  (apt)
#   - RHEL/CentOS/CloudLinux/AlmaLinux/Rocky 8+ (dnf)
#
# Usage:
#   bash scripts/bootstrap-vps.sh [deploy-user]
#
# Prerequisite: The SSH user must have passwordless sudo for the package
#   manager, nginx, certbot, npm, and systemctl commands.
# =============================================================================
set -euo pipefail

DEPLOY_USER="${1:-$(whoami)}"

echo "============================================"
echo "  VPS Bootstrap"
echo "  User: ${DEPLOY_USER}"
echo "============================================"

# ── Detect OS family ─────────────────────────────────────────────────────────
OS_ID=""
OS_LIKE=""
if [[ -f /etc/os-release ]]; then
    # shellcheck disable=SC1091
    OS_ID=$(. /etc/os-release && echo "${ID:-}")
    OS_LIKE=$(. /etc/os-release && echo "${ID_LIKE:-}")
fi

is_rhel_family() {
    echo "${OS_ID} ${OS_LIKE}" | grep -qiE 'rhel|fedora|centos|cloudlinux|almalinux|rocky'
}

is_debian_family() {
    echo "${OS_ID} ${OS_LIKE}" | grep -qiE 'debian|ubuntu'
}

if is_rhel_family; then
    PKG_MGR="dnf"
    echo "  OS    : RHEL-family (${OS_ID})"
elif is_debian_family; then
    PKG_MGR="apt"
    echo "  OS    : Debian-family (${OS_ID})"
else
    echo "  OS    : Unknown (${OS_ID}) — attempting dnf then apt"
    command -v dnf &>/dev/null && PKG_MGR="dnf" || PKG_MGR="apt"
fi
echo "  PKG   : ${PKG_MGR}"
echo "============================================"

# ── Node.js 22 ────────────────────────────────────────────────────────────────
NODE_MAJOR=$(node -e "process.stdout.write(process.version.split('.')[0].replace('v',''))" 2>/dev/null || echo "0")
if [[ "${NODE_MAJOR}" -lt 22 ]]; then
    echo "Installing Node.js 22..."
    if [[ "${PKG_MGR}" == "dnf" ]]; then
        # NodeSource RPM setup for RHEL 8+ / CloudLinux 8+
        curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo -E bash -
        sudo dnf install -y nodejs --setopt=nodesource-nodejs.module_hotfixes=1
    else
        curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    echo "✅ Node.js $(node -v) installed"
else
    echo "✅ Node.js $(node -v) already installed"
fi

# ── PM2 ───────────────────────────────────────────────────────────────────────
if ! command -v pm2 &>/dev/null; then
    echo "Installing PM2 globally..."
    sudo npm install -g pm2
    echo "✅ PM2 $(pm2 -v) installed"
else
    echo "✅ PM2 $(pm2 -v) already installed"
fi

# ── PM2 systemd startup (scoped to deploy user) ───────────────────────────────
# Registers only pm2-${DEPLOY_USER} service — no other services are touched.
PM2_SERVICE="pm2-${DEPLOY_USER}"
if ! systemctl is-enabled "${PM2_SERVICE}" &>/dev/null; then
    echo "Registering PM2 startup service for user '${DEPLOY_USER}'..."
    PM2_STARTUP_CMD=$(pm2 startup 2>/dev/null | grep -E "^sudo " | head -1 || true)
    if [[ -n "${PM2_STARTUP_CMD}" ]]; then
        eval "${PM2_STARTUP_CMD}"
        echo "✅ PM2 startup service registered"
    else
        echo "⚠️  Could not auto-register PM2 startup. Run 'pm2 startup' manually."
    fi
else
    echo "✅ PM2 startup service already registered"
fi

# ── Nginx ─────────────────────────────────────────────────────────────────────
if ! command -v nginx &>/dev/null; then
    echo "Installing Nginx..."
    if [[ "${PKG_MGR}" == "dnf" ]]; then
        # Enable the Nginx module stream on RHEL 8-family
        sudo dnf module enable -y nginx:mainline 2>/dev/null || true
        sudo dnf install -y nginx
    else
        sudo apt-get update -y
        sudo apt-get install -y nginx
    fi
fi
sudo systemctl enable nginx &>/dev/null || true
sudo systemctl start  nginx &>/dev/null || true
echo "✅ Nginx is running"

# ── Certbot (with Nginx AND Apache plugins) ───────────────────────────────────
if ! command -v certbot &>/dev/null; then
    echo "Installing Certbot..."
    if [[ "${PKG_MGR}" == "dnf" ]]; then
        # EPEL is required for certbot on RHEL-family
        sudo dnf install -y epel-release 2>/dev/null || true
        sudo dnf install -y certbot python3-certbot-nginx python3-certbot-apache
    else
        sudo apt-get install -y certbot python3-certbot-nginx python3-certbot-apache
    fi
    echo "✅ Certbot installed"
else
    echo "✅ Certbot already installed"
fi

# ── ACME challenge webroot ────────────────────────────────────────────────────
sudo mkdir -p /var/www/html/.well-known/acme-challenge
echo "✅ ACME challenge directory ready"

# ── Port 80 conflict check ────────────────────────────────────────────────────
# If Apache/httpd is on port 80, Nginx cannot bind to it and your site will
# return Apache's default response (403/forbidden) instead of your Next.js app.
# This script does NOT touch Apache — it only warns so you can act safely.
if sudo ss -tlnp 2>/dev/null | grep ':80' | grep -qivE 'nginx'; then
    echo ""
    echo "⚠️  WARNING: Something other than Nginx is listening on port 80:"
    sudo ss -tlnp 2>/dev/null | grep ':80' || true
    echo ""
    echo "   CloudLinux/cPanel often runs Apache (httpd) on port 80."
    echo "   To fix WITHOUT affecting other Apache-hosted sites, change Apache"
    echo "   to listen on a non-public port (e.g. 8080) and let Nginx front it,"
    echo "   OR switch your domain's vhost to use Nginx in cPanel (if supported)."
    echo ""
    echo "   Quick fix for a standalone VPS (no other Apache sites):"
    echo "     sudo systemctl stop httpd"
    echo "     sudo systemctl disable httpd"
    echo "     sudo systemctl restart nginx"
    echo ""
    echo "   If other apps depend on Apache, use an Nginx→Apache reverse proxy"
    echo "   pattern instead — ask your hosting provider or see Namecheap docs."
    echo ""
fi

# ── PM2 log rotation (idempotent, run every bootstrap) ───────────────────────
if [[ -f "$(dirname "${BASH_SOURCE[0]}")/pm2-logrotate-setup.sh" ]]; then
    bash "$(dirname "${BASH_SOURCE[0]}")/pm2-logrotate-setup.sh"
fi

# ── PM2 health check cron (idempotent, run every bootstrap) ──────────────────
# Uses this app's own APP_DIR since that's where the scripts live on the server.
if [[ -f "$(dirname "${BASH_SOURCE[0]}")/setup-health-cron.sh" ]]; then
    bash "$(dirname "${BASH_SOURCE[0]}")/setup-health-cron.sh" \
        "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)" \
        "${SLACK_WEBHOOK_URL:-}"
fi

echo ""
echo "============================================"
echo "  ✅ Bootstrap complete!"
echo "  The server is ready for app deployments."
echo "============================================"
