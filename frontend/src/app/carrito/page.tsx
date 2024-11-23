'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const cartItems = [
  { id: '101', name: 'Televisor', price: '$300.00', quantity: 1 },
  { id: '102', name: 'Refrigerador', price: '$500.00', quantity: 2 },
];

export default function CartPage() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Carrito de Compras</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
              <img src="/images/logo.png" alt={item.name} style={{ width: '100px', height: '100px', marginRight: '1rem' }} />
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0 }}>{item.name}</h2>
                <p style={{ margin: 0 }}>{item.price}</p>
              </div>
              <div>
                <p style={{ margin: 0 }}>Cantidad: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}