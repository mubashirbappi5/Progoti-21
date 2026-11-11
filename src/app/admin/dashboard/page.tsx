"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Users,
  Calendar,
  Utensils,
  Gift,
  Sparkles,
  Download,
  Trash2,
  Search,
  Eye,
  LogOut,
  RefreshCw,
  AlertCircle,
  Clock,
  ThumbsDown,
  X,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Table as TableIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatDate } from "@/lib/utils";

const COLORS = [
  "#F59E0B", // Amber
  "#38BDF8", // Sky blue
  "#10B981", // Emerald
  "#EC4899", // Pink
  "#A855F7", // Purple
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#14B8A6", // Teal
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "table">("overview");

  // Data state
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [overview, setOverview] = useState<any>({
    totalSubmissions: 0,
    totalUniqueParticipants: 0,
    topPreferredDate: "N/A",
    topPreferredFood: "N/A",
    topPreferredGift: "N/A",
    topPreferredActivity: "N/A",
  });
  const [charts, setCharts] = useState<any>({
    datePreferences: [],
    foodPreferences: [],
    mealSchedulePreferences: [],
    giftPreferences: [],
    activityPopularity: [],
    activitiesToAvoid: [],
  });

  // Table filtering and search
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [foodFilter, setFoodFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Detail Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  // Delete Confirmation Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Dashboard Data
  const fetchData = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/submissions");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "ড্যাশবোর্ড তথ্য লোড করা সম্ভব হয়নি।");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setSubmissions(data.submissions || []);
      setOverview(data.overview || {});
      setCharts(data.charts || {});
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/submissions/${deleteTargetId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || "মতামত ডিলিট করা যায়নি।");
      } else {
        setSubmissions((prev) => prev.filter((s) => s.id !== deleteTargetId));
        setDeleteTargetId(null);
        if (selectedSubmission?.id === deleteTargetId) {
          setSelectedSubmission(null);
        }
        fetchData();
      }
    } catch {
      alert("ডিলিট করার সময় সমস্যা হয়েছে।");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered and Sorted Table Rows
  const filteredSubmissions = useMemo(() => {
    return submissions
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          item.fullName.toLowerCase().includes(query) ||
          item.mobileNumber.toLowerCase().includes(query);

        const matchesDate =
          dateFilter === "ALL" || item.preferredDate === dateFilter;

        const matchesFood =
          foodFilter === "ALL" ||
          item.preferredFood === foodFilter ||
          (foodFilter === "পছন্দসই অন্য খাবার" &&
            item.preferredFood === "পছন্দসই অন্য খাবার");

        return matchesQuery && matchesDate && matchesFood;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [submissions, searchQuery, dateFilter, foodFilter, sortOrder]);

  const availableDates = useMemo(() => {
    const set = new Set(submissions.map((s) => s.preferredDate));
    return Array.from(set);
  }, [submissions]);

  const availableFoods = useMemo(() => {
    const set = new Set(submissions.map((s) => s.preferredFood));
    return Array.from(set);
  }, [submissions]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-white p-1 shrink-0">
            <Image
              src="/images/logo.jpg"
              alt="প্রগতি ২১ লোগো"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              প্রগতি ২১ পুনর্মিলনী ড্যাশবোর্ড
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              জরিপের রিয়েল-টাইম তথ্য ও পরিসংখ্যান
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="/api/admin/export"
            download
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg font-medium text-xs text-slate-950 bg-amber-500 hover:bg-amber-600 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV এক্সপোর্ট</span>
          </a>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            title="তথ্য রিফ্রেশ করুন"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin text-amber-500" : ""}`}
            />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            মোট মতামত
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {overview.totalSubmissions}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">সর্বমোট সাড়াদাতা</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            ইউনিক সদস্য
          </span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {overview.totalUniqueParticipants}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">স্বতন্ত্র মোবাইল</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            শীর্ষ তারিখ
          </span>
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={overview.topPreferredDate}>
            {overview.topPreferredDate}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">পছন্দসই দিন</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            শীর্ষ খাবার
          </span>
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={overview.topPreferredFood}>
            {overview.topPreferredFood}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">জনপ্রিয় মেনু</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            শীর্ষ উপহার
          </span>
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={overview.topPreferredGift}>
            {overview.topPreferredGift}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">পছন্দের স্মারক</span>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
            শীর্ষ আয়োজন
          </span>
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate" title={overview.topPreferredActivity}>
            {overview.topPreferredActivity}
          </p>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">জনপ্রিয় অনুষ্ঠান</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>অ্যানালিটিক্স ও চার্টস</span>
        </button>

        <button
          onClick={() => setActiveTab("table")}
          className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "table"
              ? "border-amber-500 text-amber-600 dark:text-amber-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <TableIcon className="w-3.5 h-3.5" />
          <span>মতামতের তালিকা ({filteredSubmissions.length})</span>
        </button>
      </div>

      {/* TAB 1: CHARTS */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Chart 1: Date */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              পুনর্মিলনীর তারিখ পছন্দ
            </h3>
            <div className="h-60 mt-3 w-full">
              {charts.datePreferences?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.datePreferences} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: 8, color: "#fff", fontSize: 12 }}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                  কোনো তথ্য নেই
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Food */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              খাবার মেনু বণ্টন
            </h3>
            <div className="h-60 mt-3 w-full">
              {charts.foodPreferences?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.foodPreferences}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={35}
                    >
                      {charts.foodPreferences.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: 8, color: "#fff", fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                  কোনো তথ্য নেই
                </div>
              )}
            </div>
          </div>

          {/* Chart 3: Meal Schedule */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              খাবারের সময়সূচি পছন্দ
            </h3>
            <div className="h-60 mt-3 w-full">
              {charts.mealSchedulePreferences?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.mealSchedulePreferences}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                    >
                      {charts.mealSchedulePreferences.map((_: any, index: number) => (
                        <Cell key={`cell-meal-${index}`} fill={index === 0 ? "#10B981" : "#38BDF8"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: 8, color: "#fff", fontSize: 12 }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                  কোনো তথ্য নেই
                </div>
              )}
            </div>
          </div>

          {/* Chart 4: Gift */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              উপহার ও স্মারক পছন্দ
            </h3>
            <div className="h-60 mt-3 w-full">
              {charts.giftPreferences?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.giftPreferences} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: 8, color: "#fff", fontSize: 12 }}
                    />
                    <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                  কোনো তথ্য নেই
                </div>
              )}
            </div>
          </div>

          {/* Chart 5: Activities */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              সদস্যদের প্রস্তাবিত শীর্ষ আয়োজনসমূহ
            </h3>
            <div className="h-64 mt-3 w-full">
              {charts.activityPopularity?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={charts.activityPopularity.slice(0, 8)}
                    margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
                  >
                    <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={100} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: 8, color: "#fff", fontSize: 12 }}
                    />
                    <Bar dataKey="count" fill="#38BDF8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                  কোনো তথ্য নেই
                </div>
              )}
            </div>
          </div>

          {/* Chart 6: Avoid */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-3">
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
              বর্জনীয় বিষয়ের পরিসংখ্যান
            </h3>
            <div className="h-60 mt-3 w-full">
              {charts.activitiesToAvoid?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={charts.activitiesToAvoid.slice(0, 8)}
                    margin={{ top: 5, right: 20, left: 120, bottom: 5 }}
                  >
                    <XAxis type="number" stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={120} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: 8, color: "#fff", fontSize: 12 }}
                    />
                    <Bar dataKey="count" fill="#F43F5E" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                  কোনো তথ্য নেই
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TABLE */}
      {activeTab === "table" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute inset-y-0 my-auto left-3 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="নাম অথবা মোবাইল দিয়ে সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">সকল তারিখ</option>
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={foodFilter}
                onChange={(e) => setFoodFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="ALL">সকল খাবার</option>
                {availableFoods.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs hover:text-slate-900 dark:hover:text-white"
              >
                <span>তারিখ</span>
                {sortOrder === "desc" ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-3.5">অংশগ্রহণকারী</th>
                    <th className="py-3 px-3.5">মোবাইল</th>
                    <th className="py-3 px-3.5">তারিখ</th>
                    <th className="py-3 px-3.5">খাবার</th>
                    <th className="py-3 px-3.5">সময়সূচি</th>
                    <th className="py-3 px-3.5">উপহার</th>
                    <th className="py-3 px-3.5">জমার সময়</th>
                    <th className="py-3 px-3.5 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                          {row.fullName}
                        </td>
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 font-mono whitespace-nowrap">
                          {row.mobileNumber}
                        </td>
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {row.preferredDate}
                        </td>
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {row.preferredFood}
                        </td>
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {row.mealSchedule}
                        </td>
                        <td className="py-3 px-3.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {row.preferredGift}
                        </td>
                        <td className="py-3 px-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="py-3 px-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedSubmission(row)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                              title="বিস্তারিত"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(row.id)}
                              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="ডিলিট"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                        কোনো মতামত পাওয়া যায়নি।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                মতামতের বিস্তারিত তথ্য
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-500">পূর্ণ নাম:</span>
                  <p className="font-semibold text-slate-900 dark:text-white mt-0.5">{selectedSubmission.fullName}</p>
                </div>
                <div>
                  <span className="text-slate-500">মোবাইল:</span>
                  <p className="font-mono text-slate-900 dark:text-white mt-0.5">{selectedSubmission.mobileNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500">তারিখ:</span>
                  <p className="text-slate-800 dark:text-white mt-0.5">{selectedSubmission.preferredDate}</p>
                </div>
                <div>
                  <span className="text-slate-500">খাবার:</span>
                  <p className="text-slate-800 dark:text-white mt-0.5">{selectedSubmission.preferredFood}</p>
                </div>
                <div>
                  <span className="text-slate-500">সময়সূচি:</span>
                  <p className="text-slate-800 dark:text-white mt-0.5">{selectedSubmission.mealSchedule}</p>
                </div>
                <div>
                  <span className="text-slate-500">উপহার:</span>
                  <p className="text-slate-800 dark:text-white mt-0.5">{selectedSubmission.preferredGift}</p>
                </div>
              </div>

              {/* Step 6: 3 Activities */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-1.5">
                  পছন্দের আয়োজনসমূহ (ধাপ ৬):
                </span>
                <div className="space-y-1">
                  {Array.isArray(selectedSubmission.preferredActivities) &&
                  selectedSubmission.preferredActivities.length > 0 ? (
                    selectedSubmission.preferredActivities.map((act: string, idx: number) => (
                      <div key={idx} className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="text-slate-400 dark:text-slate-500">•</span>
                        <span>{act}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">কোনো আয়োজন নেই</span>
                  )}
                </div>
              </div>

              {/* Step 7: 3 Avoid */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-1.5">
                  বর্জনীয় বিষয়সমূহ (ধাপ ৭):
                </span>
                <div className="space-y-1">
                  {Array.isArray(selectedSubmission.activitiesToAvoid) &&
                  selectedSubmission.activitiesToAvoid.length > 0 ? (
                    selectedSubmission.activitiesToAvoid.map((act: string, idx: number) => (
                      <div key={idx} className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <span className="text-slate-400 dark:text-slate-500">•</span>
                        <span>{act}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">কোনো বর্জনীয় বিষয় নেই</span>
                  )}
                </div>
              </div>

              {/* Step 8: Suggestions */}
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  অতিরিক্ত পরামর্শ:
                </span>
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                  {selectedSubmission.additionalSuggestions || "কোনো পরামর্শ নেই।"}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-medium text-xs transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-500" />
              মতামত মুছে ফেলুন
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              আপনি কি নিশ্চিতভাবে এই মতামতটি মুছে ফেলতে চান?
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-colors"
              >
                {isDeleting ? "মুছে ফেলা হচ্ছে..." : "মুছে ফেলুন"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
