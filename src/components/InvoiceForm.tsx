import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { useInvoice } from '../context/InvoiceContext';
import { Invoice, InvoiceDetail } from '../types/invoice';

interface InvoiceFormProps {
  invoice?: Invoice;
  onSubmit: (data: Invoice) => void;
}

export function InvoiceForm({ invoice, onSubmit }: InvoiceFormProps) {
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<Invoice>({
    defaultValues: invoice || {
      id: crypto.randomUUID(),
      invoiceNumber: '',
      customerName: '',
      date: new Date().toISOString().split('T')[0],
      details: [],
      totalAmount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  const watchDetails = watch('details');

  React.useEffect(() => {
    const total = (watchDetails || []).reduce((sum, detail) => {
      const lineTotal = (detail.quantity || 0) * (detail.unitPrice || 0);
      return sum + lineTotal;
    }, 0);
    setValue('totalAmount', total);
  }, [watchDetails, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">
          {invoice ? 'Edit Invoice' : 'Create New Invoice'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Invoice Number
            </label>
            <input
              {...register('invoiceNumber', { required: 'Invoice number is required' })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.invoiceNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.invoiceNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              {...register('customerName', { required: 'Customer name is required' })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">{errors.customerName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Invoice Details</h3>
            <button
              type="button"
              onClick={() => append({ id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0, lineTotal: 0 })}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Item
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-4 mb-4">
              <div className="col-span-4">
                <input
                  {...register(`details.${index}.description` as const, {
                    required: 'Description is required',
                  })}
                  placeholder="Description"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  {...register(`details.${index}.quantity` as const, {
                    required: 'Required',
                    min: { value: 1, message: 'Min 1' },
                  })}
                  placeholder="Quantity"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="col-span-2">
                <input
                  type="number"
                  step="0.01"
                  {...register(`details.${index}.unitPrice` as const, {
                    required: 'Required',
                    min: { value: 0, message: 'Min 0' },
                  })}
                  placeholder="Unit Price"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="col-span-3">
                <div className="px-3 py-2 border rounded-md bg-gray-50">
                  ${((watchDetails[index]?.quantity || 0) * (watchDetails[index]?.unitPrice || 0)).toFixed(2)}
                </div>
              </div>
              <div className="col-span-1">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-900 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t pt-4">
          <div className="text-lg font-semibold">
            Total Amount: ${watch('totalAmount').toFixed(2)}
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            {invoice ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </div>
    </form>
  );
}