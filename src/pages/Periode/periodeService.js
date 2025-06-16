import api from "../../services/api";

export const getSertifikatData = async () => {
  const response = await api.get('/sertifikat');
  return response.data;
};
