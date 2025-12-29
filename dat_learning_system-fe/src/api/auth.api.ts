import { mockUsers } from "../mocks/auth.mock";

export async function mockLogin(companyCode: string, password: string) {
  const user = mockUsers.find(u => u.companyCode === companyCode);

  if (!user || password !== "password123") {
    throw new Error("Invalid credentials");
  }

  return {
    token: "mock-jwt-token",
    user,
  };
}
