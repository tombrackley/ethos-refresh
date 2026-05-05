import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { TopBar } from '@/components/layout/TopBar'
import { CommandPalette } from '@/components/CommandPalette'
import { isEnabled } from '@/config/flags'
import LoginPage from '@/pages/LoginPage'
import EthikaAdminPage from '@/pages/EthikaAdminPage'
import HomePage from '@/pages/HomePage'
import HomeChatPage from '@/pages/HomeChatPage'
import HomeV2Page from '@/pages/HomeV2Page'
import HomeV3Page from '@/pages/HomeV3Page'
import ControlPage from '@/pages/ControlPage'
import WorkPage from '@/pages/WorkPage'
import ComplyPage from '@/pages/ComplyPage'
import ContractsPage from '@/pages/ContractsPage'
import ConflictPage from '@/pages/ConflictPage'
import RiskRegisterPage from '@/pages/RiskRegisterPage'
import IncidentPage from '@/pages/IncidentPage'
import AuditPage from '@/pages/AuditPage'
import LegislationPage from '@/pages/LegislationPage'
import ObligationsPage from '@/pages/ObligationsPage'
import MatterDetailPage from '@/pages/MatterDetailPage'
import RespondPage from '@/pages/RespondPage'
import MeetPage from '@/pages/MeetPage'
import TimeEfficiencyPage from '@/pages/TimeEfficiencyPage'
import VaultPage from '@/pages/VaultPage'
import ResourceLibraryPage from '@/pages/ResourceLibraryPage'
import TalentPage from '@/pages/TalentPage'
import LearnPage from '@/pages/LearnPage'
import IntegrationsPage from '@/pages/IntegrationsPage'
import GovernPage from '@/pages/GovernPage'
import BoardDetailPage from '@/pages/BoardDetailPage'
import GovernMeetingsPage from '@/pages/GovernMeetingsPage'
import BoardPapersPage from '@/pages/BoardPapersPage'
import PoliciesProceduresPage from '@/pages/PoliciesProceduresPage'
import DelegationsPage from '@/pages/DelegationsPage'
import CompanyRegisterPage from '@/pages/CompanyRegisterPage'
import MeetingAgendaPage from '@/pages/MeetingAgendaPage'
import MeetingMinutesPage from '@/pages/MeetingMinutesPage'
import BoardPaperReviewPage from '@/pages/BoardPaperReviewPage'
import { GovernShell } from '@/components/layout/GovernShell'
import { ComplyShell } from '@/components/layout/ComplyShell'
import { WorkShell } from '@/components/layout/WorkShell'
import { LearnShell } from '@/components/layout/LearnShell'
import AdminPage from '@/pages/AdminPage'
import ExternalContentViewer from '@/pages/ExternalContentViewer'
import ProfilePage from '@/pages/ProfilePage'
import CPDTrackerPage from '@/pages/CPDTrackerPage'
import CPDEventsPage from '@/pages/CPDEventsPage'
import LearningJourneysPage from '@/pages/LearningJourneysPage'
import KnowledgeCentrePage from '@/pages/KnowledgeCentrePage'
import KnowledgeCentreDemoPage from '@/pages/KnowledgeCentreDemoPage'
import SkillsProfilePage from '@/pages/SkillsProfilePage'
import InsightsPage from '@/pages/InsightsPage'
import CommunityPage from '@/pages/CommunityPage'
import FeatureFlagManagerPage from '@/pages/FeatureFlagManagerPage'

function PlaceholderPage({ title }) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <p className="text-muted-foreground text-sm">{title} content goes here.</p>
    </div>
  )
}

/** Helper: render a route only if the flag is enabled, otherwise render nothing (catch-all handles redirect) */
function gatedRoute(path, flag, element) {
  if (!isEnabled(flag)) return null
  return <Route key={path} path={path} element={element} />
}

/** Default redirect path — home is the canonical landing page */
function getDefaultPath() {
  return '/home'
}

