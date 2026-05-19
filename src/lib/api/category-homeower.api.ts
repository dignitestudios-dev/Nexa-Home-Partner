import { API } from "./axios";

export const getCategory = async (limit: number = 10) => {
  const response = await API.get(`/partner/insights/top-categories?limit=${limit}`);
  return response.data;
};

export const getHomeowner = async (limit: number = 10) => {
  const response = await API.get(`/partner/insights/top-homeowners?limit=${limit}`);
  return response.data;
};