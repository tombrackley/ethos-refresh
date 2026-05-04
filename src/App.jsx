import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { isEnabled } from '@/config/flags'
import LoginPage from '@/pages/LoginPage'
import EthikaAdminPage from '@/pages/EthikaAdminPage'
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
import BoardsCommitteesPage from '@/pages/BoardsCommitteesPage'
import GovernMeetingsPage from '@/pages/GovernMeetingsPage'
import BoardPapersPage from '@/pages/BoardPapersPage'
import PoliciesProceduresPage from '@/pages/PoliciesProceduresPage'
import DelegationsPage from '@/pages/DelegationsPage'
import CompanyRegisterPage from '@/pages/CompanyRegisterPage'
import MeetingAgendaPage from '@/pages/MeetingAgendaPage'
import MeetingMinutesPage from '@/pages/MeetingMinutesPage'
import BoardPaperReviewPage from '@/pages/BoardPaperReviewPage'
import { GovernShell } from '@/components/layout/GovernShell'
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

/** Default redirect path — first available page */
function getDefaultPath() {
  if (isEnabled('PAGE_CONTROL')) return '/'
  if (isEnabled('PAGE_LEARN')) return '/learn'
  if (isEnabled('PAGE_ADMIN')) return '/admin/organisation-profile'
  return '/'
}

function AppLayout({ onLogout }) {
  const navigate = useNavigate()
  const [selectedMatter, setSelectedMatter] = useState(null)
  const defaultPath = getDefaultPath()

  function navigateToMatter(matter) {
    setSelectedMatter(matter)
    navigate('/matter/' + (matter?.id || 'detail'))
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full bg-sidebar">
          <AppSidebar onLogout={onLogout} />

          <div className="flex flex-1 flex-col overflow-hidden p-2">
            <main className="flex-1 overflow-hidden flex rounded-lg bg-background border border-[#E2E8F0]">
              <Routes>
                {isEnabled('PAGE_CONTROL') ? (
                  <Route path="/" element={<ControlPage />} />
                ) : (
                  <Route path="/" element={<Navigate to={defaultPath} replace />} />
                )}
                {gatedRoute('/matters', 'PAGE_WORK', <WorkPage onNavigateMatter={navigateToMatter} />)}
                {isEnabled('PAGE_MATTER_DETAIL') && (
                  <Route path="/matter/:id" element={
                    selectedMatter ? <MatterDetailPage matter={selectedMatter} onBack={() => navigate('/matters')} /> : <Navigate to="/matters" replace />
                  } />
                )}
                {gatedRoute('/respond', 'PAGE_WORK_RESPOND', <RespondPage />)}
                {gatedRoute('/meet', 'PAGE_WORK_MEET', <MeetPage />)}
                {gatedRoute('/work/time-efficiency', 'PAGE_WORK_TIME_EFFICIENCY', <TimeEfficiencyPage />)}
                {gatedRoute('/comply', 'PAGE_COMPLY', <ComplyPage />)}
                {gatedRoute('/comply/contracts', 'PAGE_COMPLY_CONTRACTS', <ContractsPage />)}
                {gatedRoute('/comply/conflicts', 'PAGE_COMPLY_CONFLICTS', <ConflictPage />)}
                {gatedRoute('/comply/risk', 'PAGE_COMPLY_RISK', <RiskRegisterPage />)}
                {gatedRoute('/comply/incidents', 'PAGE_COMPLY_INCIDENTS', <IncidentPage />)}
                {gatedRoute('/comply/audit', 'PAGE_COMPLY_AUDIT', <AuditPage />)}
                {gatedRoute('/comply/legislation', 'PAGE_COMPLY_LEGISLATION', <LegislationPage />)}
                {gatedRoute('/comply/obligations', 'PAGE_COMPLY_OBLIGATIONS', <ObligationsPage />)}
                {isEnabled('PAGE_GOVERN') && (
                  <Route path="/govern" element={<GovernShell />}>
                    <Route index element={<GovernPage />} />
                    {isEnabled('PAGE_GOVERN_BOARDS_COMMITTEES') && (
                      <Route path="boards-committees" element={<BoardsCommitteesPage />} />
                    )}
                    {isEnabled('PAGE_GOVERN_MEETINGS') && (
                      <Route path="meetings" element={<GovernMeetingsPage />} />
                    )}
                    <Route path="meetings/:meetingId" element={<MeetingAgendaPage />} />
                    <Route path="meetings/:meetingId/minutes" element={<MeetingMinutesPage />} />
                    {isEnabled('PAGE_GOVERN_BOARD_PAPERS') && (
                      <Route path="board-papers" element={<BoardPapersPage />} />
                    )}
                    {isEnabled('PAGE_GOVERN_BOARD_PAPERS') && (
                      <Route path="board-papers/:paperId" element={<BoardPaperReviewPage />} />
                    )}
                    {isEnabled('PAGE_GOVERN_POLICIES') && (
                      <Route path="policies" element={<PoliciesProceduresPage />} />
                    )}
                    {isEnabled('PAGE_GOVERN_DELEGATIONS') && (
                      <Route path="delegations" element={<DelegationsPage />} />
                    )}
                    <Route path="boards/:boardId" element={<BoardDetailPage />} />
                    {isEnabled('PAGE_GOVERN_COMPANY_REGISTER') && (
                      <Route path="company-register" element={<CompanyRegisterPage />} />
                    )}
                  </Route>
                )}
                {gatedRoute('/vault', 'PAGE_VAULT', <VaultPage />)}
                {gatedRoute('/resources', 'PAGE_RESOURCES', <ResourceLibraryPage />)}
                {gatedRoute('/talent', 'PAGE_TALENT', <TalentPage />)}
                {gatedRoute('/insights', 'PAGE_INSIGHTS', <InsightsPage />)}
                {gatedRoute('/learn', 'PAGE_LEARN', <LearnPage />)}
                {gatedRoute('/learn/journeys', 'PAGE_LEARN_JOURNEYS', <LearningJourneysPage />)}
                {gatedRoute('/learn/knowledge', 'PAGE_LEARN_KNOWLEDGE_CENTRE', <KnowledgeCentrePage />)}
                {isEnabled('PAGE_LEARN_KNOWLEDGE_CENTRE') && (
                  <Route path="/knowledge-demo" element={<KnowledgeCentreDemoPage />} />
                )}
                {gatedRoute('/learn/cpd', 'PAGE_LEARN_CPD', <CPDTrackerPage />)}
                {gatedRoute('/learn/cpd/events', 'PAGE_LEARN_CPD_EVENTS', <CPDEventsPage />)}
                {gatedRoute('/learn/skills', 'PAGE_LEARN_SKILLS', <SkillsProfilePage />)}
                {gatedRoute('/community', 'PAGE_COMMUNITY', <CommunityPage />)}
                {gatedRoute('/integrations', 'PAGE_INTEGRATIONS', <IntegrationsPage />)}
                {gatedRoute('/settings', 'PAGE_SETTINGS', <PlaceholderPage title="Settings" />)}
                {gatedRoute('/profile', 'PAGE_PROFILE', <ProfilePage />)}
                {isEnabled('PAGE_ADMIN') && <Route path="/admin/*" element={<AdminPage />} />}
                <Route path="/flags" element={<FeatureFlagManagerPage />} />
                <Route path="/view/:contentId" element={<ExternalContentViewer />} />
                <Route path="*" element={<Navigate to={defaultPath} replace />} />
              </Routes>
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
