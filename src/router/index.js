// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import NotFoundPage from "../pages/NotFoundPage.vue"; // <- Create this component
import AuthLayout from "../components/AuthLayout.vue";
import AppLayout from "../components/AppLayout.vue";
import LoginPage from "../pages/auth/LoginPage.vue";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage.vue";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage.vue";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage.vue";
import DashboardPage from "@/pages/DashboardPage.vue";
import CoachPage from "@/pages/CoachPage.vue";
import CoachDetailsPage from "@/pages/CoachDetailsPage.vue";
import AthletePage from "@/pages/AthletePage.vue";
import AthleteDetailsPage from "@/pages/AthleteDetailsPage.vue";
import AssignmentPage from "@/pages/AssignmentPage.vue";
import SessionManagementPage from "@/pages/SessionManagementPage.vue";
import LeaguePage from "@/pages/sport/LeaguePage.vue";
import SportPage from "@/pages/sport/SportPage.vue";
import TeamPage from "@/pages/sport/TeamPage.vue";
import TaskPage from "@/pages/TaskPage.vue";
import ParentPage from "@/pages/ParentPage.vue";
import ParentDetailsPage from "@/pages/ParentDetailsPage.vue";
import LeagueDetailsPage from "@/pages/sport/LeagueDetailsPage.vue";
import MatchPage from "@/pages/sport/MatchPage.vue";
import LeagueRegistrationPage from "@/pages/sport/LeagueRegistrationPage.vue";
import SchoolPage from "@/pages/after-school-program/SchoolPage.vue";
import StudentPage from "@/pages/after-school-program/StudentPage.vue";
import RoutePage from "@/pages/after-school-program/RoutePage.vue";
import RouteSchoolPage from "@/pages/after-school-program/RouteSchoolPage.vue";
import ProfilePage from "@/pages/settings/ProfilePage.vue";
import ChangePassPage from "@/pages/settings/ChangePassPage.vue";
import SettingsPage from "@/pages/SettingsPage.vue";
import PrivacyPolicyPage from "@/pages/settings/PrivacyPolicyPage.vue";
import TermsConditionsPage from "@/pages/settings/TermsConditionsPage.vue";
import AboutUsPage from "@/pages/settings/AboutUsPage.vue";
// import UserLayout from "@/components/UserLayout.vue";
// import ReportPage from "../pages/ReportPage.vue";
// import ClientsAccountsPage from "../pages/ClientsAccountsPage.vue"; // <- Create this component
// import EquipmentsPage from "../pages/EquipmentsPage.vue"; // <- Create this component
// import ProfilePage from "@/pages/ProfilePage.vue";
// import UserLayout from "@/components/UserLayout.vue";
// import ChangePassPage from "@/pages/ChangePassPage.vue";
// import EquipmentDetailsPage from "@/pages/EquipmentDetailsPage.vue";
// import SettingsPage from "@/pages/SettingsPage.vue";

