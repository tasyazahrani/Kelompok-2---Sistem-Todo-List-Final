"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hoverStates, setHoverStates] = useState({});

  // Client-side only screen detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const handleMouseEnter = (element) => {
    setHoverStates(prev => ({ ...prev, [element]: true }));
  };

  const handleMouseLeave = (element) => {
    setHoverStates(prev => ({ ...prev, [element]: false }));
  };

  const features = [
    {
      icon: "✅",
      title: "Manajemen Tugas",
      description: "Buat, edit, dan organisir tugas dengan sistem kategori dan prioritas.",
    },
    {
      icon: "📊", 
      title: "Prioritas Cerdas",
      description: "Tentukan tingkat prioritas dengan sistem warna.",
    },
    {
      icon: "📅",
      title: "Jadwal Fleksibel",
      description: "Atur deadline dan pengingat dengan kalender terintegrasi.",
    },
  ];

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: 'white',
      color: '#1f2937',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    
    // Header
    header: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      zIndex: 50
    },
    headerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px'
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '64px'
    },
    logo: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#2563eb',
      margin: 0,
      textDecoration: 'none'
    },
    desktopNav: {
      display: 'none',
      gap: '24px',
      alignItems: 'center'
    },
    navButton: {
      color: '#6b7280',
      background: 'none',
      border: 'none',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '6px',
      transition: 'all 0.2s',
      textDecoration: 'none'
    },
    mobileMenuButton: {
      display: 'flex',
      flexDirection: 'column',
      gap: '3px',
      background: 'none',
      border: 'none',
      padding: '8px',
      cursor: 'pointer'
    },
    menuBar: {
      width: '20px',
      height: '2px',
      backgroundColor: '#374151',
      transition: 'all 0.2s'
    },
    mobileMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '16px'
    },
    mobileNav: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    mobileNavButton: {
      textAlign: 'left',
      color: '#6b7280',
      background: 'none',
      border: 'none',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      borderRadius: '6px',
      transition: 'all 0.2s',
      textDecoration: 'none'
    },
    
    // Hero Section
    hero: {
      paddingTop: '96px',
      paddingBottom: '64px',
      backgroundColor: '#f8fafc'
    },
    heroContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px'
    },
    heroContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '48px',
      alignItems: 'center'
    },
    heroText: {
      textAlign: 'center',
      maxWidth: '600px'
    },
    heroTitle: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#111827',
      lineHeight: '1.2',
      margin: '0 0 16px 0'
    },
    heroDescription: {
      fontSize: '18px',
      color: '#6b7280',
      lineHeight: '1.6',
      margin: '0 0 32px 0'
    },
    heroButtons: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    buttonPrimary: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      display: 'inline-block'
    },
    buttonSecondary: {
      backgroundColor: 'transparent',
      color: '#2563eb',
      padding: '12px 24px',
      border: '1px solid #2563eb',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      display: 'inline-block'
    },
    heroStats: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '24px',
      color: '#6b7280',
      fontSize: '14px'
    },
    statsDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#10b981',
      borderRadius: '50%'
    },
    heroVisual: {
      display: 'flex',
      justifyContent: 'center'
    },
    visualCard: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '32px',
      borderRadius: '12px',
      textAlign: 'center',
      minWidth: '280px',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
    },
    visualEmoji: {
      fontSize: '48px',
      marginBottom: '16px'
    },
    visualTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '0 0 8px 0'
    },
    visualSubtitle: {
      fontSize: '14px',
      opacity: 0.9,
      margin: 0
    },
    
    // Features Section
    features: {
      padding: '64px 0',
      backgroundColor: 'white'
    },
    featuresContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px'
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '48px'
    },
    sectionTitle: {
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#111827',
      margin: '0 0 16px 0'
    },
    sectionDescription: {
      fontSize: '16px',
      color: '#6b7280',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '24px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    featureCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s',
      textAlign: 'center'
    },
    featureIcon: {
      fontSize: '24px',
      marginBottom: '16px'
    },
    featureTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#111827',
      margin: '0 0 12px 0'
    },
    featureDescription: {
      fontSize: '14px',
      color: '#6b7280',
      lineHeight: '1.5',
      margin: 0
    },
    
    // CTA Section
    cta: {
      padding: '64px 0',
      backgroundColor: '#1e40af',
      color: 'white'
    },
    ctaContainer: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0 16px',
      textAlign: 'center'
    },
    ctaTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '0 0 16px 0'
    },
    ctaDescription: {
      fontSize: '16px',
      opacity: 0.9,
      margin: '0 0 32px 0',
      lineHeight: '1.6'
    },
    ctaButtons: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    buttonWhite: {
      backgroundColor: 'white',
      color: '#1e40af',
      padding: '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      display: 'inline-block'
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      color: 'white',
      padding: '12px 24px',
      border: '1px solid white',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      display: 'inline-block'
    },
    
    // Footer
    footer: {
      padding: '48px 0',
      backgroundColor: '#111827',
      color: 'white'
    },
    footerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px',
      textAlign: 'center'
    },
    footerLogo: {
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '0 0 16px 0'
    },
    footerDescription: {
      fontSize: '14px',
      opacity: 0.7,
      margin: '0 0 32px 0',
      maxWidth: '400px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      flexWrap: 'wrap',
      marginBottom: '32px'
    },
    footerLink: {
      color: '#9ca3af',
      background: 'none',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none'
    },
    footerCopyright: {
      fontSize: '12px',
      opacity: 0.5,
      margin: 0
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.headerContent}>
            <Link href="/" style={styles.logo}>TaskFlow</Link>
            
            {/* Desktop Navigation - Tampilkan hanya di desktop */}
            <nav 
              style={{
                ...styles.desktopNav,
                display: isDesktop ? 'flex' : 'none'
              }}
            >
              {["beranda", "fitur", "tim", "tentang"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  style={{
                    ...styles.navButton,
                    color: hoverStates[`nav-${item}`] ? '#2563eb' : '#6b7280',
                    backgroundColor: hoverStates[`nav-${item}`] ? '#eff6ff' : 'transparent'
                  }}
                  onMouseEnter={() => handleMouseEnter(`nav-${item}`)}
                  onMouseLeave={() => handleMouseLeave(`nav-${item}`)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
              <div style={{display: 'flex', gap: '12px', marginLeft: '16px'}}>
                <Link 
                  href="/login"
                  style={{
                    ...styles.navButton,
                    color: '#2563eb'
                  }}
                  onMouseEnter={() => handleMouseEnter('nav-login')}
                  onMouseLeave={() => handleMouseLeave('nav-login')}
                >
                  Masuk
                </Link>
                <Link 
                  href="/register"
                  style={{
                    ...styles.navButton,
                    backgroundColor: '#2563eb',
                    color: 'white'
                  }}
                  onMouseEnter={() => handleMouseEnter('nav-register')}
                  onMouseLeave={() => handleMouseLeave('nav-register')}
                >
                  Daftar
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Button - Tampilkan hanya di mobile */}
            <button
              style={{
                ...styles.mobileMenuButton,
                display: isDesktop ? 'none' : 'flex'
              }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div style={{
                ...styles.menuBar,
                transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}></div>
              <div style={{
                ...styles.menuBar,
                opacity: isMobileMenuOpen ? 0 : 1
              }}></div>
              <div style={{
                ...styles.menuBar,
                transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'
              }}></div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div style={styles.mobileMenu}>
              <nav style={styles.mobileNav}>
                {["beranda", "fitur", "tim", "tentang"].map((item) => (
                  <button
                    key={item}
                    onClick={() => scrollToSection(item)}
                    style={{
                      ...styles.mobileNavButton,
                      color: hoverStates[`mobile-nav-${item}`] ? '#2563eb' : '#6b7280',
                      backgroundColor: hoverStates[`mobile-nav-${item}`] ? '#eff6ff' : 'transparent'
                    }}
                    onMouseEnter={() => handleMouseEnter(`mobile-nav-${item}`)}
                    onMouseLeave={() => handleMouseLeave(`mobile-nav-${item}`)}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </button>
                ))}
                <div style={{display: 'flex', gap: '12px', marginTop: '16px'}}>
                  <Link 
                    href="/login"
                    style={{
                      ...styles.mobileNavButton,
                      flex: 1,
                      textAlign: 'center',
                      color: '#2563eb',
                      border: '1px solid #2563eb'
                    }}
                  >
                    Masuk
                  </Link>
                  <Link 
                    href="/register"
                    style={{
                      ...styles.mobileNavButton,
                      flex: 1,
                      textAlign: 'center',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: '1px solid #2563eb'
                    }}
                  >
                    Daftar
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="beranda" style={styles.hero}>
        <div style={styles.heroContainer}>
          <div style={styles.heroContent}>
            <div style={styles.heroText}>
              <h1 style={styles.heroTitle}>
                Tingkatkan Produktivitas Anda dengan Solusi Terbaik
              </h1>
              <p style={styles.heroDescription}>
                Platform kami membantu Anda mengatur dan memprioritaskan tugas dengan sistem manajemen yang intuitif dan powerful.
              </p>
              <div style={styles.heroButtons}>
                <Link 
                  href="/register"
                  style={{
                    ...styles.buttonPrimary,
                    backgroundColor: hoverStates.primaryBtn ? '#1d4ed8' : '#2563eb',
                    transform: hoverStates.primaryBtn ? 'translateY(-2px)' : 'none'
                  }}
                  onMouseEnter={() => handleMouseEnter('primaryBtn')}
                  onMouseLeave={() => handleMouseLeave('primaryBtn')}
                >
                  Daftar Sekarang
                </Link>
                <button 
                  onClick={() => scrollToSection("fitur")}
                  style={{
                    ...styles.buttonSecondary,
                    backgroundColor: hoverStates.secondaryBtn ? '#eff6ff' : 'transparent',
                    transform: hoverStates.secondaryBtn ? 'translateY(-2px)' : 'none'
                  }}
                  onMouseEnter={() => handleMouseEnter('secondaryBtn')}
                  onMouseLeave={() => handleMouseLeave('secondaryBtn')}
                >
                  Pelajari Fitur
                </button>
              </div>
              <div style={styles.heroStats}>
                <span style={styles.statsDot}></span>
                15.000+ pengguna telah bergabung
              </div>
            </div>
            <div style={styles.heroVisual}>
              <div style={styles.visualCard}>
                <div style={styles.visualEmoji}>🚀</div>
                <h3 style={styles.visualTitle}>TaskFlow</h3>
                <p style={styles.visualSubtitle}>Produktivitas Maksimal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" style={styles.features}>
        <div style={styles.featuresContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Fitur Unggulan</h2>
            <p style={styles.sectionDescription}>
              Temukan berbagai fitur powerful yang akan mengubah cara Anda mengelola tugas sehari-hari
            </p>
          </div>
          <div style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  ...styles.featureCard,
                  transform: hoverStates[`feature-${index}`] ? 'translateY(-4px)' : 'none',
                  boxShadow: hoverStates[`feature-${index}`] 
                    ? '0 10px 25px rgba(0, 0, 0, 0.1)'
                    : '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={() => handleMouseEnter(`feature-${index}`)}
                onMouseLeave={() => handleMouseLeave(`feature-${index}`)}
              >
                <div style={styles.featureIcon}>{feature.icon}</div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Siap Meningkatkan Produktivitas Anda?</h2>
          <p style={styles.ctaDescription}>
            Bergabunglah dengan ribuan pengguna yang telah merasakan manfaat platform kami
          </p>
          <div style={styles.ctaButtons}>
            <Link 
              href="/register"
              style={{
                ...styles.buttonWhite,
                transform: hoverStates.ctaPrimary ? 'translateY(-2px)' : 'none'
              }}
              onMouseEnter={() => handleMouseEnter('ctaPrimary')}
              onMouseLeave={() => handleMouseLeave('ctaPrimary')}
            >
              Daftar Gratis
            </Link>
            <Link 
              href="/login"
              style={{
                ...styles.buttonOutline,
                transform: hoverStates.ctaSecondary ? 'translateY(-2px)' : 'none'
              }}
              onMouseEnter={() => handleMouseEnter('ctaSecondary')}
              onMouseLeave={() => handleMouseLeave('ctaSecondary')}
            >
              Masuk Akun
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <h3 style={styles.footerLogo}>TaskFlow</h3>
          <p style={styles.footerDescription}>
            Solusi manajemen tugas terbaik untuk meningkatkan produktivitas Anda
          </p>
          <div style={styles.footerLinks}>
            {["Beranda", "Fitur", "Tim", "Tentang", "Kontak"].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                style={{
                  ...styles.footerLink,
                  color: hoverStates[`footer-${item}`] ? 'white' : '#9ca3af'
                }}
                onMouseEnter={() => handleMouseEnter(`footer-${item}`)}
                onMouseLeave={() => handleMouseLeave(`footer-${item}`)}
              >
                {item}
              </button>
            ))}
          </div>
          <p style={styles.footerCopyright}>
            © 2024 TaskFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}