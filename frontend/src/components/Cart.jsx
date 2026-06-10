import React, { useState } from 'react'
import api from '../services/api.js'
import MemberForm from './MemberForm.jsx'
import { Plus, Minus, Trash2, Search, UserCheck, UserPlus, CreditCard, ShoppingCart } from 'lucide-react'

function Cart({ cartItems, onUpdateQuantity, onRemoveItem, onCheckoutSuccess }) {
  const [memberPhone, setMemberPhone] = useState('')
  const [member, setMember] = useState(null)
  const [memberSearchError, setMemberSearchError] = useState('')
  const [showMemberRegisterModal, setShowMemberRegisterModal] = useState(false)
  const [isSearchingMember, setIsSearchingMember] = useState(false)
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false)

  // Format IDR currency
  const formatRupiah = (num) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  // Calculate Subtotal (price * quantity)
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  // Calculate Discount
  const discountRate = member ? member.discountRate : 0.0
  const discountAmount = subtotal * discountRate
  const finalTotal = subtotal - discountAmount

  // Look up member by phone number
  const handleSearchMember = async (e) => {
    e?.preventDefault()
    if (!memberPhone.trim()) return

    setIsSearchingMember(true)
    setMemberSearchError('')
    setMember(null)

    try {
      const response = await api.get(`/member/${memberPhone.trim()}`)
      if (response.data) {
        setMember(response.data)
        setMemberSearchError('')
      } else {
        setMemberSearchError('Member tidak terdaftar')
      }
    } catch (err) {
      console.error(err)
      setMemberSearchError('Error mencari member')
    } finally {
      setIsSearchingMember(false)
    }
  }

  // Register member success callback
  const handleRegisterMemberSuccess = (newMember) => {
    setMember(newMember)
    setMemberPhone(newMember.phoneNumber)
    setShowMemberRegisterModal(false)
    setMemberSearchError('')
  }

  // Submit transaction to backend
  const handleProcessTransaction = async () => {
    if (cartItems.length === 0) {
      alert('Keranjang belanja kosong!')
      return
    }

    setIsSubmittingTransaction(true)
    try {
      const requestData = {
        memberPhone: member ? member.phoneNumber : null,
        items: cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      }

      const response = await api.post('/transactions', requestData)
      onCheckoutSuccess(response.data)
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Gagal memproses transaksi. Coba lagi.')
    } finally {
      setIsSubmittingTransaction(false)
    }
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '500px', position: 'sticky', top: '120px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
        <ShoppingCart size={20} style={{ color: 'var(--primary)' }} />
        <h2 style={{ fontSize: '1.25rem' }}>Keranjang Belanja</h2>
      </div>

      {/* Cart Items List */}
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.9rem' }}>Belum ada item ditambahkan</p>
          </div>
        ) : (
          cartItems.map(item => (
            <div 
              key={item.product.id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                background: 'rgba(255,255,255,0.02)', 
                padding: '0.75rem 1rem', 
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(255,255,255,0.04)' 
              }}
            >
              <div style={{ flex: 1, minWidth: '0' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.product.productName}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {formatRupiah(item.product.price)} x {item.quantity}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                  <button 
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.35rem 0.5rem', cursor: 'pointer' }}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', padding: '0 0.5rem', minWidth: '24px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    style={{ background: 'transparent', border: 'none', color: 'white', padding: '0.35rem 0.5rem', cursor: 'pointer' }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => onRemoveItem(item.product.id)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.4rem' }}
                  title="Hapus"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Member Section */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Informasi Member</h3>
        
        {member ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--success-light)', border: '1px solid rgba(16,185,129,0.2)', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)' }}>
            <div>
              <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#a7f3d0' }}>
                {member.name}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>
                Diskon Member: {(member.discountRate * 100)}%
              </p>
            </div>
            <button 
              className="btn btn-outline" 
              onClick={() => { setMember(null); setMemberPhone(''); }}
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#fda4af', borderColor: 'rgba(239,68,68,0.2)' }}
            >
              Batal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSearchMember} style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="No HP Member..." 
                value={memberPhone} 
                onChange={(e) => setMemberPhone(e.target.value)}
                style={{ paddingRight: '2.5rem', fontSize: '0.875rem', padding: '0.6rem 0.8rem' }}
              />
              <button 
                type="submit" 
                style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                disabled={isSearchingMember}
              >
                <Search size={16} />
              </button>
            </div>
            
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => setShowMemberRegisterModal(true)}
              style={{ padding: '0.5rem', borderRadius: '8px' }}
              title="Daftar Member Baru"
            >
              <UserPlus size={16} />
            </button>
          </form>
        )}

        {memberSearchError && (
          <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.35rem' }}>
            {memberSearchError}
          </p>
        )}
      </div>

      {/* Bill Breakdown */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <span>Subtotal</span>
          <span>{formatRupiah(subtotal)}</span>
        </div>

        {member && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--success)' }}>
            <span>Diskon Member ({(discountRate * 100)}%)</span>
            <span>-{formatRupiah(discountAmount)}</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', borderTop: '1px dashed var(--border-color)', paddingTop: '0.5rem', marginTop: '0.25rem' }}>
          <span>Total Akhir</span>
          <span style={{ color: 'var(--secondary)' }}>{formatRupiah(finalTotal)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button 
        className="btn btn-primary" 
        onClick={handleProcessTransaction}
        disabled={cartItems.length === 0 || isSubmittingTransaction}
        style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
      >
        <CreditCard size={18} />
        {isSubmittingTransaction ? 'Memproses...' : 'Proses Transaksi'}
      </button>

      {/* Register Member Modal */}
      {showMemberRegisterModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Registrasi Member Baru</h3>
              <button 
                onClick={() => setShowMemberRegisterModal(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                &times;
              </button>
            </div>
            <MemberForm 
              onSuccess={handleRegisterMemberSuccess} 
              onCancel={() => setShowMemberRegisterModal(false)} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
