import Image from "next/image";
import { cookies } from "next/headers";
// Components imports
import Navbar from "./_components/Navbar";
import CTAs from "./_components/CallToActions";
// Assets imports
import userStoryIllustration from "../../public/userStoryIllustration.png";
import estimateIllustration from "../../public/estimateIllustration.png";
import discussIllustration from "../../public/discussIllustration.png";

export default function Home() {
  const cookieStore = cookies();
  const cookie = cookieStore.getAll(); 
  console.log(cookie);
  console.log('cookie')
  return (
    <>
      <Navbar />
      {/* Landing */}
      <section
        className="px-4 py-16"
        style={{
          backgroundImage: `url("/primaryLandingBg.svg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <main className="max-w-[1300px] mx-auto flex md:flex-col md:gap-y-10 justify-between items-center">
          {/* Landing Text */}
          <div className="w-[550px] sm:w-[90%] flex flex-col gap-y-5">
            <h1 className="text-transparent drop-shadow-2xl text-6xl md:text-5xl sm:text-4xl bg-clip-text bg-gradient-to-l md:text-center from-purple to-[#e41937] text-white">
              Planning Poker
            </h1>
            <p className="md:text-center font-semibold text-lg md:text-base text-white drop-shadow-2xl">
              Also known as Scrum Poker, a straightforward consensus-building
              tool for Agile teams to estimate the complexity of tasks.
            </p>
          </div>

          {/* CTAs - Create/join room or Welcome back UI */}
          <CTAs />
        </main>
      </section>

      {/* How It Works & Pricing */}
      <div
        style={{
          backgroundImage: `url("/secondaryLandingBg.svg")`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {/* How It Works */}
        <section className="px-4 py-16">
          <div id="howItWorks" className="max-w-[1300px] mx-auto">
            <h2 className="text-3xl md:text-2xl sm:text-lg font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-l from-purple to-[#e41937]">
              How It Works
            </h2>
            <div className="flex justify-between md:flex-col md:gap-y-10 ">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center bg-white">
                <Image
                  className="rounded-full w-[120px] mb-5"
                  src={userStoryIllustration}
                  alt="illustration"
                />
                <h3 className="text-2xl mb-3 font-bold">Select a Story</h3>
                <p className="text-gray-700 w-80">
                  The Scrum Master shares a user story remotely. The team gets
                  familiar with the story and reflects on its requirements.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center bg-white">
                <Image
                  className="rounded-full w-[120px] mb-5"
                  src={estimateIllustration}
                  alt="estimate-illustration"
                />

                <h3 className="text-2xl mb-3 font-bold">Estimate</h3>
                <p className="text-gray-700 w-80">
                  Team members independently select a card to estimate the
                  complexity. The card&apos;s number signifies the effort, time,
                  or complexity needed for the task.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center bg-white">
                <Image
                  className="rounded-full w-[120px] mb-5"
                  src={discussIllustration}
                  alt="discuss-illustration"
                />

                <h3 className="text-2xl mb-3 font-bold">Discuss & Review</h3>
                <p className="text-gray-700 w-80">
                  Scrum master reveals all estimates. Any wide disparities
                  prompt a discussion for better understanding. The process
                  repeats until consensus is reached.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-12 px-4">
          <div className="max-w-[1300px] bg-gradient-to-r from-[#ff930f] to-[#fff95b] rounded-3xl mx-auto flex md:flex-col md:gap-y-10 justify-between items-center p-8 sm:p-4">
            <div className="flex flex-col gap-y-4 mr-6 md:mr-0 font-semibold">
              <h2> Get a company branded-version of our app.</h2>
              <div className="bg-orange-200 p-2 shadow-4xl">
                <p>
                  Research by Gallup shows that when companies successfully
                  integrate their brand into their company, they can achieve
                  3.8x the revenue growth compared to competitors who
                  don&apos;t.
                </p>
                {/* https://www.gallup.com/workplace/236927/customer-centricity-heart-business-person-time.aspx */}
              </div>
              <div className="bg-orange-200 p-2 shadow-4xl">
                <p>
                  According to the Harvard Business Review, employees are more
                  likely to form a relationship with a company&apos;s brand when
                  the brand identity is infused throughout the company&apos;s
                  operations and culture.
                </p>
              </div>
              <div className="bg-orange-200 p-2 shadow-4xl">
                <p>
                  A study by McKinsey found that companies with high internal
                  clarity about their brand are 20% more likely to report
                  exceptional organizational health.
                </p>
                {/* https://www.mckinsey.com/capabilities/mckinsey-design/our-insights/the-business-value-of-design */}
              </div>
              {/* <div className="bg-white p-2 rounded-xl shadow-4xl">
                  <p>
                    Research by Deloitte reveals that 84% of executives rate
                    employee experience as important for driving customer
                    satisfaction.
                  </p>
                </div> */}
            </div>

            {/* <Carousel /> */}

            {/* Premium Card */}
            <div className="flex flex-col p-8 bg-gradient-to-b from-[#b330e1] to-[#5c73b9]  text-white rounded-3xl shadow-4xl w-[500px] md:w-[350px] sm:w-[300px] min-w-[300px]">
              <h2 className="text-3xl font-bold mb-2 text-center">Premium</h2>

              {/* Price tag */}
              <div className="flex items-center space-x-2 mb-2 justify-center">
                <span className="font-bold text-5xl ">$3.99 </span>
                <span>/ month</span>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-y-4">
                <li>
                  Customize the look and feel of our Scrum Poker app to match
                  your company&apos;s brand.
                </li>
                <li>
                  We&apos;ll use your company&apos;s colours, fonts and logo to
                  create a professional-grade bespoke version of our app
                  uniquely tailored to your company&apos;s branding.
                </li>
              </div>
              {/* CTA Upgrade Button */}
              <a
                href="https://buy.stripe.com/14k00C0v02rZ3uMfYY"
                target="_blank"
                className="w-full bg-[#eab308]  text-center text-white rounded-lg px-4 py-3 transition-colors duration-200 mt-4"
              >
                Upgrade Now
              </a>
            </div>
          </div>
        </section>
      </div>
      {/* Alerts */}
    </>
  );
}
