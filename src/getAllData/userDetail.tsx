import { useState, useEffect } from "react";
import authSvc from "../services/Auth.service";

export const UseUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await authSvc.getRequest("/getuser");
        setUsers(response.data || []);
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return users;
};
