// src/components/AmbulanceInfo.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export const AmbulanceInfo = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/api/ambulance/current-driver")
      .then((res) => setDrivers(res.data.drivers))
      .catch(() => setError("Failed to load ambulance info."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading ambulance info…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!drivers.length) return <p>No ambulance drivers assigned this month.</p>;

  return (
    <div>
      <h4 className="font-semibold mb-2">
        Ambulance Drivers for{" "}
        {new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </h4>
      <ul className="list-disc list-inside">
        {drivers.map((d) => (
          <li key={d._id}>
            <strong>{d.name}</strong> – {d.mobile}
          </li>
        ))}
      </ul>
    </div>
  );
};