const routes = [
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      { path: "", redirect: "auth/login" }, // Redirect to /auth/login
      { path: "login", component: LoginPage, meta: { title: "Login", dataUrl: "auth/login" } },
      { path: "forgot-password", component: ForgotPasswordPage, meta: { title: "Forgot Password", dataUrl: "auth/forgot-password" } },
      { path: "verify-email", component: VerifyEmailPage, meta: { title: "Verify Email", dataUrl: "auth/verify-email" } },
      { path: "reset-password", component: ResetPasswordPage, meta: { title: "Reset Password", dataUrl: "auth/reset-password" } },
    ],
  },

  {
    path: "/",
    component: AppLayout,
    children: [
      { path: "/", redirect: '/dashboard' },
      { path: "/dashboard", component: DashboardPage, meta: { title: "Dashboard", dataUrl: "dashboard" } },
      { path: "/athlete", component: AthletePage, meta: { title: "Athlete", dataUrl: "user/athlete" } },
      { path: "/athlete/:id", component: AthleteDetailsPage, meta: { title: "Coach Details", dataUrl: "user/athlete" } },
      { path: "/coach", component: CoachPage, meta: { title: "Coach", dataUrl: "user/coach" } },
      { path: "/coach/:id", component: CoachDetailsPage, meta: { title: "Coach Details", dataUrl: "athlete-task" } },
      { path: "/parent", component: ParentPage, meta: { title: "Parent", dataUrl: "user/parent" } },
      { path: "/parent/:id", component: ParentDetailsPage, meta: { title: "parent Details", dataUrl: "athlete" } },
      { path: "/assignment", component: AssignmentPage, meta: { title: "Assignment", dataUrl: "assignment" } },
      { path: "/lesson", component: SessionManagementPage, meta: { title: "All Sessions", dataUrl: "lesson" } },
      { path: "/skill", component: TaskPage, meta: { title: "Skill", dataUrl: "skill" } },
      // { path: "/session-mange/:id", component: SessionManagementDetailsPage, meta: { title: "Session", dataUrl: "session" } },
      {
        path: "/sport",
        children: [
          { path: '', component: SportPage, meta: { title: "Sport", dataUrl: "sport" } },
          { path: 'league', component: LeaguePage, meta: { title: "League", dataUrl: "league" } },
          { path: 'league/:id', component: LeagueDetailsPage, meta: { title: "League Details", dataUrl: "league" } },
          { path: 'league-registration', component: LeagueRegistrationPage, meta: { title: "League Registration", dataUrl: "league-registration" } },
          { path: 'team', component: TeamPage, meta: { title: "Team", dataUrl: "team" } },
          { path: 'matches', component: MatchPage, meta: { title: "Matches", dataUrl: "match" } },
        ]
      },
      {
        path: "/after-school-program",
        children: [
          { path: 'schools', component: SchoolPage, meta: { title: "School", dataUrl: "school" } },
          { path: 'student', component: StudentPage, meta: { title: "Student", dataUrl: "student" } },
          { path: 'routes', component: RoutePage, meta: { title: "Route", dataUrl: "route" } },
          { path: 'route-school', component: RouteSchoolPage, meta: { title: "Route School", dataUrl: "route-school" } },
        ]
      },
      // { path: "/coach/:id", component: CoachDetailsPage, meta: { title: "Coach Details", dataUrl: "coach" } },
      // { path: "report", component: ReportPage, meta: { title: "Report", dataUrl: "clients/report" } },
      {
        path: "/",
        // component: UserLayout,
        children: [
          { path: "profile", component: ProfilePage, meta: { title: "Profile", dataUrl: "user/u/me" } },
          { path: "change-password", component: ChangePassPage, meta: { title: "Reset Password", dataUrl: "auth/change-password" } },
          { path: "settings", component: SettingsPage, meta: { title: "Settings", dataUrl: "settings" } },
          { path: "privacy-policy", component: PrivacyPolicyPage, meta: { title: "Privacy Policy", dataUrl: "setting/privacy-policy" } },
          { path: "terms-conditions", component: TermsConditionsPage, meta: { title: "Terms & Conditions", dataUrl: "setting/terms-conditions" } },
          { path: "about-us", component: AboutUsPage, meta: { title: "About Us", dataUrl: "setting/about-us" } },
        ],
      },
    ]
  },

  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundPage, meta: { title: "404 - Page Not Found" } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/auth/login', '/auth/forgot-password', '/auth/verify-email', '/auth/reset-password'];
  const token = localStorage.getItem('token');

  // If user is logged in, don't permit visiting public pages
  if (token && publicPages.includes(to.path)) {
    return next('/');
  }
  console.log(token);

  const authRequired = !publicPages.includes(to.path) && !to.path.startsWith('/auth');

  document.title = `Athletics | ${to.meta.title}`;

  if (authRequired && !token) {
    return next('/auth/login');
  }
  next();
});

export default router;
