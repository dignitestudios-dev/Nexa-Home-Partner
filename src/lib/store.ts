import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import referralTrackingReducer from './slices/referral-trackingSlice';
import categoryHomeowerReducer from './slices/category-homeowerSlice';
import csvReducer from './slices/csvSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    referralTracking: referralTrackingReducer,
    categoryHomeower: categoryHomeowerReducer,
    csv: csvReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
