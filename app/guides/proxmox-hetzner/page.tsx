// app/guides/proxmox-hetzner/page.tsx
"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Code from "@mui/material/Box";

export default function ProxmoxHetznerGuide() {
  return (
    <Box sx={{ maxWidth: 800, mx: "auto", py: 6, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Installation von Proxmox VE auf einem Hetzner VPS Server mit LAN-Netzwerk
      </Typography>
      <Typography variant="body1" gutterBottom>
        Proxmox Virtual Environment (Proxmox VE) ist eine leistungsfähige Open-Source-Virtualisierungsplattform. In diesem Guide erfährst du, wie du Proxmox VE auf einem Hetzner VPS Server installierst und ein internes LAN-Netzwerk für deine virtuellen Maschinen einrichtest.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Installation von Proxmox VE
      </Typography>
      <Typography gutterBottom>
        Es gibt mehrere Möglichkeiten, Proxmox VE auf einem Hetzner Server zu installieren:
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        Über installimage im Rescue-System (nur für dedizierte Server):
      </Typography>
      <ul>
        <li>Server ins Rescue-System booten</li>
        <li><b>installimage</b> ausführen</li>
        <li>Unter „Other [NO SUPPORT]“ die Option für Proxmox VE wählen</li>
      </ul>

      <Typography variant="subtitle1" gutterBottom>
        Manuelle Installation auf Debian:
      </Typography>
      <ul>
        <li>Debian 12 (Bookworm) über das Hetzner-Installationssystem installieren</li>
        <li>Dann folgende Befehle ausführen:</li>
      </ul>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, background: "#23272e" }}>
        <Code component="pre" sx={{ color: "#fff" }}>
{`apt update
apt install proxmox-ve
reboot`}
        </Code>
      </Paper>

      <Typography variant="subtitle1" gutterBottom>
        ISO-Installation (für VPS):
      </Typography>
      <ul>
        <li>Proxmox VE ISO-Image herunterladen</li>
        <li>KVM-Konsole von Hetzner verwenden, um vom ISO zu booten und die Installation durchzuführen</li>
      </ul>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Netzwerkkonfiguration
      </Typography>
      <Typography gutterBottom>
        Nach der Installation von Proxmox VE müssen die Netzwerkschnittstellen konfiguriert werden. Bearbeite dazu die Datei <b>/etc/network/interfaces</b>:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, background: "#23272e" }}>
        <Code component="pre" sx={{ color: "#fff" }}>
{`auto lo
iface lo inet loopback

auto [Name der physischen Netzwerkkarte]
iface [Name der physischen Netzwerkkarte] inet manual

auto vmbr0
iface vmbr0 inet static
    address [Ihre öffentliche IP]/[CIDR-Notation]
    gateway [Ihr Gateway]
    bridge-ports [Name der physischen Netzwerkkarte]
    bridge-stp off
    bridge-fd 0

auto vmbr1
iface vmbr1 inet static
    address 192.168.100.1/24
    bridge-ports none
    bridge-stp off
    bridge-fd 0`}
        </Code>
      </Paper>
      <Typography gutterBottom>
        <b>Hinweis:</b> Die Netmask wird in CIDR-Notation angegeben, z. B. <code>/24</code> für 255.255.255.0.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        DHCP-Server einrichten
      </Typography>
      <Typography gutterBottom>
        Für die automatische IP-Vergabe an VMs im LAN-Netzwerk installiere und konfiguriere einen DHCP-Server:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, background: "#23272e" }}>
        <Code component="pre" sx={{ color: "#fff" }}>
{`apt update
apt install isc-dhcp-server`}
        </Code>
      </Paper>
      <Typography gutterBottom>
        Konfiguriere den DHCP-Server in <b>/etc/dhcp/dhcpd.conf</b>:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, background: "#23272e" }}>
        <Code component="pre" sx={{ color: "#fff" }}>
{`default-lease-time 600;
max-lease-time 7200;
authoritative;

subnet 192.168.100.0 netmask 255.255.255.0 {
    range 192.168.100.10 192.168.100.50;
    option routers 192.168.100.1;
    option domain-name-servers 8.8.8.8, 8.8.4.4;
}`}
        </Code>
      </Paper>
      <Typography gutterBottom>
        Lege die Schnittstelle für den DHCP-Server in <b>/etc/default/isc-dhcp-server</b> fest:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, background: "#23272e" }}>
        <Code component="pre" sx={{ color: "#fff" }}>
{`INTERFACESv4="vmbr1"
INTERFACESv6=""`}
        </Code>
      </Paper>
      <Typography gutterBottom>
        Starte den DHCP-Server neu:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, background: "#23272e" }}>
        <Code component="pre" sx={{ color: "#fff" }}>
{`systemctl restart isc-dhcp-server`}
        </Code>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Port-Forwarding einrichten
      </Typography>
      <Typography gutterBottom>
        Für den Zugriff auf VMs von außen ist Port-Forwarding erforderlich. Installiere iptables:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, background: "#23272e" }}>
        <Code component="pre" sx={{ color: "#fff" }}>
{`apt update
apt install iptables -y`}
        </Code>
      </Paper>
      <Typography gutterBottom>
        Beispiel für Port-Forwarding (externer Port 2222 auf internen SSH-Port 22 der VM 192.168.100.22):
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2, background: "#23272e" }}>
        <Code component="pre" sx={{ color: "#fff" }}>
{`# NAT-Regel
iptables -t nat -A PREROUTING -p tcp --dport 2222 -j DNAT --to-destination 192.168.100.22:22

# Masquerading
iptables -t nat -A POSTROUTING -p tcp -d 192.168.100.22 --dport 22 -j MASQUERADE

# Forward
iptables -A FORWARD -p tcp -d 192.168.100.22 --dport 22 -j ACCEPT`}
        </Code>
      </Paper>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        Sicherheitshinweise
      </Typography>
      <ul>
        <li>Verwende starke Passwörter oder besser noch SSH-Schlüssel für die Authentifizierung.</li>
        <li>Konfiguriere die SSH-Einstellungen der VM für erhöhte Sicherheit (z. B. Passwort-Authentifizierung deaktivieren).</li>
        <li>Erwäge die Nutzung eines VPN anstelle von direktem Port-Forwarding für sensible Umgebungen.</li>
        <li>Halte Proxmox-Host und VMs stets aktuell.</li>
      </ul>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Hinweis: Durch diese Konfiguration wird der SSH-Zugang zur VM über den externen Port 2222 ermöglicht, während die interne Kommunikation weiterhin über den Standard-SSH-Port 22 erfolgt.
      </Typography>
    </Box>
  );
}
