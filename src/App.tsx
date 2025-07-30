import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Identify, Forms, Attest, Verify, DownloadVC } from './pages/index';
import { FaAddressCard, FaRegWindowMaximize, FaSignature, FaCheckDouble, FaQuestionCircle } from 'react-icons/fa';
import Layout from './components/Layout';
import DataInColorBanner from './components/DataInColorBanner';
import HowItWorks from './pages/HowItWorks';

function BottomNav() {
  const location = useLocation();
  const tabs = [
    { to: '/', icon: <FaAddressCard />, label: 'Identity' },
    { to: '/forms', icon: <FaRegWindowMaximize />, label: 'Forms' },
    { to: '/attest', icon: <FaSignature />, label: 'Attest' },
    { to: '/verify', icon: <FaCheckDouble />, label: 'Verify' },
    { to: '/hiw', icon: <FaQuestionCircle />, label: 'How It Works' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md flex justify-around text-center text-lg">
      {tabs.map(tab => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`flex flex-col items-center py-2 px-3 flex-1 ${location.pathname === tab.to ? 'text-blue-500' : 'text-gray-500'
            }`}
        >
          {tab.icon}
          <span className="text-xs">{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}

function NormalizeIndexHtml() {
  const location = useLocation();
  if (location.pathname === '/index.html') {
    return <Navigate to="/" replace />;
  }
  return null;
}

function StripTrailingSlash() {
  const location = useLocation();
  if (location.pathname !== '/' && location.pathname.endsWith('/')) {
    return <Navigate to={location.pathname.slice(0, -1)} replace />;
  }
  return null;
}

export default function App() {
  return (
    <div className="pb-16"> {/* padding for bottom nav */}
      <DataInColorBanner />
      <NormalizeIndexHtml />
      <StripTrailingSlash />
      <Routes>
        <Route path="/" element={
          <Layout>
            <Identify />
          </Layout>
        } />
        <Route path="/forms" element={
          <Layout>
            <Forms />
          </Layout>
        } />
        <Route path="/attest" element={
          <Layout>
            <Attest />
          </Layout>
        } />
        <Route path="/verify" element={
          <Layout>
            <Verify />
          </Layout>
        } />
        <Route path="/download-vc" element={
          <Layout>
            <DownloadVC />
          </Layout>
        } />
        <Route path="/hiw" element={
          <Layout>
            <HowItWorks />
          </Layout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}
