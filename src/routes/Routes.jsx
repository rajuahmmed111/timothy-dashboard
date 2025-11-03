import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import NotFound from "../components/NotFound";
import ForgotPass from "../components/ForgotPass";
import Checkemail from "../components/Checkemail";
import ResetPassword from "../components/ResetPassword";
import DashboardHome from "../pages/dashboard/DashboardHome";
import DashboardLayout from "../layouts/DashboardLayout";
import UserInformation from "../pages/dashboard/UserInformation";
import Register from "../pages/Register/Register"
import FinancialPayments from "../pages/dashboard/FinancialPayments/FinancialPayments";
import Contracts from "../pages/dashboard/Contracts/Contracts";
import UserSupport from "../pages/dashboard/userSupport/userSupport";
import UserMessage from "../pages/dashboard/userSupport/UserMessage";
import ServiceProvider from "../pages/dashboard/ServiceProviders/ServiceProvider";
import Role from "../pages/dashboard/Role/Role";
import UserDetails from "../pages/dashboard/UserDetails";
import SettingsTab from "../pages/dashboard/SettingsTab/SettingsTabs";
import AprouvePartners from "../pages/dashboard/ApprovePartners/AprouvePartners";
import SendReport from "../pages/SendReport/SendReport";
import NewContractDetails from "../pages/dashboard/NewcontractDetails/NewContractDetails";
import ProfileSettings from "../components/ProfileSetting";
import ApprovePartnerDetails from "../pages/dashboard/ApprovePartners/ApprovePartnerDetails";
import RoleDetails from "../pages/dashboard/Role/RoleDetails";
import FinancialPaymentDetails from "../pages/dashboard/FinancialPayments/FinancialPaymentDetails";
import RoleDetailsReadOnly from "../pages/dashboard/Role/RoleDetailsReadOnly";
import AllMessage from "../pages/dashboard/AllMessage/AllMessage";
import Notification from "../pages/dashboard/Notification/Notification";
import TermsAndConditions from "../components/TermsAndConditions";
import PrivacyPolicy from "../components/PrivacyPolicy";
import PromoCodesManagement from "../components/PromoCodesManagement";


const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: <DashboardHome /> },
    ]
  },
  { path: '*', element: <NotFound /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element:  <Register></Register> },
  { path: '/forgotpass', element: <ForgotPass /> },
  { path: '/checkemail', element: <Checkemail /> },
  { path: '/reset-password', element: <ResetPassword /> },

  // Dashboard routes
{
  path: '/dashboard',
  element: <DashboardLayout />,
  children: [
    { path: 'statistics', element: <DashboardHome /> },
    { path: 'user-info', element: <UserInformation /> },
    { path: 'user-info/details/:id', element: <UserDetails></UserDetails> },
    { path: 'service-provider', element: <ServiceProvider></ServiceProvider> },
    { path: 'approve-partners', element: <AprouvePartners></AprouvePartners> },
    { path: 'approve-partners/approve-details/:id', element: <ApprovePartnerDetails></ApprovePartnerDetails> },
    { path: 'service-provider/details/:id', element: <UserDetails></UserDetails> },
    {path: "all-messages", element: <AllMessage></AllMessage>},
    { path: 'financialpayments', element: <FinancialPayments /> },
    { path: 'financialpayments/details/:id', element: <FinancialPaymentDetails></FinancialPaymentDetails> },
    { path: 'contracts', element: <Contracts /> },
    { path: `contracts/:id`, element: <NewContractDetails></NewContractDetails> },
    // { path: 'userroles', element: <div>user roles</div> },
    { path: 'support', element: <UserSupport></UserSupport> },
    { path: 'support/:id', element: <UserMessage></UserMessage> },
    { path: 'role', element: <Role></Role> },
    { path: 'role/details/:id', element: <RoleDetails></RoleDetails> },
    { path: 'role/view/:id', element: <RoleDetailsReadOnly></RoleDetailsReadOnly> },
    { path: 'settings', element: <SettingsTab></SettingsTab> },
    { path: 'update-profile', element: <ProfileSettings></ProfileSettings> },
    // { path: 'send-report', element: <SendReport></SendReport> },
    { path: 'send-report', element: <SendReport></SendReport> },
    { path: 'notification', element: <Notification></Notification> },
    { path: 'terms-conditions', element: <TermsAndConditions></TermsAndConditions> },
    { path: 'privacy-policy', element: <PrivacyPolicy></PrivacyPolicy> },
    { path: 'promo-codes', element: <PromoCodesManagement></PromoCodesManagement> },
  //   { path: 'settings/privacy', element: <Privacypage /> },
   ]
}
]);

export default router;