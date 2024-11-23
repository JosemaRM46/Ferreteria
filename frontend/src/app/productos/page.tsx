'use client';

import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const products = [
  { id: 1, name: 'Martillo', price: '$10.00' },
  { id: 2, name: 'Destornillador', price: '$5.00' },
  { id: 3, name: 'Taladro', price: '$50.00' },
  { id: 4, name: 'Sierra', price: '$30.00' },
  { id: 5, name: 'Llave Inglesa', price: '$15.00' },
  { id: 6, name: 'Alicate', price: '$8.00' },
  { id: 7, name: 'Cinta Métrica', price: '$3.00' },
  { id: 8, name: 'Nivel', price: '$12.00' },
];

export default function Productos() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1>Herramientas</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {products.map(product => (
            <Link key={product.id} href={`/productos/${product.id}`} passHref>
              <div style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
                <img src="/images/logo.png" alt={product.name} style={{ width: '100px', height: '100px', marginBottom: '1rem', margin: '0 auto' }} />
                <h2>{product.name}</h2>
                <p>{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}