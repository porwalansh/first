import React from 'react';
import { InvoiceProvider } from './context/InvoiceContext';
import { InvoiceList } from './components/InvoiceList';
import { InvoiceForm } from './components/InvoiceForm';
import { useInvoice } from './context/InvoiceContext';
import { Invoice } from './types/invoice';

function InvoiceManager() {
  const { state, dispatch } = useInvoice();
  const path = window.location.pathname;

  const handleSubmit = (invoice: Invoice) => {
    if (path.includes('/edit/')) {
      dispatch({ type: 'UPDATE_INVOICE', payload: invoice });
    } else {
      dispatch({ type: 'ADD_INVOICE', payload: invoice });
    }
    window.location.href = '/';
  };

  if (path === '/invoice/new') {
    return <InvoiceForm onSubmit={handleSubmit} />;
  }

  if (path.startsWith('/invoice/edit/')) {
    const invoiceId = path.split('/').pop();
    const invoice = state.invoices.find((inv) => inv.id === invoiceId);
    return invoice ? <InvoiceForm invoice={invoice} onSubmit={handleSubmit} /> : <div>Invoice not found</div>;
  }

  return <InvoiceList />;
}

function App() {
  return (
    <InvoiceProvider>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <a href="/" className="text-xl font-bold text-gray-800">
                Invoice Manager
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <InvoiceManager />
        </main>
      </div>
    </InvoiceProvider>
  );
}

export default App;