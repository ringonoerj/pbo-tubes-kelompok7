import React, { useState, useEffect } from 'react'
import api from '../services/api.js'
import { Plus, ShoppingCart, Loader2 } from 'lucide-react'

function ProductList({ searchTerm, onAddToCart, cartItems }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (err) {
      console.error(err)
      setError('Gagal memuat produk. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // Helper to format currency to IDR (Rupiah)
  const formatRupiah = (num) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  }

  const filteredProducts = products.filter(product => {
    const term = searchTerm.toLowerCase()
    return (
      product.productName.toLowerCase().includes(term) ||
      (product.category && product.category.toLowerCase().includes(term))
    )
  })

  // Helper to get cart quantity for a product
  const getCartQty = (productId) => {
    const item = cartItems.find(i => i.product.id === productId)
    return item ? item.quantity : 0
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', flexDirection: 'column', gap: '1rem' }}>
        <Loader2 className="animate-spin" size={36} style={{ color: 'var(--primary)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Memuat katalog produk...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</p>
        <button className="btn btn-primary" onClick={fetchProducts}>Muat Ulang</button>
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Tidak ada produk yang cocok dengan pencarian Anda.</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
      {filteredProducts.map(product => {
        const cartQty = getCartQty(product.id)
        const isOutOfStock = product.quantity <= 0
        const isSelected = cartQty > 0

        return (
          <div 
            key={product.id} 
            className="glass-panel animate-fade-in"
            onClick={() => !isOutOfStock && onAddToCart(product)}
            style={{ 
              padding: '1.5rem', 
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              transform: isSelected ? 'scale(1.02)' : 'none',
              borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
              opacity: isOutOfStock ? 0.6 : 1,
              height: '220px'
            }}
          >
            {/* Cart Badge Count */}
            {isSelected && (
              <div style={{ 
                position: 'absolute', 
                top: '0', 
                right: '0', 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '0.25rem 0.75rem', 
                borderBottomLeftRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <ShoppingCart size={12} />
                {cartQty}
              </div>
            )}

            <div>
              {/* Category */}
              <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
                {product.category || 'Lainnya'}
              </span>

              {/* Product Name */}
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                {product.productName}
              </h3>
            </div>

            <div>
              {/* Price & Stock info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Harga</p>
                  <p style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--secondary)' }}>
                    {formatRupiah(product.price)}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stok</p>
                  {isOutOfStock ? (
                    <span className="badge" style={{ background: 'var(--danger-light)', color: '#fda4af', border: '1px solid rgba(239,68,68,0.2)' }}>Habis</span>
                  ) : (
                    <p style={{ fontSize: '0.95rem', fontWeight: '600', color: product.quantity < 10 ? '#fda4af' : 'var(--text-primary)' }}>
                      {product.quantity}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductList
