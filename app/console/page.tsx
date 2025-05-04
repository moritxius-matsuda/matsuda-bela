import dynamic from "next/dynamic";
import { CircularProgress, Box } from "@mui/material";

const ConsoleClient = dynamic(() => import("./ConsoleClient"), {
  ssr: false,
  loading: () => (
    <Box sx={{ p: 4, textAlign: "center" }}>
      <CircularProgress />
    </Box>
  ),
});

export default function Page() {
  return <ConsoleClient />;
}
