import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import { MuiThemeProvider } from "./providers/ThemeProvider";
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: 'Matsuda Béla',
  description: 'Fairer Handel für Funkamateure weltweit',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="de">
        <body>
          <Navbar />
          <main><MuiThemeProvider>{children}</MuiThemeProvider></main>
        </body>
      </html>
    </ClerkProvider>
  );
}
