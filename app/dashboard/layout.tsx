"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useLoggedUserDetails } from "../../store/useLoggedUserDetails";
import axiosInstance from "../../lib/axios";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Clock,
  Briefcase,
  FileText,
  DollarSign,
  Receipt,
  Landmark,
  CreditCard,
  Building2,
  History,
  Settings,
  ChevronDown,
} from "lucide-react";

type NavLink = {
  name: string;
  href?: string;
  icon: React.ElementType;
  subItems?: { name: string; href: string }[];
};

const NAV_LINKS: NavLink[] = [
  { name: "Overview (Home)", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Employees",
    icon: Users,
    subItems: [
      { name: "All Employees", href: "/dashboard/employees" },
      { name: "Documents", href: "/dashboard/employees/documents" },
      { name: "Bank Details", href: "/dashboard/employees/bank-details" },
    ],
  },
  {
    name: "Attendance",
    icon: CalendarCheck,
    subItems: [
      { name: "Daily Attendance", href: "/dashboard/attendance" },
      { name: "Monthly Analytics", href: "/dashboard/attendance/summary" },
    ],
  },
  { name: "Timesheets", href: "/dashboard/timesheets", icon: Clock },
  {
    name: "Projects",
    icon: Briefcase,
    subItems: [
      { name: "All Projects", href: "/dashboard/projects" },
      { name: "Project Timeline", href: "/dashboard/projects/timeline" },
    ],
  },
  {
    name: "Payroll",
    icon: FileText,
    subItems: [
      { name: "Payroll Runs", href: "/dashboard/payroll/runs" },
      { name: "Payroll Slips", href: "/dashboard/payroll/slips" },
    ],
  },
  {
    name: "Salary Management",
    icon: DollarSign,
    subItems: [
      {
        name: "Salary Structures",
        href: "/dashboard/salary-management/structures",
      },
      {
        name: "Employee Salaries",
        href: "/dashboard/salary-management/salaries",
      },
    ],
  },
  {
    name: "Bonuses & Deductions",
    href: "/dashboard/bonuses-deductions",
    icon: Receipt,
  },
  { name: "Tax Management", href: "/dashboard/tax-management", icon: Landmark },
  {
    name: "Salary Payments",
    href: "/dashboard/salary-payments",
    icon: CreditCard,
  },
  {
    name: "Organization",
    icon: Building2,
    subItems: [
      { name: "Branches", href: "/dashboard/organization/branches" },
      { name: "Departments", href: "/dashboard/organization/departments" },
      { name: "Designations", href: "/dashboard/organization/designations" },
    ],
  },
  { name: "Audit Logs", href: "/dashboard/audit-logs", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

const NavItem = ({ link, pathname }: { link: NavLink; pathname: string }) => {
  const isActive = link.href
    ? pathname === link.href
    : link.subItems?.some((sub) => pathname.startsWith(sub.href));

  const [isExpanded, setIsExpanded] = useState(isActive);
  const Icon = link.icon;

  if (link.subItems) {
    return (
      <div className="flex flex-col">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
            isActive
              ? "bg-slate-800 text-white shadow-sm"
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          }`}
        >
          <div className="flex items-center">
            <Icon
              className={`w-5 h-5 mr-3 shrink-0 transition-colors ${
                isActive
                  ? "text-white"
                  : "text-slate-400 group-hover:text-white"
              }`}
            />
            <span className="truncate">{link.name}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            } ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-200 ease-in-out ${
            isExpanded ? "max-h-64 opacity-100 mt-1" : "max-h-0 opacity-0"
          }`}
        >
          <div className="ml-4 pl-4 border-l border-slate-700 space-y-1 py-1">
            {link.subItems.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  pathname === sub.href
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={link.href!}
      className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
        isActive
          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon
        className={`w-5 h-5 mr-3 shrink-0 transition-colors ${
          isActive ? "text-white" : "text-slate-400 group-hover:text-white"
        }`}
      />
      <span className="truncate">{link.name}</span>
    </Link>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useLoggedUserDetails();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/validate");
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    validateAuth();
  }, [setUser, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-slate-900 text-white shadow-xl hidden md:flex flex-col z-10 relative">
        {/* Brand Area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800  shrink-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={44}
            height={44}
            className="rounded-lg mr-3 object-contain shrink-0"
          />
          <h1 className="text-xl font-bold tracking-wide truncate">
            Source Code
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar max-h-[calc(100vh-140px)]">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Menu
          </p>
          {NAV_LINKS.map((link) => (
            <NavItem key={link.name} link={link} pathname={pathname || ""} />
          ))}
        </nav>

        {/* User Badge at Bottom */}
        <div className=" border-t border-slate-800  absolute bottom-0 w-full ">
          <div className="flex items-center w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-inner shrink-0">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {user.email.split("@")[0]}
              </p>
              <p className="text-xs text-slate-400 truncate capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation */}
        {/* <nav className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <div className="md:hidden flex items-center">
            <Image
              src="/logo.png"
              alt="Logo"
              width={44}
              height={44}
              className="rounded-lg mr-3 object-contain shrink-0"
            />
            <h1 className="text-xl font-bold text-slate-800 truncate">
              Source Code
            </h1>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </nav> */}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-scroll h-full max-h-dvh">
          {children}
        </main>
      </div>
    </div>
  );
}
