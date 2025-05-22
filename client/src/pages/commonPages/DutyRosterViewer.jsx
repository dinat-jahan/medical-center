import React, { useEffect, useState } from "react";
import axios from "axios";

function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default function DutyRosterViewer() {
  const [departments, setDepartments] = useState([]);
  const [activeDept, setActiveDept] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [roster, setRoster] = useState({});

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const res = await axios.get("/api/departments");
        setDepartments(res.data);
        setActiveDept(res.data[0] || "");
      } catch (err) {
        console.error(err);
      }
    }
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!activeDept) return;

    async function fetchData() {
      try {
        const [staffRes, rosterRes] = await Promise.all([
          axios.get(`/api/staff/${encodeURIComponent(activeDept)}`),
          axios.get(`/api/roster/${encodeURIComponent(activeDept)}`),
        ]);
        setStaffList(staffRes.data);
        setRoster(rosterRes.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [activeDept]);

  const daysOfWeek = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];

  // Remove 'Full Day' shift as requested
  const shifts = ["Morning", "Evening"];

  return (
    <div
      style={{
        display: "flex",
        padding: 20,
        fontFamily: "Arial, sans-serif",
        marginBottom: 40,
      }}
    >
      <div
        style={{
          width: 200,
          marginRight: 30,
          backgroundColor: "#e6f7f7",
          padding: 15,
          borderRadius: 8,
        }}
      >
        <h3>{capitalizeFirstLetter(activeDept)} Staff</h3>
        {staffList.length === 0 && <p>No staff found.</p>}
        {staffList.map((staff) => (
          <div
            key={staff._id}
            style={{
              backgroundColor: "white",
              padding: "8px 12px",
              margin: "8px 0",
              borderRadius: 6,
              boxShadow: "0 0 5px #ddd",
            }}
          >
            {staff.name}
          </div>
        ))}
      </div>

      <div style={{ flexGrow: 1 }}>
        <div style={{ marginBottom: 20 }}>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              style={{
                padding: "8px 20px",
                marginRight: 10,
                cursor: "pointer",
                backgroundColor: dept === activeDept ? "#008080" : "#ccc",
                color: dept === activeDept ? "white" : "#333",
                border: "none",
                borderRadius: 6,
                textTransform: "capitalize", // Also capitalize button text
              }}
            >
              {dept}
            </button>
          ))}
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "center",
            backgroundColor: "#f9ffff",
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 40, // gap below the table before footer
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#b6e0e0", fontWeight: "bold" }}>
              <th>Shift / Day</th>
              {daysOfWeek.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift} style={{ backgroundColor: "white" }}>
                <td
                  style={{
                    fontWeight: "bold",
                    padding: "8px 10px",
                    borderRight: "1px solid #ccc",
                    borderLeft: "1px solid #ccc",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  {shift}
                </td>
                {daysOfWeek.map((day) => (
                  <td
                    key={day}
                    style={{
                      padding: 10,
                      borderRight: "1px solid #ccc",
                      borderBottom: "1px solid #ccc",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {roster[day] && roster[day][shift]
                      ? roster[day][shift].join("\n")
                      : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
