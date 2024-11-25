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
    <div>
      <h1>Registro</h1>
      <form onSubmit={handleRegistro}>
        <div>
          <label>Primer Nombre:</label>
          <input type="text" value={pNombre} onChange={(e) => setPNombre(e.target.value)} required />
        </div>
        <div>
          <label>Segundo Nombre:</label>
          <input type="text" value={sNombre} onChange={(e) => setSNombre(e.target.value)} />
        </div>
        <div>
          <label>Primer Apellido:</label>
          <input type="text" value={pApellido} onChange={(e) => setPApellido(e.target.value)} required />
        </div>
        <div>
          <label>Segundo Apellido:</label>
          <input type="text" value={sApellido} onChange={(e) => setSApellido(e.target.value)} />
        </div>
        <div>
          <label>Dirección:</label>
          <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        </div>
        <div>
          <label>Género:</label>
          <select value={genero} onChange={(e) => setGenero(e.target.value)} required>
            <option value="">Selecciona</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>
        <div>
          <label>Correo:</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
        </div>
        <button type="submit">Registrarse</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
      <p>¿Ya tienes una cuenta? <Link href="/login">Inicia sesión aquí</Link></p>
    </div>
  );
}