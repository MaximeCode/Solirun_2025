import React from "react";
import Clock from './Clock';

const ClassementReel = ( { data } ) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg rounded-xl p-8 mx-auto">
      <Clock />
      <h2 className="text-4xl font-extrabold text-center mb-8 font-outline-2">
        Classement des Classes
      </h2>
    </div>
  );
};

export default ClassementReel;