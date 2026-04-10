import type { AppState, Project } from '../../types';
import { useStore } from '../../store/useStore';
import { exportProjectToJSON } from '../../utils/importExport';

interface HeaderProps {
  activePanel: 'dashboard' | 'project';
  activeProject: Project | null;
  onImportClick: () => void;
  onShareClick: () => void;
  onMenuClick: () => void;
}

export function Header({ activePanel, activeProject, onImportClick, onShareClick, onMenuClick }: HeaderProps) {
  const { settings, setCurrency, exportState } = useStore();

  function handleExport() {
    if (activePanel === 'project' && activeProject) {
      exportProjectToJSON(activeProject);
    } else {
      exportState();
    }
  }

  const exportLabel = activePanel === 'project' && activeProject
    ? 'Export Project'
    : 'Export';

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 rounded-md text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-xl font-bold text-gray-900">Dev Stack Tracker</span>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={settings.currency}
          onChange={(e) => setCurrency(e.target.value as AppState['settings']['currency'])}
          className="text-sm border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700 cursor-pointer"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <button
          onClick={handleExport}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {exportLabel}
        </button>
        <button
          onClick={onImportClick}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Import
        </button>
        <button
          onClick={onShareClick}
          className="text-sm px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          Share
        </button>
      </div>
    </header>
  );
}
