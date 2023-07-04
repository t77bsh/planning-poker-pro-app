"use client"
import React from "react";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold">Oops!</h1>

      <h2 className="text-3xl font-semibold mt-4 mb-2">
        Looks like our server might be down.
      </h2>
      <p className="text-lg mb-6">
        Reload page below. If the issue persists, please try again later at
        another time.
      </p>
      <button
        onClick={()=>window.history.back()}
        className="cgi-gradient text-white font-bold py-2 px-4 rounded shadow-2xl "
      >
        Reload
      </button>
    </div>
  );
}
