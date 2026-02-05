/**
 * Standardizes organizational unit data from various API endpoints.
 * Based on console logs, the API consistently returns { id: number, name: string }.
 */
export const normalizeOrgData = (data: any[]) => {
  // Debugging log to confirm incoming data structure

  if (!data || !Array.isArray(data)) return [];

  return data.map((d) => ({
    id: d.id,
    // Prioritize 'name' as seen in logs, fallback to specific keys if the API ever changes
    name: d.name || d.division_name || d.department_name || d.section_name || d.team_name || "Unknown Unit"
  }));
};