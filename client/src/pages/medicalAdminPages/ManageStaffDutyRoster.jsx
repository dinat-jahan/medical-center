import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
// Removed "Full Day"
const shifts = ["Morning", "Evening"];

const timeMap = {
  Morning: { startTime: "8:00 am", endTime: "2:00 pm" },
  Evening: { startTime: "2:00 pm", endTime: "8:00 pm" },
};

const departments = ["nurse and brother", "attendant", "pathology"];

const ManageStaffDutyRoster = () => {
  const [department, setDepartment] = useState(departments[0]);
  const [staff, setStaff] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [errorStaff, setErrorStaff] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingStaff(true);
      setErrorStaff(null);
      try {
        const staffRes = await axios.get("/admin/medical/medical-users", {
          params: { department },
        });
        setStaff(staffRes.data);
      } catch (err) {
        setErrorStaff("Failed to load staff.");
        setLoadingStaff(false);
        return;
      }

      try {
        const dutyRes = await axios.get("/admin/medical/duty-roster", {
          params: { department },
        });
        const initAssign = {};
        dutyRes.data.forEach((item) => {
          const key = `${item.day}___${item.shift}`;
          if (!initAssign[key]) initAssign[key] = [];
          initAssign[key].push(item);
        });
        setAssignments(initAssign);
      } catch (err) {
        setErrorStaff("Failed to load duty roster.");
      }
      setLoadingStaff(false);
    };

    fetchData();
  }, [department]);

  const onDragEnd = async (result) => {
    console.log("Drag ended:", result);
    const { source, destination, draggableId } = result;
    if (!destination) return;

    if (
      source.droppableId === "STAFF_LIST" &&
      destination.droppableId !== "STAFF_LIST"
    ) {
      const [day, shift] = destination.droppableId.split("___");
      const times = timeMap[shift] || timeMap.Morning;
      try {
        const res = await axios.post("/admin/medical/duty-roster/add", {
          staff: draggableId,
          department,
          day,
          shift,
          ...times,
        });
        const newRecord = res.data;
        console.log(newRecord);
        setAssignments((prev) => {
          const key = destination.droppableId;
          const existing = prev[key] || [];
          return { ...prev, [key]: [...existing, newRecord] };
        });
      } catch (err) {
        console.error("Failed to add duty:", err.response?.data || err.message);
      }
    }
  };

  const handleRemove = async (assignId, cellId) => {
    try {
      await axios.post(`/admin/medical/duty-roster/delete/${assignId}`);
      setAssignments((prev) => {
        const updated = { ...prev };
        updated[cellId] = updated[cellId].filter((a) => a._id !== assignId);
        console.log(updated);
        return updated;
      });
    } catch (err) {
      console.error("Failed to remove duty:", err);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-white">
      <h1 className="text-2xl sm:text-3xl font-poetsen text-teal-700 mb-6 text-center">
        Staff Duty Roster Management
      </h1>

      {/* Department selector */}
      <div className="mb-6 flex justify-center">
        <label htmlFor="department" className="mr-2 font-semibold">
          Select Department:
        </label>
        <select
          id="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1"
        >
          {departments.map((dep) => (
            <option key={dep} value={dep}>
              {dep.charAt(0).toUpperCase() + dep.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Staff List Sidebar */}
          <Droppable droppableId="STAFF_LIST">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="w-full lg:w-48 p-4 bg-teal-50 rounded-lg shadow-inner mb-4 lg:mb-0 overflow-y-auto max-h-[70vh]"
              >
                <h2 className="font-semibold mb-2 capitalize">
                  {department} Staff
                </h2>
                {loadingStaff && (
                  <p className="text-sm text-gray-500">Loading staff...</p>
                )}
                {errorStaff && (
                  <p className="text-sm text-red-500">{errorStaff}</p>
                )}
                {!loadingStaff && staff.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No staff found for this department.
                  </p>
                )}
                {staff.map((stf, idx) => (
                  <Draggable key={stf._id} draggableId={stf._id} index={idx}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        className="p-2 mb-2 bg-white rounded cursor-move shadow"
                      >
                        {stf.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Roster Grid */}
          <div className="flex-1 overflow-x-auto lg:overflow-visible">
            <div className="min-w-max lg:min-w-full grid grid-cols-8 sm:grid-cols-8 border border-gray-200 rounded-lg">
              {/* Corner */}
              <div className="p-2 bg-gray-50"></div>

              {/* Day headers */}
              {days.map((day) => (
                <div
                  key={day}
                  className="p-2 bg-teal-100 text-sm sm:text-base text-center font-semibold text-gray-800 border-l border-gray-200"
                >
                  {day}
                </div>
              ))}

              {/* Shift rows */}
              {shifts.map((shift) => (
                <React.Fragment key={shift}>
                  <div className="p-2 bg-teal-100 text-sm sm:text-base font-semibold border-t border-gray-200">
                    <div>{shift}</div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {timeMap[shift].startTime} - {timeMap[shift].endTime}
                    </div>
                  </div>

                  {days.map((day) => {
                    const cellId = `${day}___${shift}`;
                    const cellItems = assignments[cellId] || [];
                    return (
                      <Droppable droppableId={cellId} key={cellId}>
                        {(prov, snapshot) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.droppableProps}
                            className={
                              "min-h-[4rem] p-2 border-t border-l border-gray-200 rounded " +
                              (snapshot.isDraggingOver
                                ? "bg-green-50"
                                : "bg-white")
                            }
                          >
                            {cellItems.map((rec) => (
                              <div
                                key={rec._id}
                                className="flex justify-between items-center p-1 mb-1 bg-teal-50 rounded"
                              >
                                <span className="text-sm sm:text-base">
                                  {rec.staff.name}
                                </span>
                                <button
                                  onClick={() => handleRemove(rec._id, cellId)}
                                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-[0.6rem] w-4 h-4 flex items-center justify-center rounded-full"
                                  title="Remove duty"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            {prov.placeholder}
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default ManageStaffDutyRoster;
