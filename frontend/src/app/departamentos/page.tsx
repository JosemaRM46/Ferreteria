'use client';

import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const departments = [
  { id: '1', name: 'Electrónica' },
  { id: '2', name: 'Hogar' },
  { id: '3', name: 'Jardinería' },
  { id: '4', name: 'Herramientas' },
  { id: '5', name: 'Automotriz' },
  { id: '6', name: 'Construcción' },
];

export default function DepartmentsPage() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Departamentos</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {departments.map((department) => (
            <Link key={department.id} href={`/departamentos/${department.id}`} passHref>
              <div style={{ border: '1px solid #ccc', padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
                <h2>{department.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}