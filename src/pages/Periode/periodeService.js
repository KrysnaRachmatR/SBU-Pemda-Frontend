import axios from 'axios';

export const getSertifikatData = async () => {
  const response = await axios.get('/api/sertifikat');
  return response.data;
};
