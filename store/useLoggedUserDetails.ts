import { create } from "zustand";

export interface User {
  id: number;
  employee_id: number;
  email: string;
  role: string;
  last_login: string;
  created_at: string;
  updated_at: string;
}

interface LoggedUserDetailsState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useLoggedUserDetails = create<LoggedUserDetailsState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
