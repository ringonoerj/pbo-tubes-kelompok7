import React, { useState, useEffect } from 'react'
import api from '../services/api.js'
import { ArrowLeft, Printer, Loader2, Calendar, User, Percent, Receipt as ReceiptIcon } from 'lucide-react'

function Receipt({ transactionId, onBack }) {
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/transactions/${transactionId}/receipt`)
        setReceipt(response.data)
      } catch (err) {
        console.error(err)
        setError('Gagal memuat struk transaksi.')
      } finally {
        setLoading(false)
      }
    }

    if (transactionId) {
      fetchReceipt()
    }
  }, [transactionId])

  const formatRupiah = (num) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 className="animate-spin" size={36} style={{ color: 'var(--primary)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Memuat struk belanja...</p>
      </div>
    )
  }

  if (error || !receipt) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px', margin: '2rem auto' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error || 'Struk tidak ditemukan'}</p>
        <button className="btn btn-primary" onClick={onBack}>Kembali ke Dashboard</button>
      </div>
    )
  }

  // Calculate Subtotal before discount
  const subtotalBeforeDiscount = receipt.items.reduce((sum, item) => sum + item.subtotal, 0)
  const discountAmount = subtotalBeforeDiscount * receipt.discountRate

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Action Buttons (Hidden on print) */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="btn btn-outline" onClick={onBack} style={{ padding: '0.6rem 1rem' }}>
          <ArrowLeft size={16} />
          Kembali
        </button>
        <button className="btn btn-primary" onClick={handlePrint} style={{ padding: '0.6rem 1rem' }}>
          <Printer size={16} />
          Cetak Struk
        </button>
      </div>

      {/* Printable Receipt Card */}
      <div className="glass-panel" style={{ padding: '2.5rem 2rem', borderRadius: 'var(--radius-md)', background: 'rgba(20, 26, 46, 0.8)', border: '1px solid var(--border-color)' }}>
        
        {/* Receipt Header */}
        <div style={{ textAlign: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', background: 'var(--primary-light)', padding: '0.6rem', borderRadius: '50%', color: 'var(--primary)', marginBottom: '0.5rem' }}>
            <ReceiptIcon size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '0.05em' }}>SMARTCASHIER</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Struk Pembelian Barang Kelompok 7</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Jl. Telekomunikasi No. 1, Bandung</p>
        </div>

        {/* Transaction Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '1.2rem', marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>No. Transaksi</span>
            <span style={{ fontWeight: '600' }}>{receipt.transactionId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Waktu</span>
            <span>{new Date(receipt.transactionDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Kasir</span>
            <span style={{ fontWeight: '500' }}>{receipt.karyawanName}</span>
          </div>
          {receipt.memberName && receipt.memberName !== '-' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--success-light)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(16,185,129,0.1)' }}>
              <span style={{ color: '#6ee7b7', fontWeight: '500' }}>Member</span>
              <span style={{ color: '#a7f3d0', fontWeight: '600' }}>{receipt.memberName}</span>
            </div>
          )}
        </div>

        {/* Purchased Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderBottom: '1px dashed var(--border-color)', paddingBottom: '1.2rem', marginBottom: '1.2rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Daftar Item</p>
          {receipt.items.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', fontSize: '0.9rem' }}>
              <div style={{ flex: 1, paddingRight: '1rem' }}>
                <p style={{ fontWeight: '500' }}>{item.productName}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {formatRupiah(item.price)} x {item.quantity}
                </p>
              </div>
              <span style={{ fontWeight: '600' }}>{formatRupiah(item.subtotal)}</span>
            </div>
          ))}
        </div>

        {/* Financial Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Total Kotor</span>
            <span>{formatRupiah(subtotalBeforeDiscount)}</span>
          </div>

          {receipt.discountRate > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
              <span>Diskon Member ({(receipt.discountRate * 100)}%)</span>
              <span>-{formatRupiah(discountAmount)}</span>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem', marginTop: '0.4rem' }}>
            <span>Total Bayar</span>
            <span style={{ color: 'var(--secondary)' }}>{formatRupiah(receipt.totalAmount)}</span>
          </div>
        </div>

        {/* Footer Note */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <p style={{ fontStyle: 'italic' }}>Terima kasih atas kunjungan Anda!</p>
          <p style={{ marginTop: '0.25rem' }}>Barang yang sudah dibeli tidak dapat ditukar</p>
        </div>

      </div>
    </div>
  )
}

export default Receipt
