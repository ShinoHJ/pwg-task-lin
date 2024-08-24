'use client';
import { useEffect } from "react";
import "@/styles/globals.scss";
import { Modal } from "bootstrap";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modalEl => new Modal(modalEl));
  }, []);

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;