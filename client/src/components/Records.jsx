import React from 'react'
import { Link } from 'react-router-dom';

const Records = () => {
    const data = [
        { id: '123', name: 'John Doe' },
        { id: '456', name: 'Jane Smith' },
        { id: '789', name: 'Alice Johnson' }
      ];
    
      return (
        <div className="flex flex-col gap-4  ">
          <h1 className="m-auto mt-20 text-5xl font-extrabold ">PATIENT RECORD HISTORY</h1>
          <div className="grid grid-cols-4 mt-16">
            {/* ID column */}
            <div className=" p-2">
              <h2 className="font-semibold bg-gray-200">ID</h2>
              {/* Render IDs */}
              {data.map(({ id }) => (
                <div key={id}>{id}</div>
              ))}
            </div>
            {/* Name column */}
            <div className=" p-2 ">
              <h2 className="font-semibold bg-gray-200">Name</h2>
           
              {data.map(({ id, name }) => (
                <div key={id}>{name}</div>
              ))}
            </div>
            <div className=" p-2">
              <h2 className="font-semibold bg-gray-200">Visit</h2>
           
              {data.map(({ id, name }) => (
                <div key={id}>{name}</div>
              ))}
            </div>
            <div className=" p-2">
              <h2 className="font-semibold bg-gray-200">Date</h2>
           
              {data.map(({ id, name }) => (
                <div key={id}>{name}</div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-36 ">
        <Link to="/report">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring focus:ring-blue-400">Go to Next</button>
        </Link>
      </div>
        </div>
  )
}

export default Records