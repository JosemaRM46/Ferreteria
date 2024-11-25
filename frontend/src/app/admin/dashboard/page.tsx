'use client';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function AdminDashboard() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Panel de Administración</h1>
        <p>Aquí puedes gestionar diferentes aspectos de la aplicación.</p>
        {/* Agrega más funcionalidades de administración aquí */}
      </div>
      <Footer />
    </div>
  );
}