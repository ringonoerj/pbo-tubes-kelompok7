import React, { useState } from 'react'
import api from '../services/api.js'

function MemberForm({ onSuccess, onCancel }) {
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/member/register', {
        name,
        phoneNumber,
        discountRate: 0.05 // default 5%
      })
      onSuccess(response.data)
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {error && (
        <div style={{ background: 'var(--danger-light)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', color: '#fda4af', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">Nama Member</label>
        <input 
          type="text" 
          className="form-input" 
          placeholder="Contoh: Budi Santoso" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          required 
        />
      </div>

      <div className="form-group" style={{ margin: 0 }}>
        <label className="form-label">No Handphone</label>
        <input 
          type="tel" 
          className="form-input" 
          placeholder="Contoh: 08567890123" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)}
          required 
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <button 
          type="button" 
          className="btn btn-outline" 
          onClick={onCancel}
          disabled={loading}
          style={{ padding: '0.6rem 1.2rem' }}
        >
          Batal
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
          style={{ padding: '0.6rem 1.2rem' }}
        >
          {loading ? 'Menyimpan...' : 'Daftar Member'}
        </button>
      </div>
    </form>
  )
}

export default MemberForm
