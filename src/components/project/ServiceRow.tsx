import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { toMonthlyCost, formatCurrency } from '../../utils/calculations';
import { EditServiceModal } from '../modals/EditServiceModal';
import type { Service } from '../../types';

interface ServiceRowProps {
  projectId: string;
  service: Service;
  currency: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Infra: 'bg-orange-100 text-orange-700',
  Storage: 'bg-blue-100 text-blue-700',
  API: 'bg-purple-100 text-purple-700',
  Auth: 'bg-yellow-100 text-yellow-700',
  Email: 'bg-green-100 text-green-700',
  Hosting: 'bg-indigo-100 text-indigo-700',
  Database: 'bg-cyan-100 text-cyan-700',
  'CI/CD': 'bg-pink-100 text-pink-700',
  Other: 'bg-gray-100 text-gray-600',
};

export function ServiceRow({ projectId, service, currency }: ServiceRowProps) {
  const { deleteService } = useStore();
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const monthly = toMonthlyCost(service);
  const categoryClass = CATEGORY_COLORS[service.category] ?? CATEGORY_COLORS.Other;

  function handleDelete() {
    if (confirmDelete) {
      deleteService(projectId, service.id);
    } else {
      setConfirmDelete(true);
    }
  }

  return (
    <>
      <div
        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 group"
        onMouseLeave={() => setConfirmDelete(false)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 truncate">
              {service.url && /^https?:\/\//i.test(service.url) ? (
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {service.name}
                </a>
              ) : (
                service.name
              )}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${categoryClass}`}>
              {service.category}
            </span>
            {service.tier && (
              <span className="text-xs text-gray-400">{service.tier}</span>
            )}
          </div>
          {service.notes && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{service.notes}</p>
          )}
        </div>

        <div className="text-right shrink-0">
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(monthly, currency)}/mo
          </div>
          {service.billingCycle === 'yearly' && (
            <div className="text-xs text-gray-400">
              {formatCurrency(service.cost, currency)}/yr
            </div>
          )}
          {service.billingCycle === 'one-time' && (
            <div className="text-xs text-gray-400">one-time</div>
          )}
        </div>

        <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => setShowEdit(true)}
            className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xs"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className={`p-1 rounded text-xs transition-colors ${
              confirmDelete
                ? 'text-white bg-red-500 hover:bg-red-600 px-2'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            {confirmDelete ? 'Confirm' : 'Delete'}
          </button>
        </div>
      </div>

      <EditServiceModal
        open={showEdit}
        onOpenChange={setShowEdit}
        projectId={projectId}
        service={service}
      />
    </>
  );
}
