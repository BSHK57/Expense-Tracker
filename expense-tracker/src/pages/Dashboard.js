import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import Charts from '../components/Charts';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions, loading, error } = useTransactions();
  const [showForm, setShowForm] = useState(false);

  const totalExpense = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  const categoryTotals = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.email}
          </h1>
          <p className="text-gray-600">
            Track your spending and manage your finances
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-10">
          <div className="lg:col-span-4 space-y-8">
            <StatsCards totalExpense={totalExpense} categoryTotals={categoryTotals} />
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transaction
                </button>
              </div>
              
              {showForm && (
                <div className="mb-6">
                  <TransactionForm onClose={() => setShowForm(false)} />
                </div>
              )}
              
              <TransactionList transactions={transactions} loading={loading} />
            </div>
          </div>

          <div className="lg:col-span-3">
            <Charts transactions={transactions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;