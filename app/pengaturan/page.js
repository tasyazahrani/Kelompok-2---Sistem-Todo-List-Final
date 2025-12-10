"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Pengaturan() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // State untuk Data Form
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [language, setLanguage] = useState("id");
  const [fontSize, setFontSize] = useState("medium");
  const [theme, setTheme] = useState("light");
  const [defaultView, setDefaultView] = useState("list");
  const [defaultSort, setDefaultSort] = useState("dueDate");
  const [weekStartsOn, setWeekStartsOn] = useState("monday");
  const [timeFormat, setTimeFormat] = useState("24h");
  
  // State untuk Toggle Switches
  const [toggles, setToggles] = useState({
    pushNotifications: true,
    emailNotifications: false,
    taskReminders: true,
    dueDateAlerts: true,
    autoSave: true,
    showCompletedTasks: true,
    keyboardShortcuts: true,
    enableSounds: false,
    enableAnimations: true,
    showTaskCount: true,
    analytics: false,
    shareUsageData: false
  });

  // --- FETCH DATA ---
  useEffect(() => {
    const initPage = async () => {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) {
        router.push('/login');
        return;
      }
      
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      try {
        const userId = user._id || user.id;
        const res = await fetch(`/api/pengaturan?userId=${userId}`);
        const data = await res.json();

        if (data.success && data.user) {
          setProfileName(data.user.name || "");
          setProfileEmail(data.user.email || "");
          setProfileImage(data.user.profileImage || "");
          
          if (data.user.settings) {
            setTheme(data.user.settings.theme || "light");
            setLanguage(data.user.settings.language || "id");
            setFontSize(data.user.settings.fontSize || "medium");
            setDefaultView(data.user.settings.defaultView || "list");
            setDefaultSort(data.user.settings.defaultSort || "dueDate");
            setWeekStartsOn(data.user.settings.weekStartsOn || "monday");
            setTimeFormat(data.user.settings.timeFormat || "24h");
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

  // Apply Font Size
  useEffect(() => {
    const root = document.documentElement;
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    root.style.fontSize = sizes[fontSize] || '16px';
  }, [fontSize]);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#0f172a';
    } else {
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [theme]);

  // Initialize Notifications
  useEffect(() => {
    if ('Notification' in window && toggles.pushNotifications) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [toggles.pushNotifications]);

  // --- HANDLERS ---

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const toggleSetting = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('❌ Hanya file gambar yang diperbolehkan');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('❌ Ukuran file maksimal 2MB');
      return;
    }

    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      formData.append('userId', currentUser._id || currentUser.id);

      const res = await fetch('/api/upload-profile', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setProfileImage(data.imageUrl);
        
        const updatedUser = { ...currentUser, profileImage: data.imageUrl };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        alert('✅ Foto profil berhasil diupload!');
      } else {
        alert('❌ Gagal upload foto: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Terjadi kesalahan saat mengupload foto');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeProfileImage = async () => {
    if (!profileImage) return;

    if (confirm('Apakah Anda yakin ingin menghapus foto profil?')) {
      try {
        const res = await fetch('/api/remove-profile-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: currentUser._id || currentUser.id,
            imageUrl: profileImage 
          }),
        });

        const data = await res.json();

        if (data.success) {
          setProfileImage('');
          
          const updatedUser = { ...currentUser, profileImage: '' };
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          
          alert('✅ Foto profil berhasil dihapus!');
        }
      } catch (error) {
        alert('❌ Gagal menghapus foto profil');
      }
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const userId = currentUser._id || currentUser.id;
      
      const payload = {
        userId,
        name: profileName,
        email: profileEmail,
        profileImage,
        settings: {
          theme,
          language,
          fontSize,
          defaultView,
          defaultSort,
          weekStartsOn,
          timeFormat,
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
        const updatedUser = { 
          ...currentUser, 
          name: profileName, 
          email: profileEmail,
          profileImage,
          settings: payload.settings
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        document.documentElement.lang = language;
        
        if (toggles.pushNotifications && Notification.permission === 'granted') {
          new Notification('TaskFlow - Pengaturan Disimpan', {
            body: 'Pengaturan Anda berhasil disimpan',
            icon: '/icon.png'
          });
        }
        
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

  const testNotification = () => {
    if (!toggles.pushNotifications) {
      alert('⚠️ Aktifkan notifikasi browser terlebih dahulu');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification('TaskFlow - Notifikasi Test', {
        body: 'Notifikasi Anda berfungsi dengan baik! 🎉',
        icon: '/icon.png',
        tag: 'test-notification'
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          testNotification();
        }
      });
    } else {
      alert('❌ Izinkan notifikasi di browser settings');
    }
  };

  const testSound = () => {
    if (!toggles.enableSounds) {
      alert('⚠️ Aktifkan suara terlebih dahulu');
      return;
    }
    
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      
      alert('✅ Suara test berhasil diputar!');
    } catch (error) {
      alert('❌ Browser tidak mendukung Audio API');
    }
  };

  const resetToDefaults = () => {
    if (confirm('Reset semua pengaturan ke default? Tindakan ini tidak bisa dibatalkan.')) {
      setLanguage("id");
      setFontSize("medium");
      setTheme("light");
      setDefaultView("list");
      setDefaultSort("dueDate");
      setWeekStartsOn("monday");
      setTimeFormat("24h");
      setToggles({
        pushNotifications: true,
        emailNotifications: false,
        taskReminders: true,
        dueDateAlerts: true,
        autoSave: true,
        showCompletedTasks: true,
        keyboardShortcuts: true,
        enableSounds: false,
        enableAnimations: true,
        showTaskCount: true,
        analytics: false,
        shareUsageData: false
      });
      alert('✅ Pengaturan berhasil direset ke default!');
    }
  };

  // --- STYLES ---
  const isDark = theme === 'dark';
  
  const styles = {
    container: {
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      transition: 'background-color 0.3s ease'
    },
    
    sidebar: {
      width: '280px', 
      backgroundColor: '#1e293b', 
      color: 'white',
      padding: '24px 0', 
      position: 'fixed', 
      height: '100vh', 
      overflowY: 'auto', 
      zIndex: 10,
      borderRight: '1px solid #334155'
    },
    
    logoSection: {
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      padding: '0 24px 24px',
      borderBottom: '1px solid #334155'
    },
    
    logo: {
      width: '40px', 
      height: '40px', 
      backgroundColor: '#3b82f6', 
      borderRadius: '8px',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center'
    },
    
    appName: { 
      fontSize: '20px', 
      fontWeight: 'bold' 
    },
    
    navMenu: { 
      listStyle: 'none', 
      padding: '24px 0', 
      margin: 0 
    },
    
    navItem: { 
      marginBottom: '8px' 
    },
    
    navLink: {
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px', 
      padding: '12px 24px',
      color: '#cbd5e1', 
      textDecoration: 'none', 
      fontSize: '14px', 
      border: 'none',
      backgroundColor: 'transparent', 
      width: '100%', 
      textAlign: 'left', 
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    
    navLinkActive: { 
      backgroundColor: '#334155', 
      color: 'white', 
      borderRight: '3px solid #3b82f6' 
    },
    
    navIcon: { 
      fontSize: '16px', 
      width: '20px', 
      textAlign: 'center' 
    },

    mainContent: { 
      flex: 1, 
      padding: '24px', 
      marginLeft: '280px', 
      minHeight: '100vh',
      maxWidth: '1200px'
    },
    
    header: { 
      marginBottom: '32px' 
    },
    
    welcomeTitle: { 
      fontSize: '28px', 
      fontWeight: 'bold', 
      color: isDark ? '#f1f5f9' : '#1f2937', 
      marginBottom: '8px' 
    },
    
    welcomeSubtitle: { 
      fontSize: '16px', 
      color: isDark ? '#94a3b8' : '#6b7280' 
    },

    section: {
      backgroundColor: isDark ? '#1e293b' : 'white', 
      padding: '24px', 
      borderRadius: '12px',
      boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)', 
      marginBottom: '24px',
      border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
      transition: 'all 0.3s ease'
    },
    
    sectionTitle: {
      fontSize: '18px', 
      fontWeight: 'bold', 
      color: isDark ? '#f1f5f9' : '#1f2937', 
      marginBottom: '20px',
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px', 
      borderBottom: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
      paddingBottom: '12px'
    },
    
    sectionDescription: {
      fontSize: '13px',
      color: isDark ? '#94a3b8' : '#6b7280',
      marginTop: '4px',
      fontWeight: 'normal'
    },
    
    profileContainer: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px', 
      marginBottom: '24px',
      padding: '20px',
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
      borderRadius: '8px',
      border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`
    },
    
    avatarContainer: {
      position: 'relative',
      display: 'inline-block'
    },
    
    avatar: {
      width: '100px', 
      height: '100px', 
      borderRadius: '50%', 
      backgroundColor: '#3b82f6',
      color: 'white', 
      fontSize: '40px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      cursor: 'pointer',
      border: `3px solid ${isDark ? '#334155' : '#e5e7eb'}`,
      transition: 'all 0.3s ease',
      fontWeight: 'bold'
    },
    
    avatarOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0,
      transition: 'opacity 0.3s',
      color: 'white',
      fontSize: '12px',
      textAlign: 'center',
      padding: '10px',
      fontWeight: '500'
    },
    
    imageActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '10px'
    },
    
    imageButton: {
      padding: '8px 16px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontWeight: '500'
    },
    
    imageButtonRemove: {
      backgroundColor: '#ef4444'
    },
    
    row: { 
      marginBottom: '20px', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: `1px solid ${isDark ? '#334155' : '#f3f4f6'}`
    },
    
    rowLast: {
      borderBottom: 'none'
    },
    
    labelContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      flex: 1
    },
    
    label: { 
      fontSize: '14px', 
      fontWeight: '500', 
      color: isDark ? '#f1f5f9' : '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    
    labelDescription: {
      fontSize: '12px',
      color: isDark ? '#94a3b8' : '#6b7280',
      fontWeight: 'normal',
      marginTop: '2px'
    },
    
    input: {
      padding: '10px 12px', 
      borderRadius: '6px', 
      border: `1px solid ${isDark ? '#334155' : '#d1d5db'}`,
      fontSize: '14px', 
      width: '300px',
      backgroundColor: isDark ? '#0f172a' : 'white',
      color: isDark ? '#f1f5f9' : '#374151',
      transition: 'all 0.2s ease'
    },
    
    select: {
      padding: '10px 12px', 
      borderRadius: '6px', 
      border: `1px solid ${isDark ? '#334155' : '#d1d5db'}`,
      fontSize: '14px', 
      minWidth: '200px',
      backgroundColor: isDark ? '#0f172a' : 'white',
      color: isDark ? '#f1f5f9' : '#374151',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },

    toggle: (active) => ({
      width: '48px', 
      height: '24px', 
      borderRadius: '12px',
      backgroundColor: active ? '#3b82f6' : (isDark ? '#334155' : '#e5e7eb'),
      position: 'relative', 
      cursor: 'pointer', 
      transition: 'all 0.3s ease',
      flexShrink: 0
    }),
    
    toggleCircle: (active) => ({
      width: '18px', 
      height: '18px', 
      borderRadius: '50%', 
      backgroundColor: 'white',
      position: 'absolute', 
      top: '3px', 
      left: active ? '27px' : '3px',
      transition: 'all 0.3s ease', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }),

    testButton: {
      padding: '6px 12px',
      backgroundColor: isDark ? '#334155' : '#e5e7eb',
      color: isDark ? '#f1f5f9' : '#374151',
      border: 'none',
      borderRadius: '6px',
      fontSize: '11px',
      cursor: 'pointer',
      marginLeft: '8px',
      transition: 'all 0.2s ease',
      fontWeight: '500'
    },

    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '8px'
    },

    saveBtn: {
      padding: '12px 24px', 
      backgroundColor: '#3b82f6', 
      color: 'white',
      border: 'none', 
      borderRadius: '8px', 
      fontSize: '16px', 
      fontWeight: '500',
      cursor: 'pointer', 
      opacity: saving ? 0.7 : 1,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },

    resetBtn: {
      padding: '12px 24px', 
      backgroundColor: isDark ? '#334155' : '#e5e7eb', 
      color: isDark ? '#f1f5f9' : '#374151',
      border: 'none', 
      borderRadius: '8px', 
      fontSize: '16px', 
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    
    badge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      marginLeft: '8px'
    },
    
    badgeRecommended: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    
    badgeNew: {
      backgroundColor: '#dbeafe',
      color: '#1e40af'
    },
    
    hiddenFileInput: {
      display: 'none'
    },

    infoBox: {
      backgroundColor: isDark ? '#0f172a' : '#eff6ff',
      border: `1px solid ${isDark ? '#1e40af' : '#bfdbfe'}`,
      borderRadius: '8px',
      padding: '12px 16px',
      marginTop: '16px',
      fontSize: '13px',
      color: isDark ? '#93c5fd' : '#1e40af',
      display: 'flex',
      alignItems: 'start',
      gap: '8px'
    },
    
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      color: '#6b7280'
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
             <Link href="/dashboard" style={styles.navLink}> 
               <span style={styles.navIcon}>🏠</span> Dashboard 
             </Link>
          </li>
          <li style={styles.navItem}>
             <Link href="/tasks" style={styles.navLink}> 
               <span style={styles.navIcon}>📝</span> Tugas 
             </Link>
          </li>
          <li style={styles.navItem}>
             <Link href="/notifications" style={styles.navLink}> 
               <span style={styles.navIcon}>⭐</span> Pengingat 
             </Link>
          </li>
          <li style={styles.navItem}>
             <Link href="/laporan" style={styles.navLink}> 
               <span style={styles.navIcon}>📊</span> Laporan 
             </Link>
          </li>
          <li style={styles.navItem}>
             <button style={{...styles.navLink, ...styles.navLinkActive}}> 
               <span style={styles.navIcon}>⚙️</span> Pengaturan 
             </button>
          </li>
          <li style={styles.navItem}>
             <button onClick={handleLogout} style={styles.navLink}> 
               <span style={styles.navIcon}>🚪</span> Logout 
             </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
            <h1 style={styles.welcomeTitle}>Pengaturan</h1>
            <p style={styles.welcomeSubtitle}>Kelola profil dan preferensi aplikasi Anda</p>
        </div>

        {/* 1. Profil Section */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              👤 Profil Pengguna
              <span style={styles.sectionDescription}>Informasi personal dan foto profil</span>
            </h2>
            
            <div style={styles.profileContainer}>
                <div style={styles.avatarContainer}>
                    <div 
                        style={{
                            ...styles.avatar,
                            backgroundImage: profileImage ? `url(${profileImage})` : 'none'
                        }}
                        onClick={triggerFileInput}
                        onMouseEnter={(e) => {
                            const overlay = e.currentTarget.querySelector('.avatar-overlay');
                            if (overlay) overlay.style.opacity = 1;
                        }}
                        onMouseLeave={(e) => {
                            const overlay = e.currentTarget.querySelector('.avatar-overlay');
                            if (overlay) overlay.style.opacity = 0;
                        }}
                    >
                        {!profileImage && (profileName ? profileName.charAt(0).toUpperCase() : "U")}
                        <div className="avatar-overlay" style={styles.avatarOverlay}>
                            {uploadingImage ? '⏳ Mengupload...' : '📷 Klik untuk ubah'}
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={styles.hiddenFileInput}
                    />
                </div>
                <div style={{flex: 1}}>
                    <h3 style={{margin: '0 0 4px 0', fontSize: '18px', color: isDark ? '#f1f5f9' : '#1f2937'}}>
                        {profileName}
                    </h3>
                    <p style={{margin: '0 0 12px 0', color: isDark ? '#94a3b8' : '#6b7280', fontSize: '14px'}}>
                        {profileEmail}
                    </p>
                    <div style={styles.imageActions}>
                        <button 
                            onClick={triggerFileInput} 
                            style={styles.imageButton}
                            disabled={uploadingImage}
                            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.target.style.opacity = '1'}
                        >
                            {uploadingImage ? 'Mengupload...' : 'Upload Foto'}
                        </button>
                        {profileImage && (
                            <button 
                                onClick={removeProfileImage} 
                                style={{...styles.imageButton, ...styles.imageButtonRemove}}
                                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                                onMouseLeave={(e) => e.target.style.opacity = '1'}
                            >
                                Hapus Foto
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Nama Lengkap</label>
                  <span style={styles.labelDescription}>Nama yang akan ditampilkan di aplikasi</span>
                </div>
                <input 
                    type="text" 
                    value={profileName} 
                    onChange={(e) => setProfileName(e.target.value)}
                    style={styles.input} 
                    placeholder="Masukkan nama lengkap"
                />
            </div>
            
            <div style={{...styles.row, ...styles.rowLast}}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Email Address</label>
                  <span style={styles.labelDescription}>Email untuk notifikasi dan pemulihan akun</span>
                </div>
                <input 
                    type="email" 
                    value={profileEmail} 
                    onChange={(e) => setProfileEmail(e.target.value)}
                    style={styles.input} 
                    placeholder="email@example.com"
                />
            </div>
        </div>

        {/* 2. Tampilan & Tema */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              🎨 Tampilan & Tema
              <span style={styles.sectionDescription}>Sesuaikan tampilan aplikasi dengan preferensi Anda</span>
            </h2>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>
                    Mode Tema
                    <span style={{...styles.badge, ...styles.badgeNew}}>NEW</span>
                  </label>
                  <span style={styles.labelDescription}>Pilih tema terang atau gelap</span>
                </div>
                <select 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)}
                    style={styles.select}
                >
                    <option value="light">☀️ Terang</option>
                    <option value="dark">🌙 Gelap</option>
                    <option value="auto">🔄 Otomatis (Sistem)</option>
                </select>
            </div>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Ukuran Teks</label>
                  <span style={styles.labelDescription}>Sesuaikan ukuran font untuk kemudahan baca</span>
                </div>
                <select 
                    value={fontSize} 
                    onChange={(e) => setFontSize(e.target.value)}
                    style={styles.select}
                >
                    <option value="small">🔤 Kecil (14px)</option>
                    <option value="medium">🔤 Sedang (16px)</option>
                    <option value="large">🔤 Besar (18px)</option>
                </select>
            </div>
            
            <div style={{...styles.row, ...styles.rowLast}}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Animasi</label>
                  <span style={styles.labelDescription}>Aktifkan animasi transisi halus</span>
                </div>
                <div style={styles.toggle(toggles.enableAnimations)} onClick={() => toggleSetting('enableAnimations')}>
                    <div style={styles.toggleCircle(toggles.enableAnimations)}></div>
                </div>
            </div>
        </div>

        {/* 3. Preferensi Aplikasi */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              ⚙️ Preferensi Aplikasi
              <span style={styles.sectionDescription}>Pengaturan umum dan default view</span>
            </h2>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Bahasa / Language</label>
                  <span style={styles.labelDescription}>Pilih bahasa tampilan aplikasi</span>
                </div>
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
                <div style={styles.labelContainer}>
                  <label style={styles.label}>
                    Tampilan Default
                    <span style={{...styles.badge, ...styles.badgeNew}}>NEW</span>
                  </label>
                  <span style={styles.labelDescription}>Pilih tampilan default saat membuka tugas</span>
                </div>
                <select 
                    value={defaultView} 
                    onChange={(e) => setDefaultView(e.target.value)}
                    style={styles.select}
                >
                    <option value="list">📋 List View</option>
                    <option value="grid">🔲 Grid View</option>
                    <option value="kanban">📊 Kanban Board</option>
                </select>
            </div>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Urutan Default</label>
                  <span style={styles.labelDescription}>Urutkan tugas berdasarkan</span>
                </div>
                <select 
                    value={defaultSort} 
                    onChange={(e) => setDefaultSort(e.target.value)}
                    style={styles.select}
                >
                    <option value="dueDate">📅 Tanggal Jatuh Tempo</option>
                    <option value="priority">⭐ Prioritas</option>
                    <option value="createdAt">🕐 Tanggal Dibuat</option>
                    <option value="alphabetical">🔤 Abjad</option>
                </select>
            </div>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Format Waktu</label>
                  <span style={styles.labelDescription}>Format tampilan jam</span>
                </div>
                <select 
                    value={timeFormat} 
                    onChange={(e) => setTimeFormat(e.target.value)}
                    style={styles.select}
                >
                    <option value="24h">🕐 24 Jam (14:00)</option>
                    <option value="12h">🕐 12 Jam (2:00 PM)</option>
                </select>
            </div>
            
            <div style={{...styles.row, ...styles.rowLast}}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Mulai Minggu Pada</label>
                  <span style={styles.labelDescription}>Hari pertama di kalender</span>
                </div>
                <select 
                    value={weekStartsOn} 
                    onChange={(e) => setWeekStartsOn(e.target.value)}
                    style={styles.select}
                >
                    <option value="monday">Senin</option>
                    <option value="sunday">Minggu</option>
                </select>
            </div>
        </div>

        {/* 4. Produktivitas */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              💾 Produktivitas
              <span style={styles.sectionDescription}>Fitur untuk meningkatkan efisiensi kerja</span>
            </h2>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>
                    Auto Save
                    <span style={{...styles.badge, ...styles.badgeRecommended}}>RECOMMENDED</span>
                  </label>
                  <span style={styles.labelDescription}>Simpan perubahan secara otomatis</span>
                </div>
                <div style={styles.toggle(toggles.autoSave)} onClick={() => toggleSetting('autoSave')}>
                    <div style={styles.toggleCircle(toggles.autoSave)}></div>
                </div>
            </div>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Tampilkan Tugas Selesai</label>
                  <span style={styles.labelDescription}>Lihat tugas yang sudah diselesaikan</span>
                </div>
                <div style={styles.toggle(toggles.showCompletedTasks)} onClick={() => toggleSetting('showCompletedTasks')}>
                    <div style={styles.toggleCircle(toggles.showCompletedTasks)}></div>
                </div>
            </div>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>
                    Keyboard Shortcuts
                    <span style={{...styles.badge, ...styles.badgeRecommended}}>RECOMMENDED</span>
                  </label>
                  <span style={styles.labelDescription}>Gunakan pintasan keyboard (Ctrl+N, Ctrl+S, dll)</span>
                </div>
                <div style={styles.toggle(toggles.keyboardShortcuts)} onClick={() => toggleSetting('keyboardShortcuts')}>
                    <div style={styles.toggleCircle(toggles.keyboardShortcuts)}></div>
                </div>
            </div>
            
            <div style={{...styles.row, ...styles.rowLast}}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>
                    Tampilkan Jumlah Tugas
                    <span style={{...styles.badge, ...styles.badgeNew}}>NEW</span>
                  </label>
                  <span style={styles.labelDescription}>Lihat counter jumlah tugas di sidebar</span>
                </div>
                <div style={styles.toggle(toggles.showTaskCount)} onClick={() => toggleSetting('showTaskCount')}>
                    <div style={styles.toggleCircle(toggles.showTaskCount)}></div>
                </div>
            </div>
            
            <div style={styles.infoBox}>
              <span>💡</span>
              <div>
                <strong>Tips:</strong> Aktifkan Auto Save dan Keyboard Shortcuts untuk meningkatkan produktivitas hingga 50%!
              </div>
            </div>
        </div>

        {/* 5. Notifikasi & Pengingat */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              🔔 Notifikasi & Pengingat
              <span style={styles.sectionDescription}>Atur cara aplikasi mengingatkan Anda</span>
            </h2>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>
                    Notifikasi Browser (Push)
                    <button 
                        onClick={testNotification} 
                        style={styles.testButton}
                        onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#475569' : '#d1d5db'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = isDark ? '#334155' : '#e5e7eb'}
                    >
                        🧪 Test
                    </button>
                  </label>
                  <span style={styles.labelDescription}>Terima notifikasi meskipun tab tertutup</span>
                </div>
                <div style={styles.toggle(toggles.pushNotifications)} onClick={() => toggleSetting('pushNotifications')}>
                    <div style={styles.toggleCircle(toggles.pushNotifications)}></div>
                </div>
            </div>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Notifikasi Email</label>
                  <span style={styles.labelDescription}>Kirim ringkasan harian ke email</span>
                </div>
                <div style={styles.toggle(toggles.emailNotifications)} onClick={() => toggleSetting('emailNotifications')}>
                    <div style={styles.toggleCircle(toggles.emailNotifications)}></div>
                </div>
            </div>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>
                    Pengingat Tugas
                    <span style={{...styles.badge, ...styles.badgeRecommended}}>RECOMMENDED</span>
                  </label>
                  <span style={styles.labelDescription}>Ingatkan saat tugas akan datang</span>
                </div>
                <div style={styles.toggle(toggles.taskReminders)} onClick={() => toggleSetting('taskReminders')}>
                    <div style={styles.toggleCircle(toggles.taskReminders)}></div>
                </div>
            </div>
            
            <div style={{...styles.row, ...styles.rowLast}}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Alert Deadline</label>
                  <span style={styles.labelDescription}>Notifikasi khusus untuk tugas yang hampir deadline</span>
                </div>
                <div style={styles.toggle(toggles.dueDateAlerts)} onClick={() => toggleSetting('dueDateAlerts')}>
                    <div style={styles.toggleCircle(toggles.dueDateAlerts)}></div>
                </div>
            </div>
        </div>

        {/* 6. Audio & Feedback */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              🔊 Audio & Feedback
              <span style={styles.sectionDescription}>Pengaturan suara dan efek visual</span>
            </h2>
            
            <div style={{...styles.row, ...styles.rowLast}}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>
                    Efek Suara
                    <button 
                        onClick={testSound} 
                        style={styles.testButton}
                        onMouseEnter={(e) => e.target.style.backgroundColor = isDark ? '#475569' : '#d1d5db'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = isDark ? '#334155' : '#e5e7eb'}
                    >
                        🧪 Test
                    </button>
                  </label>
                  <span style={styles.labelDescription}>Mainkan suara saat menyelesaikan tugas</span>
                </div>
                <div style={styles.toggle(toggles.enableSounds)} onClick={() => toggleSetting('enableSounds')}>
                    <div style={styles.toggleCircle(toggles.enableSounds)}></div>
                </div>
            </div>
            
            <div style={styles.infoBox}>
              <span>🎵</span>
              <div>
                <strong>Catatan:</strong> Efek suara dapat mengganggu di lingkungan kerja. Pastikan volume perangkat Anda sesuai.
              </div>
            </div>
        </div>

        {/* 7. Privacy & Data */}
        <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              🔒 Privacy & Data
              <span style={styles.sectionDescription}>Kontrol data dan privasi Anda</span>
            </h2>
            
            <div style={styles.row}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Analytics</label>
                  <span style={styles.labelDescription}>Bantu kami meningkatkan aplikasi dengan data anonim</span>
                </div>
                <div style={styles.toggle(toggles.analytics)} onClick={() => toggleSetting('analytics')}>
                    <div style={styles.toggleCircle(toggles.analytics)}></div>
                </div>
            </div>
            
            <div style={{...styles.row, ...styles.rowLast}}>
                <div style={styles.labelContainer}>
                  <label style={styles.label}>Share Usage Data</label>
                  <span style={styles.labelDescription}>Bagikan data penggunaan untuk riset produk</span>
                </div>
                <div style={styles.toggle(toggles.shareUsageData)} onClick={() => toggleSetting('shareUsageData')}>
                    <div style={styles.toggleCircle(toggles.shareUsageData)}></div>
                </div>
            </div>
            
            <div style={styles.infoBox}>
              <span>🔐</span>
              <div>
                <strong>Privasi Anda Terlindungi:</strong> Data Anda dienkripsi dan tidak akan dibagikan ke pihak ketiga tanpa izin.
              </div>
            </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.buttonGroup}>
            <button 
                onClick={resetToDefaults} 
                style={styles.resetBtn}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = isDark ? '#475569' : '#d1d5db';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = isDark ? '#334155' : '#e5e7eb';
                }}
            >
                🔄 Reset ke Default
            </button>
            <button 
                onClick={saveSettings} 
                style={styles.saveBtn}
                disabled={saving || uploadingImage}
                onMouseEnter={(e) => {
                    if (!saving && !uploadingImage) {
                        e.target.style.backgroundColor = '#2563eb';
                        e.target.style.transform = 'translateY(-1px)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!saving && !uploadingImage) {
                        e.target.style.backgroundColor = '#3b82f6';
                        e.target.style.transform = 'translateY(0)';
                    }
                }}
            >
                {saving ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
        </div>

      </div>
    </div>
  );
}