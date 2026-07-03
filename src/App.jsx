import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home     from './pages/Home';
import About    from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Clients  from './pages/Clients';
import Licenses from './pages/Licenses';
import Careers  from './pages/Careers';
import Contact  from './pages/Contact';
import Portal        from './pages/Portal';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail   from './pages/VerifyEmail';
import VerifyPending from './pages/VerifyPending';
import { SEO } from './seo';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Dashboard has its own full-screen layout â€” no shared footer
function Layout({ children, isPortal, seoKey }) {
  return (
    <>
      <SEO pageKey={seoKey} />
      <Navbar />
      <main>{children}</main>
      {!isPortal && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/"         element={<Layout seoKey="home"><Home     /></Layout>} />
        <Route path="/about"    element={<Layout seoKey="about"><About    /></Layout>} />
        <Route path="/services" element={<Layout seoKey="services"><Services /></Layout>} />
        <Route path="/projects" element={<Layout seoKey="projects"><Projects /></Layout>} />
        <Route path="/clients"  element={<Layout seoKey="clients"><Clients  /></Layout>} />
        <Route path="/licenses" element={<Layout seoKey="licenses"><Licenses /></Layout>} />
        <Route path="/careers"  element={<Layout seoKey="careers"><Careers  /></Layout>} />
        <Route path="/contact"  element={<Layout seoKey="contact"><Contact  /></Layout>} />
        <Route path="/dashboard" element={<Layout isPortal seoKey="private"><Portal /></Layout>} />
        <Route path="/portal"    element={<Navigate to="/dashboard" replace />} />
        <Route path="/reset-password" element={<Layout isPortal seoKey="resetPassword"><ResetPassword /></Layout>} />
        <Route path="/verify-email"   element={<Layout isPortal seoKey="verifyEmail"><VerifyEmail /></Layout>} />
        <Route path="/verify-pending" element={<Layout isPortal seoKey="verifyPending"><VerifyPending /></Layout>} />
        {/* 404 */}
        <Route path="*" element={
          <Layout seoKey="notFound">
            <div className="min-h-screen pt-[68px] flex items-center justify-center bg-[#0B1D33]">
              <div className="text-center px-6">
                <div className="font-condensed text-[120px] font-extrabold text-[#C8922A]/20 leading-none mb-4">404</div>
                <h1 className="font-condensed text-[36px] font-extrabold text-white mb-4">Page Not Found</h1>
                <p className="text-[14px] text-white/50 mb-8">The page you're looking for doesn't exist.</p>
                <a href="/" className="inline-block bg-[#C8922A] text-[#0B1D33] font-bold text-[12px] tracking-[1px] uppercase px-8 py-4 hover:bg-[#E5A93A] transition-colors">
                  Back to Home
                </a>
              </div>
            </div>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}




