import React, { createContext, useState } from 'react';
export const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const [patient, setPatient] = useState(null);
  return (
    <PatientContext.Provider value={{ patient, setPatient }}>
      {children}
    </PatientContext.Provider>
  );
};
