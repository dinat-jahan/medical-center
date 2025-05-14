import React, { useContext, useEffect, useState } from "react";
import PatientInfo from "./components/PatientInfo";
import DoctorInfo from "./components/DoctorInfo";
import DiagnosisSelect from "./components/DiagnosisSelect";
import MedicineEntry from "./components/MedicineEntry";
import MedicineList from "./components/MedicineList";
import { useParams } from "react-router-dom";
import { UserContext } from "../../../UserContext";
import axios from "axios";
import InternalQtyModal from "./components/InternalQtyModal";
const PrescriptionForm = () => {
  const { uniqueId } = useParams();

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

  useEffect(() => {
    const fetchPatientProfile = async () => {
      try {
        const { data } = await axios.get(
          `/doctor/pres/patient-profile/${uniqueId}`
        );
        console.log(data);
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
      console.log(payload);
      await axios.post("/doctor/create-prescription", payload);
      // handle success
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveClick = () => {
    if (items.some((m) => m.dispensedFrom === "internal")) {
      setShowModal(true);
    } else {
      savePrescription();
    }
  };

  const handleModalConfirm = (localItems) => {
    // merge back full items: keep the external medicine entries unchanged, update internal
    const newItems = items.map((m) => {
      if (m.dispensedFrom === "internal") {
        const updated = localItems.find(
          (li) =>
            li.medicineName === m.medicineName &&
            li.requestedQuantity === m.requestedQuantity
        );
        return updated || m;
      }
      return m;
    });
    setItems(newItems);
    setShowModal(false);
    savePrescription();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg shadow">
        <PatientInfo patient={patient} />
        <DoctorInfo doctor={doctor} />
        <DiagnosisSelect diagnoses={diagnoses} setDiagnoses={setDiagnoses} />
        <MedicineEntry
          entry={entry}
          setEntry={setEntry}
          items={items}
          setItems={setItems}
        />
        {/* Advice & Follow-up */}
        <div className="col-span-2">
          <label>Advice (optional)</label>
          <textarea
            className="w-full border p-2 rounded"
            value={advice}
            onChange={(e) => setAdvice(e.target.value)}
            placeholder="General advice..."
          />
        </div>
        <div className="col-span-2">
          <label>Follow-Up Date (optional)</label>
          <input
            type="date"
            className="border p-2 rounded"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
          />
        </div>

        <MedicineList items={items} setItems={setItems} setEntry={setEntry} />

        {/* submit */}
        <div className="col-span-2 text-right">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSaveClick}
          >
            Save Prescription
          </button>
        </div>
        <>
          {showModal && (
            <InternalQtyModal
              items={items.filter((m) => m.dispensedFrom === "internal")}
              onConfirm={handleModalConfirm}
              onCancel={() => setShowModal(false)}
            />
          )}
        </>
      </div>
    </div>
  );
};

export default PrescriptionForm;
