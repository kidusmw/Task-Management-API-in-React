import React from 'react';
import { CheckSquare, LogOut, User, ClipboardList, Package, ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <CheckSquare className="text-blue-600" size={32} />
            <h1 className="text-xl font-bold text-gray-900">TaskFlow</h1>
          </div>

          <nav className="flex items-center gap-1">
            <button
              onClick={() => onTabChange('tasks')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'tasks'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ClipboardList size={20} />
              <span className="hidden sm:inline">Task Management</span>
            </button>
            <button
              onClick={() => onTabChange('products')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'products'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Package size={20} />
              <span className="hidden sm:inline">Product Management</span>
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <User size={20} />
              <span className="font-medium">{user?.name}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
