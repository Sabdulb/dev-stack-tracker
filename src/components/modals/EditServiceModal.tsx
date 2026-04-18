import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { CATEGORIES } from '../../types';
import type { Service } from '../../types';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Input,
  Select,
  Textarea,
} from '../ui';

interface EditServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  service: Service;
}

export function EditServiceModal(props: EditServiceModalProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {props.open && <EditServiceForm key={props.service.id} {...props} />}
    </Dialog>
  );
}

function EditServiceForm({
  onOpenChange,
  projectId,
  service,
}: EditServiceModalProps) {
  const { updateService, settings } = useStore();
  const [form, setForm] = useState<Service>({ ...service });

  function set<K extends keyof Service>(field: K, value: Service[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateService(projectId, service.id, {
      name: form.name.trim(),
      cost: form.cost,
      billingCycle: form.billingCycle,
      category: form.category,
      tier: form.tier?.trim() || undefined,
      url: form.url?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
    });
    onOpenChange(false);
  }

  return (
    <DialogContent size="md">
      <DialogHeader title="Edit service" />
      <form onSubmit={handleSubmit}>
        <DialogBody className="space-y-3">
          <Field label="Name *">
            <Input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              required
              autoFocus
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Cost (${settings.currency})`}>
              <Input
                type="number"
                value={form.cost}
                onChange={(e) => set('cost', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </Field>
            <Field label="Billing cycle">
              <Select
                value={form.billingCycle}
                onChange={(e) =>
                  set('billingCycle', e.target.value as Service['billingCycle'])
                }
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="one-time">One-time</option>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
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
            <Field label="Tier">
              <Input
                value={form.tier ?? ''}
                onChange={(e) => set('tier', e.target.value)}
                placeholder="Free, Pro…"
              />
            </Field>
          </div>
          <Field label="URL">
            <Input
              type="url"
              value={form.url ?? ''}
              onChange={(e) => set('url', e.target.value)}
              placeholder="https://…"
            />
          </Field>
          <Field label="Notes">
            <Textarea
              value={form.notes ?? ''}
              onChange={(e) => set('notes', e.target.value)}
              rows={2}
            />
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm">
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
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
