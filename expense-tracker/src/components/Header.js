import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, IndianRupee } from 'lucide-react';

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <IndianRupee className="h-7 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-1000">SpendWise </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={logout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;