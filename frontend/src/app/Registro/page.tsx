'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function RegistroPage() {
  const [pNombre, setPNombre] = useState('');
  const [sNombre, setSNombre] = useState('');
  const [pApellido, setPApellido] = useState('');
  const [sApellido, setSApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [genero, setGenero] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pNombre, sNombre, pApellido, sApellido, direccion, genero, correo, contraseña })
      });

      if (response.ok) {
        setMensaje('Registro exitoso. Ahora puedes iniciar sesión.');
      } else {
        setMensaje('Error en el registro. Por favor, intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      setMensaje('Error en el registro. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-cover bg-center bg-fixed" 
    style={{ backgroundImage: 'url(/images/Fondo2.jpg)' }}> 
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Registro</h1>
        <form onSubmit={handleRegistro}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Primer Nombre:</label>
            <input 
              type="text" 
              value={pNombre} 
              onChange={(e) => setPNombre(e.target.value)} 
              required 
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Segundo Nombre:</label>
            <input 
              type="text" 
              value={sNombre} 
              onChange={(e) => setSNombre(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Primer Apellido:</label>
            <input 
              type="text" 
              value={pApellido} 
              onChange={(e) => setPApellido(e.target.value)} 
              required 
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Segundo Apellido:</label>
            <input 
              type="text" 
              value={sApellido} 
              onChange={(e) => setSApellido(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Dirección:</label>
            <input 
              type="text" 
              value={direccion} 
              onChange={(e) => setDireccion(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Género:</label>
            <select 
              value={genero} 
              onChange={(e) => setGenero(e.target.value)} 
              required 
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecciona</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Correo:</label>
            <input 
              type="email" 
              value={correo} 
              onChange={(e) => setCorreo(e.target.value)} 
              required 
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium">Contraseña:</label>
            <input 
              type="password" 
              value={contraseña} 
              onChange={(e) => setContraseña(e.target.value)} 
              required 
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full p-2 bg-black text-white rounded hover:bg-black  focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Registrarse
          </button>
        </form>
        {mensaje && <p className="text-center text-red-500 mt-4">{mensaje}</p>}
        <p className="text-center text-gray-600 mt-4">
          ¿Ya tienes una cuenta? <Link href="/login" className="text-indigo-600 hover:underline">Inicia sesión aquí</Link>
        </p>
      </div>
    </div>
  );
}
