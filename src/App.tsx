import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AboutPage from "@/app/about/page";
import ContactPage from "@/app/contact/page";
import Home from "@/app/page";
import PatternDetailPage from "@/app/patterns/[id]/page";
import RootLayout from "@/app/layout";

function RouteScrollRestoration() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <RootLayout>
      <RouteScrollRestoration />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/patterns/:id" element={<PatternDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RootLayout>
  );
}