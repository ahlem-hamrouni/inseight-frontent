import { useAuth } from '../context/AuthContext';

export const useCurrentStudent = () => {
  const { user } = useAuth();
  return user || null;
};