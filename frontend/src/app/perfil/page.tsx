'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const user = {
  firstName: 'Juan',
  lastName: 'Pérez',
  email: 'juan.perez@example.com',
  phone: '+1234567890',
  country: 'Honduras',
  department: 'Comayagua'
};

export default function ProfilePage() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Perfil</h1>
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Nombres:</strong> <span>{user.firstName}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Apellidos:</strong> <span>{user.lastName}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Correo:</strong> <span>{user.email}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Teléfono:</strong> <span>{user.phone}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>País:</strong> <span>{user.country}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Departamento:</strong> <span>{user.department}</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}