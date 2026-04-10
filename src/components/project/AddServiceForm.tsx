import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../types';
import type { Service } from '../../types';

interface AddServiceFormProps {
  projectId: string;
}

type FormState = Omit<Service, 'id' | 'createdAt'>;

const defaultForm: FormState = {
  name: '',
  cost: 0,
  billingCycle: 'monthly',
  category: 'Other',
  tier: '',
  url: '',
  notes: '',
};

export function AddServiceForm({ projectId }: AddServiceFormProps) {
  const { addService, settings } = useStore();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [expanded, setExpanded] = useState(false);

  function set(field: keyof FormState, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    addService(projectId, {
      name: form.name.trim(),
      cost: form.cost,
      billingCycle: form.billingCycle,
      category: form.category,
      tier: form.tier?.trim() || undefined,
      url: form.url?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    });
    setForm(defaultForm);
    setExpanded(false);
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full py-3 text-sm text-indigo-600 hover:bg-indigo-50 border-t border-gray-100 transition-colors"
      >
        + Add Service
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-100 p-4 bg-gray-50 space-y-3"
    >
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Add Service
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Vercel Pro"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Cost ({settings.currency})</label>
          <input
            type="number"
            value={form.cost}
            onChange={(e) => set('cost', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Billing Cycle</label>
          <select
            value={form.billingCycle}
            onChange={(e) => set('billingCycle', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="one-time">One-time</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Tier</label>
          <input
            type="text"
            value={form.tier ?? ''}
            onChange={(e) => set('tier', e.target.value)}
            placeholder="Free, Pro…"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">URL</label>
          <input
            type="url"
            value={form.url ?? ''}
            onChange={(e) => set('url', e.target.value)}
            placeholder="https://…"
            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => { setForm(defaultForm); setExpanded(false); }}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!form.name.trim()}
          className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Service
        </button>
      </div>
    </form>
  );
}
