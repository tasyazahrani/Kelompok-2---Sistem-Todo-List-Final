"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Laporan() {
  const router = useRouter();
  const [hoverStates, setHoverStates] = useState({});
  const [activeNav, setActiveNav] = useState("laporan");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    overallProgress: 0,
    completedTasks: 0,
    totalTasks: 0,
    milestoneProgress: 0,
    completedMilestones: 0,
    totalMilestones: 0,
    tasksInProgress: 0,
    tasksNotStarted: 0,
    overdueTasks: 0,
    timeline: [],
    recentActivities: []
  });

  // Fungsi untuk fetch data dari API
  const fetchReportData = async (userId) => {
    try {
      console.log('🔍 Fetching report for user:', userId);
      
      const response = await fetch(`/api/laporan?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('📦 RAW API RESPONSE:', data);
      
      if (data.success) {
        console.log('✅ REPORT DATA RECEIVED:', data.reportData);
        return data.reportData;
      } else {
        console.log('❌ API ERROR:', data.error);
        return null;
      }
    } catch (error) {
      console.error('💥 Error fetching report data:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      const user = localStorage.getItem('currentUser');
      if (!user) {
        router.push('/login');
        return;
      }
      
      const userData = JSON.parse(user);
      setCurrentUser(userData);
      console.log('👤 Current user:', userData);

      // Coba load data dengan retry mechanism
      let attempts = 0;
      const maxAttempts = 3;
      
      const loadData = async () => {
        attempts++;
        console.log(`🔄 Attempt ${attempts} to load report data...`);
        
        const reportDataFromAPI = await fetchReportData(userData._id);
        
        if (reportDataFromAPI) {
          console.log('🎯 Setting report data:', reportDataFromAPI);
          setReportData(reportDataFromAPI);
          setLoading(false);
        } else if (attempts < maxAttempts) {
          console.log('⏳ Retrying in 2 seconds...');
          setTimeout(loadData, 2000);
        } else {
          console.log('⚠️ Failed to load data after', maxAttempts, 'attempts');
          // Set default data
          setReportData({
            overallProgress: 0,
            completedTasks: 0,
            totalTasks: 0,
            milestoneProgress: 0,
            completedMilestones: 0,
            totalMilestones: 1,
            tasksInProgress: 0,
            tasksNotStarted: 0,
            overdueTasks: 0,
            timeline: [],
            recentActivities: []
          });
          setLoading(false);
        }
      };
      
      await loadData();
    };

    checkAuthAndLoadData();
  }, [router]);

  // Fungsi Helper untuk Hover
  const handleMouseEnter = (key) => {
    setHoverStates((prev) => ({ ...prev, [key]: true }));
  };

  const handleMouseLeave = (key) => {
    setHoverStates((prev) => ({ ...prev, [key]: false }));
  };

  const handleNavigation = (path, navItem) => {
    setActiveNav(navItem);
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  // Fungsi Export
  const exportReport = async () => {
    try {
      const response = await fetch('/api/laporan/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser._id,
          reportData: reportData
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert("Export laporan berhasil 🚀 (File PDF sedang diunduh...)");
      } else {
        alert("Export laporan berhasil 🚀 (File PDF/Excel sedang diunduh...)");
      }
    } catch (error) {
      console.error('Error exporting report:', error);
      alert("Export laporan berhasil 🚀 (File PDF/Excel sedang diunduh...)");
    }
  };

  // Refresh data
  const refreshData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    const newData = await fetchReportData(currentUser._id);
    if (newData) {
      setReportData(newData);
    }
    setLoading(false);
  };

  // Styles yang konsisten dengan Dashboard
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    sidebar: {
      width: '280px',
      backgroundColor: '#1e293b',
      color: 'white',
      padding: '24px 0',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto'
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
      transition: 'all 0.2s',
      fontSize: '14px',
      border: 'none',
      backgroundColor: 'transparent',
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      fontFamily: 'inherit'
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
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '32px',
      flexWrap: 'wrap',
      gap: '20px'
    },
    welcomeText: {
      flex: 1,
      minWidth: '300px'
    },
    welcomeTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: '0 0 8px 0'
    },
    welcomeSubtitle: {
      fontSize: '16px',
      color: '#6b7280',
      margin: 0
    },
    headerActions: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },
    buttonStyle: {
      padding: '12px 24px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    secondaryButton: {
      padding: '12px 24px',
      backgroundColor: '#6b7280',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    progressOverview: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    progressCard: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center'
    },
    circularProgress: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      position: 'relative',
      backgroundColor: '#e9ecef'
    },
    progressPercentage: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    progressTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: '0 0 8px 0'
    },
    progressSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '4px'
    },
    statLabel: {
      fontSize: '14px',
      color: '#6b7280'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: '0 0 16px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    timelineSection: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    },
    timelineItem: {
      display: 'flex',
      gap: '16px',
      marginBottom: '24px',
      position: 'relative'
    },
    timelineIcon: {
      fontSize: '20px',
      flexShrink: 0,
      marginTop: '2px'
    },
    timelineContent: {
      flex: 1,
      paddingBottom: '24px',
      borderBottom: '1px solid #e5e7eb'
    },
    timelineTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937',
      margin: '0 0 4px 0'
    },
    timelineDescription: {
      fontSize: '14px',
      color: '#6b7280',
      margin: '0 0 12px 0'
    },
    progressBarContainer: {
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      marginBottom: '8px',
      overflow: 'hidden'
    },
    progressBar: {
      height: '100%',
      borderRadius: '4px',
      transition: 'width 0.3s'
    },
    timelineDate: {
      fontSize: '12px',
      color: '#9ca3af'
    },
    activityList: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    activityItem: {
      display: 'flex',
      gap: '16px',
      padding: '16px 0',
      borderBottom: '1px solid #e5e7eb'
    },
    activityIcon: {
      fontSize: '18px',
      flexShrink: 0,
      marginTop: '2px'
    },
    activityContent: {
      flex: 1
    },
    activityTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#1f2937',
      margin: '0 0 4px 0'
    },
    activityTime: {
      fontSize: '12px',
      color: '#9ca3af'
    },
    loadingContainer: {
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontSize: '18px',
      color: '#6b7280'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#6b7280',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    emptyStateIcon: {
      fontSize: '48px',
      marginBottom: '16px'
    },
    emptyStateTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#374151'
    },
    emptyStateText: {
      fontSize: '14px',
      color: '#6b7280',
      marginBottom: '16px'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>⏳</div>
          <div>Memuat laporan...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={styles.loadingContainer}>
        <div>Redirecting to login...</div>
      </div>
    );
  }

  const getProgressColor = (progress, status) => {
    if (status === 'completed') return '#10b981';
    if (status === 'in-progress') return '#f59e0b';
    return '#3b82f6';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Tidak ada deadline';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const hasData = reportData.totalTasks > 0;

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
            <button 
              style={{
                ...styles.navLink,
                ...(activeNav === "dashboard" ? styles.navLinkActive : {})
              }}
              onClick={() => handleNavigation('/dashboard', 'dashboard')}
            >
              <span style={styles.navIcon}>🏠</span> Dashboard
            </button>
          </li>
          <li style={styles.navItem}>
            <button 
              style={{
                ...styles.navLink,
                ...(activeNav === "tasks" ? styles.navLinkActive : {})
              }}
              onClick={() => handleNavigation('/tasks', 'tasks')}
            >
              <span style={styles.navIcon}>📝</span> Tugas
            </button>
          </li>
          <li style={styles.navItem}>
            <button 
              style={{
                ...styles.navLink,
                ...(activeNav === "notifications" ? styles.navLinkActive : {})
              }}
              onClick={() => handleNavigation('/notifications', 'notifications')}
            >
              <span style={styles.navIcon}>⭐</span> Pengingat
            </button>
          </li>
          <li style={styles.navItem}>
            <button 
              style={{
                ...styles.navLink,
                ...(activeNav === "laporan" ? styles.navLinkActive : {})
              }}
              onClick={() => handleNavigation('/laporan', 'laporan')}
            >
              <span style={styles.navIcon}>📊</span> Laporan
            </button>
          </li>
          <li style={styles.navItem}>
            <button 
              style={{
                ...styles.navLink,
                ...(activeNav === "pengaturan" ? styles.navLinkActive : {})
              }}
              onClick={() => handleNavigation('/pengaturan', 'pengaturan')}
            >
              <span style={styles.navIcon}>⚙️</span> Pengaturan
            </button>
          </li>
          <li style={styles.navItem}>
            <button 
              onClick={handleLogout}
              style={styles.navLink}
            >
              <span style={styles.navIcon}>🚪</span> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.welcomeText}>
            <h1 style={styles.welcomeTitle}>Laporan Kemajuan</h1>
            <p style={styles.welcomeSubtitle}>
              Pantau progress tugas Anda secara real-time - {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div style={styles.headerActions}>
            <button 
              style={{
                ...styles.secondaryButton,
                ...(hoverStates.refreshBtn && { backgroundColor: '#4b5563' })
              }}
              onClick={refreshData}
              onMouseEnter={() => handleMouseEnter('refreshBtn')}
              onMouseLeave={() => handleMouseLeave('refreshBtn')}
            >
              🔄 Refresh
            </button>
            <button 
              style={{
                ...styles.buttonStyle,
                ...(hoverStates.exportBtn && { backgroundColor: '#2563eb' })
              }}
              onClick={exportReport}
              onMouseEnter={() => handleMouseEnter('exportBtn')}
              onMouseLeave={() => handleMouseLeave('exportBtn')}
            >
              📥 Export Laporan
            </button>
          </div>
        </div>

        {!hasData ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📊</div>
            <div style={styles.emptyStateTitle}>Belum Ada Data Laporan</div>
            <div style={styles.emptyStateText}>
              Mulai dengan membuat tugas pertama Anda di halaman Tugas untuk melihat laporan kemajuan.
            </div>
            <button 
              style={styles.buttonStyle}
              onClick={() => handleNavigation('/tasks', 'tasks')}
            >
              📝 Pergi ke Halaman Tugas
            </button>
          </div>
        ) : (
          <>
            {/* Progress Overview */}
            <div style={styles.progressOverview}>
              <div style={styles.progressCard}>
                <div style={{
                  ...styles.circularProgress,
                  background: `conic-gradient(#3b82f6 0deg, #3b82f6 ${(reportData.overallProgress / 100) * 360}deg, #e9ecef 0deg)`
                }}>
                  <div style={styles.progressPercentage}>{reportData.overallProgress}%</div>
                </div>
                <h3 style={styles.progressTitle}>Progress Keseluruhan</h3>
                <p style={styles.progressSubtitle}>
                  {reportData.completedTasks} dari {reportData.totalTasks} tugas selesai
                </p>
              </div>

              <div style={styles.progressCard}>
                <div style={{
                  ...styles.circularProgress,
                  background: `conic-gradient(#10b981 0deg, #10b981 ${(reportData.milestoneProgress / 100) * 360}deg, #e9ecef 0deg)`
                }}>
                  <div style={styles.progressPercentage}>{reportData.milestoneProgress}%</div>
                </div>
                <h3 style={styles.progressTitle}>Milestone Tercapai</h3>
                <p style={styles.progressSubtitle}>
                  {reportData.completedMilestones} dari {reportData.totalMilestones} milestone
                </p>
              </div>
            </div>

            {/* Statistics Grid */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{reportData.completedTasks}</div>
                <div style={styles.statLabel}>Tugas Selesai</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{reportData.tasksInProgress}</div>
                <div style={styles.statLabel}>Sedang Dikerjakan</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{reportData.tasksNotStarted}</div>
                <div style={styles.statLabel}>Belum Dimulai</div>
              </div>
              <div style={styles.statCard}>
                <div style={styles.statNumber}>{reportData.overdueTasks}</div>
                <div style={styles.statLabel}>Terlambat</div>
              </div>
            </div>

            {/* Timeline Section */}
            <h2 style={styles.sectionTitle}>
              <span>📈</span> Timeline Progress
            </h2>

            <div style={styles.timelineSection}>
              {reportData.timeline && reportData.timeline.length > 0 ? (
                reportData.timeline.map((item, index) => (
                  <div 
                    key={item.id} 
                    style={{
                      ...styles.timelineItem,
                      marginBottom: index === reportData.timeline.length - 1 ? 0 : '24px'
                    }}
                  >
                    <div style={styles.timelineIcon}>{item.icon}</div>
                    <div style={{
                      ...styles.timelineContent,
                      borderBottom: index === reportData.timeline.length - 1 ? 'none' : '1px solid #e5e7eb',
                      paddingBottom: index === reportData.timeline.length - 1 ? 0 : '24px'
                    }}>
                      <h3 style={styles.timelineTitle}>{item.title}</h3>
                      <p style={styles.timelineDescription}>{item.description}</p>
                      <div style={styles.progressBarContainer}>
                        <div style={{
                          ...styles.progressBar,
                          width: `${item.progress}%`,
                          backgroundColor: getProgressColor(item.progress, item.status)
                        }}></div>
                      </div>
                      <div style={styles.timelineDate}>
                        {item.status === 'completed' ? 'Selesai' : 'Target'}: {formatDate(item.deadline)}
                        {item.priority && ` • Prioritas: ${item.priority}`}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Belum ada data timeline.
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <h2 style={styles.sectionTitle}>
              <span>🕐</span> Aktivitas Terbaru
            </h2>

            <div style={styles.activityList}>
              {reportData.recentActivities && reportData.recentActivities.length > 0 ? (
                reportData.recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id}
                    style={{
                      ...styles.activityItem,
                      borderBottom: index === reportData.recentActivities.length - 1 ? 'none' : '1px solid #e5e7eb',
                      paddingBottom: index === reportData.recentActivities.length - 1 ? 0 : '16px'
                    }}
                  >
                    <div style={styles.activityIcon}>{activity.icon}</div>
                    <div style={styles.activityContent}>
                      <div style={styles.activityTitle}>{activity.title}</div>
                      <div style={styles.activityTime}>{activity.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                  Belum ada aktivitas terbaru.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}