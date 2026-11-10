"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  Utensils,
  Gift,
  Sparkles,
  Download,
  Trash2,
  Search,
  Filter,
  Eye,
  LogOut,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
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

// Custom theme palette for charts
const COLORS = [
  "#F59E0B", // Gold amber
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
        setError(data.error || "Failed to load dashboard data.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setSubmissions(data.submissions || []);
      setOverview(data.overview || {});
      setCharts(data.charts || {});
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to connect to the server.");
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
        alert(data.error || "Failed to delete submission.");
      } else {
        setSubmissions((prev) => prev.filter((s) => s.id !== deleteTargetId));
        setDeleteTargetId(null);
        if (selectedSubmission?.id === deleteTargetId) {
          setSelectedSubmission(null);
        }
        // Refresh overview
        fetchData();
      }
    } catch (e) {
      alert("Error deleting record.");
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
          (foodFilter === "Custom Food Preference" &&
            item.preferredFood === "Custom Food Preference");

        return matchesQuery && matchesDate && matchesFood;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [submissions, searchQuery, dateFilter, foodFilter, sortOrder]);

  // Unique date options present in submissions
  const availableDates = useMemo(() => {
    const set = new Set(submissions.map((s) => s.preferredDate));
    return Array.from(set);
  }, [submissions]);

  // Unique food options present in submissions
  const availableFoods = useMemo(() => {
    const set = new Set(submissions.map((s) => s.preferredFood));
    return Array.from(set);
  }, [submissions]);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
              Admin Control Center
            </span>
            <span className="text-xs text-slate-400">• Neon PostgreSQL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Progoti 21 Reunion Analytics
          </h1>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <a
            href="/api/admin/export"
            download
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-navy-950 bg-amber-400 hover:bg-amber-300 shadow-md shadow-amber-500/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </a>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-navy-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin text-amber-400" : ""}`}
            />
          </button>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl glass-panel border border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Total Submissions
            </span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {overview.totalSubmissions}
          </p>
          <span className="text-[11px] text-slate-400">Total responses</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Unique Members
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">
            {overview.totalUniqueParticipants}
          </p>
          <span className="text-[11px] text-slate-400">Unique phones</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Top Date
            </span>
            <Calendar className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-sm font-bold text-white truncate" title={overview.topPreferredDate}>
            {overview.topPreferredDate}
          </p>
          <span className="text-[11px] text-slate-400">Preferred schedule</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Top Food
            </span>
            <Utensils className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-sm font-bold text-white truncate" title={overview.topPreferredFood}>
            {overview.topPreferredFood}
          </p>
          <span className="text-[11px] text-slate-400">Most requested</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Top Gift
            </span>
            <Gift className="w-4 h-4 text-pink-400" />
          </div>
          <p className="text-sm font-bold text-white truncate" title={overview.topPreferredGift}>
            {overview.topPreferredGift}
          </p>
          <span className="text-[11px] text-slate-400">Preferred keepsake</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Top Activity
            </span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-sm font-bold text-white truncate" title={overview.topPreferredActivity}>
            {overview.topPreferredActivity}
          </p>
          <span className="text-[11px] text-slate-400">Most desired</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-amber-400 text-amber-400 bg-amber-400/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Interactive Analytics & Charts</span>
        </button>

        <button
          onClick={() => setActiveTab("table")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "table"
              ? "border-amber-400 text-amber-400 bg-amber-400/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span>Responses Table ({filteredSubmissions.length})</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chart 1: Reunion Date Preferences */}
          <div className="p-5 rounded-2xl glass-panel border border-amber-500/15 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                Reunion Date Preferences
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Participant schedule votes
              </p>
            </div>
            <div className="h-64 mt-4 w-full">
              {charts.datePreferences?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.datePreferences} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b192c", borderColor: "#d4af37", borderRadius: 8, color: "#fff" }}
                    />
                    <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No date votes yet.
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Food Menu Preferences */}
          <div className="p-5 rounded-2xl glass-panel border border-amber-500/15 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-400" />
                Food Menu Breakdown
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Distribution of desired dishes
              </p>
            </div>
            <div className="h-64 mt-4 w-full">
              {charts.foodPreferences?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.foodPreferences}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={40}
                      paddingAngle={3}
                    >
                      {charts.foodPreferences.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b192c", borderColor: "#d4af37", borderRadius: 8, color: "#fff" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No food preferences recorded.
                </div>
              )}
            </div>
          </div>

          {/* Chart 3: Meal Schedule */}
          <div className="p-5 rounded-2xl glass-panel border border-amber-500/15 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                Meal Arrangement Preference
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Lunch Only vs Lunch + Snacks
              </p>
            </div>
            <div className="h-64 mt-4 w-full">
              {charts.mealSchedulePreferences?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.mealSchedulePreferences}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label
                    >
                      {charts.mealSchedulePreferences.map((_: any, index: number) => (
                        <Cell key={`cell-meal-${index}`} fill={index === 0 ? "#10B981" : "#38BDF8"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b192c", borderColor: "#d4af37", borderRadius: 8, color: "#fff" }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "#94a3b8" }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No meal schedule votes yet.
                </div>
              )}
            </div>
          </div>

          {/* Chart 4: Gift Preferences */}
          <div className="p-5 rounded-2xl glass-panel border border-amber-500/15 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-400" />
                Gift Souvenir Votes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gift Box vs Signature T-shirt vs Custom
              </p>
            </div>
            <div className="h-64 mt-4 w-full">
              {charts.giftPreferences?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.giftPreferences} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                    <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b192c", borderColor: "#d4af37", borderRadius: 8, color: "#fff" }}
                    />
                    <Bar dataKey="value" fill="#ec4899" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No gift preferences recorded.
                </div>
              )}
            </div>
          </div>

          {/* Chart 5: Activity Popularity */}
          <div className="p-5 rounded-2xl glass-panel border border-amber-500/15 flex flex-col justify-between lg:col-span-2">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Top 3 Activities Wanted
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Ranked by total participant selections
              </p>
            </div>
            <div className="h-72 mt-4 w-full">
              {charts.activityPopularity?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={charts.activityPopularity.slice(0, 8)}
                    margin={{ top: 5, right: 20, left: 90, bottom: 5 }}
                  >
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={90} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b192c", borderColor: "#d4af37", borderRadius: 8, color: "#fff" }}
                    />
                    <Bar dataKey="count" fill="#38BDF8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No activity selections recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Chart 6: Activities to Avoid */}
          <div className="p-5 rounded-2xl glass-panel border border-amber-500/15 flex flex-col justify-between lg:col-span-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ThumbsDown className="w-4 h-4 text-rose-400" />
                Previous Reunion Pitfalls to AVOID
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                What participants strongly prefer NOT to repeat this year
              </p>
            </div>
            <div className="h-64 mt-4 w-full">
              {charts.activitiesToAvoid?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={charts.activitiesToAvoid.slice(0, 8)}
                    margin={{ top: 5, right: 20, left: 130, bottom: 5 }}
                  >
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0b192c", borderColor: "#f43f5e", borderRadius: 8, color: "#fff" }}
                    />
                    <Bar dataKey="count" fill="#F43F5E" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No avoid responses recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESPONSES TABLE */}
      {activeTab === "table" && (
        <div className="space-y-4">
          {/* Search and Filters Bar */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute inset-y-0 my-auto left-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by participant name or mobile number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Dates</option>
                {availableDates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              {/* Food Filter */}
              <select
                value={foodFilter}
                onChange={(e) => setFoodFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">All Food Options</option>
                {availableFoods.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>

              {/* Sort Order */}
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
                }
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-slate-300 text-xs hover:text-white"
                title="Toggle Date Sort Order"
              >
                <span>Sort Date</span>
                {sortOrder === "desc" ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronUp className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl glass-panel border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-navy-900/90 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Participant</th>
                    <th className="py-3.5 px-4">Mobile</th>
                    <th className="py-3.5 px-4">Date Choice</th>
                    <th className="py-3.5 px-4">Food Choice</th>
                    <th className="py-3.5 px-4">Meal Schedule</th>
                    <th className="py-3.5 px-4">Gift Choice</th>
                    <th className="py-3.5 px-4">Submitted At</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-amber-400/5 transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                          {row.fullName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 font-mono whitespace-nowrap">
                          {row.mobileNumber}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                          {row.preferredDate === "Custom Date" && row.customDate
                            ? `Custom (${row.customDate})`
                            : row.preferredDate}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                          {row.preferredFood === "Custom Food Preference" &&
                          row.customFood
                            ? `Custom: ${row.customFood}`
                            : row.preferredFood}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                          {row.mealSchedule}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                          {row.preferredGift === "Custom Gift Preference" &&
                          row.customGift
                            ? `Custom: ${row.customGift}`
                            : row.preferredGift}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                          {formatDate(row.createdAt)}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedSubmission(row)}
                              className="p-1.5 rounded-lg bg-navy-900 border border-slate-700 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTargetId(row.id)}
                              className="p-1.5 rounded-lg bg-navy-900 border border-slate-700 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition-colors"
                              title="Delete Submission"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-slate-400 text-xs"
                      >
                        No survey submissions found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW SUBMISSION DETAILS MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl glass-panel-glow border border-amber-500/30 p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Submission Details
                </h3>
                <p className="text-xs text-slate-400">
                  ID: {selectedSubmission.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1.5 rounded-lg bg-navy-900 border border-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-navy-900/60 border border-slate-800">
                <div>
                  <span className="text-slate-400">Full Name</span>
                  <p className="font-semibold text-white text-sm mt-0.5">
                    {selectedSubmission.fullName}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Mobile Number</span>
                  <p className="font-mono text-white text-sm mt-0.5">
                    {selectedSubmission.mobileNumber}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Preferred Reunion Date</span>
                  <p className="text-white mt-0.5 font-medium">
                    {selectedSubmission.preferredDate}
                    {selectedSubmission.customDate && (
                      <span className="text-amber-400 ml-1">
                        ({selectedSubmission.customDate})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Food Menu Choice</span>
                  <p className="text-white mt-0.5 font-medium">
                    {selectedSubmission.preferredFood}
                    {selectedSubmission.customFood && (
                      <span className="text-amber-400 ml-1 block">
                        Detail: {selectedSubmission.customFood}
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Meal Schedule</span>
                  <p className="text-white mt-0.5 font-medium">
                    {selectedSubmission.mealSchedule}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400">Gift Souvenir</span>
                  <p className="text-white mt-0.5 font-medium">
                    {selectedSubmission.preferredGift}
                    {selectedSubmission.customGift && (
                      <span className="text-amber-400 ml-1 block">
                        Detail: {selectedSubmission.customGift}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Preferred Activities */}
              <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
                <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                  Preferred Activities (Up to 3)
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.isArray(selectedSubmission.preferredActivities) &&
                  selectedSubmission.preferredActivities.length > 0 ? (
                    selectedSubmission.preferredActivities.map((act: string) => (
                      <span
                        key={act}
                        className="px-2.5 py-1 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs"
                      >
                        {act}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None selected</span>
                  )}
                </div>
              </div>

              {/* Activities to Avoid */}
              <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
                <span className="text-rose-400 font-bold uppercase tracking-wider text-[10px]">
                  Previous Experiences to AVOID
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.isArray(selectedSubmission.activitiesToAvoid) &&
                  selectedSubmission.activitiesToAvoid.length > 0 ? (
                    selectedSubmission.activitiesToAvoid.map((act: string) => (
                      <span
                        key={act}
                        className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 text-xs"
                      >
                        {act}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">None specified</span>
                  )}
                </div>
              </div>

              {/* Additional Suggestions */}
              <div className="p-4 rounded-xl bg-navy-900/60 border border-slate-800">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Additional Suggestions
                </span>
                <p className="mt-1 text-slate-200 text-xs whitespace-pre-wrap leading-relaxed">
                  {selectedSubmission.additionalSuggestions ||
                    "No additional suggestions provided."}
                </p>
              </div>

              <div className="pt-2 text-slate-400 text-[11px] text-right">
                Submitted on: {formatDate(selectedSubmission.createdAt)}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-semibold text-xs hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl glass-panel-glow border border-rose-500/30 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-400" />
              Confirm Deletion
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Are you sure you want to delete this response permanently? This action
              cannot be undone in the Neon PostgreSQL database.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
