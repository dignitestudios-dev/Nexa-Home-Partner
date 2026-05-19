import { API } from "./axios";

export const getReferralCode = async () => {
  const response = await API.get("/partner/referral-code");
  return response.data;
};

export const getReferralActivity = async (page = 1, limit = 10, search = "") => {
  const response = await API.get(`/partner/referral/activity?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
};
export const getRevenueAnalysis = async (groupBy: string = "month", months: number = 12) => {
  const response = await API.get(`/partner/dashboard/revenue-analysis?groupBy=${groupBy}&months=${months}`);
  return response.data;
};