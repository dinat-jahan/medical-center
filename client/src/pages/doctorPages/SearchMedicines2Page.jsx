import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SearchMedicines2Page = () => {
  const { medicineSearch } = useParams();
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicineData = async () => {
      try {
        const { data } = await axios.get("/doctor/search-medicine", {
          params: { medicine: medicineSearch },
        });
        setMedicines(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMedicineData();
  }, [medicineSearch]);

  return (
    <div className="container mt-4 d-flex justify-content-center align-items-center">
      <div className="w-100">
        <h2 className="text-center mb-4 text-primary">Search Results</h2>

        {medicines.length === 0 ? (
          <p className="text-center text-muted">No medicines found.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {medicines.map((medicine) => (
              <div className="col" key={medicine._id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title text-center mb-3">
                      {medicine.name}
                    </h5>
                    <p>
                      <strong>Generic Name:</strong> {medicine.genericName}
                    </p>
                    <p>
                      <strong>Manufacturer:</strong> {medicine.manufacturer}
                    </p>
                    <p>
                      <strong>Type:</strong> {medicine.type}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {medicine.quantity}
                    </p>
                    <p>
                      <strong>Dosage:</strong> {medicine.dosage}
                    </p>
                    <p>
                      <strong>Price:</strong> ${medicine.price}
                    </p>
                    <p>
                      <strong>Expiry Date:</strong>{" "}
                      {new Date(medicine.expiryDate).toISOString().slice(0, 10)}
                    </p>
                    <p>
                      <strong>Batch Number:</strong> {medicine.batchNumber}
                    </p>
                    <p>
                      <strong>Storage Condition:</strong>{" "}
                      {medicine.storageCondition}
                    </p>
                    <p>
                      <strong>Side Effects:</strong>{" "}
                      {medicine.sideEffects?.length
                        ? medicine.sideEffects.join(", ")
                        : "None"}
                    </p>
                    <p>
                      <strong>Usage Instructions:</strong>{" "}
                      {medicine.usageInstructions}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchMedicines2Page;
