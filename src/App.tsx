import { useState } from 'react';
import { useStore } from './store/useStore';
import { useShare } from './hooks/useShare';
import { useTheme } from './hooks/useTheme';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { ProjectView } from './components/project/ProjectView';
import { ImportModal } from './components/modals/ImportModal';
import { TooltipProvider } from './components/ui';

type Panel = 'dashboard' | 'project';

export default function App() {
  const { projects, version, settings } = useStore();
  const { sharedState, copyShareLink, clearSharedState } = useShare();
  useTheme();

  const [activePanel, setActivePanel] = useState<Panel>('dashboard');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    projects[0]?.id ?? null
  );
  const [showImport, setShowImport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isShareImport = sharedState !== null;
  const activeProject = activePanel === 'project'
    ? (projects.find((p) => p.id === activeProjectId) ?? null)
    : null;

  function handleSelectProject(id: string) {
    setActiveProjectId(id);
    setActivePanel('project');
    setSidebarOpen(false);
  }

  function handleProjectDeleted() {
    setActivePanel('dashboard');
    setActiveProjectId(null);
  }

  function handleShareClick() {
    copyShareLink({ version, projects, settings });
    alert('Share link copied to clipboard!');
  }

  function handleBackToDashboard() {
    setActivePanel('dashboard');
  }

  return (
    <TooltipProvider>
    <div className="min-h-screen flex flex-col bg-canvas text-fg">
      <Header
        activePanel={activePanel}
        activeProject={activeProject}
        onImportClick={() => setShowImport(true)}
        onShareClick={handleShareClick}
        onMenuClick={() => setSidebarOpen((prev) => !prev)}
      />
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 52px)' }}>
        {sidebarOpen && (
          <div
            className="fixed inset-0 top-[52px] bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <Sidebar
          activeProjectId={activeProjectId}
          activePanel={activePanel}
          onSelectProject={handleSelectProject}
          onSelectDashboard={() => { setActivePanel('dashboard'); setSidebarOpen(false); }}
          mobileOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-y-auto flex flex-col">
          {activePanel === 'dashboard' ? (
            <Dashboard onSelectProject={handleSelectProject} />
          ) : (
            <ProjectView
              projectId={activeProjectId}
              onProjectDeleted={handleProjectDeleted}
              onBackToDashboard={handleBackToDashboard}
            />
          )}
        </main>
      </div>

      {/* Regular import modal */}
      {!isShareImport && (
        <ImportModal
          open={showImport}
          onOpenChange={setShowImport}
          activePanel={activePanel}
          activeProjectId={activeProjectId}
        />
      )}

      {/* Share URL import modal — opens automatically on shared links */}
      {isShareImport && (
        <ImportModal
          open={true}
          onOpenChange={(open) => {
            if (!open) clearSharedState();
          }}
          preloadedState={sharedState}
          activePanel={activePanel}
          activeProjectId={activeProjectId}
        />
      )}
    </div>
    </TooltipProvider>
  );
}
