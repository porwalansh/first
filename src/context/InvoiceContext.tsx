import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Invoice } from '../types/invoice';

interface InvoiceState {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
}

type InvoiceAction =
  | { type: 'SET_INVOICES'; payload: Invoice[] }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: InvoiceState = {
  invoices: [],
  loading: false,
  error: null,
};

const InvoiceContext = createContext<{
  state: InvoiceState;
  dispatch: React.Dispatch<InvoiceAction>;
} | null>(null);

function invoiceReducer(state: InvoiceState, action: InvoiceAction): InvoiceState {
  switch (action.type) {
    case 'SET_INVOICES':
      return { ...state, invoices: action.payload, loading: false };
    case 'ADD_INVOICE':
      return { ...state, invoices: [...state.invoices, action.payload] };
    case 'UPDATE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === action.payload.id ? action.payload : invoice
        ),
      };
    case 'DELETE_INVOICE':
      return {
        ...state,
        invoices: state.invoices.filter((invoice) => invoice.id !== action.payload),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(invoiceReducer, initialState);

  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      dispatch({ type: 'SET_INVOICES', payload: JSON.parse(savedInvoices) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(state.invoices));
  }, [state.invoices]);

  return (
    <InvoiceContext.Provider value={{ state, dispatch }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoice() {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
}