'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { IconButton } from '@mui/material';

interface Category {
  idCategoria: number;
  nombre: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get('http://localhost:3001/categoria')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" passHref>
            <img src="/images/logo.png" alt="Logo" className="w-12 h-12 mr-4 cursor-pointer" />
          </Link>
          <Link href="/" passHref>
            <h1 className="text-xl cursor-pointer">Ferretería</h1>
          </Link>
        </div>
        <ul className="hidden md:flex space-x-4">
          <li><Link href="/" className="hover:text-gray-400">Inicio</Link></li>
          <li><Link href="/perfil" className="hover:text-gray-400">Mi Perfil</Link></li>
        </ul>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4 w-3/12">
          <button onClick={toggleMenu} className="md:hidden">
            <div className="w-6 h-1 bg-white mb-1"></div>
            <div className="w-6 h-1 bg-white mb-1"></div>
            <div className="w-6 h-1 bg-white"></div>
          </button>
          <div className="hidden md:flex space-x-4">
            <button onClick={toggleMenu} className="hover:text-gray-400">Departamentos</button>
          </div>
        </div>
        <div className="flex items-center justify-center w-6/12">
          <input type="text" placeholder="Buscar..." className="p-2 rounded border border-gray-300 w-full text-black" />
        </div>
        <div className="flex items-center space-x-4 w-3/12 justify-end">
          <Link href="/carrito">
            <IconButton>
              <ShoppingCartIcon className="text-white" />
            </IconButton>
          </Link>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex" onClick={toggleMenu}>
          <div className="bg-gray-800 p-4 w-64 h-full shadow-lg" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button onClick={toggleMenu} className="text-white mb-4">Cerrar</button>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.idCategoria}>
                  <Link href={`/departamentos/${category.idCategoria}`} className="block hover:text-gray-400">
                    {category.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;