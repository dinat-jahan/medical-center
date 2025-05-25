// src/pages/medicalStaffPages/MonthlyDispenseReport.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function MonthlyDispenseReport() {
  // compute default range: first day of this month → today
  const today = new Date();
  const defaultStart = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .substr(0, 10);
  const defaultEnd = today.toISOString().substr(0, 10);

  const [range, setRange] = useState({
    start: defaultStart,
    end: defaultEnd,
  });
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchReport() {
      try {
        const resp = await axios.get("/medical-staff/dispensed-report", {
          params: {
            start: range.start,
            end: range.end,
          },
        });
        setData(resp.data);
      } catch (err) {
        console.error("Error fetching monthly dispense report:", err);
      }
    }
    fetchReport();
  }, [range]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Monthly Dispensed Stock</h2>

      {/* Date selectors */}
      <div className="flex space-x-6 mb-8">
        <div className="flex flex-col">
          <label htmlFor="start-date" className="text-sm font-medium mb-1">
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={range.start}
            onChange={(e) => setRange((r) => ({ ...r, start: e.target.value }))}
            className="border rounded px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="end-date" className="text-sm font-medium mb-1">
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={range.end}
            onChange={(e) => setRange((r) => ({ ...r, end: e.target.value }))}
            className="border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Bar chart */}
      <div className="h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="dispensedQuantity" name="Dispensed" fill="#00aa99" />
            {/* <Bar dataKey="remainingMonthlyStock" name="Remaining" /> */}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data table */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Medicine</th>
            <th className="border p-2 text-left">Dispensed</th>
            <th className="border p-2 text-left">Remaining</th>
          </tr>
        </thead>
        <tbody>
          {data.map((m) => (
            <tr key={m.medicineId} className="even:bg-gray-50">
              <td className="border p-2">{m.name}</td>
              <td className="border p-2">{m.dispensedQuantity}</td>
              <td className="border p-2">{m.remainingMonthlyStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
