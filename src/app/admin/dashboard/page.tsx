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
  School,
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
  "#0284C7", // Sky blue
  "#10B981", // Emerald
  "#EC4899", // Pink
  "#8B5CF6", // Purple
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
    schedulePreferences: [],
    giftPreferences: [],
    topActivities: [],
    topAvoid: [],
  });

  // Table filters & sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [foodFilter, setFoodFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // Inspection modal
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  // Deletion confirmation
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/submissions", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        setError(data.error || "তথ্য লোড করতে সমস্যা হয়েছে।");
        return;
      }

      setSubmissions(data.submissions || []);
      setOverview(data.overview || {});
      setCharts(data.charts || {});
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError("সার্ভারের সাথে যোগাযোগের সময় নেটওয়ার্ক সমস্যা হয়েছে।");
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
          item.fullName?.toLowerCase().includes(query) ||
          item.mobileNumber?.includes(query);

        const matchesDate =
          dateFilter === "ALL" || item.preferredDate === dateFilter;

        const matchesFood =
          foodFilter === "ALL" || item.preferredFood === foodFilter;

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
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6 bg-slate-50 min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 bg-white p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-white p-1 shrink-0 shadow-sm">
            <Image
              src="/images/logo.jpg"
              alt="প্রগতি ২১ লোগো"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25 flex items-center gap-1">
                <School className="w-3 h-3 text-amber-600" />
                শামসুন্নাহার-ওসমান গনি শিক্ষানিকেতন
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              প্রগতি ২১ পুনর্মিলনী ড্যাশবোর্ড
            </h1>
            <p className="text-xs text-slate-500">
              জরিপের রিয়েল-টাইম তথ্য, পরিসংখ্যান ও অংশগ্রহণকারীদের তালিকা
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href="/api/admin/export"
            download
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-xs text-slate-950 bg-amber-500 hover:bg-amber-600 shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV এক্সপোর্ট</span>
          </a>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm transition-colors disabled:opacity-50"
            title="তথ্য রিফ্রেশ করুন"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin text-amber-500" : ""}`}
            />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold shadow-sm transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            মোট মতামত
          </span>
          <p className="text-2xl font-bold text-slate-900">
            {overview.totalSubmissions}
          </p>
          <span className="text-[10px] text-slate-400">সর্বমোট সাড়াদাতা</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            ইউনিক সদস্য
          </span>
          <p className="text-2xl font-bold text-slate-900">
            {overview.totalUniqueParticipants}
          </p>
          <span className="text-[10px] text-slate-400">স্বতন্ত্র মোবাইল</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            শীর্ষ তারিখ
          </span>
          <p className="text-sm font-bold text-amber-700 truncate" title={overview.topPreferredDate}>
            {overview.topPreferredDate}
          </p>
          <span className="text-[10px] text-slate-400">পছন্দসই দিন</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            শীর্ষ খাবার
          </span>
          <p className="text-sm font-bold text-slate-900 truncate" title={overview.topPreferredFood}>
            {overview.topPreferredFood}
          </p>
          <span className="text-[10px] text-slate-400">জনপ্রিয় মেনু</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            শীর্ষ উপহার
          </span>
          <p className="text-sm font-bold text-slate-900 truncate" title={overview.topPreferredGift}>
            {overview.topPreferredGift}
          </p>
          <span className="text-[10px] text-slate-400">পছন্দের স্মারক</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow transition-shadow">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            শীর্ষ আয়োজন
          </span>
          <p className="text-sm font-bold text-slate-900 truncate" title={overview.topPreferredActivity}>
            {overview.topPreferredActivity}
          </p>
          <span className="text-[10px] text-slate-400">জনপ্রিয় অনুষ্ঠান</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-amber-500 text-amber-800 bg-white rounded-t-xl shadow-sm"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-t-xl"
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-500" />
          <span>অ্যানালিটিক্স ও চার্টস</span>
        </button>

        <button
          onClick={() => setActiveTab("table")}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === "table"
              ? "border-amber-500 text-amber-800 bg-white rounded-t-xl shadow-sm"
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-t-xl"
          }`}
        >
          <TableIcon className="w-4 h-4 text-amber-500" />
          <span>মতামতের তালিকা ({filteredSubmissions.length})</span>
        </button>
      </div>

      {/* TAB 1: CHARTS */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Chart 1: Date */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm">
              পুনর্মিলনীর তারিখ পছন্দ
            </h3>
            <div className="h-60 mt-3 w-full">
              {charts.datePreferences?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.datePreferences} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: 8, color: "#0f172a", fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  কোনো তথ্য নেই
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Food */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm">
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
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: 8, color: "#0f172a", fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "#64748b" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  কোনো তথ্য নেই
                </div>
              )}
            </div>
          </div>

          {/* Chart 3: Meal Schedule */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm">
              খাবারের সময়সূচি
            </h3>
            <div className="h-60 mt-3 w-full">
              {charts.schedulePreferences?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.schedulePreferences} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-10} textAnchor="end" />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: 8, color: "#0f172a", fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    />
                    <Bar dataKey="value" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  কোনো তথ্য নেই
                </div>
              )}
            </div>
          </div>

          {/* Chart 4: Gift */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm">
              স্মারক উপহার পছন্দ
            </h3>
            <div className="h-60 mt-3 w-full">
              {charts.giftPreferences?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.giftPreferences} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: 8, color: "#0f172a", fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  কোনো তথ্য নেই
                </div>
              )}
            </div>
          </div>

          {/* Chart 5: Activities */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm">
              জনপ্রিয় কার্যক্রমসমূহ
            </h3>
            <div className="h-60 mt-3 w-full">
              {charts.topActivities?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.topActivities} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 5 }}>
                    <XAxis type="number" stroke="#64748b" fontSize={10} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={90} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: 8, color: "#0f172a", fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    />
                    <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  কোনো তথ্য নেই
                </div>
              )}
            </div>
          </div>

          {/* Chart 6: Avoid */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 text-sm">
              যা পরিহার করা উচিত
            </h3>
            <div className="h-60 mt-3 w-full">
              {charts.topAvoid?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.topAvoid} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 5 }}>
                    <XAxis type="number" stroke="#64748b" fontSize={10} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={90} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: 8, color: "#0f172a", fontSize: 12, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    />
                    <Bar dataKey="value" fill="#f43f5e" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
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
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="নাম অথবা মোবাইল দিয়ে সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs placeholder-slate-400 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs focus:outline-none focus:border-amber-500 font-medium"
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
                className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs focus:outline-none focus:border-amber-500 font-medium"
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
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-medium hover:bg-slate-50"
              >
                <span>তারিখ</span>
                {sortOrder === "desc" ? (
                  <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5 text-amber-600" />
                )}
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">অংশগ্রহণকারী</th>
                    <th className="py-3.5 px-4">মোবাইল</th>
                    <th className="py-3.5 px-4">তারিখ</th>
                    <th className="py-3.5 px-4">খাবার</th>
                    <th className="py-3.5 px-4">সময়সূচি</th>
                    <th className="py-3.5 px-4">উপহার</th>
                    <th className="py-3.5 px-4">জমার সময়</th>
                    <th className="py-3.5 px-4 text-right">পদক্ষেপ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((row) => (
                      <tr key={row.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {row.fullName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-mono whitespace-nowrap">
                          {row.mobileNumber}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            {row.preferredDate}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                          {row.preferredFood}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                          {row.mealSchedule}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                          {row.preferredGift}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedSubmission(row)}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                              title="বিস্তারিত"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-700" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(row.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                              title="ডিলিট"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400 text-xs">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                মতামতের বিস্তারিত তথ্য
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium">পূর্ণ নাম:</span>
                  <p className="font-bold text-slate-900 mt-0.5 text-sm">{selectedSubmission.fullName}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">মোবাইল:</span>
                  <p className="font-mono text-slate-900 font-semibold mt-0.5 text-sm">{selectedSubmission.mobileNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">তারিখ:</span>
                  <p className="text-slate-800 font-semibold mt-0.5">{selectedSubmission.preferredDate}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">খাবার:</span>
                  <p className="text-slate-800 font-semibold mt-0.5">{selectedSubmission.preferredFood}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">সময়সূচি:</span>
                  <p className="text-slate-800 font-semibold mt-0.5">{selectedSubmission.mealSchedule}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">উপহার:</span>
                  <p className="text-slate-800 font-semibold mt-0.5">{selectedSubmission.preferredGift}</p>
                </div>
              </div>

              {/* Step 6: 3 Activities */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-amber-800 block mb-1.5">
                  পছন্দের আয়োজনসমূহ (ধাপ ৬):
                </span>
                <div className="space-y-1">
                  {Array.isArray(selectedSubmission.preferredActivities) &&
                  selectedSubmission.preferredActivities.length > 0 ? (
                    selectedSubmission.preferredActivities.map((act: string, idx: number) => (
                      <div key={idx} className="text-slate-800 flex items-center gap-1.5 font-medium">
                        <span className="text-amber-500">•</span>
                        <span>{act}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400">কোনো আয়োজন নেই</span>
                  )}
                </div>
              </div>

              {/* Step 7: 3 Avoid */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-rose-700 block mb-1.5">
                  বর্জনীয় বিষয়সমূহ (ধাপ ৭):
                </span>
                <div className="space-y-1">
                  {Array.isArray(selectedSubmission.activitiesToAvoid) &&
                  selectedSubmission.activitiesToAvoid.length > 0 ? (
                    selectedSubmission.activitiesToAvoid.map((act: string, idx: number) => (
                      <div key={idx} className="text-slate-800 flex items-center gap-1.5 font-medium">
                        <span className="text-rose-500">•</span>
                        <span>{act}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-slate-400">কোনো বর্জনীয় বিষয় নেই</span>
                  )}
                </div>
              </div>

              {/* Step 8: Suggestions */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">
                  অতিরিক্ত পরামর্শ:
                </span>
                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                  {selectedSubmission.additionalSuggestions || "কোনো পরামর্শ নেই।"}
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-500" />
              মতামত মুছে ফেলুন
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              আপনি কি নিশ্চিতভাবে এই মতামতটি মুছে ফেলতে চান? একবার মুছে ফেললে এটি আর ফিরিয়ে আনা সম্ভব হবে না।
            </p>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors"
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
