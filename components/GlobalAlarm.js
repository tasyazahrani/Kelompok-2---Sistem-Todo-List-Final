"use client";

import { useState, useEffect, useRef } from "react";

// KOMPONEN GLOBAL ALARM - Letakkan di layout.js atau _app.js
export default function GlobalAlarm() {
  const [reminders, setReminders] = useState([]);
  const [showAlarmModal, setShowAlarmModal] = useState(false);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const audioRef = useRef(null);
  const checkIntervalRef = useRef(null);

  // Setup Audio dan Request Permission
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
      audioRef.current.loop = true;
    }

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Fetch reminders dari ALL users (untuk sistem global)
  useEffect(() => {
    const fetchAllReminders = async () => {
      try {
        // Cek apakah ada user yang login
        const userStr = localStorage.getItem('currentUser');
        
        // JIKA TIDAK ADA USER LOGIN, ambil dari localStorage backup
        if (!userStr) {
          const backupReminders = localStorage.getItem('reminders_backup');
          if (backupReminders) {
            setReminders(JSON.parse(backupReminders));
          }
          return;
        }
        
        const user = JSON.parse(userStr);
        const userId = user._id || user.id;

        const res = await fetch(`/api/reminders?userId=${userId}`);
        if (!res.ok) return;
        
        const data = await res.json();
        if (data.success) {
          setReminders(data.reminders);
          // Backup reminders ke localStorage agar tetap ada setelah logout
          localStorage.setItem('reminders_backup', JSON.stringify(data.reminders));
        }
      } catch (error) {
        console.error("Gagal fetch reminders:", error);
      }
    };

    fetchAllReminders();
    
    // Refresh reminders setiap 30 detik untuk update otomatis
    const refreshInterval = setInterval(fetchAllReminders, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Logika Alarm - Cek setiap detik
  useEffect(() => {
    checkIntervalRef.current = setInterval(() => {
      if (!reminders.length || showAlarmModal) return;
      
      const now = new Date();
      
      for (const rem of reminders) {
        // Skip jika alarm sudah triggered
        const triggeredKey = `alarm_triggered_${rem._id}`;
        if (localStorage.getItem(triggeredKey)) continue;

        const remTime = new Date(rem.datetime);
        const diff = now - remTime;

        // Trigger jika waktunya tepat (dalam range 1 menit)
        if (diff >= 0 && diff < 60000) {
          triggerAlarm(rem);
          break; // Hanya trigger 1 alarm pada satu waktu
        }
      }
    }, 1000);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [reminders, showAlarmModal]);

  const triggerAlarm = (reminder) => {
    // Tandai alarm ini sudah triggered SEBELUM menampilkan modal
    const triggeredKey = `alarm_triggered_${reminder._id}`;
    localStorage.setItem(triggeredKey, Date.now().toString());

    // Update state reminders agar alarm ini ditandai
    setReminders(prev => prev.map(r => 
      r._id === reminder._id ? { ...r, isTriggered: true } : r
    ));

    // Play audio
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio autoplay blocked", e));
    }

    // Show browser notification
    if (Notification.permission === "granted") {
      new Notification("⏰ WAKTUNYA TUGAS!", { 
        body: reminder.title,
        icon: "https://cdn-icons-png.flaticon.com/512/3502/3502601.png",
        requireInteraction: true // Notification tidak hilang otomatis
      });
    }

    setActiveAlarm(reminder);
    setShowAlarmModal(true);
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowAlarmModal(false);
    setActiveAlarm(null);
  };

  const formatDateTime = (isoString) => {
    const d = new Date(isoString);
    return {
      date: d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }),
      time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const styles = {
    modalOverlay: { 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      backdropFilter: 'blur(4px)',
      animation: 'fadeIn 0.3s ease-in'
    },
    modalContent: { 
      backgroundColor: 'white', padding: '40px', borderRadius: '20px', 
      width: '450px', maxWidth: '90%', 
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      textAlign: 'center', borderTop: '8px solid #ef4444',
      animation: 'slideUp 0.3s ease-out'
    },
    alarmIcon: { 
      fontSize: '80px', marginBottom: '20px',
      animation: 'shake 0.5s infinite'
    },
    title: { 
      color: '#1e293b', margin: '0 0 12px 0', 
      fontSize: '28px', fontWeight: 'bold'
    },
    subtitle: { 
      color: '#ef4444', margin: 0, fontSize: '24px', 
      fontWeight: '600', marginBottom: '8px'
    },
    time: { 
      color: '#64748b', marginTop: '12px', fontSize: '16px'
    },
    stopBtn: { 
      padding: '16px 48px', backgroundColor: '#ef4444', 
      color: 'white', border: 'none', borderRadius: '50px', 
      fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', 
      marginTop: '32px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    }
  };

  // Jangan render apa-apa jika tidak ada alarm aktif
  if (!showAlarmModal || !activeAlarm) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
      `}</style>

      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <div style={styles.alarmIcon}>⏰</div>
          <h1 style={styles.title}>ALARM BERBUNYI!</h1>
          <h2 style={styles.subtitle}>{activeAlarm.title}</h2>
          <p style={styles.time}>
            🕐 {formatDateTime(activeAlarm.datetime).time}
          </p>
          <p style={{...styles.time, marginTop: '8px'}}>
            📅 {formatDateTime(activeAlarm.datetime).date}
          </p>
          <button 
            style={styles.stopBtn} 
            onClick={stopAlarm}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#dc2626';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.transform = 'scale(1)';
            }}
          >
            🔕 MATIKAN ALARM
          </button>
        </div>
      </div>
    </>
  );
}