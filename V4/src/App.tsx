import { Navigate, Route, Routes } from 'react-router-dom';
import { Shell } from './components/Shell';
import { GameProvider } from './game/state';
import DesktopPage from './pages/DesktopPage';
import NotFoundPage from './pages/NotFoundPage';
import ClinicLayout from './pages/clinic/ClinicLayout';
import {
  Article1Page,
  Article2Page,
  Article3Page,
  Article4Page,
  ClinicAboutPage,
  ClinicArchivePage,
  ClinicArticlesPage,
  ClinicContactPage,
  ClinicHomePage,
  ClinicInvestorPage,
  ClinicNewsPage,
  ClinicReviewsPage,
  ClinicTeamPage,
  ClinicTreatmentPage,
  TeamLinPage,
  TeamZhongPage
} from './pages/clinic/ClinicPages';
import {
  AdminBannedPage,
  AdminKeywordsPage,
  AdminLogsPage,
  AdminMessagesPage,
  ForumAdminLoginPage,
  ForumHomePage,
  ForumMemberPage,
  ForumPostPage,
  ForumShadowPage
} from './pages/forum/ForumPages';
import {
  OaB2ReportPage,
  OaDashboardPage,
  OaEntryPage,
  OaHrPage,
  OaLoginPage,
  OaMaintenancePage,
  OaPhotosPage,
  OaPurchasePage,
  OaSystemNotesPage
} from './pages/oa/OaPages';
import {
  EndingAPage,
  EndingBPage,
  EndingCPage,
  EndingHubPage
} from './pages/ending/EndingPages';
import {
  WorldArchivePage,
  WorldGovPage,
  WorldHubPage,
  WorldMapPage,
  WorldPetitionPage,
  WorldQaPage
} from './pages/world/WorldPages';
import { CanonGddPage, CanonWorldPage } from './pages/canon/CanonPages';

export default function App() {
  return (
    <GameProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<DesktopPage />} />

          <Route path="/clinic" element={<ClinicLayout />}>
            <Route index element={<ClinicHomePage />} />
            <Route path="about" element={<ClinicAboutPage />} />
            <Route path="team" element={<ClinicTeamPage />} />
            <Route path="team/zhong" element={<TeamZhongPage />} />
            <Route path="team/lin" element={<TeamLinPage />} />
            <Route path="treatment" element={<ClinicTreatmentPage />} />
            <Route path="reviews" element={<ClinicReviewsPage />} />
            <Route path="news" element={<ClinicNewsPage />} />
            <Route path="investor" element={<ClinicInvestorPage />} />
            <Route path="contact" element={<ClinicContactPage />} />
            <Route path="archive" element={<ClinicArchivePage />} />
            <Route path="articles" element={<ClinicArticlesPage />} />
            <Route path="articles/1" element={<Article1Page />} />
            <Route path="articles/2" element={<Article2Page />} />
            <Route path="articles/3" element={<Article3Page />} />
            <Route path="articles/4" element={<Article4Page />} />
          </Route>

          <Route path="/forum" element={<ForumHomePage />} />
          <Route path="/forum/post/:id" element={<ForumPostPage />} />
          <Route path="/forum/user/:id" element={<ForumPostPage />} />
          <Route path="/forum/member" element={<ForumMemberPage />} />
          <Route path="/forum/admin" element={<ForumAdminLoginPage />} />
          <Route path="/forum/admin/logs" element={<AdminLogsPage />} />
          <Route path="/forum/admin/keywords" element={<AdminKeywordsPage />} />
          <Route path="/forum/admin/messages" element={<AdminMessagesPage />} />
          <Route path="/forum/admin/banned" element={<AdminBannedPage />} />
          <Route path="/forum/shadow" element={<ForumShadowPage />} />

          <Route path="/oa" element={<OaLoginPage />} />
          <Route path="/oa/entry" element={<OaEntryPage />} />
          <Route path="/oa/dashboard" element={<OaDashboardPage />} />
          <Route path="/oa/purchase" element={<OaPurchasePage />} />
          <Route path="/oa/hr" element={<OaHrPage />} />
          <Route path="/oa/maintenance" element={<OaMaintenancePage />} />
          <Route path="/oa/b2report" element={<OaB2ReportPage />} />
          <Route path="/oa/photos" element={<OaPhotosPage />} />
          <Route path="/oa/system-notes" element={<OaSystemNotesPage />} />

          <Route path="/world" element={<WorldHubPage />} />
          <Route path="/world/map" element={<WorldMapPage />} />
          <Route path="/world/qa" element={<WorldQaPage />} />
          <Route path="/world/archive" element={<WorldArchivePage />} />
          <Route path="/world/gov" element={<WorldGovPage />} />
          <Route path="/world/petition" element={<WorldPetitionPage />} />

          <Route path="/canon/gdd" element={<CanonGddPage />} />
          <Route path="/canon/world" element={<CanonWorldPage />} />

          <Route path="/ending" element={<EndingHubPage />} />
          <Route path="/ending/a" element={<EndingAPage />} />
          <Route path="/ending/b" element={<EndingBPage />} />
          <Route path="/ending/c" element={<EndingCPage />} />

          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Shell>
    </GameProvider>
  );
}
