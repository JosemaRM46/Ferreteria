'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton } from '@mui/material';

interface Category {
  idCategoria: number;
  nombre: string;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      window.location.href = `/buscar?query=${searchQuery}`;
    }
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
          <IconButton onClick={toggleMenu} className="md:hidden">
            <MenuIcon className="text-white" />
          </IconButton>
          <div className="hidden md:flex space-x-4">
            <IconButton onClick={toggleMenu} className="hover:text-gray-400">
              <MenuIcon className="text-white" />
            </IconButton>
          </div>
        </div>
        <div className="flex items-center justify-center w-6/12">
          <input
            type="text"
            placeholder="Buscar..."
            className="p-2 rounded border border-gray-300 w-full text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
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
            <Link href="/departamentos" className="text-white mb-4 block text-lg">Departamentos</Link>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category.idCategoria} className="border-t border-gray-600 pt-1 flex justify-between items-center group">
                  <Link href={`/departamentos/${category.idCategoria}`} className="block p-2 flex-grow group-hover:text-gray-400">
                    {category.nombre}
                  </Link>
                  <Link href={`/departamentos/${category.idCategoria}`} className="group-hover:text-gray-400">
                    <ChevronRightIcon className="text-white group-hover:text-gray-400" />
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