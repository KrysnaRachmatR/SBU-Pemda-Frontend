import axios from 'axios';

export const getSertifikatData = async () => {
  const response = await axios.get('/api/sertifikat'); // sesuaikan endpoint
  return response.data;
};
