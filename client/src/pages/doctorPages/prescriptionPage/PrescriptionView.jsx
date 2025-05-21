import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PrescriptionView() {
  const { prescriptionId } = useParams();
  const location = useLocation();
  const [prescription, setPrescription] = useState(null);
  const [dispenseRecord, setDispenseRecord] = useState(location.state?.dispenseRecord || null);
  const [showDispense, setShowDispense] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    async function fetchPrescription() {
      try {
        const { data } = await axios.get(`/doctor/show-prescription/${prescriptionId}`);
        setPrescription(data.prescription);
        setDispenseRecord(data.dispenseRecord);
      } catch (err) {
        console.error(err);
      }
    }
    fetchPrescription();
  }, [prescriptionId]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`prescription_${prescription.prescriptionNumber}.pdf`);
  };

  if (!prescription) return <div>Loading prescription…</div>;

  const internalMeds = prescription.medicines.filter((m) => m.dispensedFrom === "internal");
  const externalMeds = prescription.medicines.filter((m) => m.dispensedFrom === "external");
  const logoUrl = "/university-logo.png";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg relative min-h-[700px]">
      <div className="flex justify-end gap-4 mb-4 print:hidden">
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded-3xl shadow hover:bg-green-700"
        >
          📥 Download
        </button>
        <button
          onClick={handlePrint}
          className="bg-indigo-600 text-white px-4 py-2 rounded-3xl shadow hover:bg-indigo-700"
        >
          🖨️ Print
        </button>
      </div>

      <div ref={printRef} id="prescription-print">
        {/* Everything inside this div will be printed or downloaded as PDF */}

        <div className="grid grid-cols-3 items-center mb-6">
          <div>
            <span className="text-gray-500 text-sm">
              {new Date(prescription.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-center">
            <img src={logoUrl} alt="University Logo" className="h-10 w-auto" />
          </div>
          <div className="flex justify-end">
            <span className="text-gray-500 text-sm">
              Rx # {prescription.prescriptionNumber}
            </span>
          </div>
        </div>

        {/* Patient & Doctor Info */}
        <section className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="font-semibold mb-2 text-lg">Patient</h4>
            <p className="text-sm"><span className="font-medium">Name:</span> {prescription.patient.name}</p>
            <p className="text-sm"><span className="font-medium">ID:</span> {prescription.patient.uniqueId}</p>
            <p className="text-sm"><span className="font-medium">Sex:</span> {prescription.patient.sex}</p>
            <p className="text-sm"><span className="font-medium">Age:</span> {prescription.age}</p>
          </div>
          <div className="text-right">
            <h4 className="font-semibold mb-2 text-lg">Doctor</h4>
            <p className="text-sm font-medium">{prescription.doctor.name}</p>
            <p className="text-sm">ID: {prescription.doctor.uniqueId}</p>
          </div>
        </section>

        {/* Diagnoses */}
        {prescription.diagnoses.length > 0 && (
          <section className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">Diagnoses</h4>
            <p className="text-sm">
              {prescription.diagnoses.map((d) => d.displayName ?? d.name).join(", ")}
            </p>
          </section>
        )}

        {/* Internal Medicines */}
        {internalMeds.length > 0 && (
          <section className="mb-6">
            <h4 className="font-semibold mb-2 text-lg text-gray-800">
              Medicine dispensed from Medical Centre Pharmacy
            </h4>
            {internalMeds.map((m, i) => (
              <div key={i} className="border rounded p-4 mb-3">
                <div className="flex justify-start gap-2 flex-wrap items-center">
                  <span className="font-medium">{m.medicineName}</span>
                  <span className="text-sm text-gray-600">{m.dose}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {m.frequency} ---- {m.duration} days
                </p>
                {m.comments && (
                  <p className="mt-2 text-sm italic text-gray-600">{m.comments}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* External Medicines */}
        {externalMeds.length > 0 && (
          <section className="mb-6">
            <h4 className="font-semibold mb-2 text-gray-800 text-lg ">
              Medicine dispensed from External Pharmacy
            </h4>
            {externalMeds.map((m, i) => (
              <div key={i} className="border rounded p-4 mb-3">
                <div className="flex justify-start gap-2 flex-wrap items-center">
                  <span className="font-medium">{m.medicineName}</span>
                  <span className="text-sm text-gray-600">{m.dose}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {m.frequency} ---- {m.duration} days
                </p>
                {m.comments && (
                  <p className="mt-2 text-sm italic text-gray-600">{m.comments}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Tests */}
        {prescription.tests && prescription.tests.length > 0 && (
          <section className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">Recommended Tests</h4>
            <ul className="list-disc list-inside text-sm">
              {prescription.tests.map((t, i) => (
                <li key={i}>{t.name}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Advice */}
        {prescription.advice && (
          <section className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">Advice</h4>
            <p className="text-sm">{prescription.advice}</p>
          </section>
        )}

        {/* Follow-Up */}
        {prescription.followUpDate && (
          <section className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">Follow-Up Date</h4>
            <p className="text-sm">
              {new Date(prescription.followUpDate).toLocaleDateString()}
            </p>
          </section>
        )}

        {/* Signature */}
        <div className="text-right mt-6">
          <h4 className="font-semibold mb-2 text-lg">Doctor</h4>
          <p className="text-sm font-medium">{prescription.doctor.name}</p>
          <p className="text-sm">ID: {prescription.doctor.uniqueId}</p>
          <div className="mt-6 border-t border-gray-300"></div>
          <p className="text-sm text-gray-500 mt-1">Signature</p>
        </div>

        {/* Dispense Record */}
        {dispenseRecord && showDispense && (
          <section className="mb-6 mt-4">
            <h4 className="font-semibold mb-2 text-lg">Dispense Record</h4>
            <ul className="list-disc list-inside text-sm">
              {dispenseRecord.medicines.map((d, i) => (
                <li key={i}>
                  {d.medicineName || d.medicine?.name}: {d.quantity} ({d.status})
                </li>
              ))}
            </ul>
            <p className="text-sm mt-2">Status: {dispenseRecord.overallStatus}</p>
          </section>
        )}
      </div>

      {dispenseRecord && (
        <div className="flex justify-start mt-4 print:hidden">
          <button
            onClick={() => setShowDispense(!showDispense)}
            className="bg-teal-500 hover:underline text-sm px-4 py-2 rounded-3xl border-none w-[300px]"
          >
            {showDispense ? "Hide" : "Show"} Dispense Record
          </button>
        </div>
      )}
    </div>
  );
}
