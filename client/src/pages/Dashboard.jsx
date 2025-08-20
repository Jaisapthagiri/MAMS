import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuthInfo } from "../services/hooks";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Package, ClipboardList, X } from "lucide-react";

export default function Dashboard() {
  const { baseId } = useAuthInfo();
  const [filters, setFilters] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    end: new Date().toISOString(),
    baseId: baseId || "",
    equipmentTypeId: "",
  });
  const [ref, setRef] = useState({ bases: [], types: [] });
  const [data, setData] = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    const loadRef = async () => {
      const [b, t] = await Promise.all([
        api.get("/api/bases"),
        api.get("/api/equipment-types"),
      ]);
      setRef({ bases: b.data, types: t.data });
    };
    loadRef();
  }, []);

  const load = async () => {
    const { data } = await api.get("/api/dashboard", { params: filters });
    setData(data);
  };

  useEffect(() => {
    load();
  }, [filters.start, filters.end, filters.baseId, filters.equipmentTypeId]);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
      >
        📊 Dashboard
      </motion.h1>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-4 gap-6 bg-white/40 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/30"
      >
        <FilterInput
          label="Start"
          type="datetime-local"
          value={filters.start.slice(0, 16)}
          onChange={(v) =>
            setFilters((f) => ({ ...f, start: new Date(v).toISOString() }))
          }
        />
        <FilterInput
          label="End"
          type="datetime-local"
          value={filters.end.slice(0, 16)}
          onChange={(v) =>
            setFilters((f) => ({ ...f, end: new Date(v).toISOString() }))
          }
        />
        <FilterSelect
          label="Base"
          value={filters.baseId}
          options={ref.bases}
          onChange={(v) => setFilters((f) => ({ ...f, baseId: v }))}
        />
        <FilterSelect
          label="Equipment Type"
          value={filters.equipmentTypeId}
          options={ref.types}
          onChange={(v) => setFilters((f) => ({ ...f, equipmentTypeId: v }))}
        />
      </motion.div>

      {/* Metrics */}
      {data && (
        <div className="grid md:grid-cols-5 gap-6">
          <MetricCard
            title="Opening Balance"
            value={data.metrics.opening}
            icon={<Package />}
          />
          <MetricCard
            title="Net Movement"
            value={data.metrics.netMovement}
            icon={<TrendingUp />}
            onClick={() => setShowBreakdown(true)}
            clickable
          />
          <MetricCard
            title="Closing Balance"
            value={data.metrics.closing}
            icon={<ClipboardList />}
          />
          <MetricCard
            title="Assigned"
            value={data.metrics.assigned}
            icon={<TrendingDown />}
          />
          <MetricCard
            title="Expended"
            value={data.metrics.expended}
            icon={<TrendingDown />}
          />
        </div>
      )}

      {/* Breakdown Modal */}
      <AnimatePresence>
        {showBreakdown && data && (
          <Modal onClose={() => setShowBreakdown(false)}>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                📌 Net Movement Breakdown
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <MetricCard
                  title="Purchases"
                  value={data.breakdown.purchases}
                  icon={<Package />}
                />
                <MetricCard
                  title="Transfer In"
                  value={data.breakdown.transferIn}
                  icon={<TrendingUp />}
                />
                <MetricCard
                  title="Transfer Out"
                  value={data.breakdown.transferOut}
                  icon={<TrendingDown />}
                />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================
   Reusable Components
========================= */

const FilterInput = ({ label, type, value, onChange }) => (
  <div className="grid gap-1">
    <label className="text-sm font-semibold text-gray-800">{label}</label>
    <input
      type={type}
      className="border border-gray-300 rounded-xl p-3 text-sm bg-white/70 backdrop-blur focus:ring-2 focus:ring-indigo-400 outline-none transition"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const FilterSelect = ({ label, value, options, onChange }) => (
  <div className="grid gap-1">
    <label className="text-sm font-semibold text-gray-800">{label}</label>
    <select
      className="border border-gray-300 rounded-xl p-3 text-sm bg-white/70 backdrop-blur focus:ring-2 focus:ring-indigo-400 outline-none transition"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All</option>
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

const MetricCard = ({ title, value, icon, onClick, clickable }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    whileTap={{ scale: 0.98 }}
    className={`rounded-3xl p-6 bg-gradient-to-br from-indigo-50 to-white shadow-lg border border-indigo-100/50 
      ${clickable ? "cursor-pointer hover:shadow-2xl" : ""}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="text-indigo-600">{icon}</div>
    </div>
    <div className="text-4xl font-extrabold mt-3 text-gray-900">{value}</div>
  </motion.div>
);

const Modal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/40 backdrop-blur-sm grid place-items-center p-6 z-50"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-200"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-end">
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition"
          onClick={onClose}
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>
      {children}
    </motion.div>
  </motion.div>
);
