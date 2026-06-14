import React, { useState, useEffect } from 'react'
import api from '../services/api.js'
import { Plus, Edit2, Trash2, Loader2, RefreshCw, User, Phone, Key, Award, ShieldAlert } from 'lucide-react'

function KaryawanManager() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Form state
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [employeeId, setEmployeeId] = useState('')
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [kpiScore, setKpiScore] = useState(0)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await api.get('/karyawan')
      setEmployees(response.data)
    } catch (err) {
      console.error(err)
      setError('Gagal memuat daftar karyawan.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleEditClick = (emp) => {
    setIsEditing(true)
    setEditId(emp.id)
    setEmployeeId(emp.employeeId)
    setName(emp.name)
    setPhoneNumber(emp.phoneNumber || '')
    setPassword('') // Kosongkan password untuk keamanan, hanya diisi jika ingin diubah
    setKpiScore(emp.kpiScore || 0)
    setFormError('')
  }

  const handleAddNewClick = () => {
    setIsEditing(false)
    setEditId(null)
    setEmployeeId('')
    setName('')
    setPhoneNumber('')
    setPassword('')
    setKpiScore(0)
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    // Validasi input
    if (!employeeId.trim() || !name.trim()) {
      setFormError('ID Karyawan dan Nama tidak boleh kosong.')
      setFormLoading(false)
      return
    }

    if (!isEditing && !password) {
      setFormError('Password wajib diisi untuk karyawan baru.')
      setFormLoading(false)
      return
    }

    const payload = {
      id: editId || employeeId,
      employeeId,
      name,
      phoneNumber,
      kpiScore: parseFloat(kpiScore)
    }

    // Hanya kirim password jika diisi (untuk mencegah overwrite dengan string kosong saat edit)
    if (password) {
      payload.password = password
    } else if (isEditing) {
      // Cari password lama karyawan yang sedang diedit agar tidak ter-overwrite kosong di database
      const currentEmp = employees.find(e => e.id === editId)
      if (currentEmp) {
        payload.password = currentEmp.password
      }
    }

    try {
      if (isEditing) {
        // Update
        await api.put(`/karyawan/${editId}`, payload)
      } else {
        // Create
        await api.post('/karyawan', payload)
      }
      
      // Reset & refresh
      handleAddNewClick()
      fetchEmployees()
    } catch (err) {
      console.error(err)
      if (err.response && err.response.status === 409) {
        setFormError('Gagal menyimpan. ID Karyawan sudah digunakan.')
      } else {
        setFormError('Gagal menyimpan data karyawan. Silakan periksa kembali inputan Anda.')
      }
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id, empName) => {
    const activeUser = JSON.parse(localStorage.getItem('karyawan') || '{}')
    if (activeUser.id === id) {
      alert('Anda tidak bisa menghapus akun Anda sendiri yang sedang aktif digunakan login!')
      return
    }

    if (!window.confirm(`Apakah Anda yakin ingin menghapus karyawan "${empName}"?`)) return
    
    try {
      await api.delete(`/karyawan/${id}`)
      fetchEmployees()
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus karyawan. Kemungkinan karyawan ini sudah memiliki data transaksi di sistem.')
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
      
      {/* Employee Table List */}
      <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Manajemen Karyawan</h2>
            <p>Kelola data akun kasir dan staf toko di sini</p>
          </div>
          <button className="btn btn-outline" onClick={fetchEmployees} style={{ padding: '0.5rem' }}>
            <RefreshCw size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', flexDirection: 'column', gap: '1rem' }}>
            <Loader2 className="animate-spin" size={30} style={{ color: 'var(--primary)' }} />
            <p style={{ color: 'var(--text-secondary)' }}>Memuat data...</p>
          </div>
        ) : error ? (
          <p style={{ color: 'var(--danger)', padding: '2rem 0', textAlign: 'center' }}>{error}</p>
        ) : employees.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '3rem 0', textAlign: 'center' }}>Belum ada karyawan di database.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID Sistem</th>
                  <th>ID Karyawan</th>
                  <th>Nama Lengkap</th>
                  <th>No. Telepon</th>
                  <th style={{ textAlign: 'center' }}>KPI Score</th>
                  <th style={{ textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => (
                  <tr key={emp.id}>
                    <td>{emp.id}</td>
                    <td style={{ fontWeight: '700', color: 'var(--primary-light)' }}>{emp.employeeId}</td>
                    <td style={{ fontWeight: '600' }}>{emp.name}</td>
                    <td>{emp.phoneNumber || '-'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Award size={12} style={{ color: 'var(--secondary)' }} />
                        {emp.kpiScore !== undefined ? emp.kpiScore.toFixed(1) : '0.0'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleEditClick(emp)}
                          style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--secondary)' }}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleDelete(emp.id, emp.name)}
                          style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--danger)' }}
                          title="Hapus"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Editor Card */}
      <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
          {isEditing ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
        </h3>

        {formError && (
          <div style={{ background: 'var(--danger-light)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', color: '#fda4af', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">ID Karyawan (untuk Login)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Contoh: EMP003" 
                value={employeeId} 
                onChange={(e) => setEmployeeId(e.target.value)}
                disabled={isEditing}
                required 
              />
            </div>
            {isEditing && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>ID Karyawan tidak dapat diubah setelah disimpan.</p>}
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Nama Lengkap</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Contoh: Jane Doe" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">No. Telepon</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Contoh: 08123456789" 
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder={isEditing ? "Kosongkan jika tidak ingin diubah" : "Masukkan password login"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required={!isEditing}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">KPI Score</label>
            <input 
              type="number" 
              step="0.1"
              min="0"
              className="form-input" 
              placeholder="0.0" 
              value={kpiScore} 
              onChange={(e) => setKpiScore(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            {isEditing && (
              <button 
                type="button" 
                className="btn btn-outline" 
                onClick={handleAddNewClick}
                disabled={formLoading}
              >
                Batal
              </button>
            )}
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={formLoading}
              style={{ flex: 1 }}
            >
              {formLoading ? 'Menyimpan...' : isEditing ? 'Perbarui Karyawan' : 'Tambah Karyawan'}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default KaryawanManager
