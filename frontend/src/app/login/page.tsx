'use client';
import { useState } from 'react';
import Link from 'next/link';

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
        // Guardar el idPersona y el estado de jefe en localStorage
        localStorage.setItem('idPersona', data.idPersona);
        localStorage.setItem('isJefe', data.isJefe ? 'true' : 'false');
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

  // Función para redirigir a la página de registro
  const handleRegisterRedirect = () => {
    window.location.href = '/Registro'; 
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url(/images/Fondo.jpg)' }}
    >
      <h1 className="text-5xl font-extrabold text-gray-800 mb-20 text-center">
        Tu ferre de confianza
      </h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Inicio de Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Correo:</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Contraseña:</label>
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-black"
          >
            Iniciar Sesión
          </button>
        </form>
        
        {/* Botón para redirigir a la página de registro */}
        <p className="text-center text-sm text-gray-600 mt-4">
          ¿No tienes cuenta?{' '}
          <button
            onClick={handleRegisterRedirect}
            className="text-blue-500 hover:underline"
          >
            Crear cuenta
          </button>
        </p>

        {loading && <p className="text-center text-blue-500 mt-3">Redirigiendo...</p>}
      </div>
    </div>
  );
}
