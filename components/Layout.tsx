import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, GraduationCap, LogOut, LayoutDashboard, PenTool } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'text-primary' : 'text-gray-300 hover:text-white';

  return (
    <div className="min-h-screen flex flex-col bg-background text-white selection:bg-primary selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold tracking-tight">Make Academy</span>
            </Link>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}>Home</Link>
                {user ? (
                  <>
                    <Link to="/generator" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/generator')}`}>Generator</Link>
                    <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')}`}>Dashboard</Link>
                    <button onClick={() => signOut()} className="px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:text-red-300 transition-colors">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/login')}`}>Login</Link>
                    <Link to="/register" className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-blue-500/25">Get Started</Link>
                  </>
                )}
              </div>
            </div>
            
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800">Home</Link>
              {user ? (
                <>
                  <Link to="/generator" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Generator</Link>
                  <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Dashboard</Link>
                  <button onClick={() => signOut()} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-800">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800">Login</Link>
                  <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:text-white hover:bg-gray-800">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-gray-400" />
              <span className="text-lg font-bold text-gray-400">Make Academy</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Intelligent academic solutions for students.</p>
          </div>
          <div className="flex space-x-6 text-gray-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/generator" className="hover:text-white transition-colors">Generator</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};