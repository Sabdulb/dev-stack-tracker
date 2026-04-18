import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../types';
import type { Service } from '../../types';
import {
  Button,
  cn,
  Icon,
  Input,
  Select,
  Textarea,
} from '../ui';

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
  const [moreDetails, setMoreDetails] = useState(false);

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
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
    setMoreDetails(false);
    setExpanded(false);
  }

  function handleCancel() {
    setForm(defaultForm);
    setMoreDetails(false);
    setExpanded(false);
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 py-3',
          'text-sm font-medium text-fg-muted',
          'transition-colors duration-150',
          'hover:border-accent hover:bg-accent-subtle hover:text-accent',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
        )}
      >
        <Icon name="plus" size={14} />
        Add Service
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-dashed border-border bg-surface p-4"
    >
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
        Add Service
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <Field label="Name *">
          <Input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Vercel Pro"
            autoFocus
            required
          />
        </Field>
        <Field label={`Cost (${settings.currency})`}>
          <Input
            type="number"
            value={form.cost}
            onChange={(e) => set('cost', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
          />
        </Field>
        <Field label="Billing Cycle">
          <Select
            value={form.billingCycle}
            onChange={(e) =>
              set('billingCycle', e.target.value as FormState['billingCycle'])
            }
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="one-time">One-time</option>
          </Select>
        </Field>
        <Field label="Category">
          <Select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <button
        type="button"
        onClick={() => setMoreDetails((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-fg-muted hover:text-fg"
      >
        <Icon
          name="chevron-down"
          size={12}
          className={cn('transition-transform', moreDetails && 'rotate-180')}
        />
        {moreDetails ? 'Hide' : 'More details'}
      </button>

      {moreDetails && (
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Tier">
            <Input
              value={form.tier ?? ''}
              onChange={(e) => set('tier', e.target.value)}
              placeholder="Free, Pro…"
            />
          </Field>
          <Field label="URL">
            <Input
              type="url"
              value={form.url ?? ''}
              onChange={(e) => set('url', e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Notes">
              <Textarea
                value={form.notes ?? ''}
                onChange={(e) => set('notes', e.target.value)}
                rows={2}
                placeholder="Optional notes"
              />
            </Field>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={!form.name.trim()}>
          <Icon name="plus" size={14} />
          Add Service
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
        {label}
      </span>
      {children}
    </label>
  );
}
