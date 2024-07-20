import React, { useState, useEffect } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";

const CarRental = () => {
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [numWheels, setNumWheels] = useState("");
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (numWheels) {
      setLoading(true);
      axios
        .post("https://car-rental-k8ox.onrender.com/vehicle/vehicle-types", {
          num_wheels: numWheels,
        })
        .then((response) => {
          setVehicleTypes(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vehicle types:", error);
          setLoading(false);
        });
    }
  }, [numWheels]);

  useEffect(() => {
    if (selectedType) {
      setLoading(true);
      axios
        .post("https://car-rental-k8ox.onrender.com/vehicle/vehicles-by-type", {
          type: selectedType,
        })
        .then((response) => {
          setVehicles(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching vehicles:", error);
          setLoading(false);
        });
    }
  }, [selectedType]);

  const handleNext = () => {
    if (step === 1) {
      if (!firstName || !lastName) {
        toast.error("Please provide both first and last names.");
        return;
      }
    } else if (step === 2) {
      if (!numWheels) {
        toast.error("Please select the number of wheels.");
        return;
      }
    } else if (step === 3) {
      if (!selectedType) {
        toast.error("Please select a vehicle type.");
        return;
      }
    } else if (step === 4) {
      if (!selectedVehicle) {
        toast.error("Please select a specific vehicle model.");
        return;
      }
    } else if (step === 5) {
      if (!startDate || !endDate) {
        toast.error("Please select both start and end dates.");
        return;
      }

      // Submit the form
      setLoading(true);
      axios
        .post("https://car-rental-k8ox.onrender.com/vehicle/book-vehicle", {
          vehicleId: selectedVehicle,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        })
        .then((response) => {
          toast.success("Vehicle booked successfully");
          setLoading(false);

          // Reset form after 3 seconds
          setTimeout(() => {
            setStep(1);
            setFirstName("");
            setLastName("");
            setNumWheels("");
            setVehicleTypes([]);
            setSelectedType("");
            setVehicles([]);
            setSelectedVehicle("");
            setStartDate("");
            setEndDate("");
          }, 3000);
        })
        .catch((error) => {
          toast.error("Vehicle is already booked for the selected dates");
          setLoading(false);
        });

      return;
    }

    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <RotatingLines
            visible={true}
            height="96"
            width="96"
            color="grey"
            strokeWidth="5"
            animationDuration="0.75"
            ariaLabel="rotating-lines-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        {step === 1 && (
          <div>
            <h2 className="text-2xl mb-4 font-semibold">What is your name?</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border p-2 mr-2 w-full mb-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-2xl mb-4 font-semibold">Number of wheels</h2>
            <div className="mb-4">
              <label className="block mb-2">
                <input
                  type="radio"
                  value="2"
                  checked={numWheels === "2"}
                  onChange={(e) => setNumWheels(e.target.value)}
                  className="mr-2"
                />
                2
              </label>
              <label className="block mb-2">
                <input
                  type="radio"
                  value="4"
                  checked={numWheels === "4"}
                  onChange={(e) => setNumWheels(e.target.value)}
                  className="mr-2"
                />
                4
              </label>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-2xl mb-4 font-semibold">
              Select Type Of Vehicle
            </h2>
            <div className="mb-4">
              {vehicleTypes.map((type) => (
                <label key={type.type} className="block mb-2">
                  <input
                    type="radio"
                    value={type.type}
                    checked={selectedType === type.type}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="mr-2"
                  />
                  {type.type}
                </label>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <h2 className="text-2xl mb-4 font-semibold">Select Your Vehicle</h2>
            <div className="mb-4">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <label key={vehicle.id} className="block mb-2">
                    <input
                      type="radio"
                      value={vehicle.id}
                      checked={selectedVehicle == vehicle.id}
                      onChange={(e) => setSelectedVehicle(e.target.value)}
                      className="mr-2"
                    />
                    {vehicle.name} ({vehicle.model})
                  </label>
                ))
              ) : (
                <p>No vehicles available for the selected type.</p>
              )}
            </div>
          </div>
        )}
        {step === 5 && (
          <div>
            <h2 className="text-2xl mb-4 font-semibold">Select Date</h2>
            <div className="mb-4">
              <label className="block mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 mb-4 w-full"
              />
              <label className="block mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {step < 5 ? "Next" : "Submit"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CarRental;
