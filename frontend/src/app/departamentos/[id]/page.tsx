'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const departments = [
  { id: '1', name: 'Electrónica' },
  { id: '2', name: 'Hogar' },
];

const products = [
  { productId: '101', departmentId: '1', name: 'Televisor', price: '$300.00' },
  { productId: '102', departmentId: '1', name: 'Refrigerador', price: '$500.00' },
  { productId: '103', departmentId: '2', name: 'Sofá', price: '$200.00' },
  { productId: '104', departmentId: '2', name: 'Mesa', price: '$100.00' },
  { productId: '105', departmentId: '1', name: 'Laptop', price: '$800.00' },
  { productId: '106', departmentId: '2', name: 'Cama', price: '$400.00' },
];

export default function DepartmentPage() {
  const { id } = useParams();

  // Filtrar productos por el departamento seleccionado
  const departmentProducts = products.filter(product => product.departmentId === id);

  // Obtener el nombre del departamento
  const department = departments.find(dept => dept.id === id);

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Productos en el Departamento {department?.name}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {departmentProducts.map((product) => (
            <Link key={product.productId} href={`/departamentos/${id}/productos/${product.productId}`} passHref>
              <div style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/images/logo.png" alt={product.name} style={{ width: '100px', height: '100px', marginBottom: '1rem' }} />
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