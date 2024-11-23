'use client';

import { useParams } from 'next/navigation';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/Footer';

const products = [
  { id: '101', departmentId: '1', name: 'Televisor', price: '$300.00' },
  { id: '102', departmentId: '1', name: 'Refrigerador', price: '$500.00' },
  { id: '103', departmentId: '2', name: 'Sofá', price: '$200.00' },
  { id: '104', departmentId: '2', name: 'Mesa', price: '$100.00' },
  { id: '105', departmentId: '1', name: 'Laptop', price: '$800.00' },
  { id: '106', departmentId: '2', name: 'Cama', price: '$400.00' },

];

export default function ProductPage() {
  const { id, productId } = useParams();
  const product = products.find(p => p.id === productId);

  if (!product) {
    return <div>Producto no encontrado</div>;
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src="/images/logo.png" alt={product.name} style={{ width: '200px', height: '200px', margin: '0 auto' }} />
        </div>
        <div style={{ flex: 1, paddingLeft: '2rem' }}>
          <h1>{product.name}</h1>
          <p>Precio: {product.price}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}