import React from "react";
import Link from "next/link";
import Image from "next/image";
import planningPokerProLogo from "../../../public/pppLogo.svg";

export default function Page() {
  return (
    <>
      <div className="flex flex-col h-screen justify-center items-center bg-gray-200 p-4">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-full md:w-3/4 lg:w-1/2">
          <div className="flex flex-col items-center mb-4">
            <article>
              <h2 className="text-2xl mb-4">Cookies</h2>
              <p className="text-sm mb-3">
                We use cookies. By visiting and interacting with our web app,
                you&apos;re giving us your consent to employ cookies in alignment
                with the stipulations outlined in these guidelines. Cookies are
                small files that are dispatched by our servers to your browser
                and saved by it. Every time your browser requests a webpage, the
                stored information is sent back to the server. This system
                allows us to recognize and keep track of users&apos; browsers.
              </p>
              <p className="text-sm mb-3">
                Our web application leverages essential cookies, which are
                crucial for the operational functionality of the app.
              </p>
              <p className="text-sm mb-3">
                We deploy a cookie that allows us to identify users who have
                previously interacted with our app. The benefit of this is to
                offer the possibility to recover data from a prior session,
                including information like your chosen display name or the
                previous room code you used. This allows for a more seamless
                experience for returning users who wish to play again without
                creating a new room or display name. This is a strictly
                necessary cookie.
              </p>
              <p className="text-sm mb-3">
                By using our web application, you&apos;re providing consent for these
                essential cookies to be stored on your device. We do not use any
                non-essential cookies.
              </p>
            </article>
            <a className="cgi-gradient rounded p-1 text-white" href="/">
              Back to home
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
