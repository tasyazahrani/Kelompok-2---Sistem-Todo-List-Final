"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Laporan() {
  const router = useRouter();
  const [hoverStates, setHoverStates] = useState({});

  // Fungsi Helper untuk Hover
  const handleMouseEnter = (key) => {
    setHoverStates((prev) => ({ ...prev, [key]: true }));
  };

  const handleMouseLeave = (key) => {
    setHoverStates((prev) => ({ ...prev, [key]: false }));
  };

  // Fungsi Export
  const exportReport = () => {
    alert("Export laporan berhasil 🚀 (File PDF/Excel sedang diunduh...)");
  };

  // --- STYLING (Disamakan dengan gaya projectmu) ---
  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      backgroundColor: "#f4f7fa",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    // Sidebar Styles
    sidebar: {
      width: "260px",
      backgroundColor: "#ffffff",
      boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      height: "100vh",
      zIndex: 100,
    },
    logoSection: {
      padding: "24px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      borderBottom: "1px solid #eee",
    },
    logo: {
      width: "32px",
      height: "32px",
      color: "#2563eb",
    },
    appName: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#1e293b",
    },
    navMenu: {
      listStyle: "none",
      padding: "20px 12px",
      margin: 0,
    },
    navItem: {
      marginBottom: "8px",
    },
    navLink: (isActive) => ({
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      borderRadius: "8px",
      textDecoration: "none",
      color: isActive ? "#2563eb" : "#64748b",
      backgroundColor: isActive ? "#eff6ff" : "transparent",
      fontWeight: isActive ? "600" : "500",
      transition: "all 0.2s",
    }),
    
    // Main Content Styles
    mainContent: {
      flex: 1,
      marginLeft: "260px", // Offset width sidebar
      padding: "32px",
      overflowY: "auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "32px",
    },
    welcomeText: {
      h1: { fontSize: "28px", color: "#1e293b", margin: "0 0 8px 0" },
      p: { color: "#64748b", margin: 0 },
    },
    exportBtn: {
      backgroundColor: "#2563eb",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "background 0.2s",
    },

    // Progress Section
    progressOverview: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "24px",
      marginBottom: "32px",
    },
    progressCard: {
      backgroundColor: "white",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
      textAlign: "center",
    },
    circularProgress: (color = "#2563eb", percent = 60) => ({
      width: "120px",
      height: "120px",
      borderRadius: "50%",
      background: `conic-gradient(${color} ${percent * 3.6}deg, #e2e8f0 0deg)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 16px",
      position: "relative",
    }),
    innerCircle: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      backgroundColor: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      fontWeight: "bold",
      color: "#1e293b",
    },
    progressTitle: { margin: "0 0 4px 0", fontSize: "18px", color: "#1e293b" },
    progressSubtitle: { margin: 0, color: "#64748b", fontSize: "14px" },

    // Stats Grid
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "24px",
      marginBottom: "32px",
    },
    statCard: {
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
    },
    statIcon: { fontSize: "24px", padding: "12px", borderRadius: "50%", background: "#f1f5f9" },
    statNumber: { fontSize: "32px", fontWeight: "bold", color: "#1e293b" },
    statLabel: { color: "#64748b", fontSize: "14px" },

    // Section Titles
    sectionTitle: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "20px",
      fontWeight: "bold",
      color: "#1e293b",
      marginBottom: "24px",
    },

    // Timeline
    timelineSection: {
      backgroundColor: "white",
      padding: "32px",
      borderRadius: "16px",
      marginBottom: "32px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
    },
    timelineItem: {
      display: "flex",
      gap: "20px",
      marginBottom: "24px",
      position: "relative",
    },
    timelineContent: {
      flex: 1,
      paddingBottom: "24px",
      borderBottom: "1px solid #f1f5f9",
    },
    progressBarContainer: {
      height: "8px",
      backgroundColor: "#e2e8f0",
      borderRadius: "4px",
      marginTop: "12px",
      overflow: "hidden",
    },
    progressBar: (width, color) => ({
      height: "100%",
      width: width,
      backgroundColor: color,
      borderRadius: "4px",
    }),

    // Recent Activity
    activityList: {
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "24px",
    },
    activityItem: {
      display: "flex",
      gap: "16px",
      padding: "16px 0",
      borderBottom: "1px solid #f1f5f9",
    },
  };

  return (
    <div style={styles.container}>
      {/* --- SIDEBAR --- */}
      <div style={styles.sidebar}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <div style={styles.appName}>TaskFlow</div>
        </div>

        <ul style={styles.navMenu}>
          <li style={styles.navItem}>
            <Link href="/dashboard" style={styles.navLink(false)}>
              <span>🏠</span> Dashboard
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/tasks" style={styles.navLink(false)}>
              <span>📝</span> Tugas
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/notifikasi" style={styles.navLink(false)}>
              <span>⭐</span> Pengingat
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/laporan" style={styles.navLink(true)}>
              <span>📊</span> Laporan
            </Link>
          </li>
          <li style={styles.navItem}>
            <Link href="/pengaturan" style={styles.navLink(false)}>
              <span>⚙️</span> Pengaturan
            </Link>
          </li>
          <li style={{...styles.navItem, marginTop: "auto" }}>
            <Link href="/login" style={{...styles.navLink(false), color: '#ef4444'}}>
              <span>🚪</span> Logout
            </Link>
          </li>
        </ul>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main style={styles.mainContent}>
        
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.welcomeText}>
            <h1 style={styles.welcomeText.h1}>Laporan Kemajuan</h1>
            <p style={styles.welcomeText.p}>Pantau progress tugas akhir Anda secara real-time</p>
          </div>
          <button 
            style={styles.exportBtn} 
            onClick={exportReport}
            onMouseOver={(e) => e.target.style.opacity = "0.9"}
            onMouseOut={(e) => e.target.style.opacity = "1"}
          >
            📥 Export Laporan
          </button>
        </header>

        {/* Progress Overview (Donut Charts) */}
        <div style={styles.progressOverview}>
          <div style={styles.progressCard}>
            <div style={styles.circularProgress("#2563eb", 60)}>
              <div style={styles.innerCircle}>60%</div>
            </div>
            <h3 style={styles.progressTitle}>Progress Keseluruhan</h3>
            <p style={styles.progressSubtitle}>12 dari 20 tugas selesai</p>
          </div>

          <div style={styles.progressCard}>
            <div style={styles.circularProgress("#26de81", 80)}>
              <div style={styles.innerCircle}>80%</div>
            </div>
            <h3 style={styles.progressTitle}>Milestone Tercapai</h3>
            <p style={styles.progressSubtitle}>4 dari 5 milestone</p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, color: '#26de81'}}>✅</div>
            <div style={styles.statNumber}>12</div>
            <div style={styles.statLabel}>Tugas Selesai</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, color: '#f1c40f'}}>⏳</div>
            <div style={styles.statNumber}>3</div>
            <div style={styles.statLabel}>Sedang Dikerjakan</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, color: '#3498db'}}>📝</div>
            <div style={styles.statNumber}>5</div>
            <div style={styles.statLabel}>Belum Dimulai</div>
          </div>
          <div style={styles.statCard}>
            <div style={{...styles.statIcon, color: '#e74c3c'}}>⚠️</div>
            <div style={styles.statNumber}>2</div>
            <div style={styles.statLabel}>Terlambat</div>
          </div>
        </div>

        {/* Timeline Section */}
        <div style={styles.sectionTitle}>
          <span>📈</span> Timeline Progress
        </div>

        <div style={styles.timelineSection}>
          {/* Timeline Item 1 */}
          <div style={styles.timelineItem}>
            <div style={{fontSize: '24px'}}>✅</div>
            <div style={styles.timelineContent}>
              <h3 style={{margin: '0 0 4px 0', fontSize: '16px'}}>Proposal Penelitian</h3>
              <p style={{margin: '0', color: '#64748b', fontSize: '14px'}}>Penyusunan dan pengajuan proposal</p>
              <div style={styles.progressBarContainer}>
                <div style={styles.progressBar('100%', '#26de81')}></div>
              </div>
              <div style={{fontSize: '12px', color: '#94a3b8', marginTop: '8px'}}>Selesai: 15 Januari 2025</div>
            </div>
          </div>

           {/* Timeline Item 2 */}
           <div style={styles.timelineItem}>
            <div style={{fontSize: '24px'}}>⏳</div>
            <div style={styles.timelineContent}>
              <h3 style={{margin: '0 0 4px 0', fontSize: '16px'}}>Pengumpulan Data</h3>
              <p style={{margin: '0', color: '#64748b', fontSize: '14px'}}>Proses pengambilan data lapangan</p>
              <div style={styles.progressBarContainer}>
                <div style={styles.progressBar('75%', '#f1c40f')}></div>
              </div>
              <div style={{fontSize: '12px', color: '#94a3b8', marginTop: '8px'}}>Target: 30 April 2025</div>
            </div>
          </div>

          {/* Timeline Item 3 */}
          <div style={{...styles.timelineItem, marginBottom: 0}}>
            <div style={{fontSize: '24px'}}>📝</div>
            <div style={{...styles.timelineContent, borderBottom: 'none'}}>
              <h3 style={{margin: '0 0 4px 0', fontSize: '16px'}}>Analisis Data</h3>
              <p style={{margin: '0', color: '#64748b', fontSize: '14px'}}>Pengolahan data penelitian</p>
              <div style={styles.progressBarContainer}>
                <div style={styles.progressBar('0%', '#e2e8f0')}></div>
              </div>
              <div style={{fontSize: '12px', color: '#94a3b8', marginTop: '8px'}}>Target: 31 Mei 2025</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={styles.sectionTitle}>
          <span>🕐</span> Aktivitas Terbaru
        </div>

        <div style={styles.activityList}>
          <div style={styles.activityItem}>
            <div style={{fontSize: '20px'}}>✅</div>
            <div>
              <div style={{fontWeight: '500', color: '#1e293b'}}>Menyelesaikan survei responden</div>
              <div style={{fontSize: '13px', color: '#94a3b8'}}>2 jam yang lalu</div>
            </div>
          </div>
          <div style={{...styles.activityItem, borderBottom: 'none', paddingBottom: 0}}>
            <div style={{fontSize: '20px'}}>💬</div>
            <div>
              <div style={{fontWeight: '500', color: '#1e293b'}}>Meeting dengan dosen pembimbing</div>
              <div style={{fontSize: '13px', color: '#94a3b8'}}>5 hari yang lalu</div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}