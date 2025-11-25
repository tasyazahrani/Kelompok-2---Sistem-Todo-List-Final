"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoverStates, setHoverStates] = useState({});
  const [activeNav, setActiveNav] = useState("dashboard");

  // Fungsi untuk fetch tasks dari database
  const fetchTasksFromDB = async (userId) => {
    try {
      const response = await fetch(`/api/tasks?userId=${userId}`);
      const data = await response.json();
      if (data.success) {
        return data.tasks;
      }
      return [];
    } catch (error) {
      console.error('Error fetching tasks from DB:', error);
      return [];
    }
  };

  // Fungsi untuk save task ke database
  const saveTaskToDB = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error saving task to DB:', error);
      return { success: false, error: error.message };
    }
  };

  // Fungsi untuk update task di database
  const updateTaskInDB = async (taskId, updateData) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating task in DB:', error);
      return { success: false, error: error.message };
    }
  };

  // Fungsi untuk delete task dari database
  const deleteTaskFromDB = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting task in DB:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const checkAuthAndLoadTasks = async () => {
      const user = localStorage.getItem('currentUser');
      if (!user) {
        router.push('/login');
        return;
      }
      
      const userData = JSON.parse(user);
      setCurrentUser(userData);

      const tasksFromDB = await fetchTasksFromDB(userData._id);
      setTasks(tasksFromDB);
      setLoading(false);
    };

    checkAuthAndLoadTasks();
  }, [router]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const title = formData.get('taskTitle');
    const priority = formData.get('taskPriority');
    const deadline = formData.get('taskDeadline');
    const notes = formData.get('taskNotes');
    const subtasksRaw = formData.get('taskSubtasks');
    const subtasks = subtasksRaw.split("\n").filter((s) => s.trim() !== "");
    const completedSubtasks = subtasks.map(() => false);

    const newTask = {
      userId: currentUser._id,
      title,
      priority,
      deadline: deadline || null,
      notes: notes || '',
      subtasks,
      completedSubtasks,
    };

    const result = await saveTaskToDB(newTask);
    
    if (result.success) {
      const updatedTasks = await fetchTasksFromDB(currentUser._id);
      setTasks(updatedTasks);
      setIsModalOpen(false);
      e.target.reset();
    } else {
      alert('Gagal menambah tugas: ' + result.error);
    }
  };

  const toggleSubtask = async (taskId, subIndex) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const updatedCompletedSubtasks = task.completedSubtasks.map((c, i) =>
      i === subIndex ? !c : c
    );

    const result = await updateTaskInDB(taskId, {
      completedSubtasks: updatedCompletedSubtasks
    });

    if (result.success) {
      setTasks(prev =>
        prev.map(t =>
          t._id === taskId
            ? { ...t, completedSubtasks: updatedCompletedSubtasks }
            : t
        )
      );
    }
  };

  const deleteTask = async (taskId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tugas ini?')) return;

    const result = await deleteTaskFromDB(taskId);
    
    if (result.success) {
      const updatedTasks = await fetchTasksFromDB(currentUser._id);
      setTasks(updatedTasks);
    } else {
      alert('Gagal menghapus tugas: ' + (result.error || 'Unknown error'));
    }
  };

  const handleNavigation = (path, navItem) => {
    setActiveNav(navItem);
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  const handleMouseEnter = (element) => {
    setHoverStates(prev => ({ ...prev, [element]: true }));
  };

  const handleMouseLeave = (element) => {
    setHoverStates(prev => ({ ...prev, [element]: false }));
  };

  // Filter tasks
  const filteredTasks =
    filter === "all"
      ? tasks
      : filter === "today"
      ? tasks.filter((t) => {
          if (!t.deadline) return false;
          const today = new Date();
          const taskDate = new Date(t.deadline);
          return taskDate.toDateString() === today.toDateString();
        })
      : tasks.filter((t) => t.priority === filter);

  // Calculate completed count
  const completedCount = tasks.reduce(
    (sum, t) =>
      sum +
      (t.completedSubtasks ? t.completedSubtasks.filter((c) => c === true).length : 0) /
        ((t.subtasks && t.subtasks.length) || 1),
    0
  );

  // Styles - DIPERBAIKI: Hindari konflik background/backgroundColor
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
      backgroundColor: 'transparent', // GUNAKAN backgroundColor, BUKAN background
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      fontFamily: 'inherit'
    },
    navLinkActive: {
      backgroundColor: '#334155', // GUNAKAN backgroundColor
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
    headerStats: {
      display: 'flex',
      gap: '16px',
      flexWrap: 'wrap'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      textAlign: 'center',
      minWidth: '120px'
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
    quickActions: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px'
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
    actionButtons: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },
    actionBtn: {
      padding: '12px 20px',
      backgroundColor: '#3b82f6', // GUNAKAN backgroundColor
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    tasksSection: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '24px',
      alignItems: 'start'
    },
    tasksContainer: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    taskFilters: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
      flexWrap: 'wrap'
    },
    filterBtn: {
      padding: '8px 16px',
      backgroundColor: '#f3f4f6', // GUNAKAN backgroundColor
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    filterBtnActive: {
      backgroundColor: '#3b82f6', // GUNAKAN backgroundColor
      color: 'white'
    },
    tasksList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },
    taskItem: {
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      backgroundColor: '#fafafa', // GUNAKAN backgroundColor
      transition: 'all 0.2s'
    },
    taskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },
    taskTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1f2937',
      flex: 1
    },
    deleteBtn: {
      padding: '4px 8px',
      backgroundColor: '#ef4444', // GUNAKAN backgroundColor
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      fontFamily: 'inherit'
    },
    taskMeta: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '12px',
      flexWrap: 'wrap'
    },
    priorityBadge: {
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500'
    },
    priorityHigh: {
      backgroundColor: '#fee2e2',
      color: '#dc2626'
    },
    priorityMedium: {
      backgroundColor: '#fef3c7',
      color: '#d97706'
    },
    priorityLow: {
      backgroundColor: '#d1fae5',
      color: '#059669'
    },
    deadline: {
      fontSize: '12px',
      color: '#6b7280'
    },
    deadlineOverdue: {
      color: '#dc2626',
      fontWeight: '500'
    },
    deadlineToday: {
      color: '#d97706',
      fontWeight: '500'
    },
    taskProgress: {
      height: '4px',
      backgroundColor: '#e5e7eb',
      borderRadius: '2px',
      marginBottom: '12px',
      overflow: 'hidden'
    },
    progressBar: {
      height: '100%',
      backgroundColor: '#3b82f6',
      transition: 'width 0.3s'
    },
    subtasks: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '12px'
    },
    subtask: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    checkbox: {
      width: '16px',
      height: '16px',
      border: '2px solid #d1d5db',
      borderRadius: '3px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '10px',
      flexShrink: 0,
      backgroundColor: 'white' // GUNAKAN backgroundColor
    },
    checkboxChecked: {
      backgroundColor: '#3b82f6', // GUNAKAN backgroundColor
      borderColor: '#3b82f6',
      color: 'white'
    },
    subtaskText: {
      fontSize: '14px',
      color: '#6b7280',
      flex: 1
    },
    subtaskTextCompleted: {
      textDecoration: 'line-through',
      color: '#9ca3af'
    },
    taskNotes: {
      backgroundColor: '#f3f4f6',
      padding: '12px',
      borderRadius: '6px',
      fontSize: '14px'
    },
    notesTitle: {
      fontWeight: '600',
      marginBottom: '4px',
      color: '#374151'
    },
    notesContent: {
      color: '#6b7280',
      lineHeight: '1.4'
    },
    progressContainer: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      height: 'fit-content',
      position: 'sticky',
      top: '24px'
    },
    progressOverview: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      marginBottom: '24px'
    },
    circularProgress: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundColor: '#e9ecef' // GUNAKAN backgroundColor
    },
    progressPercentage: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    progressStats: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    },
    progressStat: {
      textAlign: 'center'
    },
    progressStatNumber: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '4px'
    },
    progressStatLabel: {
      fontSize: '14px',
      color: '#6b7280'
    },
    notifications: {
      borderTop: '1px solid #e5e7eb',
      paddingTop: '20px'
    },
    notificationItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      marginBottom: '8px'
    },
    notificationIcon: {
      fontSize: '16px',
      flexShrink: 0
    },
    notificationContent: {
      flex: 1
    },
    notificationTitle: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#1f2937',
      marginBottom: '2px'
    },
    notificationTime: {
      fontSize: '12px',
      color: '#6b7280'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '12px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 24px',
      borderBottom: '1px solid #e5e7eb',
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      borderRadius: '12px 12px 0 0'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#6b7280',
      padding: 0,
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent' // TAMBAHKAN backgroundColor
    },
    formGroup: {
      marginBottom: '16px',
      padding: '0 24px'
    },
    formLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '6px'
    },
    formInput: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      backgroundColor: 'white' // GUNAKAN backgroundColor
    },
    formSelect: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      backgroundColor: 'white',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    },
    formTextarea: {
      width: '100%',
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      backgroundColor: 'white' // GUNAKAN backgroundColor
    },
    submitBtn: {
      width: 'calc(100% - 48px)',
      margin: '0 24px 24px',
      padding: '12px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '500',
      cursor: 'pointer',
      fontFamily: 'inherit'
    },
    loadingContainer: {
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontSize: '18px',
      color: '#6b7280'
    }
  };

  if (loading) {
    return <div style={styles.loadingContainer}>Memuat dashboard...</div>;
  }

  if (!currentUser) {
    return <div style={styles.loadingContainer}>Redirecting to login...</div>;
  }

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
                ...(activeNav === "settings" ? styles.navLinkActive : {})
              }}
              onClick={() => handleNavigation('/settings', 'settings')}
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
            <h1 style={styles.welcomeTitle}>
              Selamat Datang, {currentUser?.name}! 👋
            </h1>
            <p style={styles.welcomeSubtitle}>
              Kelola tugas Anda dengan efisien dan tingkatkan produktivitas
            </p>
          </div>
          <div style={styles.headerStats}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{tasks.length}</div>
              <div style={styles.statLabel}>Total Tugas</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{Math.round(completedCount)}</div>
              <div style={styles.statLabel}>Selesai</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{tasks.length - Math.round(completedCount)}</div>
              <div style={styles.statLabel}>Menunggu</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.quickActions}>
          <h2 style={styles.sectionTitle}>
            <span>⚡</span> Aksi Cepat
          </h2>
          <div style={styles.actionButtons}>
            <button 
              style={{
                ...styles.actionBtn,
                ...(hoverStates.addTask && { backgroundColor: '#2563eb' }) // PERBAIKAN: Gunakan conditional styling yang benar
              }}
              onClick={openModal}
              onMouseEnter={() => handleMouseEnter('addTask')}
              onMouseLeave={() => handleMouseLeave('addTask')}
            >
              ➕ Tambah Tugas Baru
            </button>
            <button 
              style={{
                ...styles.actionBtn,
                ...(hoverStates.todayTasks && { backgroundColor: '#2563eb' })
              }}
              onClick={() => setFilter("today")}
              onMouseEnter={() => handleMouseEnter('todayTasks')}
              onMouseLeave={() => handleMouseLeave('todayTasks')}
            >
              📅 Tugas Hari Ini
            </button>
            <button 
              style={{
                ...styles.actionBtn,
                ...(hoverStates.highPriority && { backgroundColor: '#2563eb' })
              }}
              onClick={() => setFilter("high")}
              onMouseEnter={() => handleMouseEnter('highPriority')}
              onMouseLeave={() => handleMouseLeave('highPriority')}
            >
              🔥 Prioritas Tinggi
            </button>
            <button 
              style={{
                ...styles.actionBtn,
                ...(hoverStates.mediumPriority && { backgroundColor: '#2563eb' })
              }}
              onClick={() => setFilter("medium")}
              onMouseEnter={() => handleMouseEnter('mediumPriority')}
              onMouseLeave={() => handleMouseLeave('mediumPriority')}
            >
              ⚡ Prioritas Sedang
            </button>
            <button 
              style={{
                ...styles.actionBtn,
                ...(hoverStates.lowPriority && { backgroundColor: '#2563eb' })
              }}
              onClick={() => setFilter("low")}
              onMouseEnter={() => handleMouseEnter('lowPriority')}
              onMouseLeave={() => handleMouseLeave('lowPriority')}
            >
              💤 Prioritas Rendah
            </button>
          </div>
        </div>

        {/* Tasks Section */}
        <div style={styles.tasksSection}>
          <div style={styles.tasksContainer}>
            <h2 style={styles.sectionTitle}>
              <span>📋</span> Daftar Tugas
            </h2>
            <div style={styles.taskFilters}>
              <button 
                style={{
                  ...styles.filterBtn,
                  ...(filter === "all" ? styles.filterBtnActive : {})
                }}
                onClick={() => setFilter("all")}
              >
                📁 Semua ({tasks.length})
              </button>
              <button 
                style={{
                  ...styles.filterBtn,
                  ...(filter === "high" ? styles.filterBtnActive : {})
                }}
                onClick={() => setFilter("high")}
              >
                🔥 Tinggi ({tasks.filter(t => t.priority === 'high').length})
              </button>
              <button 
                style={{
                  ...styles.filterBtn,
                  ...(filter === "medium" ? styles.filterBtnActive : {})
                }}
                onClick={() => setFilter("medium")}
              >
                ⚡ Sedang ({tasks.filter(t => t.priority === 'medium').length})
              </button>
              <button 
                style={{
                  ...styles.filterBtn,
                  ...(filter === "low" ? styles.filterBtnActive : {})
                }}
                onClick={() => setFilter("low")}
              >
                💤 Rendah ({tasks.filter(t => t.priority === 'low').length})
              </button>
              <button 
                style={{
                  ...styles.filterBtn,
                  ...(filter === "today" ? styles.filterBtnActive : {})
                }}
                onClick={() => setFilter("today")}
              >
                📅 Hari Ini ({tasks.filter(t => {
                  if (!t.deadline) return false;
                  const today = new Date();
                  const taskDate = new Date(t.deadline);
                  return taskDate.toDateString() === today.toDateString();
                }).length})
              </button>
            </div>

            <div style={styles.tasksList}>
              {filteredTasks.map((task) => {
                const totalSub = task.subtasks ? task.subtasks.length : 0;
                const doneSub = task.completedSubtasks ? task.completedSubtasks.filter(c => c).length : 0;
                const progress = totalSub ? Math.round((doneSub / totalSub) * 100) : 0;

                const deadlineDate = task.deadline ? new Date(task.deadline) : null;
                const today = new Date();
                const isToday = deadlineDate && deadlineDate.toDateString() === today.toDateString();
                const isOverdue = deadlineDate && deadlineDate < today && !isToday;

                return (
                  <div key={task._id} style={styles.taskItem}>
                    <div style={styles.taskHeader}>
                      <div style={styles.taskTitle}>{task.title}</div>
                      <button 
                        style={styles.deleteBtn}
                        onClick={() => deleteTask(task._id)}
                      >
                        Hapus
                      </button>
                    </div>
                    <div style={styles.taskMeta}>
                      <span style={{
                        ...styles.priorityBadge,
                        ...(task.priority === 'high' ? styles.priorityHigh : 
                             task.priority === 'medium' ? styles.priorityMedium : 
                             styles.priorityLow)
                      }}>
                        {task.priority === 'high' ? '🔥 TINGGI' : 
                         task.priority === 'medium' ? '⚡ SEDANG' : '💤 RENDAH'}
                      </span>
                      {task.deadline && (
                        <span style={{
                          ...styles.deadline,
                          ...(isOverdue ? styles.deadlineOverdue : 
                               isToday ? styles.deadlineToday : {})
                        }}>
                          {new Date(task.deadline).toLocaleDateString('id-ID', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    {totalSub > 0 && (
                      <>
                        <div style={styles.taskProgress}>
                          <div style={{...styles.progressBar, width: `${progress}%`}}></div>
                        </div>
                        <div style={styles.subtasks}>
                          {task.subtasks.map((sub, i) => (
                            <div key={i} style={styles.subtask}>
                              <div 
                                style={{
                                  ...styles.checkbox,
                                  ...(task.completedSubtasks && task.completedSubtasks[i] ? styles.checkboxChecked : {})
                                }}
                                onClick={() => toggleSubtask(task._id, i)}
                              >
                                {task.completedSubtasks && task.completedSubtasks[i] ? "✔" : ""}
                              </div>
                              <div style={{
                                ...styles.subtaskText,
                                ...(task.completedSubtasks && task.completedSubtasks[i] ? styles.subtaskTextCompleted : {})
                              }}>
                                {sub}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    {task.notes && (
                      <div style={styles.taskNotes}>
                        <div style={styles.notesTitle}>Catatan:</div>
                        <div style={styles.notesContent}>{task.notes}</div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredTasks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  {tasks.length === 0 ? 'Belum ada tugas. Tambah tugas pertama Anda!' : `Tidak ada tugas dengan filter "${filter}".`}
                </div>
              )}
            </div>
          </div>

          {/* Progress Container */}
          <div style={styles.progressContainer}>
            <h2 style={styles.sectionTitle}>
              <span>📈</span> Kemajuan
            </h2>
            <div style={styles.progressOverview}>
              <div style={{
                ...styles.circularProgress,
                background: `conic-gradient(#3b82f6 0deg, #3b82f6 ${Math.round((completedCount / Math.max(tasks.length, 1)) * 360)}deg, #e9ecef 0deg)`
              }}>
                <div style={styles.progressPercentage}>
                  {Math.round((completedCount / Math.max(tasks.length, 1)) * 100)}%
                </div>
              </div>
              <div style={styles.progressStats}>
                <div style={styles.progressStat}>
                  <div style={styles.progressStatNumber}>{Math.round(completedCount)}</div>
                  <div style={styles.progressStatLabel}>Selesai</div>
                </div>
                <div style={styles.progressStat}>
                  <div style={styles.progressStatNumber}>{tasks.length}</div>
                  <div style={styles.progressStatLabel}>Total</div>
                </div>
              </div>
            </div>

            {/* Priority Summary */}
            <div style={styles.notifications}>
              <h3 style={{ color: "#333", marginBottom: "1rem" }}>📊 Ringkasan Prioritas</h3>
              <div style={styles.notificationItem}>
                <div style={styles.notificationIcon}>🔥</div>
                <div style={styles.notificationContent}>
                  <div style={styles.notificationTitle}>Prioritas Tinggi</div>
                  <div style={styles.notificationTime}>{tasks.filter(t => t.priority === 'high').length} tugas</div>
                </div>
              </div>
              <div style={styles.notificationItem}>
                <div style={styles.notificationIcon}>⚡</div>
                <div style={styles.notificationContent}>
                  <div style={styles.notificationTitle}>Prioritas Sedang</div>
                  <div style={styles.notificationTime}>{tasks.filter(t => t.priority === 'medium').length} tugas</div>
                </div>
              </div>
              <div style={styles.notificationItem}>
                <div style={styles.notificationIcon}>💤</div>
                <div style={styles.notificationContent}>
                  <div style={styles.notificationTitle}>Prioritas Rendah</div>
                  <div style={styles.notificationTime}>{tasks.filter(t => t.priority === 'low').length} tugas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Tambah Tugas Baru</div>
              <button style={styles.closeBtn} onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleAddTask}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Judul Tugas *</label>
                <input 
                  type="text" 
                  name="taskTitle" 
                  style={styles.formInput} 
                  required 
                  placeholder="Masukkan judul tugas"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Prioritas *</label>
                <select name="taskPriority" style={styles.formSelect}>
                  <option value="high">🔥 Tinggi</option>
                  <option value="medium">⚡ Sedang</option>
                  <option value="low">💤 Rendah</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Deadline</label>
                <input 
                  type="datetime-local" 
                  name="taskDeadline" 
                  style={styles.formInput} 
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Catatan</label>
                <textarea 
                  name="taskNotes" 
                  style={styles.formTextarea}
                  placeholder="Tambahkan catatan untuk tugas ini..."
                ></textarea>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Sub-tugas (satu per baris)</label>
                <textarea 
                  name="taskSubtasks" 
                  style={styles.formTextarea}
                  placeholder="Tulis sub-tugas, satu per baris..."
                ></textarea>
              </div>
              <button type="submit" style={styles.submitBtn}>
                Tambahkan Tugas
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}