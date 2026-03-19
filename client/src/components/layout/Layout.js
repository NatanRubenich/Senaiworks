import React from 'react';
import TopBar from './TopBar';
import NavBar from './NavBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="sw-page-wrapper">
      <TopBar />
      <NavBar />
      <main className="sw-main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
