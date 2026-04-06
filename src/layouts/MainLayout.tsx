import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingSidebar from '../components/FloatingSidebar';
import ScrollToTop from '../components/ScrollToTop';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <FloatingSidebar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
