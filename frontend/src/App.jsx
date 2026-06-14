import React, { useState, useEffect } from 'react'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import ProductManager from './components/ProductManager.jsx'
import KaryawanManager from './components/KaryawanManager.jsx'
import Receipt from './components/Receipt.jsx'
import { Layout, LogOut, Award, ShoppingBag, FolderOpen, Users } from 'lucide-react'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [activePage, setActivePage] = useState('dashboard') // dashboard, products, receipt
  const [activeReceiptId, setActiveReceiptId] = useState(null)

  useEffect(() => {
    const savedKaryawan = localStorage.getItem('karyawan')
    if (savedKaryawan) {
      setCurrentUser(JSON.parse(savedKaryawan))
    }
  }, [])

  const handleLoginSuccess = (karyawanData) => {
    localStorage.setItem('karyawan', JSON.stringify(karyawanData))
    setCurrentUser(karyawanData)
    setActivePage('dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('karyawan')
    setCurrentUser(null)
    setActiveReceiptId(null)
  }

  const handleViewReceipt = (receiptId) => {
    setActiveReceiptId(receiptId)
    setActivePage('receipt')
  }

  // Live reload KPI from database when we change pages or process transaction
  const refreshKPI = async () => {
    if (!currentUser) return
    try {
      const response = await fetch(`/api/products`); // simple ping
      // We can also fetch the specific karyawan if needed, but we keep it simple for now
    } catch (e) {
      console.error(e)
    }
  }

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="glass-panel no-print" style={{ margin: '1rem', padding: '1rem 2rem', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ background: 'var(--primary-light)', padding: '0.6rem', borderRadius: '8px', color: 'var(--primary)' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '800', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SMARTCASHIER</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Sistem Kasir Modern Kelompok 7</p>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${activePage === 'dashboard' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => { setActivePage('dashboard'); refreshKPI(); }}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <ShoppingBag size={16} />
            Transaksi
          </button>
          <button 
            className={`btn ${activePage === 'products' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => { setActivePage('products'); refreshKPI(); }}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <FolderOpen size={16} />
            Kelola Produk
          </button>
          <button 
            className={`btn ${activePage === 'karyawan' ? 'btn-primary' : 'btn-outline'}`} 
            onClick={() => { setActivePage('karyawan'); refreshKPI(); }}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            <Users size={16} />
            Kelola Karyawan
          </button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
            <Award size={16} style={{ color: 'var(--secondary)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              KPI: <strong style={{ color: 'var(--secondary)' }}>{currentUser.kpiScore.toFixed(1)}</strong>
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>{currentUser.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kasir Aktif</p>
          </div>

          <button className="btn btn-outline" onClick={handleLogout} style={{ padding: '0.5rem', borderRadius: '8px' }} title="Logout">
            <LogOut size={16} style={{ color: 'var(--danger)' }} />
          </button>
        </div>
      </header>

      {/* Main Pages */}
      <main className="main-content">
        {activePage === 'dashboard' && (
          <Dashboard onViewReceipt={handleViewReceipt} updateKPI={(kpi) => {
            const updatedUser = { ...currentUser, kpiScore: kpi }
            setCurrentUser(updatedUser)
            localStorage.setItem('karyawan', JSON.stringify(updatedUser))
          }} />
        )}
        {activePage === 'products' && (
          <ProductManager />
        )}
        {activePage === 'karyawan' && (
          <KaryawanManager />
        )}
        {activePage === 'receipt' && (
          <Receipt transactionId={activeReceiptId} onBack={() => setActivePage('dashboard')} />
        )}
      </main>
    </div>
  )
}

export default App
