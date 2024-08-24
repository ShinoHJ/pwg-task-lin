'use client';
import "@/styles/globals.scss";
import ActiveModal from "@/components/ActiveModal";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <html lang="en">
      <body>
        <ActiveModal />
        {children}
      </body>
    </html>
  );
};

export default RootLayout;