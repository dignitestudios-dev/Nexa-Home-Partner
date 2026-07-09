import { API } from "./axios";

export const getReferralCode = async () => {
  const response = await API.get("/partner/referral-code");
  return response.data;
};

export const getReferralActivity = async (page = 1, limit = 10, search = "", startDate = "", endDate = "") => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (search) queryParams.append("search", search);
  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  
  const response = await API.get(`/partner/referral/activity?${queryParams.toString()}`);
  return response.data;
};
export const getRevenueAnalysis = async (groupBy: string = "month", months: number = 12) => {
  const response = await API.get(`/partner/dashboard/revenue-analysis?groupBy=${groupBy}&months=${months}`);
  return response.data;
};