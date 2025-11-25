"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function WealthSummaryPage() {
    const search = useSearchParams();
    const router = useRouter();

    const afterYears = Number(search.get("age") || 0);
    const cost = Number(search.get("cost") || 0);
    const inflation = Number(search.get("inflation") || 0);
    const returns = Number(search.get("returns") || 0);
    const risk = search.get("risk") || "Conservative";

    const [showModal, setShowModal] = useState(false);


    const futureValue = useMemo(() => {
        if (!cost || !afterYears) return 0;
        return Math.round(cost * Math.pow(1 + inflation / 100, afterYears));
    }, [cost, afterYears, inflation]);


    const monthlySIP = useMemo(() => {
        if (!futureValue || !afterYears) return 0;
        return Math.round(futureValue / (afterYears * 12));
    }, [futureValue, afterYears]);

    return (
        <div className="w-full">

            <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-19 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
                <h1 className="text-4xl font-semibold text-white-900 mb-2">
                    Goal <span className="text-yellow-300">Summary</span>
                </h1>
            </section>

            <section className="w-full py-12 flex justify-center">
                <div className="max-w-6xl w-full p-8 bg-white rounded-xl shadow-lg">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
                            <div className="text-3xl font-bold">₹ {cost.toLocaleString()}</div>
                            <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm transform hover:scale-105 transition object-cover">
                                Target Amount (Today's Value)
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
                            <div className="text-3xl font-bold">₹ {futureValue.toLocaleString()}</div>
                            <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm transform hover:scale-105 transition object-cover">
                                Future Value (Inflation Adjusted)
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
                            <div className="text-3xl font-bold">{afterYears}</div>
                            <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm transform hover:scale-105 transition object-cover">
                                Years to Save
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow text-center border border-gray-200 py-6">
                            <div className="text-3xl font-bold">₹ {monthlySIP.toLocaleString()}</div>
                            <div className="mt-4 bg-[#3B82F6] text-white py-3 rounded-md text-sm transform hover:scale-105 transition object-cover">
                                Monthly SIP Required
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

                        <div
                            onClick={() => setShowModal(true)}
                            className="bg-[#3B82F6] text-white rounded-xl shadow text-center py-8 cursor-pointer hover:opacity-90 transition"
                        >
                            <p className="font-bold text-lg">Are you an existing client?</p>
                            <p className="mt-3 text-sm">
                                Click to map your existing investments to this goal
                            </p>
                        </div>

                        <div
                            onClick={() => router.push(`/Goal_Planners/Child-Wedding-Summary?investmentType=SIP&risk=${risk}&years=${afterYears}&futureValue=${futureValue}&sip=${monthlySIP}`
                            )}
                            className="border border-[#3B82F6] bg-[#F8FFF1] rounded-xl shadow text-center py-8 cursor-pointer hover:bg-[#eefbe0] transition"
                        >
                            <p className="font-bold text-lg text-[#3B82F6]">
                                No, I do not have investments
                            </p>
                            <p className="mt-3 text-sm text-gray-700">
                                Take me to plan without mapping investments
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* LOGIN POPUP */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg w-[420px] shadow-xl overflow-hidden">

                        <div className="bg-[#00597A] text-white px-6 py-3 text-lg font-semibold">
                            Login
                        </div>

                        <div className="p-6">
                            <label className="text-gray-700 font-medium">PAN Number:</label>
                            <input
                                type="text"
                                className="w-full border mt-1 mb-5 rounded px-3 py-2 border-gray-300"
                            />

                            <label className="text-gray-700 font-medium">Password:</label>
                            <input
                                type="password"
                                className="w-full border mt-1 rounded px-3 py-2 border-gray-300"
                            />
                        </div>

                        <hr />

                        <div className="flex justify-end gap-3 px-6 py-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Close
                            </button>

                            <button className="px-5 py-2 bg-[#004F6E] text-white rounded hover:bg-[#003f58]">
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
