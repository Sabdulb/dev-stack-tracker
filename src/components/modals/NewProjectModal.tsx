import { useState } from 'react';
import { useStore } from '../../store/useStore';
import {
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Input,
} from '../ui';

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_COLOR = '#6366f1';

export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const { addProject } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    addProject(name.trim(), description.trim() || undefined, color);
    setName('');
    setDescription('');
    setColor(DEFAULT_COLOR);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader title="New project" />
        <form onSubmit={handleSubmit}>
          <DialogBody className="space-y-3">
            <Field label="Name *">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My SaaS"
                autoFocus
                required
              />
            </Field>
            <Field label="Description">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional"
              />
            </Field>
            <Field label="Color">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-9 w-16 cursor-pointer rounded-md border border-border bg-surface"
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
            <Button type="submit" size="sm" disabled={!name.trim()}>
              Create project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
