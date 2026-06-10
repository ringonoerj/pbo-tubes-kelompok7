import React, { useState } from 'react'
import api from '../services/api.js'
import { Lock, User, ShieldAlert, ShoppingBag } from 'lucide-react'

function Login({ onLoginSuccess }) {
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', { employeeId, password })
      if (response.data.success) {
        onLoginSuccess(response.data)
      } else {
        setError('ID Karyawan atau Password salah')
      }
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Login gagal. Hubungi Administrator.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', borderRadius: 'var(--radius-lg)' }}>
        
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--primary-light)', padding: '1rem', borderRadius: '50%', color: 'var(--primary)', marginBottom: '1rem' }}>
            <ShoppingBag size={36} />
          </div>
          <h2>SMARTCASHIER</h2>
          <p style={{ marginTop: '0.25rem' }}>Silakan login untuk melayani transaksi</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--danger-light)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', color: '#fca5a5', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Employee ID */}
          <div className="form-group">
            <label className="form-label">ID Karyawan</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Contoh: EMP001" 
                value={employeeId} 
                onChange={(e) => setEmployeeId(e.target.value)}
                style={{ paddingLeft: '2.8rem' }}
                required 
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.8rem' }}
                required 
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem' }} 
            disabled={loading}
          >
            {loading ? 'Menghubungkan...' : 'Masuk Aplikasi'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Gunakan akun demo: <strong>EMP001</strong> / <strong>rahasia123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
