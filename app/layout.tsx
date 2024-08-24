
import "@/styles/globals.scss";
import dynamic from 'next/dynamic';

const ActiveModal = dynamic(() => import("@/components/ActiveModal"), { ssr: false });

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