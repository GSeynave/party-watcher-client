import { useEffect, useState } from "react";
import Api from "../services/auth";

type UserContext = {
  userId: string;
  mail: string;
};

function useAuth() {
  const [user, setUser] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchUser() {
    setLoading(true);
    try {
      const response = await Api.getMe();
      console.log("User data fetched successfully:", response);
      setUser({ userId: response.userId, mail: response.mail });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    async function init() {
      await fetchUser();
    }
    init();
  }, []);

  return { user, loading, isAuthenticated: !!user, error, refetch: fetchUser };
}

export default useAuth;
