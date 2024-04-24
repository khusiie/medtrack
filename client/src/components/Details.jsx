import React from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assests/backgroundImage.png";
import { useForm } from "react-hook-form";
import axios from "axios";

const Details = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:3001/details", data, {
        headers: {
          Authorization: localStorage.getItem("auth-token"),
        },
      });

      if (res.data.success) {
        navigate("/description");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <form
      className="relative bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="absolute inset-0 bg-gray-900 opacity-90">
        <div className="flex justify-center items-center h-full text-white">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-8">
              Patient Personal Details
            </h1>

            <div className="grid grid-cols-2 gap-8">
              {/* First Column */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <label className="mr-6">Name:</label>
                  <input
                    type="text"
                    className="px-4 py-2 text-black rounded-lg border border-gray-300"
                    placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <span className="text-red-500">{errors.name.message}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <label className="mr-6">Age:</label>
                  <input
                    type="number"
                    className="px-4 py-2  text-black  rounded-lg border border-gray-300"
                    placeholder="Age"
                    {...register("age", { required: "Age is required" })}
                  />
                  {errors.dob && (
                    <span className="text-red-500">{errors.dob.message}</span>
                  )}
                </div>
                <div className="flex items-center">
                  <label className="mr-2">Gender:</label>
                  <select
                    className="px-4 py-2  text-black  rounded-lg border border-gray-300"
                    placeholder="Gender"
                    {...register("gender", {
                      required: "Gender is required",
                    })}
                  >
                    <option value="Male" selected>
                      Male
                    </option>
                    <option value="Female">Female</option>
                    <option value="Other">Other/Preferred not to say</option>
                  </select>
                  {errors.gender && (
                    <span className="text-red-500">
                      {errors.gender.message}
                    </span>
                  )}
                </div>
              </div>
              {/* Second Column */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <label className="mr-2">Contact Number :</label>
                  <input
                    type="text"
                    className="px-4 py-2  text-black  rounded-lg border border-gray-300"
                    placeholder="Contact Number"
                    {...register("contactNumber")}
                  />
                </div>
                <div className="flex items-center">
                  <label className="mr-20">Height :</label>
                  <input
                    type="number"
                    className="px-4 py-2  text-black  rounded-lg border border-gray-300"
                    placeholder="Height(cm)"
                    {...register("height", { required: "Height is required" })}
                  />
                  {errors.height && (
                    <span className="text-red-500">
                      {errors.height.message}
                    </span>
                  )}
                </div>
                <div className="flex items-center">
                  <label className="mr-[77px]">Weight :</label>
                  <input
                    type="number"
                    className="px-4 py-2  text-black  rounded-lg border border-gray-300"
                    placeholder="Weight(kg)"
                    {...register("weight", { required: "Weight is required" })}
                  />
                  {errors.weight && (
                    <span className="text-red-500">
                      {errors.weight.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-20">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring focus:ring-blue-400"
              >
                Go to Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Details;
