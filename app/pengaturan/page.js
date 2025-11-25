"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Pengaturan() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // State untuk Data Form
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [theme, setTheme] = useState("pink");
  const [language, setLanguage] = useState("id");
  
  // State untuk Toggle Switches
  const [toggles, setToggles] = useState({
    pushNotifications: true,
    emailNotifications: false,
    compactView: false
  });

  // --- FETCH DATA ---
  useEffect(() => {
    const initPage = async () => {
      // 1. Cek Login LocalStorage
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) {
        router.push('/login');
        return;
      }
      
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      try {
        // 2. Ambil Data Terbaru dari Database
        const userId = user._id || user.id;
        const res = await fetch(`/api/pengaturan?userId=${userId}`);
        const data = await res.json();

        if (data.success && data.user) {
          setProfileName(data.user.name || "");
          setProfileEmail(data.user.email || "");
          
          // Load settings jika ada
          if (data.user.settings) {
            setTheme(data.user.settings.theme || "pink");
            setLanguage(data.user.settings.language || "id");
            if (data.user.settings.toggles) {
              setToggles(prev => ({...prev, ...data.user.settings.toggles}));
            }
          }
        }
      } catch (error) {
        console.error("Gagal load settings:", error);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, [router]);

  // --- HANDLERS ---

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const toggleSetting = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const userId = currentUser._id || currentUser.id;
      
      const payload = {
        userId,
        name: profileName,
        email: profileEmail,
        settings: {
          theme,
          language,
          toggles
        }
      };

      const res = await fetch('/api/pengaturan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.success) {
        // Update LocalStorage agar Dashboard langsung berubah namanya
        const updatedUser = { ...currentUser, name: profileName, email: profileEmail };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        alert("✅ Pengaturan berhasil disimpan!");
      } else {
        alert("❌ Gagal menyimpan: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setSaving(false);
    }
  };

  // --- STYLES (Sama dengan Dashboard) ---
  const styles = {
    container: {
      display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    sidebar: {
      width: '280px', backgroundColor: '#1e293b', color: 'white',
      padding: '24px 0', position: 'fixed', height: '100vh', overflowY: 'auto', zIndex: 10
    },
    logoSection: {
      display: 'flex', alignItems: 'center', gap: '12px', padding: '0 24px 24px',
      borderBottom: '1px solid #334155'
    },
    logo: {
      width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '8px',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    appName: { fontSize: '20px', fontWeight: 'bold' },
    navMenu: { listStyle: 'none', padding: '24px 0', margin: 0 },
    navItem: { marginBottom: '8px' },
    navLink: {
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
      color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', border: 'none',
      backgroundColor: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer'
    },
    navLinkActive: { backgroundColor: '#334155', color: 'white', borderRight: '3px solid #3b82f6' },
    navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },

    // Content
    mainContent: { flex: 1, padding: '24px', marginLeft: '280px', minHeight: '100vh' },
    header: { marginBottom: '32px' },
    welcomeTitle: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' },
    welcomeSubtitle: { fontSize: '16px', color: '#6b7280' },

    // Sections
    section: {
        backgroundColor: 'white', padding: '24px', borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '24px'
    },
    sectionTitle: {
        fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e5e7eb',
        paddingBottom: '12px'
    },
    
    // Profile
    profileContainer: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' },
    avatar: {
        width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#3b82f6',
        color: 'white', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    
    // Form Inputs
    row: { marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    label: { fontSize: '14px', fontWeight: '500', color: '#374151' },
    input: {
        padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db',
        fontSize: '14px', width: '300px'
    },
    select: {
        padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db',
        fontSize: '14px', width: '200px', backgroundColor: 'white'
    },

    // Toggle Switch (CSS-in-JS)
    toggle: (active) => ({
        width: '48px', height: '24px', borderRadius: '12px',
        backgroundColor: active ? '#3b82f6' : '#e5e7eb',
        position: 'relative', cursor: 'pointer', transition: '0.3s'
    }),
    toggleCircle: (active) => ({
        width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white',
        position: 'absolute', top: '3px', left: active ? '27px' : '3px',
        transition: '0.3s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
    }),

    // Button
    saveBtn: {
        padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white',
        border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '500',
        cursor: 'pointer', opacity: saving ? 0.7 : 1
    },
    loading: {
        display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6b7280'
    }
  };

  if (loading) return <div style={styles.loading}>Memuat Pengaturan...</div>;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <div style={styles.appName}>TaskFlow</div>
        </div>
        <ul style={styles.navMenu}>
          <li style={styles.navItem}>
             <Link href="/dashboard" style={styles.navLink}> <span style={styles.navIcon}>🏠</span> Dashboard </Link>
          </li>
          <li style={styles.navItem}>
             <Link href="/tasks" style={styles.navLink}> <span style={styles.navIcon}>📝</span> Tugas </Link>
          </li>
          <li style={styles.navItem}>
             <Link href="/notifications" style={styles.navLink}> <span style={styles.navIcon}>⭐</span> Pengingat </Link>
          </li>
          <li style={styles.navItem}>
             <Link href="/laporan" style={styles.navLink}> <span style={styles.navIcon}>📊</span> Laporan </Link>
          </li>
          <li style={styles.navItem}>
             <button style={{...styles.navLink, ...styles.navLinkActive}}> <span style={styles.navIcon}>⚙️</span> Pengaturan </button>
          </li>
          <li style={styles.navItem}>
             <button onClick={handleLogout} style={styles.navLink}> <span style={styles.navIcon}>🚪</span> Logout </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
            <h1 style={styles.welcomeTitle}>Pengaturan</h1>
            <p style={styles.welcomeSubtitle}>Kelola profil dan preferensi aplikasi</p>
        </div>

        {/* 1. Profil Section */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>👤 Profil Pengguna</h2>
            <div style={styles.profileContainer}>
                <div style={styles.avatar}>
                    {profileName ? profileName.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                    <h3 style={{margin: '0 0 4px 0', fontSize: '18px'}}>{profileName}</h3>
                    <p style={{margin: 0, color: '#6b7280', fontSize: '14px'}}>{profileEmail}</p>
                </div>
            </div>
            
            <div style={styles.row}>
                <label style={styles.label}>Nama Lengkap</label>
                <input 
                    type="text" 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)}
                    style={styles.input} 
                />
            </div>
            <div style={styles.row}>
                <label style={styles.label}>Email Address</label>
                <input 
                    type="email" 
                    value={profileEmail} 
                    onChange={(e) => setProfileEmail(e.target.value)}
                    style={styles.input} 
                />
            </div>
        </div>

        {/* 2. App Preferences */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🎨 Tampilan & Bahasa</h2>
            <div style={styles.row}>
                <label style={styles.label}>Tema Aplikasi</label>
                <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)}
                    style={styles.select}
                >
                    <option value="pink">🌸 Pink</option>
                    <option value="blue">🔵 Blue</option>
                    <option value="dark">⚫ Dark Mode</option>
                </select>
            </div>
            <div style={styles.row}>
                <label style={styles.label}>Bahasa</label>
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    style={styles.select}
                >
                    <option value="id">🇮🇩 Bahasa Indonesia</option>
                    <option value="en">🇺🇸 English</option>
                </select>
            </div>
             <div style={styles.row}>
                <label style={styles.label}>Mode Ringkas (Compact)</label>
                <div style={styles.toggle(toggles.compactView)} onClick={() => toggleSetting('compactView')}>
                    <div style={styles.toggleCircle(toggles.compactView)}></div>
                </div>
            </div>
        </div>

        {/* 3. Notifications */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🔔 Notifikasi</h2>
            <div style={styles.row}>
                <label style={styles.label}>Notifikasi Browser (Push)</label>
                <div style={styles.toggle(toggles.pushNotifications)} onClick={() => toggleSetting('pushNotifications')}>
                    <div style={styles.toggleCircle(toggles.pushNotifications)}></div>
                </div>
            </div>
            <div style={styles.row}>
                <label style={styles.label}>Notifikasi Email</label>
                <div style={styles.toggle(toggles.emailNotifications)} onClick={() => toggleSetting('emailNotifications')}>
                    <div style={styles.toggleCircle(toggles.emailNotifications)}></div>
                </div>
            </div>
        </div>

        {/* Save Button */}
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <button 
                onClick={saveSettings} 
                style={styles.saveBtn}
                disabled={saving}
            >
                {saving ? "Menyimpan..." : "💾 Simpan Perubahan"}
            </button>
        </div>

      </div>
    </div>
  );
}