function AppLayout({ onLogout }) {
  const navigate = useNavigate()
  const [selectedMatter, setSelectedMatter] = useState(null)
  const [commandOpen, setCommandOpen] = useState(false)
  const defaultPath = getDefaultPath()

  function navigateToMatter(matter) {
    setSelectedMatter(matter)
    navigate('/matter/' + (matter?.id || 'detail'))
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-sidebar">
          <AppSidebar onSearchClick={() => setCommandOpen(true)} />
          <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

          <div className="flex flex-1 flex-col overflow-hidden p-2">
            <main className="flex-1 overflow-hidden flex flex-col rounded-lg bg-background border border-[#E2E8F0]">
              <TopBar onLogout={onLogout} />
              <div className="flex-1 overflow-hidden flex">
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomeV3Page />} />
                <Route path="/home/v2" element={<HomeV2Page />} />
                <Route path="/home/v4" element={<HomeChatPage />} />
                <Route path="/home/kanban" element={<HomePage />} />
                {isEnabled('PAGE_CONTROL') && (
                  <Route path="/control" element={<ControlPage />} />
                )}
                <Route element={<WorkShell />}>
                  {gatedRoute('/matters', 'PAGE_WORK', <WorkPage onNavigateMatter={navigateToMatter} />)}
                  {gatedRoute('/respond', 'PAGE_WORK_RESPOND', <RespondPage />)}
                  {gatedRoute('/meet', 'PAGE_WORK_MEET', <MeetPage />)}
                  {gatedRoute('/work/time-efficiency', 'PAGE_WORK_TIME_EFFICIENCY', <TimeEfficiencyPage />)}
                </Route>
                {isEnabled('PAGE_MATTER_DETAIL') && (
                  <Route path="/matter/:id" element={
                    selectedMatter ? <MatterDetailPage matter={selectedMatter} onBack={() => navigate('/matters')} /> : <Navigate to="/matters" replace />
                  } />
                )}
                {isEnabled('PAGE_COMPLY') && (
                  <Route path="/comply" element={<ComplyShell />}>
                    <Route index element={<ComplyPage />} />
                    {isEnabled('PAGE_COMPLY_CONTRACTS') && <Route path="contracts" element={<ContractsPage />} />}
                    {isEnabled('PAGE_COMPLY_CONFLICTS') && <Route path="conflicts" element={<ConflictPage />} />}
                    {isEnabled('PAGE_COMPLY_RISK') && <Route path="risk" element={<RiskRegisterPage />} />}
                    {isEnabled('PAGE_COMPLY_INCIDENTS') && <Route path="incidents" element={<IncidentPage />} />}
                    {isEnabled('PAGE_COMPLY_AUDIT') && <Route path="audit" element={<AuditPage />} />}
                    {isEnabled('PAGE_COMPLY_LEGISLATION') && <Route path="legislation" element={<LegislationPage />} />}
                    {isEnabled('PAGE_COMPLY_OBLIGATIONS') && <Route path="obligations" element={<ObligationsPage />} />}
                  </Route>
                )}
                {isEnabled('PAGE_GOVERN') && (
                  <Route path="/govern" element={<GovernShell />}>
                    <Route index element={<GovernPage />} />
                    {isEnabled('PAGE_GOVERN_MEETINGS') && (
                      <Route path="meetings" element={<GovernMeetingsPage />} />
                    )}
                    {isEnabled('PAGE_GOVERN_BOARD_PAPERS') && (
                      <Route path="board-papers" element={<BoardPapersPage />} />
                    )}
                    {isEnabled('PAGE_GOVERN_POLICIES') && (
                      <Route path="policies" element={<PoliciesProceduresPage />} />
                    )}
                    {isEnabled('PAGE_GOVERN_DELEGATIONS') && (
                      <Route path="delegations" element={<DelegationsPage />} />
                    )}
                    {isEnabled('PAGE_GOVERN_COMPANY_REGISTER') && (
                      <Route path="company-register" element={<CompanyRegisterPage />} />
                    )}
                  </Route>
                )}
                {isEnabled('PAGE_GOVERN') && (
                  <>
                    <Route path="/govern/meetings/:meetingId" element={<MeetingAgendaPage />} />
                    <Route path="/govern/meetings/:meetingId/minutes" element={<MeetingMinutesPage />} />
                    {isEnabled('PAGE_GOVERN_BOARD_PAPERS') && (
                      <Route path="/govern/board-papers/:paperId" element={<BoardPaperReviewPage />} />
                    )}
                    <Route path="/govern/boards/:boardId" element={<BoardDetailPage />} />
                  </>
                )}
                {gatedRoute('/vault', 'PAGE_VAULT', <VaultPage />)}
                {gatedRoute('/resources', 'PAGE_RESOURCES', <ResourceLibraryPage />)}
                {gatedRoute('/talent', 'PAGE_TALENT', <TalentPage />)}
                {gatedRoute('/insights', 'PAGE_INSIGHTS', <InsightsPage />)}
                {isEnabled('PAGE_LEARN') && (
                  <Route path="/learn" element={<LearnShell />}>
                    <Route index element={<LearnPage />} />
                    {isEnabled('PAGE_LEARN_JOURNEYS') && <Route path="journeys" element={<LearningJourneysPage />} />}
                    {isEnabled('PAGE_LEARN_CPD') && <Route path="cpd" element={<CPDTrackerPage />} />}
                    {isEnabled('PAGE_LEARN_CPD_EVENTS') && <Route path="cpd/events" element={<CPDEventsPage />} />}
                    {isEnabled('PAGE_LEARN_SKILLS') && <Route path="skills" element={<SkillsProfilePage />} />}
                  </Route>
                )}
                {gatedRoute('/knowledge', 'PAGE_LEARN_KNOWLEDGE_CENTRE', <KnowledgeCentrePage />)}
                {isEnabled('PAGE_LEARN_KNOWLEDGE_CENTRE') && (
                  <Route path="/knowledge-demo" element={<KnowledgeCentreDemoPage />} />
                )}
                {gatedRoute('/community', 'PAGE_COMMUNITY', <CommunityPage />)}
                {gatedRoute('/integrations', 'PAGE_INTEGRATIONS', <IntegrationsPage />)}
                {gatedRoute('/settings', 'PAGE_SETTINGS', <PlaceholderPage title="Settings" />)}
                {gatedRoute('/profile', 'PAGE_PROFILE', <ProfilePage />)}
                {isEnabled('PAGE_ADMIN') && <Route path="/admin/*" element={<AdminPage />} />}
                <Route path="/flags" element={<FeatureFlagManagerPage />} />
                <Route path="/view/:contentId" element={<ExternalContentViewer />} />
                <Route path="*" element={<Navigate to={defaultPath} replace />} />
              </Routes>
              </div>
            </main>
          </div>

        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

function App() {
  const [authMode, setAuthMode] = useState(() => {
    // Skip login when Figma capture hash is present
    if (window.location.hash.includes('figmacapture')) return 'user'
    try {
      const stored = sessionStorage.getItem('ethos_auth')
      if (stored) {
        const { mode } = JSON.parse(stored)
        return mode
      }
    } catch { /* ignore */ }
    return null
  })
  const _Navigate = useNavigate()

  function handleLogout() {
    sessionStorage.removeItem('ethos_auth')
    setAuthMode(null)
    window.location.href = '/'
  }

  // External content viewer — standalone full-page route (opens in new tab, no auth needed)
  if (window.location.pathname.startsWith('/view/')) {
    return (
      <Routes>
        <Route path="/view/:contentId" element={<ExternalContentViewer />} />
      </Routes>
    )
  }

  if (authMode === null) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage onLogin={setAuthMode} />} />
      </Routes>
    )
  }

  if (authMode === 'ethika-admin') {
    if (!isEnabled('PAGE_ETHIKA_ADMIN')) {
      return <AppLayout onLogout={handleLogout} />
    }
    return (
      <Routes>
        <Route path="/ethika-admin/*" element={<EthikaAdminPage onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/ethika-admin" replace />} />
      </Routes>
    )
  }

  return <AppLayout onLogout={handleLogout} />
}

export default App
