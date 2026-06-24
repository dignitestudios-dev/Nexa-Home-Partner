import { API } from "./axios";

export const getDashboardSummary = async () => {
  const response = await API.get("/partner/dashboard/summary");
  return response.data;
};

export const getRevenueAnalysis = async (groupBy: string = "month", months: number = 12) => {
  const response = await API.get(`/partner/dashboard/revenue-analysis?groupBy=${groupBy}&months=${months}`);
  return response.data;
};

export const getGrowthTracking = async (groupBy: string = "month", months: number = 12) => {
  const response = await API.get(`/partner/dashboard/growth-tracking?groupBy=${groupBy}&months=${months}`);
  return response.data;
};


export const uploadSignature = async (formData: FormData) => {
  const response = await API.post("/user/signature", formData);
  return response.data;
};