import './globals.css';
import MegaNavbar from '@/components/MegaNavbar';
import MegaFooter from '@/components/MegaFooter';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
          <MegaNavbar /> {/* Now part of layout */}
          <main className="flex-grow">
            {children} {/* This will be your page content */}
          </main>
          <MegaFooter /> {/* Now part of layout */}
      </body>
    </html>
  );
}