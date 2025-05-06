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
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

export default function Navbar() {
  const { user, isSignedIn, isLoaded } = useUser();

  // Dropdowns für Desktop
  const [serversAnchorEl, setServersAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleServersMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setServersAnchorEl(event.currentTarget);
  };
  const handleServersMenuClose = () => {
    setServersAnchorEl(null);
  };

  const [guidesAnchorEl, setGuidesAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleGuidesMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setGuidesAnchorEl(event.currentTarget);
  };
  const handleGuidesMenuClose = () => {
    setGuidesAnchorEl(null);
  };

  // Hamburger/Drawer für Mobilgeräte
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Für Nested Menüs im Drawer
  const [drawerServersOpen, setDrawerServersOpen] = React.useState(false);
  const [drawerGuidesOpen, setDrawerGuidesOpen] = React.useState(false);

  if (!isLoaded) return null;

  // Alle Navigationspunkte zentral, damit sie in Desktop & Drawer genutzt werden können
  const navLinks = [
    { label: "HOME", href: "/" },
    ...(isSignedIn ? [{ label: "ADMIN", href: "/admin" }] : []),
    { label: "IMPRESSUM", href: "/impressum" },
    { label: "SPAM-Policy", href: "/spam-policy" },
  ];

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          minHeight: { xs: 56, sm: 64 },
          py: 0,
        }}
      >
        {/* Logo ganz links */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: { xs: 56, sm: 64 },
        pr: 2, // Padding rechts
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <img
          src="https://moritxius.nl/img/rechteck-weiß.png"
          alt="Logo"
          style={{
            height: "80%",       // 80% der Navbar-Höhe für etwas Luft
            maxHeight: 48,       // Maximal 48px hoch (passt zu Material UI)
            minHeight: 32,
            padding: "4px 12px", // Oben/unten/links/rechts Padding
            background: "transparent",
            borderRadius: 6,
            display: "block",
          }}
        />
      </Link>
    </Box>

        {/* Links (Desktop) */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              columnGap: 3, // horizontaler Abstand
              rowGap: 0.5,  // vertikaler Abstand (z.B. 0.5 = 4px)
              flexDirection: "row",
              alignItems: "center",
              minWidth: 0,
            }}
          >
        
            {navLinks.map((link) => (
              <Button
                key={link.href}
                color="inherit"
                component={Link}
                href={link.href}
                disableElevation
                sx={{
                  my: 0, // kein vertical margin
                  py: 1, // vertikales Padding für Klickfläche
                  minWidth: 0,
                }}
              >
                {link.label}
              </Button>
            ))}

            {/* Servers Dropdown */}
            <Button
              color="inherit"
              onClick={handleServersMenuOpen}
              aria-controls="servers-menu"
              aria-haspopup="true"
              disableElevation
              sx={{ my: 0, py: 1, minWidth: 0 }}
            >
              SERVERS
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
              <MenuItem
                component={Link}
                href="/servers/services"
                onClick={handleServersMenuClose}
              >
                Services
              </MenuItem>
            </Menu>

            {/* Guides Dropdown */}
            <Button
              color="inherit"
              onClick={handleGuidesMenuOpen}
              aria-controls="guides-menu"
              aria-haspopup="true"
              disableElevation
              sx={{ my: 0, py: 1, minWidth: 0 }}
            >
              GUIDES
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
            </Menu>
          </Box>
        )}

        {/* Hamburger Button (Mobile) */}
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Rechtsbereich */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: { xs: "flex-start", sm: "flex-end" },
            mt: { xs: 2, sm: 0 },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              ml: 2,
              color: "rgba(255,255,255,0.7)",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            Made with <span style={{ color: "red" }}>❤</span> by Moritz Béla Meier
          </Typography>
          {isSignedIn ? (
            <>
              <Typography variant="body1" sx={{ whiteSpace: "nowrap" }}>
                {user?.fullName}
              </Typography>
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

      {/* Drawer für Mobilgeräte */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 260, pt: 2 }} role="presentation">
          <List>
            {navLinks.map((link) => (
              <ListItem disablePadding key={link.href}>
                <ListItemButton
                  component={Link}
                  href={link.href}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}

            {/* Servers Nested Dropdown */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => setDrawerServersOpen(open => !open)}>
                <ListItemText primary="SERVERS" />
                {drawerServersOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={drawerServersOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/console?name=JCWSMP&server=86c006fd-bdbb-4227-86c8-f9a8ceb73216"
                    sx={{ pl: 4 }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary="JCWSMP" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/servers/services"
                    sx={{ pl: 4 }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary="Services" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>

            {/* Guides Nested Dropdown */}
            <ListItem disablePadding>
              <ListItemButton onClick={() => setDrawerGuidesOpen(open => !open)}>
                <ListItemText primary="GUIDES" />
                {drawerGuidesOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={drawerGuidesOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/guides/proxmox-hetzner"
                    sx={{ pl: 4 }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary="Installation Proxmox auf Hetzner" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </List>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ px: 2, pb: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "rgba(0,0,0,0.7)",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              Made with <span style={{ color: "red" }}>❤</span> by Moritz Béla Meier
            </Typography>
            {isSignedIn ? (
              <>
                <Typography variant="body1" sx={{ whiteSpace: "nowrap" }}>
                  {user?.fullName}
                </Typography>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Button
                  color="primary"
                  component={Link}
                  href="/sign-in"
                  fullWidth
                  onClick={() => setDrawerOpen(false)}
                  sx={{ mt: 1 }}
                >
                  Sign In
                </Button>
                <Button
                  color="primary"
                  component={Link}
                  href="/sign-up"
                  fullWidth
                  onClick={() => setDrawerOpen(false)}
                  sx={{ mt: 1 }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
