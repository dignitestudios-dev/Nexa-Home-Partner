import { API } from "./axios";

export const getInvitations = async (
    page: number = 1,
    limit: number = 10,
    status: string = "pending",
    search: string = ""
) => {
    const response = await API.get(
        `/partner/invitations?page=${page}&limit=${limit}&status=${status}&search=${search}`
    );
    return response.data;
};

export const uploadCsvFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await API.post("/partner/invitations/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const csvTemplate = async () => {
    const response = await API.get("/partner/invitations/template", {
        responseType: "blob",
    });
    return response.data;
};
