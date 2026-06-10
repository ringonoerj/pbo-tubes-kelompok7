import React, { useState } from 'react'
import ProductList from './ProductList.jsx'
import Cart from './Cart.jsx'

function Dashboard({ onViewReceipt, updateKPI }) {
  const [cartItems, setCartItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddToCart = (product) => {
    if (product.quantity <= 0) {
      alert('Stok produk habis!')
      return
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id)
      if (existingItem) {
        if (existingItem.quantity >= product.quantity) {
          alert('Batas maksimal stok tercapai!')
          return prevItems
        }
        return prevItems.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { product, quantity: 1 }]
    })
  }

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId)
      return
    }
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.product.id === productId) {
          if (newQty > item.product.quantity) {
            alert('Batas maksimal stok tercapai!')
            return item
          }
          return { ...item, quantity: newQty }
        }
        return item
      })
    )
  }

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId))
  }

  const handleClearCart = () => {
    setCartItems([])
  }

  const handleTransactionSuccess = (receiptResponse) => {
    handleClearCart()
    // Award 5.0 points to Cashier in UI
    const localKaryawan = localStorage.getItem('karyawan')
    if (localKaryawan) {
      const parsed = JSON.parse(localKaryawan)
      const newScore = parsed.kpiScore + 5.0
      updateKPI(newScore)
    }
    onViewReceipt(receiptResponse.transactionId)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem', alignItems: 'start' }}>
      
      {/* Product Catalog Column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem' }}>Katalog Produk</h2>
            <p>Klik produk untuk menambahkannya ke keranjang belanja</p>
          </div>
          <div>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Cari produk..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '250px' }}
            />
          </div>
        </div>
        
        <ProductList 
          searchTerm={searchTerm} 
          onAddToCart={handleAddToCart}
          cartItems={cartItems}
        />
      </div>

      {/* Cart Sidebar Column */}
      <div>
        <Cart 
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onCheckoutSuccess={handleTransactionSuccess}
        />
      </div>

    </div>
  )
}

export default Dashboard
