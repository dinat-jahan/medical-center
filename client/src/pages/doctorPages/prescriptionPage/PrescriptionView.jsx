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

  const handleDownloadPDF = async () => {
    try {
      const element = printRef.current;
      if (!element) {
        alert("Printable content not found!");
        console.error("Printable content not found!");
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      const height = imgHeight > pdfHeight ? pdfHeight : imgHeight;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, height);

      const fileName = `prescription_${prescription.prescriptionNumber}.pdf`;
      pdf.save(fileName);

      alert(`✅ Download started successfully: ${fileName}`);
      console.log(`✅ PDF generated and download started: ${fileName}`);
    } catch (error) {
      alert("❌ Error generating PDF. Check console.");
      console.error("Error generating PDF:", error);
    }
  };

  if (!prescription) return <div>Loading prescription…</div>;

  const internalMeds = prescription.medicines.filter((m) => m.dispensedFrom === "internal");
  const externalMeds = prescription.medicines.filter((m) => m.dispensedFrom === "external");
  const logoUrl = "/university-logo.png";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg relative min-h-[700px]">
      {/* Download button */}
      <div className="flex justify-end gap-4 mb-4 print:hidden">
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white px-4 py-2 rounded-3xl shadow hover:bg-green-700"
        >
          📥 Download
        </button>
      </div>

      {/* Prescription content to print */}
      <div
        ref={printRef}
        id="prescription-print"
        className="bg-white p-6 print:block print:bg-white print:text-black print:shadow-none print:rounded-none"
      >
        {/* Header */}
        <div className="grid grid-cols-3 items-center mb-6">
          <div>
            <span className="text-gray-500 text-sm">
              {new Date(prescription.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-center">
            <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
          </div>
          <div className="flex justify-end">
            <span className="text-gray-500 text-sm">Rx # {prescription.prescriptionNumber}</span>
          </div>
        </div>

        {/* Patient & Doctor Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="font-semibold text-lg mb-2">Patient</h4>
            <p className="text-sm">
              <strong>Name:</strong> {prescription.patient.name}
            </p>
            <p className="text-sm">
              <strong>ID:</strong> {prescription.patient.uniqueId}
            </p>
            <p className="text-sm">
              <strong>Sex:</strong> {prescription.patient.sex}
            </p>
            <p className="text-sm">
              <strong>Age:</strong> {prescription.age}
            </p>
          </div>
          <div className="text-right">
            <h4 className="font-semibold text-lg mb-2">Doctor</h4>
            <p className="text-sm font-medium">{prescription.doctor.name}</p>
            <p className="text-sm">ID: {prescription.doctor.uniqueId}</p>
          </div>
        </div>

        {/* Diagnoses */}
        {prescription.diagnoses.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-lg">Diagnoses</h4>
            <p className="text-sm">
              {prescription.diagnoses.map((d) => d.displayName ?? d.name).join(", ")}
            </p>
          </div>
        )}

        {/* Internal Medicines */}
        {internalMeds.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Internal Medicines</h4>
            {internalMeds.map((m, i) => (
              <div key={i} className="border p-3 rounded mb-3">
                <p>
                  <strong>{m.medicineName}</strong> ({m.dose})
                </p>
                <p>
                  {m.frequency} - {m.duration} days
                </p>
                {m.comments && <p className="italic text-sm mt-1">{m.comments}</p>}
              </div>
            ))}
          </div>
        )}

        {/* External Medicines */}
        {externalMeds.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">External Medicines</h4>
            {externalMeds.map((m, i) => (
              <div key={i} className="border p-3 rounded mb-3">
                <p>
                  <strong>{m.medicineName}</strong> ({m.dose})
                </p>
                <p>
                  {m.frequency} - {m.duration} days
                </p>
                {m.comments && <p className="italic text-sm mt-1">{m.comments}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Tests */}
        {prescription.tests.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Tests</h4>
            <ul className="list-disc list-inside text-sm">
              {prescription.tests.map((test, i) => (
                <li key={i}>{test.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Advice */}
        {prescription.advice && (
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Advice</h4>
            <p className="text-sm">{prescription.advice}</p>
          </div>
        )}

        {/* Follow-up Date */}
        {prescription.followUpDate && (
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-2">Follow-Up</h4>
            <p className="text-sm">{new Date(prescription.followUpDate).toLocaleDateString()}</p>
          </div>
        )}

        {/* Signature */}
        <div className="text-right mt-8">
          <h4 className="font-semibold text-lg">Doctor</h4>
          <p className="text-sm">{prescription.doctor.name}</p>
          <p className="text-sm">ID: {prescription.doctor.uniqueId}</p>
          <div className="border-t mt-4 pt-1 text-gray-500 text-sm">Signature</div>
        </div>
      </div>

      {/* Dispense record toggle (hidden on print) */}
      {dispenseRecord && (
        <div className="mt-6 print:hidden">
          <button
            onClick={() => setShowDispense(!showDispense)}
            className="bg-teal-500 hover:bg-teal-600 text-white text-sm px-4 py-2 rounded"
          >
            {showDispense ? "Hide Dispense Record" : "Show Dispense Record"}
          </button>

          {showDispense && (
            <div className="mt-4 p-4 border rounded text-sm bg-gray-50">
              <p>
                <strong>Dispensed By:</strong> {dispenseRecord.dispensedBy}
              </p>
              <p>
                <strong>Date:</strong> {new Date(dispenseRecord.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Notes:</strong> {dispenseRecord.notes || "N/A"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
