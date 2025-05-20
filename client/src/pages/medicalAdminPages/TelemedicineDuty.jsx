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

const ManageTelemedicineRoster = () => {
  const [doctors, setDoctors] = useState([]);
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/admin/medical/telemedicine-duty");
        const { duties, doctors } = res.data;

        setDoctors(doctors);

        const initial = {};
        duties.forEach((item) => {
          const key = item.day;
          initial[key] = initial[key] || [];
          initial[key].push(item);
        });
        setAssignments(initial);
      } catch (err) {
        console.error("Error fetching telemedicine duties:", err);
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
      const day = destination.droppableId;
      try {
        const res = await axios.post("/admin/medical/telemedicine-duty/add", {
          doctor: draggableId,
          day,
        });
        const newRecord = res.data;
        setAssignments((prev) => {
          const existing = prev[day] || [];
          return { ...prev, [day]: [...existing, newRecord] };
        });
      } catch (err) {
        console.error("Failed to add telemedicine duty:", err.response?.data);
      }
    }
  };

  const handleRemove = async (assignId, day) => {
    try {
      await axios.post(`/admin/medical/telemedicine-duty/delete/${assignId}`);
      setAssignments((prev) => {
        const updated = { ...prev };
        updated[day] = updated[day].filter((a) => a._id !== assignId);
        return updated;
      });
    } catch (err) {
      console.error("Failed to remove telemedicine duty:", err);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-white">
      <h1 className="text-2xl sm:text-3xl font-poetsen text-teal-700 mb-6 text-center">
        Telemedicine Duty Roster
      </h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Doctor List */}
          <Droppable droppableId="DOCTOR_LIST">
            {(provided) => (
              <div
                className="w-full lg:w-48 p-4 bg-teal-50 rounded-lg shadow-inner mb-6 lg:mb-0 max-h-[70vh] overflow-auto"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h2 className="font-semibold mb-3">Doctors</h2>
                {doctors.map((doc, idx) => (
                  <Draggable key={doc._id} draggableId={doc._id} index={idx}>
                    {(prov) => (
                      <div
                        className="p-3 mb-2 bg-white rounded cursor-move shadow text-sm sm:text-base"
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

          {/* Roster: Days as rows */}
          <div className="flex-1 overflow-auto max-h-[80vh]">
            <div className="w-full border border-gray-200 rounded-lg divide-y divide-gray-200">
              {days.map((day) => {
                const cellItems = assignments[day] || [];
                return (
                  <Droppable droppableId={day} key={day} direction="horizontal">
                    {(prov, snapshot) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.droppableProps}
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between p-4 gap-3 sm:gap-6 border-b border-gray-200 rounded last:mb-0 ${
                          snapshot.isDraggingOver ? "bg-green-50" : "bg-white"
                        }`}
                      >
                        <div className="w-full sm:w-36 font-semibold text-gray-700 text-lg">
                          {day}
                        </div>

                        <div className="flex flex-wrap gap-2 flex-grow min-h-[3.5rem]">
                          {cellItems.length === 0 && (
                            <span className="text-gray-400 italic text-sm">
                              No doctors assigned
                            </span>
                          )}
                          {cellItems.map((rec, idx) => (
                            <div
                              key={rec._id}
                              className="flex items-center bg-teal-100 text-teal-900 rounded px-3 py-1 shadow-sm"
                            >
                              <span className="mr-2 whitespace-nowrap text-sm sm:text-base">
                                {rec.doctor.name}
                              </span>
                              <button
                                onClick={() => handleRemove(rec._id, day)}
                                className="text-teal-700 hover:text-red-600 font-bold bg-gray-400 w-4 text-lg leading-none focus:outline-none"
                                aria-label={`Remove ${rec.doctor.name} from ${day}`}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          {prov.placeholder}
                        </div>
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default ManageTelemedicineRoster;
