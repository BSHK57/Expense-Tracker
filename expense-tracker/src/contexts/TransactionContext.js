import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { backendurl } from '../App';


const TransactionContext = createContext();

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

function transactionReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload, loading: false, error: null };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    default:
      return state;
  }
}

export function TransactionProvider({ children }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const { isAuthenticated, logout } = useAuth();

  // ✅ Get headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ✅ Fetch Transactions
  const fetchTransactions = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`${backendurl}/api/transactions`, getAuthHeaders());
      dispatch({ type: 'SET_TRANSACTIONS', payload: response.data });
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch transactions' });
      }
    }
  };

  // ✅ Add Transaction
  const addTransaction = async (transaction) => {
    try {
      const response = await axios.post(
        `${backendurl}/api/transactions`,
        transaction,
        getAuthHeaders()
      );
      dispatch({ type: 'ADD_TRANSACTION', payload: response.data });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to add transaction' });
      }
      throw error;
    }
  };

  // ✅ Delete Transaction
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${backendurl}/api/transactions/${id}`, getAuthHeaders());
      dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete transaction' });
      }
      throw error;
    }
  };

  // ✅ Auto-fetch on login
  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  const value = {
    ...state,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
