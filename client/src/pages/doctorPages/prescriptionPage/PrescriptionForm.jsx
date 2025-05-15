import React, { useContext, useEffect, useState } from "react";
import DiagnosisSelect from "./components/DiagnosisSelect";
import MedicineEntry from "./components/MedicineEntry";
import MedicineList from "./components/MedicineList";
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

  const savePrescription = async () => {
    if (!patient) return;
    const payload = {
      patient: patient._id,
      doctor: doctor.id,
      date: new Date(),
      diagnoses: diagnoses.map((d) => d._id),
      age: patient.age,
      followUpDate: followUpDate || null,
      advice: advice || "",
      medicines: items.map((m) => ({
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
      console.log(data);
      // navigate(`/prescriptions/${data.prescription._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveClick = () => {
    const internals = items.map((m, idx) => ({ ...m, idx })).filter((m) => m.dispensedFrom === "internal");
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
    savePrescription();
  };

  const today = new Date().toLocaleDateString("en-US");

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 min-h-screen flex flex-col">
      <div className="bg-teal-50 rounded-2xl shadow-lg p-6 space-y-6 border border-gray-200 flex-grow">
        {/* Patient Info (inline in main form) */}
        {patient ? (
          <div className="text-gray-700 space-y-1 text-base leading-relaxed font-semibold">
            <div><span className="font-bold" >Name:</span> {patient.name}</div>
            <div><span className="font-bold">Unique ID:</span> {patient.uniqueId}</div>
            <div><span className="font-bold">Age:</span> {patient.age}</div>
            <div><span className="font-bold" >Sex:</span> {patient.sex}</div>
          </div>
        ) : (
          <div className="text-gray-500">Loading patient info...</div>
        )}

        <DiagnosisSelect diagnoses={diagnoses} setDiagnoses={setDiagnoses} />

        <MedicineEntry entry={entry} setEntry={setEntry} items={items} setItems={setItems} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-gray-800 mb-1 text-lg">Advice (optional)</label>
            <textarea
              className="w-full border  border-gray-300 p-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="General advice..."
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-1">Follow-Up Date (optional)</label>
            <input
              type="date"
              className="w-full border border-gray-300 p-3 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
            />
          </div>
        </div>

        <MedicineList items={items} setItems={setItems} setEntry={setEntry} />

        {/* Doctor Info */}
        <div className="flex justify-end items-center border-t border-gray-300 pt-5 mt-6">
          <div className="text-right text-gray-600 text-sm font-semibold whitespace-nowrap">
            <div>Doctor: {doctor.name} (ID: {doctor.uniqueId})</div>
            <div>Date: {today}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          className="bg-blue-500 hover:bg-teal-700 text-white font-medium w-[350px] border-none px-6 py-2 rounded-3xl text-xl transition duration-200"
          onClick={handleSaveClick}
        >
          Save Prescription
        </button>
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
