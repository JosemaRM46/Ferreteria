'use client';

import Link from 'next/link';
import { useState } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton } from '@mui/material';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav style={{ padding: '1rem', backgroundColor: '#333', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" passHref>
            <img src="/images/logo.png" alt="Logo" style={{ width: '50px', height: '50px', marginRight: '1rem', cursor: 'pointer' }} />
          </Link>
          <Link href="/" passHref>
            <h1 style={{ cursor: 'pointer' }}>Ferretería</h1>
          </Link>
        </div>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '1rem', margin: 0 }}>
          <li><Link href="/" style={{ color: '#fff' }}>Inicio</Link></li>
          <li><Link href="/perfil" style={{ color: '#fff' }}>Mi Perfil</Link></li>
        </ul>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', justifyContent: 'space-between' }}>
        <div onClick={toggleMenu} style={{ cursor: 'pointer', margin: '0 10% 0 2%' }}>
          <div style={{ width: '25px', height: '3px', backgroundColor: '#fff', margin: '4px 0' }}></div>
          <div style={{ width: '25px', height: '3px', backgroundColor: '#fff', margin: '4px 0' }}></div>
          <div style={{ width: '25px', height: '3px', backgroundColor: '#fff', margin: '4px 0' }}></div>
        </div>
        <input type="text" placeholder="Buscar..." style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', width: '50%', color: 'black' }} />
        <Link href="/carrito">
          <IconButton>
            <ShoppingCartIcon style={{ color: '#fff', fontSize: '30px', margin: '0 2% 0 10%' }} />
          </IconButton>
        </Link>
      </div>

      {isMenuOpen && (
        <div style={{ position: 'absolute', top: '120px', left: '10px', backgroundColor: '#333', padding: '1rem', borderRadius: '4px' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><Link href="/" style={{ color: '#fff' }}>Inicio</Link></li>
            <li><Link href="/perfil" style={{ color: '#fff' }}>Mi Perfil</Link></li>
            <li><Link href="/herramientas" style={{ color: '#fff' }}>Herramientas</Link></li>
            <li><Link href="/pinturas" style={{ color: '#fff' }}>Pinturas</Link></li>
            <li><Link href="/materiales" style={{ color: '#fff' }}>Materiales</Link></li>
            <li><Link href="/jardineria" style={{ color: '#fff' }}>Jardinería</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;