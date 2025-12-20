# Proxmox LXC Setup for Docker Templates

This guide walks you through setting up a Proxmox LXC container ready to run the Docker Compose templates from `docker-templates/`.

## Prerequisites
- Proxmox VE installed and accessible
- Basic familiarity with Proxmox web interface
- Network access to your Proxmox host

## Step 1: Create Ubuntu LXC Container

1. **Download Ubuntu Template** (if not already available):
   - In Proxmox web UI, select your storage (e.g., `local`)
   - Go to **CT Templates** → **Templates**
   - Download **Ubuntu 22.04** or **Ubuntu 24.04**

2. **Create Container**:
   - Click **Create CT** (top right)
   - **General**:
     - Hostname: `n8n-docker` (or your preferred name)
     - Password: Set a strong root password
     - Unprivileged container: ✅ **Uncheck** (we need privileged for Docker)
   - **Template**: Select Ubuntu template
   - **Disks**: 
     - Disk size: `20 GB` minimum (32 GB recommended)
   - **CPU**: 
     - Cores: `2` minimum (4 recommended for n8n cluster)
   - **Memory**:
     - Memory: `2048 MB` minimum (4096 MB recommended)
     - Swap: `512 MB`
   - **Network**:
     - Bridge: `vmbr0`
     - IPv4: `DHCP` or static IP (e.g., `192.168.0.6/24`)
   - **DNS**: Use host settings
   - **Confirm** and create

3. **Start the Container**:
   - Select the container → **Start**

## Step 2: Configure Container for Docker

### Enable Nesting and Features
1. **Shutdown the container** (if running)
2. In Proxmox shell (or SSH), edit the container config:
   ```bash
   nano /etc/pve/lxc/<CTID>.conf
   ```
   Replace `<CTID>` with your container ID (e.g., `100`)

3. **Add these lines**:
   ```conf
   features: nesting=1,keyctl=1
   lxc.apparmor.profile: unconfined
   lxc.cgroup2.devices.allow: a
   lxc.cap.drop:
   lxc.mount.auto: proc:rw sys:rw
   ```

4. **Save and exit** (`Ctrl+X`, `Y`, `Enter`)
5. **Start the container**

## Step 3: Install Docker in LXC

SSH or console into the container:

```bash
# Update system
apt update && apt upgrade -y

# Install prerequisites
apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

## Step 4: Prepare for Templates

```bash
# Create working directory
mkdir -p /opt/automation
cd /opt/automation

# Install git (for cloning the repo)
apt install -y git

# Clone the SailorNet Shipyard repo
git clone https://github.com/YOUR_USERNAME/sailornet-shipyard.git
cd sailornet-shipyard/docker-templates/n8n-cluster

# Copy .env.example to .env
cp .env.example .env

# Edit .env with your secrets
nano .env
```

## Step 5: Deploy a Template

```bash
# Navigate to the template
cd /opt/automation/sailornet-shipyard/docker-templates/n8n-cluster

# Fix line endings (if edited on Windows)
sed -i 's/\r$//' init-data.sh
chmod +x init-data.sh

# Generate SSL certificates (self-signed for local use)
mkdir -p nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/sailor.net.key \
  -out nginx/ssl/sailor.net.crt \
  -subj "/C=AU/ST=Queensland/L=Brisbane/O=Homelab/CN=*.sailor.net"

# Start the stack
docker compose up -d

# Check status
docker compose ps
docker compose logs -f
```

## Troubleshooting

### Docker fails to start
- Ensure `nesting=1` is set in the LXC config
- Restart the container after config changes

### Permission denied errors
- Run `chmod +x init-data.sh`
- Ensure the container is **privileged** (not unprivileged)

### Network issues
- Check firewall: `ufw status` (disable if needed: `ufw disable`)
- Verify container has network access: `ping 8.8.8.8`

## Next Steps
- Configure DNS to point `*.sailor.net` to your LXC IP
- Access your services via HTTPS (accept self-signed cert warning)
- Set up backups of `/opt/automation` directory
