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

  // Tim pengembang dengan foto asli
  const teamMembers = [
    {
      name: "Dea Zasqia Pasaribu Malau",
      role: "Frontend Developer & UI/UX Designer",
      bio: "Spesialis dalam React dan Next.js dengan pengalaman 3 tahun dalam pengembangan aplikasi web modern. Passionate tentang menciptakan pengalaman pengguna yang intuitif.",
      skills: ["React", "Next.js", "TypeScript", "Figma"],
      photoUrl: "https://i.ibb.co.com/5WjqDw8Q/dea.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/deazasqiamalau ",
        github: "https://github.com/deazasqiamalau"
      }
    },
    {
      name: "Tasya Zahrani",
      role: "Backend Developer & System Architect",
      bio: "Ahli dalam sistem backend dan database dengan fokus pada keamanan dan skalabilitas aplikasi. Memiliki pengalaman dalam microservices dan cloud computing.",
      skills: ["Node.js", "PostgreSQL", "AWS", "Docker"],
      photoUrl: "https://i.ibb.co.com/yFqtY0MC/tasya.jpg",
      social: {
        linkedin: "https://www.linkedin.com/in/tasya-zahrani-176b8b28a/",
        github: "https://github.com/tasyazahrani"
      }
    }
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
      paddingBottom: '96px',
      backgroundColor: '#f8fafc',
      position: 'relative',
      overflow: 'hidden'
    },
    heroContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px'
    },
    heroContent: {
      display: 'flex',
      flexDirection: 'column',
      gap: '64px',
      alignItems: 'center'
    },
    heroMain: {
      display: 'flex',
      flexDirection: 'column',
      gap: '48px',
      width: '100%',
      maxWidth: '1200px'
    },
    heroRow: {
      display: 'flex',
      flexDirection: 'column',
      gap: '48px',
      alignItems: 'center',
      width: '100%'
    },
    heroLeft: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    heroText: {
      textAlign: 'left',
      maxWidth: '600px'
    },
    heroTitle: {
      fontSize: '42px',
      fontWeight: 'bold',
      color: '#111827',
      lineHeight: '1.2',
      margin: '0 0 20px 0'
    },
    heroDescription: {
      fontSize: '18px',
      color: '#6b7280',
      lineHeight: '1.7',
      margin: '0 0 32px 0',
      maxWidth: '500px'
    },
    heroButtons: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap',
      marginBottom: '32px'
    },
    buttonPrimary: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '14px 28px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
    },
    buttonSecondary: {
      backgroundColor: 'white',
      color: '#2563eb',
      padding: '14px 28px',
      border: '2px solid #2563eb',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block'
    },
    heroStats: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#6b7280',
      fontSize: '16px'
    },
    statsDot: {
      width: '10px',
      height: '10px',
      backgroundColor: '#10b981',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    },
    heroRight: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    visualCard: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '48px 32px',
      borderRadius: '20px',
      textAlign: 'center',
      minWidth: '320px',
      maxWidth: '400px',
      boxShadow: '0 20px 40px rgba(37, 99, 235, 0.2)',
      position: 'relative',
      overflow: 'hidden'
    },
    visualCardBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
      zIndex: 1
    },
    visualContent: {
      position: 'relative',
      zIndex: 2
    },
    visualEmoji: {
      fontSize: '64px',
      marginBottom: '24px',
      display: 'inline-block',
      animation: 'float 3s ease-in-out infinite'
    },
    visualTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      margin: '0 0 12px 0',
      lineHeight: '1.2'
    },
    visualSubtitle: {
      fontSize: '18px',
      opacity: 0.9,
      margin: 0,
      fontWeight: '500'
    },
    
    // Animation keyframes
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 }
    },
    '@keyframes float': {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' }
    },
    
    // Features Section
    features: {
      padding: '80px 0',
      backgroundColor: 'white'
    },
    featuresContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px'
    },
    sectionHeader: {
      textAlign: 'center',
      marginBottom: '64px'
    },
    sectionTitle: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#111827',
      margin: '0 0 20px 0'
    },
    sectionDescription: {
      fontSize: '18px',
      color: '#6b7280',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '32px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    featureCard: {
      backgroundColor: 'white',
      padding: '32px',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      transition: 'all 0.3s ease',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
    },
    featureIcon: {
      fontSize: '32px',
      marginBottom: '20px',
      display: 'inline-block'
    },
    featureTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      margin: '0 0 16px 0'
    },
    featureDescription: {
      fontSize: '16px',
      color: '#6b7280',
      lineHeight: '1.6',
      margin: 0
    },

    // Team Section
    team: {
      padding: '80px 0',
      backgroundColor: '#f8fafc'
    },
    teamContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px'
    },
    teamGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '40px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    teamMemberCard: {
      backgroundColor: 'white',
      padding: '32px',
      borderRadius: '16px',
      border: '1px solid #e5e7eb',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden',
      position: 'relative'
    },
    photoContainer: {
      width: '140px',
      height: '140px',
      borderRadius: '50%',
      marginBottom: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      border: '4px solid white',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
      position: 'relative',
      zIndex: 2
    },
    memberPhoto: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease'
    },
    teamMemberName: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: '0 0 8px 0',
      position: 'relative',
      zIndex: 2
    },
    teamMemberRole: {
      fontSize: '16px',
      color: '#2563eb',
      fontWeight: '600',
      margin: '0 0 16px 0',
      padding: '8px 20px',
      backgroundColor: '#eff6ff',
      borderRadius: '24px',
      position: 'relative',
      zIndex: 2
    },
    teamMemberBio: {
      fontSize: '15px',
      color: '#6b7280',
      lineHeight: '1.7',
      margin: '0 0 24px 0',
      minHeight: '80px',
      position: 'relative',
      zIndex: 2
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '8px',
      position: 'relative',
      zIndex: 2
    },
    skillBadge: {
      fontSize: '13px',
      padding: '6px 16px',
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
      borderRadius: '20px',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    socialLinks: {
      display: 'flex',
      gap: '16px',
      marginTop: '24px',
      position: 'relative',
      zIndex: 2
    },
    socialLink: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#6b7280',
      fontSize: '18px',
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      transform: 'translateY(0)'
    },
    cardBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '200px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      opacity: 0,
      transition: 'opacity 0.4s ease',
      zIndex: 1
    },
    
    // CTA Section
    cta: {
      padding: '80px 0',
      backgroundColor: '#1e40af',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    },
    ctaContainer: {
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0 16px',
      textAlign: 'center',
      position: 'relative',
      zIndex: 2
    },
    ctaTitle: {
      fontSize: '32px',
      fontWeight: 'bold',
      margin: '0 0 20px 0'
    },
    ctaDescription: {
      fontSize: '18px',
      opacity: 0.9,
      margin: '0 0 40px 0',
      lineHeight: '1.6'
    },
    ctaButtons: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    buttonWhite: {
      backgroundColor: 'white',
      color: '#1e40af',
      padding: '16px 32px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      color: 'white',
      padding: '16px 32px',
      border: '2px solid white',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block'
    },
    
    // Footer
    footer: {
      padding: '64px 0',
      backgroundColor: '#111827',
      color: 'white',
      position: 'relative'
    },
    footerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 16px',
      textAlign: 'center'
    },
    footerLogo: {
      fontSize: '24px',
      fontWeight: 'bold',
      margin: '0 0 20px 0'
    },
    footerDescription: {
      fontSize: '16px',
      opacity: 0.7,
      margin: '0 0 40px 0',
      maxWidth: '400px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.6'
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '24px',
      flexWrap: 'wrap',
      marginBottom: '40px'
    },
    footerLink: {
      color: '#9ca3af',
      background: 'none',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      textDecoration: 'none',
      padding: '8px 16px'
    },
    footerCopyright: {
      fontSize: '14px',
      opacity: 0.5,
      margin: 0
    },

    // Media Queries
    '@media (min-width: 768px)': {
      heroRow: {
        flexDirection: 'row',
        gap: '80px'
      },
      heroText: {
        textAlign: 'left'
      },
      heroButtons: {
        justifyContent: 'flex-start'
      },
      heroStats: {
        justifyContent: 'flex-start'
      },
      featuresGrid: {
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '32px'
      }
    }
  };

  // Inline styles untuk keyframes animation
  const animationStyles = `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;

  return (
    <div style={styles.container}>
      {/* Inline style tag untuk animations */}
      <style>{animationStyles}</style>
      
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
            <div style={styles.heroMain}>
              <div style={{
                ...styles.heroRow,
                flexDirection: isDesktop ? 'row' : 'column',
                gap: isDesktop ? '80px' : '48px'
              }}>
                {/* Bagian Kiri: Teks Utama */}
                <div style={styles.heroLeft}>
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
                          transform: hoverStates.primaryBtn ? 'translateY(-4px)' : 'none',
                          boxShadow: hoverStates.primaryBtn 
                            ? '0 8px 20px rgba(37, 99, 235, 0.3)' 
                            : '0 4px 12px rgba(37, 99, 235, 0.2)'
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
                          backgroundColor: hoverStates.secondaryBtn ? '#eff6ff' : 'white',
                          transform: hoverStates.secondaryBtn ? 'translateY(-4px)' : 'none',
                          borderColor: hoverStates.secondaryBtn ? '#1d4ed8' : '#2563eb',
                          color: hoverStates.secondaryBtn ? '#1d4ed8' : '#2563eb'
                        }}
                        onMouseEnter={() => handleMouseEnter('secondaryBtn')}
                        onMouseLeave={() => handleMouseLeave('secondaryBtn')}
                      >
                        Pelajari Fitur
                      </button>
                    </div>
                    
                    <div style={styles.heroStats}>
                      <span style={{
                        ...styles.statsDot,
                        animation: 'pulse 2s infinite'
                      }}></span>
                      15.000+ pengguna telah bergabung
                    </div>
                  </div>
                </div>
                
                {/* Bagian Kanan: TaskFlow Card */}
                <div style={styles.heroRight}>
                  <div style={{
                    ...styles.visualCard,
                    transform: hoverStates.visualCard ? 'translateY(-8px) scale(1.02)' : 'none',
                    boxShadow: hoverStates.visualCard 
                      ? '0 30px 60px rgba(37, 99, 235, 0.3)' 
                      : '0 20px 40px rgba(37, 99, 235, 0.2)'
                  }}
                  onMouseEnter={() => handleMouseEnter('visualCard')}
                  onMouseLeave={() => handleMouseLeave('visualCard')}>
                    <div style={styles.visualCardBg} />
                    <div style={styles.visualContent}>
                      <div style={{
                        ...styles.visualEmoji,
                        animation: 'float 3s ease-in-out infinite'
                      }}>🚀</div>
                      <h3 style={styles.visualTitle}>TaskFlow</h3>
                      <p style={styles.visualSubtitle}>Produktivitas Maksimal</p>
                    </div>
                  </div>
                </div>
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
          <div style={{
            ...styles.featuresGrid,
            gridTemplateColumns: isDesktop ? 'repeat(3, 1fr)' : '1fr'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  ...styles.featureCard,
                  transform: hoverStates[`feature-${index}`] ? 'translateY(-8px)' : 'none',
                  boxShadow: hoverStates[`feature-${index}`] 
                    ? '0 20px 40px rgba(0, 0, 0, 0.1)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05)'
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

      {/* Team Section */}
      <section id="tim" style={styles.team}>
        <div style={styles.teamContainer}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Tim Pengembang</h2>
            <p style={styles.sectionDescription}>
              Dibalik kesuksesan TaskFlow ada tim developer berpengalaman yang berdedikasi
            </p>
          </div>
          <div style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div
                key={index}
                style={{
                  ...styles.teamMemberCard,
                  transform: hoverStates[`team-${index}`] ? 'translateY(-10px)' : 'none',
                  boxShadow: hoverStates[`team-${index}`] 
                    ? '0 25px 50px rgba(0, 0, 0, 0.15)'
                    : '0 4px 12px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={() => handleMouseEnter(`team-${index}`)}
                onMouseLeave={() => handleMouseLeave(`team-${index}`)}
              >
                {/* Background gradient pada hover */}
                <div 
                  style={{
                    ...styles.cardBackground,
                    opacity: hoverStates[`team-${index}`] ? 0.1 : 0
                  }}
                />
                
                {/* Foto Diri */}
                <div style={styles.photoContainer}>
                  <img 
                    src={member.photoUrl}
                    alt={member.name}
                    style={{
                      ...styles.memberPhoto,
                      transform: hoverStates[`team-${index}`] ? 'scale(1.05)' : 'scale(1)'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${member.name.replace(' ', '+')}&background=random&color=fff&size=128`;
                    }}
                  />
                </div>
                
                <h3 style={styles.teamMemberName}>{member.name}</h3>
                <p style={styles.teamMemberRole}>{member.role}</p>
                <p style={styles.teamMemberBio}>{member.bio}</p>
                
                <div style={styles.skillsContainer}>
                  {member.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex} 
                      style={{
                        ...styles.skillBadge,
                        backgroundColor: hoverStates[`team-${index}-skill-${skillIndex}`] 
                          ? '#2563eb' 
                          : '#f3f4f6',
                        color: hoverStates[`team-${index}-skill-${skillIndex}`] 
                          ? 'white' 
                          : '#4b5563',
                        transform: hoverStates[`team-${index}-skill-${skillIndex}`] 
                          ? 'translateY(-2px)' 
                          : 'none'
                      }}
                      onMouseEnter={() => handleMouseEnter(`team-${index}-skill-${skillIndex}`)}
                      onMouseLeave={() => handleMouseLeave(`team-${index}-skill-${skillIndex}`)}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                {/* Social Links */}
                <div style={styles.socialLinks}>
                  <a 
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...styles.socialLink,
                      backgroundColor: hoverStates[`team-${index}-linkedin`] 
                        ? '#0077b5' 
                        : '#f3f4f6',
                      color: hoverStates[`team-${index}-linkedin`] 
                        ? 'white' 
                        : '#6b7280',
                      transform: hoverStates[`team-${index}-linkedin`] 
                        ? 'translateY(-4px) scale(1.1)' 
                        : 'translateY(0) scale(1)'
                    }}
                    onMouseEnter={() => handleMouseEnter(`team-${index}-linkedin`)}
                    onMouseLeave={() => handleMouseLeave(`team-${index}-linkedin`)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a 
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      ...styles.socialLink,
                      backgroundColor: hoverStates[`team-${index}-github`] 
                        ? '#333' 
                        : '#f3f4f6',
                      color: hoverStates[`team-${index}-github`] 
                        ? 'white' 
                        : '#6b7280',
                      transform: hoverStates[`team-${index}-github`] 
                        ? 'translateY(-4px) scale(1.1)' 
                        : 'translateY(0) scale(1)'
                    }}
                    onMouseEnter={() => handleMouseEnter(`team-${index}-github`)}
                    onMouseLeave={() => handleMouseLeave(`team-${index}-github`)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
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
                transform: hoverStates.ctaPrimary ? 'translateY(-4px) scale(1.05)' : 'none',
                boxShadow: hoverStates.ctaPrimary ? '0 12px 25px rgba(0, 0, 0, 0.3)' : 'none'
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
                transform: hoverStates.ctaSecondary ? 'translateY(-4px) scale(1.05)' : 'none',
                boxShadow: hoverStates.ctaSecondary ? '0 8px 20px rgba(255, 255, 255, 0.3)' : 'none'
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
                  color: hoverStates[`footer-${item}`] ? 'white' : '#9ca3af',
                  backgroundColor: hoverStates[`footer-${item}`] ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
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