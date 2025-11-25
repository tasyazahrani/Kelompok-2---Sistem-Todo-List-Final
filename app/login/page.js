"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  });
  
  const [feedback, setFeedback] = useState({
    show: false,
    message: '',
    type: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace('login', '').toLowerCase();
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback({
          show: true,
          message: 'Login successful! Redirecting...',
          type: 'success'
        });
        
        // Simpan user data di localStorage/session
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setFeedback({
          show: true,
          message: data.error,
          type: 'error'
        });
      }
    } catch (error) {
      setFeedback({
        show: true,
        message: 'Network error. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert('Please contact support to reset your password');
  };

  // Styles (sama dengan register)
  const styles = {
    // ... (styles sama seperti di register page)
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    },
    bgDecoration: {
      position: 'absolute',
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      opacity: 0.1
    },
    mainContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '40px',
      maxWidth: '400px',
      width: '100%'
    },
    splashScreen: {
      textAlign: 'center',
      color: '#2563eb'
    },
    logo: {
      width: '64px',
      height: '64px',
      margin: '0 auto 16px',
      color: '#2563eb'
    },
    splashTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      margin: '0 0 8px 0'
    },
    splashSubtitle: {
      fontSize: '16px',
      color: '#6b7280',
      margin: 0
    },
    authForm: {
      backgroundColor: 'white',
      padding: '32px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      width: '100%'
    },
    feedback: {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px'
    },
    feedbackSuccess: {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      border: '1px solid #a7f3d0'
    },
    feedbackError: {
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      border: '1px solid #fecaca'
    },
    formHeader: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    formTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#111827',
      margin: '0 0 8px 0'
    },
    formSubtitle: {
      fontSize: '14px',
      color: '#6b7280',
      margin: 0
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.2s',
      boxSizing: 'border-box'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#2563eb',
      boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
    },
    formFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '20px'
    },
    forgotPassword: {
      fontSize: '14px',
      color: '#2563eb',
      textDecoration: 'none',
      cursor: 'pointer'
    },
    forgotPasswordHover: {
      textDecoration: 'underline'
    },
    button: {
      width: '100%',
      padding: '12px 16px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      opacity: 1
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    buttonPrimary: {
      backgroundColor: '#2563eb',
      color: 'white'
    },
    buttonHover: {
      backgroundColor: '#1d4ed8',
      transform: 'translateY(-1px)'
    },
    switchForm: {
      textAlign: 'center',
      marginTop: '24px',
      fontSize: '14px',
      color: '#6b7280'
    },
    link: {
      color: '#2563eb',
      textDecoration: 'none',
      fontWeight: '500'
    },
    linkHover: {
      textDecoration: 'underline'
    }
  };

  const [hoverStates, setHoverStates] = useState({});

  const handleMouseEnter = (element) => {
    setHoverStates(prev => ({ ...prev, [element]: true }));
  };

  const handleMouseLeave = (element) => {
    setHoverStates(prev => ({ ...prev, [element]: false }));
  };

  return (
    <div style={styles.container}>
      {/* Background Decorations */}
      <div style={{...styles.bgDecoration, top: '10%', left: '10%'}}></div>
      <div style={{...styles.bgDecoration, top: '60%', right: '10%'}}></div>
      <div style={{...styles.bgDecoration, bottom: '10%', left: '20%'}}></div>
      <div style={{...styles.bgDecoration, top: '20%', right: '20%'}}></div>
      
      <div style={styles.mainContainer}>
        <div style={styles.splashScreen}>
          <div style={styles.logo}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              <path d="M10.95,18.95C10.95,19.5 10.55,19.95 10,19.95C9.45,19.95 9.05,19.5 9.05,18.95C9.05,18.45 9.45,18 10,18C10.55,18 10.95,18.45 10.95,18.95M12.95,16.95C12.95,17.5 12.55,17.95 12,17.95C11.45,17.95 11.05,17.5 11.05,16.95C11.05,16.45 11.45,16 12,16C12.55,16 12.95,16.45 12.95,16.95M8.95,16.95C8.95,17.5 8.55,17.95 8,17.95C7.45,17.95 7.05,17.5 7.05,16.95C7.05,16.45 7.45,16 8,16C8.55,16 8.95,16.45 8.95,16.95M10.95,14.95C10.95,15.5 10.55,15.95 10,15.95C9.45,15.95 9.05,15.5 9.05,14.95C9.05,14.45 9.45,14 10,14C10.55,14 10.95,14.45 10.95,14.95M12.95,12.95C12.95,13.5 12.55,13.95 12,13.95C11.45,13.95 11.05,13.5 11.05,12.95C11.05,12.45 11.45,12 12,12C12.55,12 12.95,12.45 12.95,12.95M8.95,12.95C8.95,13.5 8.55,13.95 8,13.95C7.45,13.95 7.05,13.5 7.05,12.95C7.05,12.45 7.45,12 8,12C8.55,12 8.95,12.45 8.95,12.95"/>
            </svg>
          </div>
          <h1 style={styles.splashTitle}>TaskFlow</h1>
          <p style={styles.splashSubtitle}>Manage your tasks efficiently</p>
        </div>
        
        <div style={styles.authForm}>
          {feedback.show && (
            <div style={{
              ...styles.feedback,
              ...(feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError)
            }}>
              {feedback.message}
            </div>
          )}
          
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome Back</h2>
            <p style={styles.formSubtitle}>Sign in to your account</p>
          </div>
          
          <form id="loginForm" onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="loginMobile" style={styles.label}>Mobile</label>
              <input
                type="tel"
                id="loginMobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="08473589556"
                required
                style={styles.input}
                onFocus={(e) => e.target.style = {...styles.input, ...styles.inputFocus}}
                onBlur={(e) => e.target.style = styles.input}
                disabled={isLoading}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="loginPassword" style={styles.label}>Password</label>
              <input
                type="password"
                id="loginPassword"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={styles.input}
                onFocus={(e) => e.target.style = {...styles.input, ...styles.inputFocus}}
                onBlur={(e) => e.target.style = styles.input}
                disabled={isLoading}
              />
            </div>
            
            <div style={styles.formFooter}>
              <a 
                href="#" 
                id="forgotPassword" 
                onClick={handleForgotPassword}
                style={{
                  ...styles.forgotPassword,
                  ...(hoverStates.forgotPassword ? styles.forgotPasswordHover : {})
                }}
                onMouseEnter={() => handleMouseEnter('forgotPassword')}
                onMouseLeave={() => handleMouseLeave('forgotPassword')}
              >
                Forgot Password?
              </a>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                ...styles.button,
                ...styles.buttonPrimary,
                ...(hoverStates.loginBtn && !isLoading ? styles.buttonHover : {}),
                ...(isLoading ? styles.buttonDisabled : {})
              }}
              onMouseEnter={() => !isLoading && handleMouseEnter('loginBtn')}
              onMouseLeave={() => !isLoading && handleMouseLeave('loginBtn')}
            >
              {isLoading ? 'Logging in...' : 'LOG IN'}
            </button>
          </form>
          
          <div style={styles.switchForm}>
            Don't have an account?{' '}
            <Link 
              href="/register" 
              style={{
                ...styles.link,
                ...(hoverStates.registerLink ? styles.linkHover : {})
              }}
              onMouseEnter={() => handleMouseEnter('registerLink')}
              onMouseLeave={() => handleMouseLeave('registerLink')}
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}