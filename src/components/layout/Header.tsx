import type { AppState, Project } from '../../types';
import { useStore } from '../../store/useStore';
import { exportProjectToJSON } from '../../utils/importExport';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Icon,
  IconButton,
  ThemeToggle,
} from '../ui';

const CURRENCIES: AppState['settings']['currency'][] = ['USD', 'EUR', 'GBP'];

interface HeaderProps {
  activePanel: 'dashboard' | 'project';
  activeProject: Project | null;
  onImportClick: () => void;
  onShareClick: () => void;
  onMenuClick: () => void;
}

export function Header({
  activePanel,
  activeProject,
  onImportClick,
  onShareClick,
  onMenuClick,
}: HeaderProps) {
  const { settings, setCurrency, exportState } = useStore();

  function handleExportAll() {
    exportState();
  }

  function handleExportProject() {
    if (activeProject) exportProjectToJSON(activeProject);
  }

  const canExportProject = activePanel === 'project' && activeProject !== null;

  return (
    <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-2">
        <IconButton
          icon="menu"
          label="Toggle menu"
          size="sm"
          className="md:hidden"
          onClick={onMenuClick}
        />
        <div
          aria-hidden="true"
          className="flex h-5 w-5 items-center justify-center rounded-sm bg-accent text-accent-fg"
        >
          <Icon name="layout" size={12} />
        </div>
        <span className="text-sm font-semibold tracking-tight text-fg">
          Dev Stack Tracker
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              {settings.currency}
              <Icon name="chevron-down" size={12} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Currency</DropdownMenuLabel>
            {CURRENCIES.map((c) => (
              <DropdownMenuItem key={c} onSelect={() => setCurrency(c)}>
                <span className="flex-1">{c}</span>
                {settings.currency === c && (
                  <Icon name="check" size={14} className="text-accent" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" aria-label="Import and export">
              <Icon name="download" size={14} />
              <span className="hidden sm:inline">Data</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={onImportClick}>
              <Icon name="upload" size={14} />
              Import JSON
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleExportAll}>
              <Icon name="download" size={14} />
              Export all
            </DropdownMenuItem>
            {canExportProject && (
              <DropdownMenuItem onSelect={handleExportProject}>
                <Icon name="download" size={14} />
                Export this project
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={onShareClick}>
          <Icon name="share" size={14} />
          <span className="hidden sm:inline">Share</span>
        </Button>

        <ThemeToggle />
      </div>
    </header>
  );
}
