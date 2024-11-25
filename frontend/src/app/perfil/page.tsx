'use client';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface UserProfile {
  pNombre: string;
  sNombre: string;
  pApellido: string;
  sApellido: string;
  direccion: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const idPersona = localStorage.getItem('idPersona');
    if (idPersona) {
      fetch(`http://localhost:3001/perfil/${idPersona}`)
        .then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error('Error al obtener los datos del perfil:', error));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('idPersona');
    window.location.href = '/login';
  };

  if (!user) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Perfil</h1>
        <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Primer Nombre:</strong> <span>{user.pNombre}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Segundo Nombre:</strong> <span>{user.sNombre}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Primer Apellido:</strong> <span>{user.pApellido}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Segundo Apellido:</strong> <span>{user.sApellido}</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>Dirección:</strong> <span>{user.direccion}</span>
          </div>
        </div>
        <button onClick={handleLogout} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </div>
      <Footer />
    </div>
  );
}