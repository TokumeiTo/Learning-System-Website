import api from "../hooks/useApi";

export interface OrgUnitSelect {
  id: number;
  name: string;
}

export const getDivisions = async (): Promise<OrgUnitSelect[]> => {
  const res = await api.get("/api/OrgUnits/divisions");
  return res.data;
};

export const getDepartments = async (): Promise<OrgUnitSelect[]> => {
  const res = await api.get("/api/OrgUnits/departments");
  return res.data;
};

export const getSections = async (): Promise<OrgUnitSelect[]> => {
  const res = await api.get("/api/OrgUnits/sections");
  return res.data;
};

export const getTeams = async (): Promise<OrgUnitSelect[]> => {
  const res = await api.get("/api/OrgUnits/teams");
  return res.data;
};
