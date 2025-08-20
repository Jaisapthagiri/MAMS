import React, { useEffect, useState } from "react";
import { PlusCircle, ClipboardList } from "lucide-react";
import api from "../services/api";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [ref, setRef] = useState({ bases: [], types: [] });
  const [assignForm, setAssignForm] = useState({
    base: "",
    equipmentType: "",
    quantity: 0,
    assignedTo: "",
    assignedAt: new Date().toISOString(),
  });
  const [expForm, setExpForm] = useState({
    base: "",
    equipmentType: "",
    quantity: 0,
    expendedBy: "",
    expendedAt: new Date().toISOString(),
    note: "",
  });

  useEffect(() => {
    const loadRef = async () => {
      const [b, t] = await Promise.all([
        api.get("/api/bases"),
        api.get("/api/equipment-types"),
      ]);
      setRef({ bases: b.data, types: t.data });
    };
    loadRef();
    refresh();
  }, []);

  const refresh = async () => {
    const [a, e] = await Promise.all([
      api.get("/api/assignments"),
      api.get("/api/expenditures"),
    ]);
    setAssignments(a.data);
    setExpenditures(e.data);
  };

  const submitAssign = async (e) => {
    e.preventDefault();
    await api.post("/api/assignments", assignForm);
    setAssignForm((f) => ({ ...f, quantity: 0, assignedTo: "" }));
    refresh();
  };

  const submitExp = async (e) => {
    e.preventDefault();
    await api.post("/api/expenditures", expForm);
    setExpForm((f) => ({ ...f, quantity: 0, expendedBy: "", note: "" }));
    refresh();
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
        📦 Assignments & Expenditures
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Assign Form */}
        <FormCard
          title="Assign Assets"
          icon={<PlusCircle className="w-5 h-5 text-indigo-600" />}
          onSubmit={submitAssign}
        >
          <FormFields
            form={assignForm}
            setForm={setAssignForm}
            refData={ref}
            mode="assign"
          />
          <Button label="Record Assignment" />
        </FormCard>

        {/* Expenditure Form */}
        <FormCard
          title="Record Expenditure"
          icon={<ClipboardList className="w-5 h-5 text-purple-600" />}
          onSubmit={submitExp}
        >
          <FormFields
            form={expForm}
            setForm={setExpForm}
            refData={ref}
            mode="exp"
          />
          <Button label="Record Expenditure" />
        </FormCard>
      </div>

      {/* Tables */}
      <div className="grid md:grid-cols-2 gap-6">
        <ListCard
          title="Assignments"
          rows={assignments}
          cols={[
            ["assignedAt", (v) => new Date(v).toLocaleString()],
            ["base.name"],
            ["equipmentType.name"],
            ["quantity"],
            ["assignedTo"],
          ]}
        />

        <ListCard
          title="Expenditures"
          rows={expenditures}
          cols={[
            ["expendedAt", (v) => new Date(v).toLocaleString()],
            ["base.name"],
            ["equipmentType.name"],
            ["quantity"],
            ["expendedBy"],
          ]}
        />
      </div>
    </div>
  );
}

/* -------------------- Reusable UI -------------------- */
const FormCard = ({ title, icon, onSubmit, children }) => (
  <form
    onSubmit={onSubmit}
    className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-xl flex flex-col gap-4 hover:shadow-2xl transition"
  >
    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
      {icon} {title}
    </div>
    {children}
  </form>
);

const FormFields = ({ form, setForm, refData, mode }) => (
  <div className="grid md:grid-cols-2 gap-4">
    <select
      className="form-select"
      value={form.base}
      onChange={(e) => setForm((f) => ({ ...f, base: e.target.value }))}
    >
      <option value="">Select Base</option>
      {refData.bases.map((b) => (
        <option key={b._id} value={b._id}>
          {b.name}
        </option>
      ))}
    </select>

    <select
      className="form-select"
      value={form.equipmentType}
      onChange={(e) => setForm((f) => ({ ...f, equipmentType: e.target.value }))}
    >
      <option value="">Select Equipment</option>
      {refData.types.map((t) => (
        <option key={t._id} value={t._id}>
          {t.name}
        </option>
      ))}
    </select>

    <input
      type="number"
      placeholder="Quantity"
      className="form-input"
      value={form.quantity}
      onChange={(e) =>
        setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
      }
    />

    <input
      placeholder={mode === "assign" ? "Assigned To" : "Expended By"}
      className="form-input"
      value={mode === "assign" ? form.assignedTo : form.expendedBy}
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          [mode === "assign" ? "assignedTo" : "expendedBy"]: e.target.value,
        }))
      }
    />

    <input
      type="datetime-local"
      className="form-input"
      value={
        mode === "assign"
          ? form.assignedAt.slice(0, 16)
          : form.expendedAt.slice(0, 16)
      }
      onChange={(e) =>
        setForm((f) => ({
          ...f,
          [mode === "assign" ? "assignedAt" : "expendedAt"]: new Date(
            e.target.value
          ).toISOString(),
        }))
      }
    />

    {mode === "exp" && (
      <input
        placeholder="Note"
        className="form-input md:col-span-2"
        value={form.note}
        onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
      />
    )}
  </div>
);

const Button = ({ label }) => (
  <button className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 font-medium shadow hover:opacity-90 active:scale-[0.98] transition">
    {label}
  </button>
);

/* -------------------- ListCard -------------------- */
const getVal = (obj, path) =>
  path.split(".").reduce((o, k) => o?.[k], obj);

const ListCard = ({ title, rows, cols }) => (
  <div className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
    <h3 className="font-semibold text-lg mb-3">{title}</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600">
            {cols.map((c, i) => (
              <th key={i} className="p-2 text-left font-medium">
                {Array.isArray(c) ? c[0] : c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r._id}
              className={`border-t hover:bg-gray-50 ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50/40"
              }`}
            >
              {cols.map((c, i) => {
                const key = Array.isArray(c) ? c[0] : c;
                const fmt = Array.isArray(c) ? c[1] : null;
                const v = getVal(r, key);
                return (
                  <td key={i} className="p-2 text-gray-700">
                    {fmt ? fmt(v) : v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* -------------------- Tailwind Input Styles -------------------- */
const baseInput =
  "border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-sm";
const formClasses = {
  input: baseInput,
  select: baseInput,
};
Object.assign(window, {
  formInput: formClasses.input,
  formSelect: formClasses.select,
});
