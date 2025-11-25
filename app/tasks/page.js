'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TaskManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    priority: "medium",
    deadline: "",
    notes: "",
    subtasks: ""
  });
  const [filter, setFilter] = useState("all");
  const [activeNav, setActiveNav] = useState("tasks");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [hoverStates, setHoverStates] = useState({});
  const router = useRouter();

  // Fungsi untuk fetch tasks dari database
  const fetchTasksFromDB = async (userId) => {
    try {
      console.log('🔍 Fetching tasks for user:', userId);
      const response = await fetch(`/api/tasks?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('📦 Tasks API response:', data);
      
      if (data.success) {
        console.log('✅ Tasks loaded:', data.tasks.length);
        return data.tasks;
      }
      return [];
    } catch (error) {
      console.error('💥 Error fetching tasks:', error);
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

  // Fungsi untuk show notification
  const showNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    // Auto remove setelah 3 detik
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
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

  // Auto-refresh tasks setiap 10 detik
  useEffect(() => {
    if (!currentUser) return;
    
    const interval = setInterval(async () => {
      const updatedTasks = await fetchTasksFromDB(currentUser._id);
      setTasks(updatedTasks);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [currentUser]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ title: "", priority: "medium", deadline: "", notes: "", subtasks: "" });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      showNotification('❌ Judul tugas tidak boleh kosong', 'error');
      return;
    }

    const subtasks = formData.subtasks ? formData.subtasks.split("\n").filter(st => st.trim()) : [];
    const completedSubtasks = subtasks.map(() => false);

    const newTask = {
      userId: currentUser._id,
      title: formData.title.trim(),
      priority: formData.priority,
      deadline: formData.deadline || null,
      notes: formData.notes || '',
      subtasks: subtasks,
      completedSubtasks: completedSubtasks,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    showNotification(`🔄 Menambahkan tugas "${formData.title}"...`, 'info');

    const result = await saveTaskToDB(newTask);
    
    if (result.success) {
      const updatedTasks = await fetchTasksFromDB(currentUser._id);
      setTasks(updatedTasks);
      setFormData({ title: "", priority: "medium", deadline: "", notes: "", subtasks: "" });
      closeModal();
      showNotification(`✅ Tugas "${formData.title}" berhasil ditambahkan!`, 'success');
    } else {
      showNotification(`❌ Gagal menambah tugas: ${result.error}`, 'error');
    }
  };

  const toggleTaskComplete = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const newStatus = task.status === "completed" ? "pending" : "completed";
    const action = newStatus === "completed" ? "diselesaikan" : "dibuka kembali";
    
    // Optimistic update
    setTasks(prev =>
      prev.map(t =>
        t._id === taskId ? { ...t, status: newStatus } : t
      )
    );

    showNotification(`🔄 Menandai tugas "${task.title}" sebagai ${action}...`, 'info');

    const result = await updateTaskInDB(taskId, {
      status: newStatus,
      updatedAt: new Date()
    });

    if (result.success) {
      showNotification(
        newStatus === "completed" 
          ? `✅ Tugas "${task.title}" berhasil diselesaikan!` 
          : `↶ Tugas "${task.title}" dibuka kembali`,
        'success'
      );
    } else {
      // Rollback jika gagal
      setTasks(prev =>
        prev.map(t =>
          t._id === taskId ? { ...t, status: task.status } : t
        )
      );
      showNotification(`❌ Gagal mengupdate tugas: ${result.error}`, 'error');
    }
  };

  const toggleSubtask = async (taskId, subIndex) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task || !task.subtasks) return;

    const subtaskName = task.subtasks[subIndex];
    const currentStatus = task.completedSubtasks[subIndex];
    const newStatus = !currentStatus;
    const action = newStatus ? "diselesaikan" : "dibuka kembali";

    const updatedCompletedSubtasks = task.completedSubtasks.map((c, i) =>
      i === subIndex ? !c : c
    );

    // Optimistic update
    setTasks(prev =>
      prev.map(t =>
        t._id === taskId
          ? { ...t, completedSubtasks: updatedCompletedSubtasks }
          : t
      )
    );

    const result = await updateTaskInDB(taskId, {
      completedSubtasks: updatedCompletedSubtasks,
      updatedAt: new Date()
    });

    if (result.success) {
      showNotification(
        `📌 Subtask "${subtaskName}" ${action}`,
        'success'
      );
      
      // Cek jika semua subtasks selesai, auto complete task
      const allCompleted = updatedCompletedSubtasks.every(c => c);
      if (allCompleted && task.status !== "completed" && task.subtasks.length > 0) {
        setTimeout(() => {
          showNotification(`🎉 Semua subtasks selesai! Menandai tugas sebagai selesai...`, 'info');
          toggleTaskComplete(taskId);
        }, 1000);
      }
    } else {
      // Rollback jika gagal
      setTasks(prev =>
        prev.map(t =>
          t._id === taskId
            ? { ...t, completedSubtasks: task.completedSubtasks }
            : t
        )
      );
      showNotification(`❌ Gagal mengupdate subtask`, 'error');
    }
  };

  const deleteTask = async (taskId) => {
    const taskToDelete = tasks.find(t => t._id === taskId);
    if (!taskToDelete) return;

    // Optimistic update
    const originalTasks = tasks;
    setTasks(prev => prev.filter(t => t._id !== taskId));
    
    showNotification(`🗑️ Menghapus tugas "${taskToDelete.title}"...`, 'warning');

    const result = await deleteTaskFromDB(taskId);
    
    if (result.success) {
      showNotification(`✅ Tugas "${taskToDelete.title}" berhasil dihapus`, 'success');
    } else {
      // Rollback jika gagal
      setTasks(originalTasks);
      showNotification(`❌ Gagal menghapus tugas: ${result.error}`, 'error');
    }
    setDeleteConfirm(null);
  };

  const showDeleteConfirm = (task) => {
    setDeleteConfirm(task);
  };

  const handleDeleteConfirm = async (confirmed) => {
    if (confirmed && deleteConfirm) {
      await deleteTask(deleteConfirm._id);
    } else {
      setDeleteConfirm(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "pending") return task.status === "pending";
    if (filter === "completed") return task.status === "completed";
    if (filter === "overdue") {
      return task.deadline && new Date(task.deadline) < new Date() && task.status !== "completed";
    }
    return true;
  });

  const getPriorityLabel = (priority) => {
    switch(priority) {
      case "high": return "🔥 Tinggi";
      case "medium": return "⚡ Sedang";
      case "low": return "🌱 Rendah";
      default: return priority;
    }
  };

  const isOverdue = (deadline) => {
    return deadline && new Date(deadline) < new Date();
  };

  const handleNavigation = (path, navItem) => {
    setActiveNav(navItem);
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/login');
  };

  const handleMouseEnter = (item) => {
    setHoverStates(prev => ({ ...prev, [item]: true }));
  };

  const handleMouseLeave = (item) => {
    setHoverStates(prev => ({ ...prev, [item]: false }));
  };

  const refreshTasks = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    const updatedTasks = await fetchTasksFromDB(currentUser._id);
    setTasks(updatedTasks);
    setLoading(false);
    showNotification('🔄 Data tugas diperbarui', 'info');
  };

  // Styles
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
      background: 'transparent',
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
      alignItems: 'center'
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
    refreshButton: {
      padding: '10px 16px',
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
    mainContainer: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    filterTabs: {
      display: 'flex',
      gap: '8px',
      marginBottom: '2rem',
      backgroundColor: '#f3f4f6',
      padding: '8px',
      borderRadius: '12px'
    },
    filterTab: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: 'transparent',
      color: '#666',
      cursor: 'pointer',
      flex: 1,
      fontSize: '14px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      fontFamily: 'inherit'
    },
    filterTabActive: {
      backgroundColor: '#3b82f6',
      color: 'white'
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
    taskItem: {
      backgroundColor: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: '4px solid #3b82f6',
      position: 'relative',
      transition: 'all 0.2s ease'
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
    priorityBadge: {
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
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
    taskMeta: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      marginBottom: '12px',
      flexWrap: 'wrap'
    },
    deadline: {
      fontSize: '12px',
      color: '#6b7280'
    },
    deadlineOverdue: {
      color: '#dc2626',
      fontWeight: '500'
    },
    subtaskSection: {
      margin: '1rem 0',
      paddingLeft: '1rem',
      borderLeft: '2px solid #e5e7eb'
    },
    subtaskItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '4px 0',
      color: '#666'
    },
    subtaskCheckbox: {
      width: '16px',
      height: '16px',
      border: '2px solid #d1d5db',
      borderRadius: '3px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px'
    },
    subtaskCheckboxChecked: {
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
      color: 'white'
    },
    subtaskText: {
      fontSize: '14px',
      color: '#6b7280'
    },
    subtaskTextCompleted: {
      textDecoration: 'line-through',
      color: '#9ca3af'
    },
    taskFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '1px solid #e5e7eb',
      fontSize: '12px'
    },
    actionButtons: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      display: 'flex',
      gap: '4px'
    },
    actionBtn: {
      width: '32px',
      height: '32px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      transition: 'all 0.2s ease'
    },
    completeBtn: {
      backgroundColor: '#d1fae5',
      color: '#059669'
    },
    completeBtnCompleted: {
      backgroundColor: '#fef3c7',
      color: '#d97706'
    },
    deleteBtn: {
      backgroundColor: '#fee2e2',
      color: '#dc2626'
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
      borderRadius: '6px',
      transition: 'all 0.2s'
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
      fontFamily: 'inherit'
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
      fontFamily: 'inherit'
    },
    formActions: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px',
      padding: '0 24px 24px'
    },
    cancelBtn: {
      flex: 1,
      padding: '12px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#374151',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '14px',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    submitBtn: {
      flex: 2,
      padding: '12px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '14px',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 2rem',
      color: '#6b7280'
    },
    emptyStateIcon: {
      fontSize: '4rem',
      marginBottom: '1rem'
    },
    emptyStateTitle: {
      fontSize: '1.5rem',
      marginBottom: '0.5rem',
      color: '#374151'
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

  // Notification Styles
  const notificationStyles = {
    notificationContainer: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1001,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    notification: {
      padding: '12px 16px',
      borderRadius: '8px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      minWidth: '300px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      animation: 'slideIn 0.3s ease-out'
    },
    notificationSuccess: {
      backgroundColor: '#10b981',
      borderLeft: '4px solid #059669'
    },
    notificationError: {
      backgroundColor: '#ef4444',
      borderLeft: '4px solid #dc2626'
    },
    notificationWarning: {
      backgroundColor: '#f59e0b',
      borderLeft: '4px solid #d97706'
    },
    notificationInfo: {
      backgroundColor: '#3b82f6',
      borderLeft: '4px solid #2563eb'
    }
  };

  // Notification Component
  const Notification = ({ message, type, onClose }) => (
    <div style={{
      ...notificationStyles.notification,
      ...(type === 'success' ? notificationStyles.notificationSuccess :
          type === 'error' ? notificationStyles.notificationError :
          type === 'warning' ? notificationStyles.notificationWarning :
          notificationStyles.notificationInfo)
    }}>
      <span style={{ flex: 1 }}>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          padding: '0',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ×
      </button>
    </div>
  );

  if (loading) {
    return <div style={styles.loadingContainer}>Memuat tugas...</div>;
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
            <h1 style={styles.welcomeTitle}>Task Manager</h1>
            <p style={styles.welcomeSubtitle}>
              Kelola {tasks.length} tugas dengan deadline dan prioritas
            </p>
          </div>
          <div style={styles.headerActions}>
            <button 
              style={{
                ...styles.refreshButton,
                ...(hoverStates.refresh && { backgroundColor: '#4b5563' })
              }}
              onClick={refreshTasks}
              onMouseEnter={() => handleMouseEnter('refresh')}
              onMouseLeave={() => handleMouseLeave('refresh')}
              title="Refresh data"
            >
              🔄 Refresh
            </button>
            <button 
              style={{
                ...styles.buttonStyle,
                ...(hoverStates.addTask && { backgroundColor: '#2563eb' })
              }}
              onClick={openModal}
              onMouseEnter={() => handleMouseEnter('addTask')}
              onMouseLeave={() => handleMouseLeave('addTask')}
            >
              ➕ Tambah Tugas
            </button>
          </div>
        </div>

        <div style={styles.mainContainer}>
          {/* Filter Tabs */}
          <div style={styles.filterTabs}>
            {[
              { key: "all", label: "Semua", count: tasks.length },
              { key: "pending", label: "Aktif", count: tasks.filter(t => t.status === "pending").length },
              { key: "completed", label: "Selesai", count: tasks.filter(t => t.status === "completed").length },
              { key: "overdue", label: "Terlambat", count: tasks.filter(t => 
                t.deadline && new Date(t.deadline) < new Date() && t.status !== "completed"
              ).length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                style={{
                  ...styles.filterTab,
                  ...(filter === key ? styles.filterTabActive : {})
                }}
                onClick={() => setFilter(key)}
                onMouseEnter={(e) => {
                  if (filter !== key) {
                    e.target.style.backgroundColor = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== key) {
                    e.target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          <h2 style={styles.sectionTitle}>
            <span>📋</span>
            Daftar Tugas ({filteredTasks.length})
          </h2>

          <div>
            {filteredTasks.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyStateIcon}>
                  {filter === "completed" ? "🎉" : 
                   filter === "overdue" ? "⏰" : "📝"}
                </div>
                <h3 style={styles.emptyStateTitle}>
                  {filter === "completed" ? "Belum ada tugas yang selesai" : 
                   filter === "overdue" ? "Tidak ada tugas terlambat" : 
                   filter === "pending" ? "Semua tugas sudah selesai" : 
                   "Belum ada tugas"}
                </h3>
                <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                  {filter === "all" ? "Tambahkan tugas pertama Anda untuk memulai!" :
                   filter === "completed" ? "Selesaikan beberapa tugas untuk melihatnya di sini" :
                   "Semua tugas sudah sesuai filter"}
                </p>
                {filter !== "all" && (
                  <button 
                    style={{
                      ...styles.buttonStyle,
                      marginRight: '12px',
                      ...(hoverStates.showAll && { backgroundColor: '#2563eb' })
                    }}
                    onClick={() => setFilter("all")}
                    onMouseEnter={() => handleMouseEnter('showAll')}
                    onMouseLeave={() => handleMouseLeave('showAll')}
                  >
                    👀 Lihat Semua Tugas
                  </button>
                )}
                <button 
                  style={{
                    ...styles.buttonStyle,
                    ...(hoverStates.emptyStateBtn && { backgroundColor: '#2563eb' })
                  }}
                  onClick={openModal}
                  onMouseEnter={() => handleMouseEnter('emptyStateBtn')}
                  onMouseLeave={() => handleMouseLeave('emptyStateBtn')}
                >
                  ➕ Tambah Tugas Baru
                </button>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const completedSubtasksCount = task.completedSubtasks ? task.completedSubtasks.filter(Boolean).length : 0;
                const totalSubtasks = task.subtasks ? task.subtasks.length : 0;
                const progress = totalSubtasks > 0 ? Math.round((completedSubtasksCount / totalSubtasks) * 100) : 0;

                return (
                  <div 
                    key={task._id} 
                    style={{
                      ...styles.taskItem,
                      borderLeftColor: 
                        task.priority === 'high' ? '#dc2626' :
                        task.priority === 'medium' ? '#d97706' : '#059669',
                      opacity: task.status === 'completed' ? 0.7 : 1,
                      backgroundColor: task.status === 'completed' ? '#f8f9fa' : 'white',
                      ...(hoverStates[`task-${task._id}`] && { 
                        transform: 'translateY(-2px)', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' 
                      })
                    }}
                    onMouseEnter={() => handleMouseEnter(`task-${task._id}`)}
                    onMouseLeave={() => handleMouseLeave(`task-${task._id}`)}
                  >
                    <div style={styles.taskHeader}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          ...styles.taskTitle,
                          textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                          color: task.status === 'completed' ? '#6b7280' : '#1f2937'
                        }}>
                          {task.title}
                          {task.status === 'completed' && (
                            <span style={{ 
                              marginLeft: '8px', 
                              fontSize: '12px', 
                              color: '#059669',
                              fontWeight: '500'
                            }}>
                              ✓ Selesai
                            </span>
                          )}
                        </h3>
                        {task.notes && (
                          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.4', marginTop: '4px' }}>
                            {task.notes}
                          </p>
                        )}
                      </div>
                      <span style={{
                        ...styles.priorityBadge,
                        ...(task.priority === 'high' ? styles.priorityHigh : 
                             task.priority === 'medium' ? styles.priorityMedium : 
                             styles.priorityLow)
                      }}>
                        {getPriorityLabel(task.priority)}
                      </span>
                    </div>
                    
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div style={styles.subtaskSection}>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '500' }}>
                          Sub-tugas ({completedSubtasksCount}/{totalSubtasks})
                        </div>
                        {task.subtasks.map((st, i) => (
                          <div key={i} style={styles.subtaskItem}>
                            <div 
                              style={{
                                ...styles.subtaskCheckbox,
                                ...(task.completedSubtasks[i] && styles.subtaskCheckboxChecked),
                                ...(hoverStates[`subtask-${task._id}-${i}`] && { borderColor: '#3b82f6' })
                              }}
                              onClick={() => toggleSubtask(task._id, i)}
                              onMouseEnter={() => handleMouseEnter(`subtask-${task._id}-${i}`)}
                              onMouseLeave={() => handleMouseLeave(`subtask-${task._id}-${i}`)}
                            >
                              {task.completedSubtasks[i] && "✓"}
                            </div>
                            <span style={{
                              ...styles.subtaskText,
                              ...(task.completedSubtasks[i] && styles.subtaskTextCompleted)
                            }}>
                              {st}
                            </span>
                          </div>
                        ))}
                        {totalSubtasks > 0 && (
                          <div style={{ 
                            marginTop: '8px', 
                            fontSize: '12px', 
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <div style={{
                              flex: 1,
                              height: '4px',
                              backgroundColor: '#e5e7eb',
                              borderRadius: '2px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                height: '100%',
                                backgroundColor: progress === 100 ? '#10b981' : '#3b82f6',
                                width: `${progress}%`,
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                            <span>{progress}%</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div style={styles.taskFooter}>
                      <div>
                        {task.deadline && (
                          <span style={{ 
                            ...styles.deadline,
                            ...(isOverdue(task.deadline) && task.status !== 'completed' && styles.deadlineOverdue)
                          }}>
                            ⏰ {new Date(task.deadline).toLocaleString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {isOverdue(task.deadline) && task.status !== 'completed' && (
                              <span style={{ marginLeft: '4px', fontWeight: 'bold' }}>TERLAMBAT!</span>
                            )}
                          </span>
                        )}
                      </div>
                      <span style={{ color: '#9ca3af' }}>
                        Dibuat: {new Date(task.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <div style={styles.actionButtons}>
                      <button 
                        style={{
                          ...styles.actionBtn,
                          ...(task.status === 'completed' ? styles.completeBtnCompleted : styles.completeBtn),
                          ...(hoverStates[`complete-${task._id}`] && { 
                            backgroundColor: task.status === 'completed' ? '#d97706' : '#059669',
                            color: 'white'
                          })
                        }}
                        onClick={() => toggleTaskComplete(task._id)}
                        onMouseEnter={() => handleMouseEnter(`complete-${task._id}`)}
                        onMouseLeave={() => handleMouseLeave(`complete-${task._id}`)}
                        title={task.status === 'completed' ? "Tandai belum selesai" : "Tandai selesai"}
                      >
                        {task.status === 'completed' ? "↶" : "✓"}
                      </button>
                      <button 
                        style={{
                          ...styles.actionBtn,
                          ...styles.deleteBtn,
                          ...(hoverStates[`delete-${task._id}`] && { 
                            backgroundColor: '#dc2626',
                            color: 'white'
                          })
                        }}
                        onClick={() => showDeleteConfirm(task)}
                        onMouseEnter={() => handleMouseEnter(`delete-${task._id}`)}
                        onMouseLeave={() => handleMouseLeave(`delete-${task._id}`)}
                        title="Hapus tugas"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>➕ Tambah Tugas Baru</div>
              <button 
                style={{
                  ...styles.closeBtn,
                  ...(hoverStates.closeModal && { backgroundColor: '#f3f4f6' })
                }} 
                onClick={closeModal}
                onMouseEnter={() => handleMouseEnter('closeModal')}
                onMouseLeave={() => handleMouseLeave('closeModal')}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Judul Tugas *</label>
                <input
                  type="text"
                  id="title"
                  style={styles.formInput}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Masukkan judul tugas..."
                  required
                />
              </div>

              <div style={{ ...styles.formGroup, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={styles.formLabel}>Prioritas</label>
                  <select 
                    id="priority" 
                    style={styles.formSelect}
                    value={formData.priority} 
                    onChange={handleChange}
                  >
                    <option value="high">🔥 Tinggi</option>
                    <option value="medium">⚡ Sedang</option>
                    <option value="low">🌱 Rendah</option>
                  </select>
                </div>
                <div>
                  <label style={styles.formLabel}>Deadline</label>
                  <input
                    type="datetime-local"
                    id="deadline"
                    style={styles.formInput}
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Catatan</label>
                <textarea
                  id="notes"
                  style={styles.formTextarea}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tambahkan catatan untuk tugas ini..."
                  rows="3"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Sub-tugas (pisahkan dengan enter)</label>
                <textarea
                  id="subtasks"
                  style={{ ...styles.formTextarea, minHeight: '100px' }}
                  value={formData.subtasks}
                  onChange={handleChange}
                  placeholder="Sub-tugas 1&#10;Sub-tugas 2&#10;Sub-tugas 3"
                  rows="4"
                />
              </div>

              <div style={styles.formActions}>
                <button 
                  type="button" 
                  style={{
                    ...styles.cancelBtn,
                    ...(hoverStates.cancelBtn && { backgroundColor: '#f3f4f6' })
                  }}
                  onClick={closeModal}
                  onMouseEnter={() => handleMouseEnter('cancelBtn')}
                  onMouseLeave={() => handleMouseLeave('cancelBtn')}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  style={{
                    ...styles.submitBtn,
                    ...(hoverStates.submitBtn && { backgroundColor: '#2563eb' })
                  }}
                  onMouseEnter={() => handleMouseEnter('submitBtn')}
                  onMouseLeave={() => handleMouseLeave('submitBtn')}
                >
                  ✨ Tambah Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>🗑️ Hapus Tugas</div>
              <button 
                style={styles.closeBtn}
                onClick={() => setDeleteConfirm(null)}
              >
                ×
              </button>
            </div>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ marginBottom: '8px', color: '#1f2937' }}>
                Hapus "{deleteConfirm.title}"?
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                Tugas ini akan dihapus permanen dan tidak dapat dikembalikan.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  style={{
                    ...styles.cancelBtn,
                    flex: 1
                  }}
                  onClick={() => handleDeleteConfirm(false)}
                >
                  Batal
                </button>
                <button 
                  style={{
                    ...styles.submitBtn,
                    flex: 1,
                    backgroundColor: '#ef4444'
                  }}
                  onClick={() => handleDeleteConfirm(true)}
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Container */}
      <div style={notificationStyles.notificationContainer}>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            onClose={() => setNotifications(prev => 
              prev.filter(n => n.id !== notification.id)
            )}
          />
        ))}
      </div>

      {/* Global Styles untuk Animation */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOut {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}