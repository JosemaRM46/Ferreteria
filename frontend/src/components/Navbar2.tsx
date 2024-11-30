'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  idCategoria: number;
  nombre: string;
}

const Navbar = () => {
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

        {/* Menú de navegación en pantallas grandes */}
        <ul className="hidden md:flex space-x-4">
          <li><Link href="/" className="hover:text-gray-400">Inicio</Link></li>
          <li><Link href="/perfil" className="hover:text-gray-400">Mi Perfil</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
