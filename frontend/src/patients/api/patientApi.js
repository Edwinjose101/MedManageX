import axios from 'axios';

const BASE_URL = '/api/patients';

export const createPatient = async (data, token) => {
  return axios.post(BASE_URL, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getPatient = async (id, department, token) => {
  let url = `${BASE_URL}/${id}`;
  if (department) url += `?department=${department}`;

  return axios.get(url, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const addMedicalRecord = async (patientId, record, token) => {
  return axios.post(`${BASE_URL}/${patientId}/record`, record, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
