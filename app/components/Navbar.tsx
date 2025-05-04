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
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  if (!isLoaded) return null;

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
            onClick={handleMenuOpen}
            aria-controls="servers-menu"
            aria-haspopup="true"
          >
            Servers
          </Button>
          <Menu
            id="servers-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "servers-button",
            }}
          >
            <MenuItem
              component={Link}
              href="/console?name=JCWSMP&server=86c006fd-bdbb-4227-86c8-f9a8ceb73216"
              onClick={handleMenuClose}
            >
              JCWSMP
            </MenuItem>
            {/* Hier kannst du weitere Server ergänzen */}
          </Menu>
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
