"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Notifikasi() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // --- SETUP AWAL ---
  useEffect(() => {
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
  }, [router]);

  // --- CRUD OPERATION ---
  const fetchReminders = async (userId) => {
    try {
      const res = await fetch(`/api/reminders?userId=${userId}`);
      if (!res.ok) return;
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
        
        if (!res.ok) throw new Error("Gagal menyimpan");

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

  const deleteReminder = async (id) => {
    if(!confirm("Yakin hapus pengingat ini?")) return;
    try {
        await fetch(`/api/reminders?id=${id}`, { method: 'DELETE' });
        setReminders(prev => prev.filter(r => r._id !== id));
        // Hapus juga flag triggered dari localStorage
        localStorage.removeItem(`alarm_triggered_${id}`);
    } catch (error) {
        alert("Gagal menghapus");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    return {
        date: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
        time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  };

  // --- STYLES ---
  const styles = {
    container: { display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' },
    
    // SIDEBAR 
    sidebar: { width: '280px', backgroundColor: '#1e293b', color: 'white', padding: '24px 0', position: 'fixed', height: '100vh', zIndex: 10, overflowY: 'auto' },
    
    // LOGO SECTION
    logoSection: { 
        display: 'flex', alignItems: 'center', gap: '12px', 
        padding: '0 24px 24px', borderBottom: '1px solid #334155' 
    },
    logo: { 
        width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '8px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center' 
    },
    appName: { fontSize: '20px', fontWeight: 'bold' },

    // NAVIGATION
    navMenu: { listStyle: 'none', padding: '24px 0', margin: 0 },
    navItem: { marginBottom: '8px' },
    navLink: {
      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px',
      color: '#cbd5e1', textDecoration: 'none', fontSize: '14px', border: 'none',
      backgroundColor: 'transparent', width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit'
    },
    navLinkActive: {
      backgroundColor: '#334155', color: 'white', borderRight: '3px solid #3b82f6'
    },
    navIcon: { fontSize: '16px', width: '20px', textAlign: 'center' },

    // MAIN CONTENT
    mainContent: { flex: 1, padding: '24px', marginLeft: '280px', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '32px', alignItems: 'center' },
    welcomeTitle: { fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' },
    welcomeSubtitle: { fontSize: '16px', color: '#6b7280', margin: 0 },
    
    card: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    reminderItem: { 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '16px', borderBottom: '1px solid #f1f5f9'
    },
    
    btnPrimary: { padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
    btnDelete: { padding: '6px 12px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight:'500' },
    
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(2px)' },
    modalContent: { backgroundColor: 'white', padding: '32px', borderRadius: '16px', width: '400px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '8px', boxSizing: 'border-box', fontSize: '14px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#374151' }
  };

  if (loading) return <div style={{display:'flex', height:'100vh', justifyContent:'center', alignItems:'center', color:'#64748b'}}>Memuat Pengingat...</div>;

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
             <button style={{...styles.navLink, ...styles.navLinkActive}}>
                <span style={styles.navIcon}>⭐</span> Pengingat
             </button>
          </li>
          <li style={styles.navItem}>
             <Link href="/laporan" style={styles.navLink}>
                <span style={styles.navIcon}>📊</span> Laporan
             </Link>
          </li>
          <li style={styles.navItem}>
             <Link href="/pengaturan" style={styles.navLink}>
                <span style={styles.navIcon}>⚙️</span> Pengaturan
             </Link>
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
            <div>
                <h1 style={styles.welcomeTitle}>Pengingat</h1>
                <p style={styles.welcomeSubtitle}>Jangan lewatkan jadwal penting Anda</p>
            </div>
            <button style={styles.btnPrimary} onClick={() => setShowReminderModal(true)}>
                <span>➕</span> Tambah Pengingat
            </button>
        </div>

        <div style={styles.card}>
            <h3 style={{marginBottom: '24px', color: '#334155', fontSize: '18px'}}>📅 Jadwal & Alarm</h3>
            {reminders.length === 0 ? (
                <div style={{textAlign:'center', padding:'40px 0', color:'#94a3b8'}}>
                    <div style={{fontSize:'40px', marginBottom:'10px'}}>🔕</div>
                    <p>Belum ada pengingat.</p>
                </div>
            ) : (
                reminders.map((rem) => {
                    const { date, time } = formatDateTime(rem.datetime);
                    const isPast = new Date(rem.datetime) < new Date();
                    const isTriggered = localStorage.getItem(`alarm_triggered_${rem._id}`);
                    
                    return (
                        <div key={rem._id} style={{...styles.reminderItem, opacity: isPast || isTriggered ? 0.5 : 1}}>
                            <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                                <div style={{
                                    backgroundColor: isPast || isTriggered ? '#f1f5f9' : '#eff6ff', 
                                    padding: '12px 20px', borderRadius:'12px', textAlign:'center',
                                    color: isPast || isTriggered ? '#94a3b8' : '#3b82f6', minWidth: '80px'
                                }}>
                                    <div style={{fontWeight:'bold', fontSize:'18px'}}>{time}</div>
                                </div>
                                <div>
                                    <div style={{fontSize:'16px', fontWeight:'600', color:'#1e293b', marginBottom:'4px'}}>
                                        {rem.isTask ? "📝 " : ""}{rem.title}
                                    </div>
                                    <div style={{fontSize:'14px', color:'#64748b'}}>
                                        {date} 
                                        {isPast && ' • Sudah Lewat'}
                                        {isTriggered && !isPast && ' • Alarm Sudah Dibunyikan'}
                                    </div>
                                </div>
                            </div>
                            {!rem.isTask && (
                                <button style={styles.btnDelete} onClick={() => deleteReminder(rem._id)}>Hapus</button>
                            )}
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* MODAL TAMBAH REMINDER */}
      {showReminderModal && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <h2 style={{marginTop:0, marginBottom:'24px', fontSize:'20px', color:'#1e293b'}}>🔔 Tambah Pengingat</h2>
                <form onSubmit={handleAddReminder}>
                    <div style={{marginBottom:'20px'}}>
                        <label style={styles.label}>Judul Kegiatan</label>
                        <input style={styles.input} value={title} onChange={e => setTitle(e.target.value)} required placeholder="Contoh: Bangun Pagi" />
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
                        <button type="submit" style={styles.btnPrimary}>Simpan Jadwal</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}