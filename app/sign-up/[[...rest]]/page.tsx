"use client";
import { SignUp } from "@clerk/nextjs";
import Box from "@mui/material/Box";

export default function SignUpPage() {
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
      <SignUp />
    </Box>
  );
}
