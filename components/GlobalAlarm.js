"use client";

import { useState, useEffect, useRef } from "react";

export default function GlobalAlarm() {
  const [reminders, setReminders] = useState([]);
  const [activeAlarm, setActiveAlarm] = useState(null);
  const audioRef = useRef(null);

  // 1. Setup Audio & Fetch Data Awal
  useEffect(() => {
    // Setup Audio
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
      audioRef.current.loop = true;
    }

    // Request Izin Notifikasi Browser
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // Fungsi Ambil Data (Gabungan Tugas & Pengingat)
    const fetchReminders = async () => {
      const userStr = localStorage.getItem('currentUser');
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      try {
        // Panggil API yang sudah kita perbaiki sebelumnya
        const res = await fetch(`/api/reminders?userId=${user._id || user.id}`);
        const data = await res.json();
        if (data.success) {
          setReminders(data.reminders);
        }
      } catch (error) {
        console.error("Gagal load alarm background", error);
      }
    };

    // Ambil data pertama kali & update tiap 1 menit
    fetchReminders();
    const dataInterval = setInterval(fetchReminders, 60000);

    return () => clearInterval(dataInterval);
  }, []);

  // 2. Cek Waktu Setiap Detik
  useEffect(() => {
    const checkTimer = setInterval(() => {
      if (!reminders.length) return;
      
      const now = new Date();
      
      reminders.forEach(rem => {
        if (rem.isTriggered) return; // Skip kalau sudah bunyi

        const remTime = new Date(rem.datetime);
        const diff = now - remTime;

        // Jika waktu sekarang >= jadwal (toleransi telat 1 menit)
        // DAN belum ada alarm yang sedang aktif
        if (diff >= 0 && diff < 60000 && !activeAlarm) {
          triggerAlarm(rem);
        }
      });
    }, 1000);

    return () => clearInterval(checkTimer);
  }, [reminders, activeAlarm]);

  const triggerAlarm = (reminder) => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio blocked by browser", e));
    }
    if (Notification.permission === "granted") {
      new Notification("⏰ WAKTUNYA TUGAS!", { body: reminder.title });
    }
    setActiveAlarm(reminder);
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Update state lokal supaya tidak bunyi lagi
    setReminders(prev => prev.map(r => r._id === activeAlarm._id ? {...r, isTriggered: true} : r));
    setActiveAlarm(null);
  };

  // Kalau tidak ada alarm, komponen ini "Invisible"
  if (!activeAlarm) return null;

  // Tampilan Layar Merah saat Alarm Bunyi
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={{fontSize: '80px', animation: 'shake 0.5s infinite'}}>⏰</div>
        <h1 style={{color: '#fff', margin: '20px 0'}}>ALARM TUGAS!</h1>
        <h2 style={{color: '#fee2e2', background: 'rgba(0,0,0,0.3)', padding: '10px 20px', borderRadius: '10px'}}>
          {activeAlarm.title}
        </h2>
        <button onClick={stopAlarm} style={styles.button}>
          🔕 MATIKAN SAYA
        </button>
      </div>
      {/* Animasi getar */}
      <style jsx>{`
        @keyframes shake {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-10deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(220, 38, 38, 0.95)', // Layar Merah Full
    zIndex: 9999, // Paling depan di atas segalanya
    display: 'flex', justifyContent: 'center', alignItems: 'center'
  },
  modal: {
    textAlign: 'center', color: 'white', fontFamily: 'system-ui, sans-serif'
  },
  button: {
    marginTop: '30px', padding: '15px 50px', fontSize: '20px', fontWeight: 'bold',
    color: '#dc2626', backgroundColor: 'white', border: 'none', borderRadius: '50px',
    cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    transition: 'transform 0.1s'
  }
};