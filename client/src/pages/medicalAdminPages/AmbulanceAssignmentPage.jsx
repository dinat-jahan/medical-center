import React, { useState, useEffect } from "react";
import axios from "axios";

const AmbulanceAssignmentPage = () => {
  const now = new Date();
  const year = now.getFullYear();
  const defaultMM = String(now.getMonth() + 1).padStart(2, "0");

  const [month, setMonth] = useState(`${year}-${defaultMM}`);
  const [drivers, setDrivers] = useState([]);
  const [assigned, setAssigned] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // reload list + assignment when month changes
  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("/admin/medical/get-drivers"),
      axios.get("/admin/medical/current-driver", { params: { month } }),
    ])
      .then(([allRes, asgRes]) => {
        setDrivers(allRes.data);
        setAssigned(new Set(asgRes.data.drivers.map((d) => d._id)));
        setMessage("");
      })
      .catch(() => setMessage("Failed to load data."))
      .finally(() => setLoading(false));
  }, [month]);

  const toggle = (id) => {
    setAssigned((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.post("/admin/medical/assign-driver", {
        month,
        driverIds: Array.from(assigned),
      });
      if (res.data.cleared) {
        setMessage(`Cleared assignment for ${month}`);
      } else {
        setMessage(
          `Assigned ${res.data.drivers.length} driver(s) for ${month}`
        );
      }
    } catch {
      setMessage("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Assign Ambulance Drivers</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Month</label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded"
        >
          {Array.from({ length: 12 }).map((_, i) => {
            const mm = String(i + 1).padStart(2, "0");
            const name = new Date(year, i).toLocaleString("default", {
              month: "long",
            });
            return (
              <option
                key={mm}
                value={`${year}-${mm}`}
              >{`${name} ${year}`}</option>
            );
          })}
        </select>
      </div>

      {message && (
        <div className="mb-4 text-green-600 font-medium">{message}</div>
      )}

      <form onSubmit={handleSubmit}>
        <ul className="space-y-2 mb-6">
          {drivers.map((d) => (
            <li key={d._id} className="flex items-center">
              <input
                type="checkbox"
                checked={assigned.has(d._id)}
                onChange={() => toggle(d._id)}
                className="mr-2"
              />
              <label className="flex-1">
                <span className="font-medium">{d.name}</span>
                <span className="ml-2 text-sm text-gray-600">
                  ({d.designation}) – {d.mobile}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-teal-600 text-white rounded disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Assignment"}
        </button>
      </form>
    </div>
  );
};

export default AmbulanceAssignmentPage;
