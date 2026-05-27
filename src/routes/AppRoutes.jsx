import { useEffect, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import PublicRoute from './PublicRouter';
import PrivateRoute from './PrivateRouter';
import { multiLazy } from './multiLazy';

import LottieLoader from '../components/ui/LottieUnique/LottieLoader';
import Unauthorized from '../components/ui/Unauthorized';
import CreateCasePage from '../pages/Cases/components/AddEdit/CreateCasePage.jsx';
import Clientlist from '../pages/ClientList/ClientList.jsx';
import ClientDetail from '../pages/ClientList/ClientDetail/ClientDetail.jsx';
// import DocConfiguration from "../pages/DocConfiguration/Index.jsx";

const Login = multiLazy(() => import('../pages/Login/Content/Login.jsx'));
const ForgotPassword = multiLazy(
  () => import('../pages/Login/Content/ForgotPassword'),
);
const ResetPassword = multiLazy(
  () => import('../pages/Login/Content/ResetPassword'),
);
const AuthenticationPage = multiLazy(
  () => import('../pages/Login/Content/AuthenticationPage'),
);
const OtpVerificationPage = multiLazy(
  () => import('../pages/Login/Content/OtpVerification'),
);

const AgentList = multiLazy(() => import('../pages/Agent/Index.jsx'));
const AgentWaitListDashboard = multiLazy(
  () => import('../pages/Agent/BucketFlow/AgentWaitListDashboard.jsx'),
);
const AgentDetailPage = multiLazy(
  () => import('../pages/Agent/components/AgentDetailPage.jsx'),
);
const Profile = multiLazy(() => import('../pages/Profile/Index.jsx'));
const CasePage = multiLazy(() => import('../pages/Cases/Index.jsx'));
const KYCVerificationReport = multiLazy(
  () => import('../pages/Cases/components/KYCVerificationReport.jsx'),
);
const APIkeyList = multiLazy(() => import('../pages/APIkeys'));
const AddEditAgentFormPage = multiLazy(
  () => import('../pages/Agent/AddEditAgentFormPage.jsx'),
);
const LoginActivities = multiLazy(() => import('../pages/Activity/Index.jsx'));
const DeviceHistory = multiLazy(() => import('../pages/History/Index'));
const AddEditRolesAndPermission = multiLazy(
  () => import('../pages/AccessSettings/AddEditRolesAndPermission'),
);
const ReportCenter = multiLazy(() => import('../pages/Reports/ReportCenter'));
const AgentSummaryReport = multiLazy(
  () => import('../pages/Reports/Components/AgentReportSummary'),
);
const HistoryList = multiLazy(
  () => import('../pages/DownloadManager/HistoryList'),
);
const MeetScreen = multiLazy(
  () => import('../pages/CallScreen/MeetScreen.jsx'),
);
const DocConfiguration = multiLazy(
  () => import('../pages/DocConfiguration/Index.jsx'),
);
const ShiftManagement = multiLazy(
  () =>
    import('../pages/Profile/ShiftManagement/Components/AddEdit/AddEditShiftManagement.jsx'),
);
const UserList = multiLazy(() => import('../pages/User/Index.jsx'));
const AddEditUserFormPage = multiLazy(
  () => import('../pages/User/AddEditUserFormPage.jsx'),
);

const RolesPage = multiLazy(() => import('../pages/Roles/Index.jsx'));
const CreateRolePage = multiLazy(() => import('../pages/Roles/CreateRole.jsx'));

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/signin', element: <Login /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      { path: '/authentication', element: <AuthenticationPage /> },
      { path: '/otp-verification', element: <OtpVerificationPage /> },
    ],
  },

  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },

  {
    element: <PrivateRoute />,
    children: [
      { path: '/agents/agents-list', element: <AgentList /> },
      { path: '/case-bucket', element: <AgentWaitListDashboard /> },
      { path: '/profile', element: <Profile /> },
      { path: '/cases/cases-list', element: <CasePage /> },
      { path: '/cases/cases-list/create-case', element: <CreateCasePage /> },
      { path: '/api-keys/api-keys-list', element: <APIkeyList /> },
      {
        path: '/cases/cases-list/report/:caseId',
        element: <KYCVerificationReport />,
      },
      {
        path: '/agents/agents-list/edit-agent/:agentId',
        element: <AddEditAgentFormPage />,
      },
      {
        path: '/agents/agents-list/create-agent',
        element: <AddEditAgentFormPage />,
      },
      {
        path: '/agents/agents-list/view-agent/:userId',
        element: <AgentDetailPage />,
      },
      // { path: "/agents/agents-list/edit-user/:userId", element: <AddEditAgentFormPage /> },
      // { path: "/agents/agents-list/create-user", element: <AddEditAgentFormPage /> },
      { path: '/login-activities', element: <LoginActivities /> },
      { path: '/device-history', element: <DeviceHistory /> },

      {
        path: '/roles/roles-list',
        element: <RolesPage />,
      },
      { path: '/roles/roles-list/create-role', element: <CreateRolePage /> },
      {
        path: '/roles/roles-list/edit-role/:roleId',
        element: <CreateRolePage />,
      },

      // {
      //     path: "/roles/roles-list/edit-role/:roleId",
      //     element: <AddEditRolesAndPermission />,
      // },
      {
        path: '/reports/report-center',
        element: <ReportCenter />,
      },
      {
        path: '/reports/report-center/case-summary',
        element: <AgentSummaryReport />,
      },
      {
        path: '/download-history',
        element: <HistoryList />,
      },
      {
        path: '/doc-configuration',
        element: <DocConfiguration />,
      },
      {
        path: '/users/users-list',
        element: <UserList />,
      },

      {
        path: '/users/users-list/create-user',
        element: <AddEditUserFormPage />,
      },
      {
        path: '/users/users-list/edit-user/:userId',
        element: <AddEditUserFormPage />,
      },
      {
        path: '/create-shift',
        element: <ShiftManagement />,
      },
      { path: '/client/client-list', element: <Clientlist /> },
      { path: '/client/client-list/detail', element: <ClientDetail /> },
      {
        path: '/access-forbidden',
        element: (
          <Unauthorized
            code={403}
            message='This case session is invalid or not assigned to you.'
          />
        ),
      },
    ],
  },

  {
    path: '/agents/agent-call/:caseId',
    element: <MeetScreen />,
  },

  {
    path: '*',
    element: <Navigate to='/signin' replace />,
  },
]);

export default function AppRouter() {
  useEffect(() => {
    if (import.meta.env.PROD) {
      console.debug = () => {};
    }
  }, []);

  return (
    <Suspense
      fallback={<LottieLoader lottieKey='loaderIcon' playerClass='w-[80px]' />}
    >
      <RouterProvider router={router} />
    </Suspense>
  );
}
