import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import authReducer from "./features/auth/authSlice";
import adminReducer from "./features/admin/adminSlice";
import getAllUsersReducer from "./features/user/getAllUsersSlice";
import getAllPartnersReducer from "./features/user/getPartnersSlice";
import singleUserReducer from "./features/user/getSIngleUserSlice";
import { statisticsApi } from './api/statistics/getOverviewApi';
import { paymentUserAnalysisApi } from './api/statistics/paymentAndUserAnalisys';
import { cancelRefundApi } from './api/statistics/cancelRefundApi';
import { termsConditionsApi } from './api/termsConditions/termsConditionsApi';
import { privacyPolicyApi } from './api/privacyPolicy/privacyPolicyApi';
import { financesApi } from './api/finances/financesApi';
import { promoCodesApi } from './api/promoCodes/promoCodesApi';
import { adminApi } from './api/admin/adminApi';
import { userApi } from './api/userApi';
import { channelsApi } from './api/chat/getChannelsByIdApi';
import { messagesApi } from './api/chat/getAllMSGApi';
import { adminChannelsApi } from './api/chat/getAllChannelsForAdminApi';
import { contractDetailsApi } from './api/contracts/contractDetailsApi';
import { supportApi } from './api/support/supportApi';
import { notificationManageApi } from './api/notifications/notificationManageApi';
import { userDemographicsApi } from './api/statistics/getuserDemographics';
import { userSupportTicketsApi } from './api/statistics/userSupportTicketsApi';

export const store = configureStore({
  reducer: {
    singleUser: singleUserReducer,
    user: userReducer,
    auth: authReducer,
    admin: adminReducer,
    getAllUsers: getAllUsersReducer,
    getAllPartners: getAllPartnersReducer,
    [statisticsApi.reducerPath]: statisticsApi.reducer,
    [paymentUserAnalysisApi.reducerPath]: paymentUserAnalysisApi.reducer,
    [cancelRefundApi.reducerPath]: cancelRefundApi.reducer,
    [termsConditionsApi.reducerPath]: termsConditionsApi.reducer,
    [privacyPolicyApi.reducerPath]: privacyPolicyApi.reducer,
    [financesApi.reducerPath]: financesApi.reducer,
    [promoCodesApi.reducerPath]: promoCodesApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [channelsApi.reducerPath]: channelsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [adminChannelsApi.reducerPath]: adminChannelsApi.reducer,
    [contractDetailsApi.reducerPath]: contractDetailsApi.reducer,
    [supportApi.reducerPath]: supportApi.reducer,
    [notificationManageApi.reducerPath]: notificationManageApi.reducer,
    [userDemographicsApi.reducerPath]: userDemographicsApi.reducer,
    [userSupportTicketsApi.reducerPath]: userSupportTicketsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(statisticsApi.middleware)
      .concat(paymentUserAnalysisApi.middleware)
      .concat(cancelRefundApi.middleware)
      .concat(termsConditionsApi.middleware)
      .concat(privacyPolicyApi.middleware)
      .concat(financesApi.middleware)
      .concat(promoCodesApi.middleware)
      .concat(userApi.middleware)
      .concat(channelsApi.middleware)
      .concat(messagesApi.middleware)
      .concat(adminChannelsApi.middleware)
      .concat(contractDetailsApi.middleware)
      .concat(supportApi.middleware)
      .concat(notificationManageApi.middleware)
      .concat(userDemographicsApi.middleware)
      .concat(userSupportTicketsApi.middleware)
      .concat(adminApi.middleware),
});
