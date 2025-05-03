"use client";
import { SignIn } from "@clerk/nextjs";
import Box from "@mui/material/Box";

export default function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <SignIn />
    </Box>
  );
}
