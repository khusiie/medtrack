import React from 'react';
import backgroundImage from '../assests/backgroundImage.png';
import { Link } from 'react-router-dom';



const Home = () => {
  return (
    <div className="relative bg-cover bg-center h-screen" style={{backgroundImage: `url(${backgroundImage})`}}>
      <div className="absolute inset-0 bg-gray-900 opacity-75"></div> 
      <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-white hover:text-blue-500 mb-8">MED TRACK PRO</h1>
          <p className="text-lg text-white mb-12">AI HEALTH ASSISTANT</p>
          <p className="text-lg text-white mb-12">USE AI  For  More Detailed  and ACCURATE MEDICAL ASSISSTANCE</p>
          <div className="flex flex-col items-center space-y-4">
           <Link to="/signup">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring focus:ring-blue-400">
                  New Patient
                </button>
                </Link> 
            <Link to="/signup">   
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring focus:ring-gray-400">
                  Existing Patient?
              </button>
              </Link> 
          </div>
          <div className="flex justify-center mt-8 gap-10">
              <p className='px-8 py-2 rounded-lg bg-blue-500 '>How to use?</p>
              <p className='px-8 py-2 rounded-lg bg-blue-500 '>Learn more</p>

          </div>
            
         
      </div>
      
    </div>
  );
}

export default Home;
