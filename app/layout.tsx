import MobileBottomNav from "./components/MobileBottomNav";
import { ToastProvider } from "./components/Toast";
import "./globals.css";

export const metadata = {
  title: "Chitra Viseshalu",
  description: "Movies • OTT • Reviews • Community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          {children}
          <MobileBottomNav />
        </ToastProvider>
      </body>
    </html>
  );
}