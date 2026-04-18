import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { toMonthlyCost, formatCurrency } from '../../utils/calculations';
import { EditServiceModal } from '../modals/EditServiceModal';
import type { Service } from '../../types';
import {
  AlertDialog,
  AlertDialogContent,
  CategoryChip,
  Icon,
  IconButton,
  Tooltip,
} from '../ui';

interface ServiceRowProps {
  projectId: string;
  service: Service;
  currency: string;
}

export function ServiceRow({ projectId, service, currency }: ServiceRowProps) {
  const { deleteService } = useStore();
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const monthly = toMonthlyCost(service);
  const isExternalUrl =
    service.url && /^https?:\/\//i.test(service.url);

  return (
    <>
      <div className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface-muted">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium text-fg">
              {isExternalUrl ? (
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {service.name}
                  <Icon
                    name="external-link"
                    size={11}
                    className="text-fg-subtle"
                  />
                </a>
              ) : (
                service.name
              )}
            </span>
            <CategoryChip category={service.category} />
            {service.tier && (
              <span className="text-xs text-fg-subtle">{service.tier}</span>
            )}
          </div>
          {service.notes && (
            <p className="mt-0.5 truncate text-xs text-fg-muted">
              {service.notes}
            </p>
          )}
        </div>

        <div className="shrink-0 text-right">
          <div className="font-mono text-sm font-semibold text-fg">
            {formatCurrency(monthly, currency)}
            <span className="ml-1 text-[11px] font-normal text-fg-muted">
              /mo
            </span>
          </div>
          {service.billingCycle === 'yearly' && (
            <div className="font-mono text-[11px] text-fg-subtle">
              {formatCurrency(service.cost, currency)}/yr
            </div>
          )}
          {service.billingCycle === 'one-time' && (
            <div className="text-[11px] text-fg-subtle">one-time</div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-within:opacity-100">
          <Tooltip content="Edit">
            <IconButton
              icon="pencil"
              label="Edit service"
              size="sm"
              onClick={() => setShowEdit(true)}
            />
          </Tooltip>
          <Tooltip content="Delete">
            <IconButton
              icon="trash"
              label="Delete service"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              className="hover:text-danger"
            />
          </Tooltip>
        </div>
      </div>

      <EditServiceModal
        open={showEdit}
        onOpenChange={setShowEdit}
        projectId={projectId}
        service={service}
      />

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent
          title={`Delete "${service.name}"?`}
          description="This service will be permanently removed."
          confirmLabel="Delete"
          danger
          onConfirm={() => deleteService(projectId, service.id)}
        />
      </AlertDialog>
    </>
  );
}
