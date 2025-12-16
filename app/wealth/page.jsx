"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WealthCreation() {
    const router = useRouter();

    const [showPopup, setShowPopup] = useState(false);


    const [age, setAge] = useState("");
    const [amount, setAmount] = useState("");
    const [years, setYears] = useState("");
    const [inflation, setInflation] = useState("");
    const [returns, setReturns] = useState("");

    const handleSubmit = () => {
        if (!age || !amount || !years || !inflation || !returns) {
            setShowPopup(true);
            return;
        }

        router.push("/wealth-summary");
    };

    return (
        <div className="w-full">

            <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-19 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        <div className="max-w-6xl mx-auto text-center px-4">
                    <h1 className="text-4xl font-semibold text-white-900 mb-2">
                        Wealth  <span className="text-yellow-300">Creation </span>
                    </h1>
                    <div className="flex justify-center gap-2 text-sm text-white-600">
                        <Link href="/">Home</Link>

                        <span className="text-white-400">/</span>
                        <span>Goal</span>
                        <span className="text-white-400">/</span>
                        <span className="text-[white] font-medium">Wealth Creation</span>
                    </div>
                </div>
      </section>

            <section className="w-full py-16 flex justify-center">
                <div className="bg-white rounded-xl shadow-2xl p-12 max-w-7xl w-full">
                    <div className="text-gray-700 text-xl leading-relaxed space-y-8">

                        <div className="flex flex-wrap items-center gap-4">
                            <span>You are</span>

                            <input
                                type="number"
                                placeholder="Your Age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                className="border-b-2 border-gray-400 focus:border-blue-600 outline-none w-32 pb-1"
                            />

                            <span>years old now you require Rs</span>

                            <input
                                type="number"
                                placeholder="Amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="border-b-2 border-gray-400 focus:border-blue-600 outline-none w-40 pb-1"
                            />

                            <span>at today's value after</span>

                            <input
                                type="number"
                                placeholder="Years"
                                value={years}
                                onChange={(e) => setYears(e.target.value)}
                                className="border-b-2 border-gray-400 focus:border-blue-600 outline-none w-24 pb-1"
                            />

                            <span>years.</span>
                        </div>


                        <div className="flex flex-wrap items-center gap-4">
                            <span>For becoming wealthy, you assume the inflation to be</span>

                            <input
                                type="number"
                                placeholder="Inflation "
                                value={inflation}
                                onChange={(e) => setInflation(e.target.value)}
                                className="border-b-2 border-gray-400 focus:border-blue-600 outline-none w-24 pb-1"
                            />

                            <span>% and expect</span>

                            <input
                                type="number"
                                placeholder="Returns "
                                value={returns}
                                onChange={(e) => setReturns(e.target.value)}
                                className="border-b-2 border-gray-400 focus:border-blue-600 outline-none w-24 pb-1"
                            />

                            <span>% return on your investments.</span>
                        </div>


                        <div className="text-center pt-6">
                            <button
                                onClick={handleSubmit}
                                className="px-10 py-3 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition"
                            >
                                Build My Goal
                            </button>
                        </div>


                        {showPopup && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                                <div className="bg-white rounded-xl shadow-2xl p-8 w-[380px] text-center">
                                    <p className="text-gray-700 text-lg mb-6">
                                        Please fill all fields correctly
                                    </p>

                                    <button
                                        onClick={() => setShowPopup(false)}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        OK
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
