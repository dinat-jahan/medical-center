import React, { useContext, useEffect, useState } from "react";
import DiagnosisSelect from "./components/DiagnosisSelect";
import MedicineEntry from "./components/MedicineEntry";
import MedicineList from "./components/MedicineList";
import TestEntry from "./components/TestEntry";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../UserContext";
import axios from "axios";
import InternalQtyModal from "./components/InternalQtyModal";

const PrescriptionForm = () => {
  const { uniqueId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const { user: doctor } = useContext(UserContext);

  const [diagnoses, setDiagnoses] = useState([]);
  const [tests, setTestts] = useState([]);
  const [entry, setEntry] = useState({
    medicine: null,
    medicineName: "",
    dose: "",
    frequency: "",
    frequencyCustom: "",
    durationDays: "",
    durationCustom: "",
    comment: "",
  });
  const [items, setItems] = useState([]);
  const [followUpDate, setFollowUpDate] = useState("");
  const [advice, setAdvice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalItems, setModalItems] = useState([]);

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const { data } = await axios.get(`/doctor/pres/patient-profile/${uniqueId}`);
        setPatient(data.patient);
      } catch (err) {
        console.log(err);
      }
    };
    if (uniqueId) {
      fetchPatientProfile();
    }
  }, [uniqueId]);

  const savePrescription = async (itemsToSend = items) => {
    if (!patient) return;

    const payload = {
      patient: patient._id,
      doctor: doctor.id,
      date: new Date(),
      diagnoses: diagnoses.map((d) => ({
        diagnosis: d._id,
        displayName: d.displayName || d.name,
      })),
      tests: tests.map((t) => ({
        test: t._id,
        name: t.name,
      })),
      age: patient.age,
      followUpDate: followUpDate || null,
      advice: advice || "",
      medicines: itemsToSend.map((m) => ({
        medicine: m.medicine ? m.medicine._id : null,
        medicineName: m.medicineName,
        dose: m.dose || "",
        frequency: m.frequency,
        durationDays: m.durationDays,
        requestedQuantity: m.requestedQuantity,
        internalQuantity: m.internalQuantity,
        dispensedFrom: m.dispensedFrom,
        comments: m.comment || "",
        startDate: m.startDate || new Date(),
      })),
    };

    try {
      const { data } = await axios.post("/doctor/create-prescription", payload);
      const { prescription, dispenseRecord } = data;
      if (prescription && prescription._id) {
        navigate(`/show-prescription/${prescription._id}`, {
          state: { dispenseRecord },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveClick = () => {
    const internals = items
      .map((m, idx) => ({ ...m, idx }))
      .filter((m) => m.dispensedFrom === "internal");
    if (internals.length) {
      setModalItems(internals);
      setShowModal(true);
    } else {
      savePrescription();
    }
  };

  const handleModalConfirm = (updated) => {
    const newItems = items.map((m, i) => {
      const u = updated.find((x) => x.idx === i);
      if (u) {
        return {
          ...m,
          internalQuantity: u.internalQuantity,
          externalQuantity: m.requestedQuantity - u.internalQuantity,
        };
      }
      return m;
    });
    setItems(newItems);
    setShowModal(false);
    savePrescription(newItems);
  };

  const today = new Date().toLocaleDateString("en-US");

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 min-h-screen flex flex-col">
      <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-gray-500 flex-grow">
        {/* Patient Header */}
        {patient ? (
          <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-4">
            <div className="text-gray-700 space-y-1 text-base leading-relaxed font-semibold">
              <div><span className="font-bold">Name:</span> {patient.name}</div>
              <div><span className="font-bold">Unique ID:</span> {patient.uniqueId}</div>
              <div><span className="font-bold">Age:</span> {patient.age}</div>
              <div><span className="font-bold">Sex:</span> {patient.sex}</div>
            </div>
            <div className="text-right text-gray-600 text-sm font-semibold whitespace-nowrap">
              <div>Doctor: {doctor.name} (ID: {doctor.uniqueId})</div>
              <div>Date: {today}</div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Loading patient info...</div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Diagnosis Select */}
            <DiagnosisSelect diagnoses={diagnoses} setDiagnoses={setDiagnoses} />
            
            {/* Medicine Entry */}
            <MedicineEntry
              entry={entry}
              setEntry={setEntry}
              items={items}
              setItems={setItems}
            />

            {/* ✅ Test Entry: now placed AFTER Add Medicine */}
            <TestEntry tests={tests} setTests={setTestts} />

            {/* ✅ Advice + Follow-Up (Side-by-Side) */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-1/2">
                <label className="block font-semibold text-gray-800 mb-1 text-lg">
                  Advice (optional)
                </label>
                <textarea
                  className="w-full h-10 border border-gray-500 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="General advice..."
                />
              </div>
              <div className="w-full lg:w-1/2">
                <label className="block text-lg font-semibold text-gray-800 mb-1">
                  Follow-Up Date (optional)
                </label>
                <input
                  type="date"
                  className="w-15 h-10 border border-gray-500 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-y-10 h-full">
            <MedicineList items={items} setItems={setItems} setEntry={setEntry} />

            <div className="text-right text-gray-600 text-sm font-semibold whitespace-nowrap">
              <div>Doctor: {doctor.name} (ID: {doctor.uniqueId})</div>
              <div>Date: {today}</div>
            </div>

            <button
              className="bg-sky-500 hover:bg-teal-700 text-white font-medium w-[350px] border-none px-2 rounded-3xl text-lg transition duration-200 mx-auto-block"
              onClick={handleSaveClick}
            >
              Save Prescription
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <InternalQtyModal
          items={modalItems}
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default PrescriptionForm;
