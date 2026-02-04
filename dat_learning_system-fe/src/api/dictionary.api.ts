import api from "../hooks/useApi";

export const dictionaryApi = {
  search: async (keyword: string) => {
    console.log("1. Starting search for:", keyword); // Did this show up?
    try {
      const response = await api.get(`api/Dictionary/search`, {
        params: { keyword }
      });
      console.log("2. Response received:", response.data);
      return response.data; 
    } catch (err) {
      console.error("3. Service Layer Error:", err);
      throw err;
    }
  },
};