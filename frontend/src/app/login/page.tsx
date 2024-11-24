'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Mostrar el loader
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Correo: correo, Contraseña: contraseña })
      });

      if (response.ok) {
        const data = await response.json();
        // Guardar el idPersona en localStorage
        localStorage.setItem('idPersona', data.idPersona);
        // Indicar que el inicio de sesión fue exitoso
        setLoginSuccess(true);
        // Redirigir a la página principal
        window.location.href = '/';
      } else {
        alert('Correo o contraseña incorrectos');
        setLoading(false); // Ocultar el loader si hay un error
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setLoading(false); // Ocultar el loader si hay un error
    }
  };

  return (
    <div>
      <h1>Inicio de Sesión</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>Correo:</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {loading && loginSuccess && <p>Redirigiendo...</p>} {/* Mostrar el loader solo si el login es exitoso */}
    </div>
  );
}