import React, { useEffect, useState } from "react";
import { RiHospitalFill } from "react-icons/ri";
import axios from "axios";

async function getFinalDiagnosis() {
  const response = await axios.get("http://localhost:3001/final_diagnosis", {
    headers: {
      Authorization: localStorage.getItem("auth-token"),
    },
  });

  return response.data.response.suggested_reports;
}

async function getSuggestedTests() {
  const response = await axios.get(
    "http://localhost:3001/get_required_reports",
    {
      headers: {
        Authorization: localStorage.getItem("auth-token"),
      },
    }
  );

  return response.data.response.suggested_reports;
}

async function getUserProfile() {
  const response = await axios.get("http://localhost:3001/user_profile", {
    headers: {
      Authorization: localStorage.getItem("auth-token"),
    },
  });

  return response.data.response;
}

const Report = () => {
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});
  const [finalDiagnosis, setFinalDiagnosis] = useState(null);
  const [suggestedTests, setSuggestedTests] = useState([]);
  const [suggestedMedicalReports, setSuggestedMedicalReports] = useState([]);

  useEffect(() => {
    async function fetchDiagnosis() {
      const diagnosis = await getFinalDiagnosis();
      const finalDiagnosis = diagnosis.replace("Final Answer: ", "");
      setFinalDiagnosis(finalDiagnosis);
    }

    async function fetchSuggestedTests() {
      const report = await getSuggestedTests();
      const [tests, reports] = report.split("\n\n");

      const suggestedTests = tests
        .replace("Test Required: ", "")
        .split("\n")
        .map((test) => test.trim().replace("- ", ""));

      suggestedTests.shift();

      const suggestedMedicalReports = reports
        .replace("Medical Reports Required: ", "")
        .split("\n")
        .map((report) => report.trim().replace("- ", ""));

      suggestedMedicalReports.shift();

      setSuggestedTests(suggestedTests);
      setSuggestedMedicalReports(suggestedMedicalReports);
    }

    async function fetchUserProfile() {
      const userProfile = await getUserProfile();
      setUserProfile(userProfile);
    }

    async function fetchAllData() {
      setLoading(true);
      await Promise.all([
        fetchDiagnosis(),
        fetchSuggestedTests(),
        fetchUserProfile(),
      ]);
      setLoading(false);
    }

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div class="flex items-center justify-center h-screen">
        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div class="max-w-screen-lg mx-auto p-8">
      <div class="grid grid-cols-2 gap-8">
        <div>
          <h2 class="text-xl font-semibold">{userProfile.name}</h2>
          <p class="text-gray-500">Patient ID: {userProfile.id}</p>
          <p class="text-gray-500">Age: {userProfile.age}</p>

          <div class="mt-8">
            <h3 class="text-lg font-semibold">Personal Details</h3>
            <ul class="mt-4 space-y-2">
              <li>Gender: {userProfile.gender}</li>
              <li>
                Height:{" "}
                {userProfile.height ? `${userProfile.height}cm` : "Not Entered"}
              </li>
              <li>
                Weight:{" "}
                {userProfile.weight ? `${userProfile.weight}kg` : "Not Entered"}
              </li>
              <li>Contact: {userProfile.contactNumber || "Not Entered"}</li>
              <li>Last Update: {new Date().toLocaleDateString()}</li>
            </ul>
          </div>
        </div>
        <div>
          <div class="grid grid-cols-2 gap-8">
            <div>
              <h3 class="text-lg font-semibold">Symptoms</h3>
            </div>
            <div>
              <h3 class="text-lg font-semibold">Vital Signs</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <div>
          <h3 class="text-lg font-semibold">Suggested Medical Reports</h3>
          <div className="flex">
            <ul className="flex justify-around space-x-60">
              {suggestedMedicalReports.map((report, index) => (
                <li className="flex items-center gap-3" key={index}>
                  <span className="text-[30px]">
                    <RiHospitalFill />
                  </span>
                  {report}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div class="mt-10">
          <h3 class="text-lg font-semibold">Suggested Test Reports</h3>
          <div className="flex ">
            <ul className="flex justify-around space-x-80">
              {suggestedTests.map((test, index) => (
                <li className="flex items-center gap-3" key={index}>
                  <span className="text-[30px]">
                    <RiHospitalFill />
                  </span>
                  {test}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div class="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-8 mt-10">
        <h2 class="text-2xl font-semibold mb-4">Diagnosis</h2>
        <p> According to our ML Agent</p>

        <div class="mt-8 bg-gray-100 rounded-lg p-4">
          <p class="text-sm text-gray-700">{finalDiagnosis}</p>
        </div>
      </div>
    </div>
  );
};

export default Report;
