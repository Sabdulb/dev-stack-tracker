import type { AppState, Project, ExportData, FullExport, ProjectExport } from '../types';

export function validateState(obj: unknown): obj is AppState {
  if (typeof obj !== 'object' || obj === null) return false;
  const s = obj as Record<string, unknown>;
  if (typeof s.version !== 'number') return false;
  if (!Array.isArray(s.projects)) return false;
  if (typeof s.settings !== 'object' || s.settings === null) return false;
  return true;
}

export function validateProjectExport(obj: unknown): obj is ProjectExport {
  if (typeof obj !== 'object' || obj === null) return false;
  const s = obj as Record<string, unknown>;
  if (s.type !== 'project') return false;
  if (typeof s.version !== 'number') return false;
  if (typeof s.project !== 'object' || s.project === null) return false;
  const p = s.project as Record<string, unknown>;
  if (typeof p.id !== 'string') return false;
  if (typeof p.name !== 'string') return false;
  if (!Array.isArray(p.services)) return false;
  return true;
}

function triggerDownload(data: object, filename: string): void {
  try {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export failed:', err);
  }
}

export function exportToJSON(state: AppState): void {
  const data: FullExport = { type: 'full', ...state };
  triggerDownload(data, `dev-stack-${new Date().toISOString().slice(0, 10)}.json`);
}

export function exportProjectToJSON(project: Project): void {
  const data: ProjectExport = { type: 'project', version: 1, project };
  const safeName = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  triggerDownload(data, `dev-stack-${safeName}-${new Date().toISOString().slice(0, 10)}.json`);
}

function parseExportData(raw: unknown): ExportData {
  if (typeof raw !== 'object' || raw === null) {
    throw new Error('Invalid format: not a JSON object');
  }
  const obj = raw as Record<string, unknown>;

  // Project export
  if (obj.type === 'project') {
    if (!validateProjectExport(obj)) {
      throw new Error('Invalid project export: missing required fields (version, project)');
    }
    return obj as ProjectExport;
  }

  // Full export — accepts files with type: 'full' or legacy files without a type field
  if (!validateState(obj)) {
    throw new Error('Invalid format: missing required fields (version, projects, settings)');
  }
  return { type: 'full', ...(obj as AppState) } as FullExport;
}

export function importFromJSON(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        resolve(parseExportData(parsed));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function importFromText(text: string): ExportData {
  const parsed = JSON.parse(text);
  return parseExportData(parsed);
}
