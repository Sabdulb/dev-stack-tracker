import { useState, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useStore } from '../../store/useStore';
import { importFromJSON, importFromText } from '../../utils/importExport';
import type { AppState, ExportData, ImportMode } from '../../types';

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preloadedState?: AppState | null;
  activePanel: 'dashboard' | 'project';
  activeProjectId: string | null;
}

export function ImportModal({
  open,
  onOpenChange,
  preloadedState,
  activePanel,
  activeProjectId,
}: ImportModalProps) {
  const { projects, importState, addProjectFromExport, addServicesToProject } = useStore();
  const [parsed, setParsed] = useState<ExportData | null>(
    preloadedState ? { type: 'full', ...preloadedState } : null
  );
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function reset() {
    setParsed(preloadedState ? { type: 'full', ...preloadedState } : null);
    setError('');
    setPasteText('');
  }

  function handleClose(open: boolean) {
    if (!open) reset();
    onOpenChange(open);
  }

  async function handleFile(file: File) {
    setError('');
    try {
      const data = await importFromJSON(file);
      setParsed(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      setParsed(null);
    }
  }

  function handlePasteSubmit() {
    setError('');
    try {
      const data = importFromText(pasteText);
      setParsed(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
      setParsed(null);
    }
  }

  function handleFullImport(mode: ImportMode) {
    if (!parsed || parsed.type !== 'full') return;
    const { type: _, ...appState } = parsed;
    importState(appState as AppState, mode);
    handleClose(false);
  }

  function handleAddAsProject() {
    if (!parsed || parsed.type !== 'project') return;
    addProjectFromExport(parsed.project);
    handleClose(false);
  }

  function handleAddToCurrentProject() {
    if (!parsed || parsed.type !== 'project' || !activeProjectId) return;
    addServicesToProject(activeProjectId, parsed.project.services);
    handleClose(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const currentProject = activeProjectId
    ? projects.find((p) => p.id === activeProjectId)
    : null;

  function renderConfirmPanel() {
    if (!parsed) return null;

    if (parsed.type === 'full') {
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm font-medium text-green-800">Full export — ready to import</p>
            <p className="text-xs text-green-700 mt-1">
              {parsed.projects.length} project(s),{' '}
              {parsed.projects.reduce((n, p) => n + p.services.length, 0)} service(s) total
            </p>
          </div>
          <p className="text-sm text-gray-600">How would you like to import?</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleFullImport('merge')}
              className="flex-1 py-2 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              Merge
              <span className="block text-xs font-normal opacity-80">Add missing projects</span>
            </button>
            <button
              onClick={() => handleFullImport('replace')}
              className="flex-1 py-2 text-sm rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
            >
              Replace
              <span className="block text-xs font-normal opacity-80">Overwrite everything</span>
            </button>
          </div>
        </div>
      );
    }

    // Project export
    return (
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <p className="text-sm font-medium text-green-800">
            Project export — "{parsed.project.name}"
          </p>
          <p className="text-xs text-green-700 mt-1">
            {parsed.project.services.length} service(s)
          </p>
        </div>
        <p className="text-sm text-gray-600">Where should these services go?</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleAddAsProject}
            className="py-2.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Add as new project
            <span className="block text-xs font-normal opacity-80">
              Creates "{parsed.project.name}" as a separate project
            </span>
          </button>
          {activePanel === 'project' && currentProject && (
            <button
              onClick={handleAddToCurrentProject}
              className="py-2.5 text-sm rounded-md border border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition-colors"
            >
              Add services to "{currentProject.name}"
              <span className="block text-xs font-normal opacity-80">
                Appends {parsed.project.services.length} service(s) to the current project
              </span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white rounded-xl shadow-xl p-6">
          <Dialog.Title className="text-lg font-semibold text-gray-900 mb-4">
            {preloadedState ? 'Import Shared Stack' : 'Import Data'}
          </Dialog.Title>

          {preloadedState && (
            <div className="mb-4 p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-sm text-indigo-700">
              Viewing a shared stack — import it to save your own copy.
            </div>
          )}

          {!parsed ? (
            <div className="space-y-4">
              {/* Drag & drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragging
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <p className="text-sm text-gray-500">
                  Drop a <code className="text-xs bg-gray-100 px-1 rounded">.json</code> file here, or{' '}
                  <span className="text-indigo-600 underline">browse</span>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </div>

              {/* Paste zone */}
              <div>
                <p className="text-xs text-gray-500 mb-1">Or paste JSON:</p>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  rows={4}
                  placeholder='{"version": 1, "projects": [...], "settings": {...}}'
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <button
                  onClick={handlePasteSubmit}
                  disabled={!pasteText.trim()}
                  className="mt-2 text-sm px-3 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Parse JSON
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {renderConfirmPanel()}
              <button
                onClick={reset}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Choose a different file
              </button>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              onClick={() => handleClose(false)}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
