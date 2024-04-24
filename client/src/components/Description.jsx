import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Description = () => {
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const symptoms = e.target.symptoms.value;
    const ecgFiles = e.target.ecg_files.files;

    if (ecgFiles.length < 2) {
      alert("Please upload both ECG files");
      return;
    } else if (ecgFiles.length > 2) {
      alert("Only 2 files are allowed");
      return;
    }

    try {
      formData.append("ecg_lr", ecgFiles[0]);
      formData.append("ecg_hr", ecgFiles[1]);

      const ecg_res = await axios.post(
        "http://localhost:8000/upload_records/ecg",
        formData
      );

      const ecg_prediction = ecg_res.data.prediction;

      const res = await axios.post(
        "http://localhost:3001/start_diagnostic",
        {
          symptoms,
          ecg_prediction,
        },
        {
          headers: {
            Authorization: localStorage.getItem("auth-token"),
          },
        }
      );

      if (res.data.success) {
        navigate("/aiconsole");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <form className="flex flex-col gap-4 bg-gray-200" onSubmit={onSubmit}>
      <h1 className="m-auto mt-20 text-5xl font-extrabold">
        ADD SYMPTOMS DESCRIPTION
      </h1>

      <div className="m-auto mt-20 w-96 flex flex-col items-center justify-between px-4 py-2 bg-indigo-900 rounded-lg">
        <span class="text-white">Write your symptoms here.</span>
        <textarea
          name="symptoms"
          rows="7"
          placeholder="Symptoms here"
          className="text-sm resize-none p-1 mt-1 w-full block rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>

      {/* Upload health record */}
      <div className="mt-10 mb-52 gap-8 m-auto w-96 flex flex-col items-center justify-between px-4 py-2 bg-gray-300 rounded-lg">
        <h1 className="font-bold">Add any previous health record (if any)</h1>
        <div className="flex items-center justify-between">
          {/* <button className="flex items-center justify-center bg-indigo-900 text-white px-16 py-1 rounded-lg border border-gray-300 w-full">
            <span>Upload health record(ECG Files)</span>
          </button> */}
          <input type="file" name="ecg_files" multiple className="ml-20" />
        </div>
        <h1 className="text-[10px]">Max file size 50MB</h1>
        <div className="flex justify-center ">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring focus:ring-blue-400"
          >
            Go to Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default Description;
