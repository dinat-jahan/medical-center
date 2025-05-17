import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import DispenseDetail from "./component/DispenseDetail";

const DispenseMedicine = () => {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [newCount, setNewCount] = useState(0);
  const [dateFilter, setDateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch whenever filter, date, or page changes
  useEffect(() => {
    fetchRecords();
    const socket = io();
    socket.on("new-dispense-request", () => {
      fetchRecords();
      if (filter !== "pending") {
        setNewCount((c) => c + 1);
      }
    });
    return () => socket.disconnect();
  }, [filter, dateFilter, page]);

  // Fetch records from server
  async function fetchRecords() {
    try {
      const params = { page, limit };
      if (filter !== "all") params.status = filter;
      if (dateFilter) params.date = dateFilter;

      const { data, headers } = await axios.get(
        "/medical-staff/dispense-records",
        {
          params,
        }
      );
      setRecords(data);
      const totalCount = parseInt(headers["x-total-count"], 10) || data.length;
      setTotalPages(Math.ceil(totalCount / limit));
      if (selected) {
        const updated = data.find((r) => r._id === selected._id);
        setSelected(updated || null);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function selectTab(tab) {
    setFilter(tab);
    setPage(1);
    setSelected(null);
    if (tab === "pending" || tab === "all") setNewCount(0);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8">
        Dispense Records
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <div className="flex gap-2">
          {["all", "pending", "completed"].map((tab) => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className={`px-3 py-1.5 text-sm rounded-md border transition ${
                filter === tab
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2 self-center">
            Filter by Date:
          </label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
              setSelected(null);
            }}
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="space-y-4 col-span-1">
          {records.map((rec) => (
            <div>
              <div
                key={rec._id}
                onClick={() => setSelected(rec)}
                className={`p-6 bg-white w-full max-w-md rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all border-l-4 ${
                  rec.overallStatus === "completed"
                    ? "border-green-500"
                    : "border-red-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-sm font-mono text-gray-700 bg-gray-100 border border-gray-300 px-2 py-1 rounded">
                    Rx #{rec.prescription.slice(-6)}
                  </span>
                  <div className="text-right text-sm text-gray-600 leading-tight">
                    <p>{new Date(rec.createdAt).toLocaleTimeString()}</p>
                    <p>{new Date(rec.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">
                    <span className="text-gray-700 font-medium">Patient: </span>
                    <span className="text-blue-600 font-semibold">
                      {rec.patient.name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Doctor: {rec.doctor?.name || "—"}
                  </p>
                </div>
              </div>
              {/* INLINE DETAIL FOR MOBILE */}
              {selected?._id === rec._id && (
                <div className="lg:hidden px-6 pb-8">
                  <button
                    onClick={() => setSelected(null)}
                    className="
    inline-flex items-center mb-4
    px-4 py-2
    bg-gradient-to-r from-white-500 to-white-600
    text-white font-medium
    rounded-full shadow-lg
    transform transition hover:scale-105 hover:from-blue-600 hover:to-indigo-700
  "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back to list
                  </button>
                  <DispenseDetail record={selected} onUpdate={fetchRecords} />
                </div>
              )}
            </div>
          ))}{" "}
          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-indigo-600 text-white rounded disabled:bg-gray-300"
            >
              Prev
            </button>
            <span className="text-sm">
              {page}/{totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-indigo-600 text-white rounded disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 hidden lg:block">
          {selected ? (
            <DispenseDetail record={selected} onUpdate={fetchRecords} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              Select a record to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispenseMedicine;
