"use client";

import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function Navbar() {
  const { user, isSignedIn, isLoaded } = useUser();

  // State und Handler für Servers-Dropdown
  const [serversAnchorEl, setServersAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleServersMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setServersAnchorEl(event.currentTarget);
  };
  const handleServersMenuClose = () => {
    setServersAnchorEl(null);
  };

  // State und Handler für Guides-Dropdown
  const [guidesAnchorEl, setGuidesAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleGuidesMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setGuidesAnchorEl(event.currentTarget);
  };
  const handleGuidesMenuClose = () => {
    setGuidesAnchorEl(null);
  };

  if (!isLoaded) return null;

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/">
            Home
          </Button>
          {isSignedIn && (
            <Button color="inherit" component={Link} href="/admin">
              Admin
            </Button>
          )}

          {/* Servers Dropdown */}
          <Button
            color="inherit"
            onClick={handleServersMenuOpen}
            aria-controls="servers-menu"
            aria-haspopup="true"
          >
            Servers
          </Button>
          <Menu
            id="servers-menu"
            anchorEl={serversAnchorEl}
            open={Boolean(serversAnchorEl)}
            onClose={handleServersMenuClose}
          >
            <MenuItem
              component={Link}
              href="/console?name=JCWSMP&server=86c006fd-bdbb-4227-86c8-f9a8ceb73216"
              onClick={handleServersMenuClose}
            >
              JCWSMP
            </MenuItem>
            {/* Weitere Server hier */}
          </Menu>

          {/* Guides Dropdown */}
          <Button
            color="inherit"
            onClick={handleGuidesMenuOpen}
            aria-controls="guides-menu"
            aria-haspopup="true"
          >
            Guides
          </Button>
          <Menu
            id="guides-menu"
            anchorEl={guidesAnchorEl}
            open={Boolean(guidesAnchorEl)}
            onClose={handleGuidesMenuClose}
          >
            <MenuItem
              component={Link}
              href="/guides/proxmox-hetzner"
              onClick={handleGuidesMenuClose}
            >
              Installation Proxmox auf Hetzner
            </MenuItem>
            {/* Weitere Guides hier */}
          </Menu>

          <Button color="inherit" component={Link} href="/projekt">
            Projektbeschreibung
          </Button>
          <Button component={Link} href="/impressum" color="inherit">
            Impressum
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="body2"
            sx={{ ml: 2, color: "rgba(255,255,255,0.7)", userSelect: "none" }}
          >
            Made with <span style={{ color: "red" }}>❤</span> by Moritz Béla Meier
          </Typography>
          {isSignedIn ? (
            <>
              <Typography variant="body1">{user?.fullName}</Typography>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} href="/sign-in">
                Sign In
              </Button>
              <Button color="inherit" component={Link} href="/sign-up">
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
