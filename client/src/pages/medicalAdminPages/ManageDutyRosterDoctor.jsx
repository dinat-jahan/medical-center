import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// Define days and shifts
const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];
const shifts = ["Morning", "Evening", "Full Day"];

// Preset times for each shift
const timeMap = {
  Morning: { startTime: "8:00 am", endTime: "2:00 pm" },
  Evening: { startTime: "2:00 pm", endTime: "8:00 pm" },
  "Full Day": { startTime: "9:00 am", endTime: "5:00 pm" },
};

const ManageDutyRosterDragDrop = () => {
  const [doctors, setDoctors] = useState([]);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/medical/duty-roster-doctor");
        const { dutyRosterDoctor, doctors } = response.data;

        setDoctors(doctors);

        const initial = {};
        dutyRosterDoctor.forEach((item) => {
          const key = `${item.day}___${item.shift}`;
          initial[key] = initial[key] || [];
          initial[key].push(item);
        });
        setAssignments(initial);
      } catch (err) {
        console.error("Error fetching duty roster:", err);
      }
    };
    fetchData();
  }, []);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === "DOCTOR_LIST" &&
      destination.droppableId !== "DOCTOR_LIST"
    ) {
      const [day, shift] = destination.droppableId.split("___");
      const times = timeMap[shift] || timeMap.Morning;
      try {
        const res = await axios.post("/admin/medical/duty-roster-doctor/add", {
          doctor: draggableId,
          day,
          shift,
          ...times,
        });
        const newRecord = res.data;
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
      await axios.post(`/admin/medical/duty-roster-doctor/delete/${assignId}`);
      setAssignments((prev) => {
        const updated = { ...prev };
        updated[cellId] = updated[cellId].filter((a) => a._id !== assignId);
        return updated;
      });
    } catch (err) {
      console.error("Failed to remove duty:", err);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-white">
      <h1 className="text-2xl sm:text-3xl font-poetsen text-teal-700 mb-4 sm:mb-6 text-center">
        Doctor Duty Roster
      </h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Doctor List Sidebar */}
          <Droppable droppableId="DOCTOR_LIST">
            {(provided) => (
              <div
                className="w-full lg:w-48 p-4 bg-teal-50 rounded-lg shadow-inner mb-4 lg:mb-0"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="font-semibold mb-2">Doctors</h2>
                {doctors.map((doc, idx) => (
                  <Draggable key={doc._id} draggableId={doc._id} index={idx}>
                    {(prov) => (
                      <div
                        className="p-2 mb-2 bg-white rounded cursor-move shadow"
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                      >
                        {doc.name}
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
              {/* corner */}
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
                              `min-h-[4rem] p-2 border-t border-l border-gray-200 rounded ` +
                              (snapshot.isDraggingOver
                                ? "bg-green-50"
                                : "bg-white")
                            }
                          >
                            {cellItems.map((rec, idx) => (
                              <div
                                key={rec._id}
                                className="flex justify-between items-center p-1 mb-1 bg-teal-50 rounded"
                              >
                                <span className="text-sm sm:text-base">
                                  {rec.doctor.name}
                                </span>
                                <button
                                  onClick={() => handleRemove(rec._id, cellId)}
                                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 text-[0.6rem] w-4 h-4 flex items-center justify-center rounded-full"
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

export default ManageDutyRosterDragDrop;
