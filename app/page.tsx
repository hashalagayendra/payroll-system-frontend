"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../lib/axios";
import { useLoggedUserDetails } from "../store/useLoggedUserDetails";

export default function Home() {
  const router = useRouter();
  const setUser = useLoggedUserDetails((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/validate");
        if (response.data.user) {
          setUser(response.data.user);
          router.push("/dashboard");
        } else {
          router.push("/login");
        }
      } catch (err) {
        // Not authenticated, redirect to login page
        router.push("/login");
      }
    };
    checkAuth();
  }, [setUser, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Validating session...</p>
      </div>
    </div>
  );
}
