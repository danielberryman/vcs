import React from 'react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen px-4 py-8 bg-white">
      {children}
    </div>
  );
};

export default Layout;
