import { useRef, useState } from 'react';
import { useStore } from '../../store/useStore';
import { importFromJSON, importFromText } from '../../utils/importExport';
import type { AppState, ExportData, ImportMode } from '../../types';
import {
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Icon,
  Textarea,
} from '../ui';

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
  const { projects, importState, addProjectFromExport, addServicesToProject } =
    useStore();
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

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
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
    const appState: AppState = {
      version: parsed.version,
      projects: parsed.projects,
      settings: parsed.settings,
    };
    importState(appState, mode);
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent size="md">
        <DialogHeader
          title={preloadedState ? 'Import shared stack' : 'Import data'}
          description={
            preloadedState
              ? 'Viewing a shared stack — import it to save your own copy.'
              : undefined
          }
        />
        <DialogBody className="space-y-4">
          {!parsed ? (
            <>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  'rounded-lg border-2 border-dashed p-8 text-center text-sm transition-colors',
                  'cursor-pointer',
                  dragging
                    ? 'border-accent bg-accent-subtle text-accent'
                    : 'border-border text-fg-muted hover:border-border-strong hover:bg-surface-muted'
                )}
              >
                <Icon
                  name="upload"
                  size={20}
                  className="mx-auto mb-2 text-fg-subtle"
                />
                <p>
                  Drop a{' '}
                  <code className="rounded bg-surface-muted px-1 text-xs">
                    .json
                  </code>{' '}
                  file here, or{' '}
                  <span className="text-accent underline">browse</span>
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

              <div>
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-fg-subtle">
                  Or paste JSON
                </p>
                <Textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  rows={4}
                  placeholder='{"version": 1, "projects": [...], "settings": {...}}'
                  className="font-mono text-xs"
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handlePasteSubmit}
                    disabled={!pasteText.trim()}
                  >
                    Parse JSON
                  </Button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-md border border-danger/30 bg-danger-subtle px-3 py-2 text-sm text-danger"
                >
                  {error}
                </p>
              )}
            </>
          ) : (
            <ConfirmPanel
              parsed={parsed}
              activePanel={activePanel}
              currentProjectName={currentProject?.name}
              onFullImport={handleFullImport}
              onAddAsProject={handleAddAsProject}
              onAddToCurrentProject={handleAddToCurrentProject}
              onReset={reset}
            />
          )}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleClose(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ConfirmPanelProps {
  parsed: ExportData;
  activePanel: 'dashboard' | 'project';
  currentProjectName: string | undefined;
  onFullImport: (mode: ImportMode) => void;
  onAddAsProject: () => void;
  onAddToCurrentProject: () => void;
  onReset: () => void;
}

function ConfirmPanel({
  parsed,
  activePanel,
  currentProjectName,
  onFullImport,
  onAddAsProject,
  onAddToCurrentProject,
  onReset,
}: ConfirmPanelProps) {
  return (
    <div className="space-y-4">
      {parsed.type === 'full' ? (
        <>
          <Banner
            title="Full export — ready to import"
            body={`${parsed.projects.length} project(s), ${parsed.projects.reduce(
              (n, p) => n + p.services.length,
              0
            )} service(s) total`}
          />
          <p className="text-sm text-fg-muted">How would you like to import?</p>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => onFullImport('merge')}
            >
              Merge
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => onFullImport('replace')}
            >
              Replace everything
            </Button>
          </div>
          <p className="text-xs text-fg-subtle">
            Merge adds missing projects. Replace overwrites all local data.
          </p>
        </>
      ) : (
        <>
          <Banner
            title={`Project export — "${parsed.project.name}"`}
            body={`${parsed.project.services.length} service(s)`}
          />
          <p className="text-sm text-fg-muted">
            Where should these services go?
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={onAddAsProject}>Add as new project</Button>
            {activePanel === 'project' && currentProjectName && (
              <Button variant="secondary" onClick={onAddToCurrentProject}>
                Add services to "{currentProjectName}"
              </Button>
            )}
          </div>
        </>
      )}
      <button
        onClick={onReset}
        className="text-xs text-fg-muted transition-colors hover:text-fg"
      >
        ← Choose a different file
      </button>
    </div>
  );
}

function Banner({ title, body }: { title: string; body: string }) {
  return (
    <div
      role="status"
      className="rounded-md border border-success/30 bg-success-subtle px-3 py-2"
    >
      <p className="text-sm font-medium text-success">{title}</p>
      <p className="mt-0.5 text-xs text-success/80">{body}</p>
    </div>
  );
}
