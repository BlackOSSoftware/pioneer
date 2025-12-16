"use client";

export default function WealthCreation() {
  return (
    <div className="w-full">

      {/* ------------------ TOP BLUE HEADING AREA ------------------ */}
      <section className="w-full bg-blue-50 py-12">
        <h1 className="text-4xl font-semibold text-center text-gray-800">
          Wealth Creation
        </h1>

        {/* Breadcrumbs */}
        <p className="text-center text-gray-600 mt-2">
          Home <span className="mx-1">/</span> Goal{" "}
          <span className="mx-1">/</span>{" "}
          <span className="text-blue-600 font-medium">Wealth Creation</span>
        </p>
      </section>

      {/* ------------------ MAIN WHITE CARD ------------------ */}
      <section className="w-full py-16 flex justify-center bg-blue-50">
        <div className="bg-white rounded-xl shadow-xl p-10 max-w-5xl w-full">

          <div className="text-gray-700 text-lg leading-relaxed">

            {/* Row 1 */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span>You are</span>
              <input
                type="text"
                className="border-b border-gray-400 outline-none w-32"
                placeholder=""
              />
              <span>years old now you require Rs</span>
              <input
                type="text"
                className="border-b border-gray-400 outline-none w-40"
              />
              <span>at today's value after</span>
              <input
                type="text"
                className="border-b border-gray-400 outline-none w-28"
              />
              <span>years</span>
            </div>

            {/* Row 2 */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span>for becoming wealthy. You assume the inflation to be</span>
              <input
                type="text"
                className="border-b border-gray-400 outline-none w-28"
              />
              <span>% and expect</span>
              <input
                type="text"
                className="border-b border-gray-400 outline-none w-28"
              />
              <span>% return on your investments.</span>
            </div>

            {/* Row 3 */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <span>You can take</span>

              <select className="border-b border-gray-400 outline-none w-40">
                <option>Conservative</option>
                <option>Moderate</option>
                <option>Aggressive</option>
              </select>

              <span>risk with your investments.</span>
            </div>

            {/* BUTTON */}
            <div className="text-center">
              <button className="px-10 py-3 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition">
                Build My Goal
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
