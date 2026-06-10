import React, { useState, useEffect } from 'react'
import api from '../services/api.js'
import { Plus, Edit2, Trash2, ArrowLeft, Loader2, RefreshCw } from 'lucide-react'

function ProductManager() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Form state
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)
  const [productName, setProductName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [price, setPrice] = useState(0)
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (err) {
      console.error(err)
      setError('Gagal memuat daftar produk.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleEditClick = (product) => {
    setIsEditing(true)
    setEditId(product.id)
    setProductName(product.productName)
    setCategory(product.category || '')
    setQuantity(product.quantity)
    setPrice(product.price)
    setFormError('')
  }

  const handleAddNewClick = () => {
    setIsEditing(false)
    setEditId(null)
    setProductName('')
    setCategory('')
    setQuantity(0)
    setPrice(0)
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setFormLoading(true)

    const payload = {
      productName,
      category,
      quantity: parseInt(quantity),
      price: parseFloat(price)
    }

    try {
      if (editId) {
        // Update
        await api.put(`/products/${editId}`, payload)
      } else {
        // Create
        await api.post('/products', payload)
      }
      
      // Reset & refresh
      handleAddNewClick()
      fetchProducts()
    } catch (err) {
      console.error(err)
      setFormError('Gagal menyimpan produk. Cek inputan Anda.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) return
    
    try {
      await api.delete(`/products/${id}`)
      fetchProducts()
    } catch (err) {
      console.error(err)
      alert('Gagal menghapus produk. Mungkin produk ini sudah pernah ditransaksikan.')
    }
  }

  const formatRupiah = (num) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
      
      {/* Product Table List */}
      <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Manajemen Produk</h2>
            <p>Kelola data barang dagangan kasir di sini</p>
          </div>
          <button className="btn btn-outline" onClick={fetchProducts} style={{ padding: '0.5rem' }}>
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
        ) : products.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', padding: '3rem 0', textAlign: 'center' }}>Belum ada produk di database.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama Produk</th>
                  <th>Kategori</th>
                  <th>Harga</th>
                  <th style={{ textAlign: 'center' }}>Stok</th>
                  <th style={{ textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td style={{ fontWeight: '600' }}>{p.productName}</td>
                    <td><span className="badge badge-primary">{p.category || 'Umum'}</span></td>
                    <td style={{ color: 'var(--secondary)', fontWeight: '600' }}>{formatRupiah(p.price)}</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{p.quantity}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleEditClick(p)}
                          style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--secondary)' }}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => handleDelete(p.id)}
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
          {editId ? 'Edit Data Produk' : 'Tambah Produk Baru'}
        </h3>

        {formError && (
          <div style={{ background: 'var(--danger-light)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', color: '#fda4af', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Nama Produk</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Contoh: Indomie Goreng" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)}
              required 
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Kategori</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Contoh: Makanan, Minuman, Alat Tulis" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Stok Awal</label>
              <input 
                type="number" 
                className="form-input" 
                min="0"
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)}
                required 
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">Harga (Rp)</label>
              <input 
                type="number" 
                className="form-input" 
                min="0"
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            {editId && (
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
              {formLoading ? 'Menyimpan...' : editId ? 'Perbarui Produk' : 'Tambah Produk'}
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default ProductManager
