import { API } from "./axios";

export const getEarnings = async (page: number = 1, limit: number = 10, search: string = "", status: string = "") => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (search) {
    queryParams.append("search", search);
  }
  
  if (status) {
    queryParams.append("status", status);
  }

  const response = await API.get(`/partner/referral/earnings?${queryParams.toString()}`);
  return response.data;
};
