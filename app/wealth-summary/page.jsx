export default function GoalSummary() {
    return (
        <div className="w-full">


            <section className="w-full bg-blue-50 py-12 mt-10">
                <h1 className="text-4xl font-semibold text-center text-gray-800">
                    Wealth Creation
                </h1>

                <p className="text-center text-gray-600 mt-2">
                    Home <span className="mx-1">/</span> Goal{" "}
                    <span className="mx-1">/</span>{" "}
                    <span className="text-blue-600 font-medium">Wealth Creation</span>
                </p>
            </section>


            <section className="w-full py-16 flex justify-center ">
                <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-6xl w-full">


                    <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
                        Goal Summary
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">


                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">46,535</h3>
                            <div className="bg-teal-900 text-white p-4 rounded-md">
                                Your Targeted Amount <br /> (in today's value)
                            </div>
                        </div>


                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">47,000</h3>
                            <div className="bg-teal-900 text-white p-4 rounded-md">
                                Future value of your Wealth creation <br />
                                (adjusting for 0% inflation)
                            </div>
                        </div>


                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">6</h3>
                            <div className="bg-teal-900 text-white p-4 rounded-md">
                                Number of Years <br /> You Need To Save
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-8 text-center">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">1,000</h3>
                            <div className="bg-teal-900 text-white p-4 rounded-md">
                                Monthly SIP Investment <br /> Required
                            </div>
                        </div>

                    </div>


                    <div className="bg-teal-900 text-white text-center rounded-xl p-6 mt-16 shadow-md">
                        <h3 className="text-xl font-semibold">Are you an existing client?</h3>
                        <p className="mt-2 text-sm">
                            If yes, please click here and map your existing investments to this goal.
                        </p>
                    </div>


                    <div className="border border-green-400 bg-green-50 text-gray-700 text-center rounded-xl p-6 mt-6 shadow-md">
                        <h3 className="text-xl font-semibold text-green-700">
                            No, I do not have investments with you
                        </h3>
                        <p className="mt-2 text-sm">
                            Take me to the plan without mapping any existing investments
                        </p>
                    </div>

                </div>
            </section>
        </div>
    );
}
