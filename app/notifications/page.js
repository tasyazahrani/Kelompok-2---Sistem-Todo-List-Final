"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Notifikasi() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal & Alarm
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const audioRef = useRef(null);

  // --- 1. SETUP AWAL ---
  useEffect(() => {
    // Setup Audio Alarm (Online URL)
    if (typeof window !== 'undefined') {
        audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audioRef.current.loop = true;
    }

    // Minta izin notifikasi
    if ("Notification" in window) {
      Notification.requestPermission();
    }

    const initPage = async () => {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) {
        router.push('/login');
        return;
      }
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      // Panggil fungsi fetch data
      await fetchReminders(user._id || user.id);
    };

    initPage();

    // Cleanup audio saat pindah halaman
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [router]);

  // --- 2. LOGIKA ALARM (Cek Tiap Detik) ---
  useEffect(() => {
    const checkAlarm = setInterval(() => {
      if (!reminders.length) return;
      const now = new Date();
      
      reminders.forEach((rem) => {
        if (rem.isTriggered) return; // Lewati jika sudah bunyi

        const remTime = new Date(rem.datetime);
        const diff = now - remTime; // Selisih waktu sekarang dengan jadwal

        // Jika waktu sekarang >= jadwal (dan lewatnya belum sampai 1 menit)
        if (diff >= 0 && diff < 60000 && !showAlarmModal) {
            triggerAlarm(rem);
        }
      });
    }, 1000);

    return () => clearInterval(checkAlarm);
  }, [reminders, showAlarmModal]);

  const triggerAlarm = (reminder) => {
    // Bunyi
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio autoplay blocked", e));
    }
    // Notifikasi Browser
    if (Notification.permission === "granted") {
        new Notification("⏰ WAKTUNYA TUGAS!", { body: reminder.title });
    }
    // Tampilkan Modal
    setActiveAlarm(reminder);
    setShowAlarmModal(true);

    // Update state lokal agar tidak bunyi lagi
    setReminders(prev => prev.map(r => r._id === reminder._id ? { ...r, isTriggered: true } : r));
  };

  const stopAlarm = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    setShowAlarmModal(false);
    setActiveAlarm(null);
  };

  // --- 3. CRUD OPERATION ---
  
  // Fetch Data (GET)
  const fetchReminders = async (userId) => {
    try {
      // INI PATH PENTING: Harus sesuai nama folder di API
      const res = await fetch(`/api/reminders?userId=${userId}`);
      
      if (!res.ok) {
        console.error("API Error:", res.status);
        return;
      }
      
      const data = await res.json();
      if (data.success) {
        setReminders(data.reminders);
      }
    } catch (error) {
      console.error("Gagal ambil data", error);
    } finally {
      setLoading(false);
    }
  };

  // Tambah Data (POST)
  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!date || !time || !title) return alert("Lengkapi data dulu ya!");

    const datetime = new Date(`${date}T${time}`);
    const userId = currentUser._id || currentUser.id;

    try {
        const res = await fetch('/api/reminders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userId, title, datetime })
        });
        
        if (!res.ok) throw new Error("Gagal menyimpan (Cek API)");

        const data = await res.json();
        
        if (data.success) {
            setReminders(prev => [...prev, data.reminder].sort((a,b) => new Date(a.datetime) - new Date(b.datetime)));
            setShowReminderModal(false);
            setTitle(""); setDate(""); setTime("");
            alert("✅ Pengingat berhasil dibuat!");
        }
    } catch (error) {
        alert("Gagal menyimpan: " + error.message);
    }
  };

  // Hapus Data (DELETE)
  const deleteReminder = async (id) => {
    if(!confirm("Yakin hapus pengingat ini?")) return;
    try {
        await fetch(`/api/reminders?id=${id}`, { method: 'DELETE' });
        setReminders(prev => prev.filter(r => r._id !== id));
    } catch (error) {
        alert("Gagal menghapus");
    }
  };

  // Helper Format Tanggal
  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    return {
        date: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
        time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // --- 4. STYLES (UI RAPI) ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
    
    // SIDEBAR FIX
    sidebar: { width: '280px', backgroundColor: '#1e293b', color: 'white', padding: '24px 0', position: 'fixed', height: '100vh', zIndex: 10 },
    logoSection: { 
        display: 'flex', alignItems: 'center', gap: '15px', // Jarak aman antar elemen
        padding: '0 24px 24px', borderBottom: '1px solid #334155' 
    },
    logoBox: { 
        width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '8px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
    },
    appName: { fontSize: '20px', fontWeight: 'bold', color: 'white', lineHeight: '1' },
    
    // NAVIGATION
    navMenu: { listStyle: 'none', padding: '24px 0', margin: 0 },
    navItem: { marginBottom: '8px' },
    navLink: (active) => ({
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
      color: active ? 'white' : '#cbd5e1', textDecoration: 'none', fontSize: '14px', 
      backgroundColor: active ? '#334155' : 'transparent', width: '100%', textAlign: 'left', 
      border: 'none', cursor: 'pointer', borderRight: active ? '3px solid #3b82f6' : '3px solid transparent'
    }),

    // MAIN CONTENT
    mainContent: { flex: 1, padding: '32px', marginLeft: '280px', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' },
    welcomeTitle: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' },
    welcomeSubtitle: { fontSize: '16px', color: '#6b7280', margin: 0 },
    
    card: { backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    reminderItem: { 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '16px', borderBottom: '1px solid #f1f5f9'
    },
    
    btnPrimary: { padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    btnDelete: { padding: '6px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight:'500' },
    
    // MODAL
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(2px)' },
    modalContent: { backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '400px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '8px', boxSizing: 'border-box', fontSize: '14px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
    
    alarmModal: { textAlign: 'center', borderTop: '8px solid #ef4444' },
    stopBtn: { padding: '14px 40px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '24px' }
  };

  if (loading) return <div style={{display:'flex', height:'100vh', justifyContent:'center', alignItems:'center', color:'#64748b'}}>Memuat Pengingat...</div>;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoSection}>
          <div style={styles.logoBox}>
            <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
            </svg>
          </div>
          <div style={styles.appName}>TaskFlow</div>
        </div>
        <ul style={styles.navMenu}>
          <li style={styles.navItem}><Link href="/dashboard" style={styles.navLink(false)}><span>🏠</span> Dashboard</Link></li>
          <li style={styles.navItem}><Link href="/tasks" style={styles.navLink(false)}><span>📝</span> Tugas</Link></li>
          <li style={styles.navItem}><button style={styles.navLink(true)}><span>⭐</span> Pengingat</button></li>
          <li style={styles.navItem}><Link href="/laporan" style={styles.navLink(false)}><span>📊</span> Laporan</Link></li>
          <li style={styles.navItem}><Link href="/pengaturan" style={styles.navLink(false)}><span>⚙️</span> Pengaturan</Link></li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.header}>
            <div>
                <h1 style={styles.welcomeTitle}>Pengingat</h1>
                <p style={styles.welcomeSubtitle}>Kelola jadwal alarm tugas Anda</p>
            </div>
            <button style={styles.btnPrimary} onClick={() => setShowReminderModal(true)}>
                <span>➕</span> Tambah
            </button>
        </div>

        <div style={styles.card}>
            <h3 style={{marginBottom: '24px', color: '#334155', fontSize: '18px'}}>📅 Jadwal Akan Datang</h3>
            {reminders.length === 0 ? (
                <div style={{textAlign:'center', padding:'40px 0', color:'#94a3b8'}}>
                    <div style={{fontSize:'40px', marginBottom:'10px'}}>🔕</div>
                    <p>Belum ada pengingat.</p>
                </div>
            ) : (
                reminders.map((rem) => {
                    const { date, time } = formatDateTime(rem.datetime);
                    const isPast = new Date(rem.datetime) < new Date();
                    return (
                        <div key={rem._id} style={{...styles.reminderItem, opacity: isPast ? 0.5 : 1}}>
                            <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                                <div style={{
                                    backgroundColor: isPast ? '#f1f5f9' : '#eff6ff', 
                                    padding: '12px 20px', borderRadius:'12px', textAlign:'center',
                                    color: isPast ? '#94a3b8' : '#3b82f6', minWidth: '80px'
                                }}>
                                    <div style={{fontWeight:'bold', fontSize:'18px'}}>{time}</div>
                                </div>
                                <div>
                                    <div style={{fontSize:'16px', fontWeight:'600', color:'#1e293b', marginBottom:'4px'}}>{rem.title}</div>
                                    <div style={{fontSize:'14px', color:'#64748b'}}>{date} {isPast ? '• Sudah Lewat' : ''}</div>
                                </div>
                            </div>
                            <button style={styles.btnDelete} onClick={() => deleteReminder(rem._id)}>Hapus</button>
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* MODAL TAMBAH */}
      {showReminderModal && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2 style={{marginTop:0, marginBottom:'24px', fontSize:'20px', color:'#1e293b'}}>🔔 Tambah Pengingat</h2>
                <form onSubmit={handleAddReminder}>
                    <div style={{marginBottom:'20px'}}>
                        <label style={styles.label}>Judul Kegiatan</label>
                        <input style={styles.input} value={title} onChange={e => setTitle(e.target.value)} required placeholder="Contoh: Submit Tugas" />
                    </div>
                    <div style={{display:'flex', gap:'16px'}}>
                        <div style={{marginBottom:'20px', flex:1}}>
                            <label style={styles.label}>Tanggal</label>
                            <input type="date" style={styles.input} value={date} onChange={e => setDate(e.target.value)} required />
                        </div>
                        <div style={{marginBottom:'20px', flex:1}}>
                            <label style={styles.label}>Jam</label>
                            <input type="time" style={styles.input} value={time} onChange={e => setTime(e.target.value)} required />
                        </div>
                    </div>
                    <div style={{display:'flex', gap:'12px', justifyContent:'flex-end', marginTop:'24px'}}>
                        <button type="button" onClick={() => setShowReminderModal(false)} style={{padding:'12px 24px', backgroundColor:'#f1f5f9', border:'none', borderRadius:'8px', cursor:'pointer', color:'#64748b', fontWeight:'600'}}>Batal</button>
                        <button type="submit" style={styles.btnPrimary}>Simpan</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* MODAL ALARM */}
      {showAlarmModal && activeAlarm && (
        <div style={{...styles.modalOverlay, backgroundColor: 'rgba(0,0,0,0.85)'}}>
            <div style={{...styles.modalContent, ...styles.alarmModal}}>
                <div style={{fontSize:'64px', marginBottom:'16px'}}>⏰</div>
                <h1 style={{color:'#1e293b', margin:'0 0 8px 0'}}>ALARM!</h1>
                <h2 style={{color: '#ef4444', margin:0, fontSize:'24px'}}>{activeAlarm.title}</h2>
                <p style={{color:'#64748b', marginTop:'8px'}}>Waktu: {formatDateTime(activeAlarm.datetime).time}</p>
                <button style={styles.stopBtn} onClick={stopAlarm}>🔕 MATIKAN ALARM</button>
            </div>
        </div>
      )}
    </div>
  );
}