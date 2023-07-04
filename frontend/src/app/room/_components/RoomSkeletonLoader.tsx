
import React from "react";
import CardsSkeletonLoader from "./CardsSkeletonLoader";
import UserNavbar from "./UserNavbar";

function RoomSkeletonLoader() {
  return (
    <div className="h-full min-h-screen bg-slate-50">
      <UserNavbar />
      <section className="bg-[#ece9f6] px-4">
        <div className="max-w-[1300px] mx-auto flex flex-col">
          <div className="flex flex-col py-5 m-auto px-[4%]">
            <main className="flex flex-col gap-y-6">
              <div className="flex items-center justify-end space-x-4 h-12 invisible"></div>
              <CardsSkeletonLoader />
              <div className="flex gap-x-4 mt-10 invisible items-baseline">
                <p className="font-semibold text-lg"></p>
                <div className="flex flex-wrap gap-x-2 gap-y-2 sm:justify-around">
                  <button
                    disabled
                    className="border-2  h-8 text-sm  pl-2 sm:text-base flex items-center justify-center gap-x-3 "
                  >
                    <span className="text-xs">🔗</span>
                    <span></span>
                    <div className="w-12 flex justify-center items-center">
                      <span
                        className={`text-xs text-white px-1 rounded-sm py-0.5`}
                      ></span>
                    </div>
                  </button>
                  <button
                    disabled
                    className="border-2 h-8 text-sm flex items-center justify-center gap-x-3 pl-2 rounded-lg sm:rounded-md "
                  >
                    <span></span>
                    <div className="w-12 flex justify-center items-center">
                      <span className={`text-xs px-1 py-0.5`}></span>
                    </div>
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RoomSkeletonLoader;
