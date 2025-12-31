

  "use client";

  import { useEffect, useState } from "react";
  import Link from "next/link";
  export default function Hero() {
    const slideData = [
      {
        img: "/bg/bg1.jpg",
        title: "Your Trusted Partner In",
        highlight: "Wealth Creation",
        buttonText: "Explore Wealth Services →",
        buttonURL: "/Goal_Planners/Wealth-Creation"
      },
      {
        img: "/bg/bg2.jpg",
        title: "Start Building the",
        highlight: "Home You Truly Deserve",
        buttonText: "Begin Your Dream Home Plan →",
        buttonURL: "/Goal_Planners/Dream-home"
      },
      
      {
        img: "/bg/bg4.jpg",
        title: "Build A Strong Future With",
        highlight: "Child Education Goal",
        buttonText: "Start Child Planning →",
        buttonURL: "/Goal_Planners/Child-Education"
      }
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % slideData.length);
      }, 2500);
      return () => clearInterval(interval);
    }, []);

    // -------------------- COMPONENTS --------------------

    function InfoCard({ number, text }) {
      return (
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
          <div className="text-blue-600 text-4xl font-extrabold mb-2">{number}</div>
          <p className="text-gray-700 font-medium">{text}</p>
        </div>
      );
    }

    function MissionBox({ icon, title, text }) {
      return (
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:-translate-y-1">
          <div className="bg-blue-100 text-blue-600 w-12 h-12 flex items-center justify-center rounded-xl mb-3 text-lg">
            <i className={`fa-solid ${icon}`}></i>
          </div>
          <h3 className="font-semibold text-gray-800 mb-2 text-lg">{title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{text}</p>
        </div>
      );
    }

    function ServiceCard({ icon, color, title, description }) {
      return (
        <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 border border-gray-100 transition-all duration-300 text-center">
          <div className={`bg-${color}-100 text-${color}-600 w-14 h-14 flex items-center justify-center rounded-2xl mb-4 mx-auto text-2xl`}>
            <i className={`fa-solid ${icon}`}></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
          <p className="text-gray-600 text-base leading-relaxed">{description}</p>
        </div>
      );
    }

    function TestimonialCard({ name, role, text }) {
      return (
        <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300 border border-gray-100">
          <div className="flex items-center mb-4 gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold">
              {name[0]}
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{name}</h4>
              <p className="text-sm text-gray-500">{role}</p>
            </div>
          </div>

          <div className="flex mb-3 text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <i key={i} className="fa-solid fa-star text-sm"></i>
            ))}
          </div>

          <p className="text-gray-600 text-base italic leading-relaxed">“{text}”</p>
        </div>
      );
    }

    function SectionHeader({ label, title, color, subtitle }) {
      return (
        <div className="text-center mb-10 transition-all duration-200 hover:-translate-y-1  ">
          <p className={`text-${color}-600 bg-${color}-100 px-6 py-2 rounded-full font-semibold inline-block  `}>
            {label}
          </p>

          <h2 className="text-4xl font-extrabold text-gray-900 mt-5 mb-3">
            {title.split(" ").slice(0, -2).join(" ")}{" "}
            <span className={`text-${color}-600`}>
              {title.split(" ").slice(-2).join(" ")}
            </span>
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto text-lg">{subtitle}</p>
        </div>
      );
    }
    const cardData = [
      { number: "5,000+", text: "Clients Served" },
      { number: "15+", text: "Years Experience" },
      { number: "₹500Cr+", text: "Assets Managed" }
    ];


    // -------------------- MAIN RETURN --------------------

    return (
      <div className="bg-white">

        <section className="relative min-h-[96vh] flex items-center px-10 py-20 overflow-hidden rounded-3xl -mt-9  transition duration-300 hover:scale-101 object-cover border border-gray-100">

          {/* Background Images */}
          {slideData.map((item, i) => (
            <img
              key={i}
              src={item.img}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-[1500ms]
              ${i === index ? "opacity-100" : "opacity-0"}`}
            />
          ))}

          
          <div className="absolute inset-0 bg-black/40"></div>

          
          <p className="absolute top-20 left-1/2 -translate-x-1/2 z-20 text-gray-200 text-lg font-medium bg-white/20 px-6 py-2 rounded-full shadow-sm mt-6 backdrop-blur">
            Trusted Financial Partner Since 2009
          </p>

        
          <div className="relative z-10 ml-5 flex flex-col text-left max-w-3xl mt-15">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
              {slideData[index].title}
            </h2>

            <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-6 leading-tight drop-shadow">
              {slideData[index].highlight}
            </h1>

            <div className="flex flex-wrap gap-5 mb-10">
              <Link
                href={slideData[index].buttonURL}
                className="px-7 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md transition"
              >
                {slideData[index].buttonText}
              </Link>
            </div>
          </div>
          <div className="absolute bottom-4 right-5 z-10">

            <div className="w-[220px] transition-opacity duration-700">
              <InfoCard
                number={cardData[index % cardData.length].number}
                text={cardData[index % cardData.length].text}
              />
            </div>

          </div>
        </section>



        {/* ------------------- NEXT SECTIONS SAME AS BEFORE ------------------- */}

        <section className="flex flex-col md:flex-row items-center justify-center gap-14 bg-gray-50 py-20 px-8">
          <div className="relative md:w-1/2 w-full">
            <img
              src="/team1.jpg"
              alt="Financial Team"
              className="rounded-3xl shadow-2xl w-full h-[480px] transition duration-500 hover:scale-105 object-cover border border-gray-100"
            />

            <div className="absolute bottom-6 right-6 bg-white shadow-lg rounded-2xl px-5 py-3 flex items-center gap-3 border border-gray-100">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                <i className="fa-solid fa-trophy text-xl"></i>
              </div>
              <div >
                <h3 className="text-lg font-bold text-gray-800 ">15+</h3>
                <p className="text-sm text-gray-500">Awards Won</p>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 w-full text-left">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-5">
              Building Financial Futures <span className="text-blue-600">Since 2009</span>
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed text-lg">
              Pioneer Wealth Solutions is your dedicated partner in navigating
              the complex world of finance. We combine deep expertise with
              personalized service to help you achieve your financial dreams.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <MissionBox icon="fa-bullseye" title="Our Mission" text="Empowering individuals and families to achieve financial security through expert guidance and innovative solutions." />
              <MissionBox icon="fa-eye" title="Our Vision" text="To be India’s most trusted financial advisory firm, transforming lives through wealth creation and protection." />
            </div>

            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
              Learn More About Us
            </button>
          </div>
        </section>
        <section className="relative bg-white rounded-3xl shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all  mb-1 duration-200 text-center p-8 ">
          <SectionHeader
            label="Our Services"
            title="Comprehensive Financial Solutions"
            color="blue"
            subtitle="From investment planning to insurance and tax optimization, we provide everything to help you reach your financial goals."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <ServiceCard
              icon="fa-chart-line"
              color="blue"
              title="Mutual Funds"
              description="Invest smartly in top-rated mutual funds with expert insights and portfolio management."
            />
            <ServiceCard
              icon="fa-shield-heart"
              color="green"
              title="Life Insurance"
              description="Secure your family's future with personalized life insurance plans."
            />
            <ServiceCard
              icon="fa-heart-pulse"
              color="red"
              title="Health Insurance"
              description="Comprehensive health plans to safeguard your family’s well-being."
            />
            <ServiceCard
              icon="fa-file-invoice-dollar"
              color="purple"
              title="Tax Planning"
              description="Save more with smart tax strategies and expert consultation."
            />
            <ServiceCard
              icon="fa-briefcase"
              color="orange"
              title="Financial Advisory"
              description="Personalized advice from experts for confident investment decisions."
            />
            <ServiceCard
              icon="fa-piggy-bank"
              color="teal"
              title="Retirement Planning"
              description="Plan early, retire peacefully with smart pension strategies."
            />
          </div>

          <button className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition duration-300 shadow-sm">
            View All Services
          </button>
        </section>


        <section className="relative  py-16 bg-white rounded-3xl shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 text-center p-8">
          <SectionHeader
            label="Testimonials"
            title="What Our Clients Say About Us"
            color="blue"
            subtitle="Real stories from real people who trusted us with their financial future."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <TestimonialCard
              name="Rajesh Kumar"
              role="Business Owner"
              text="Pioneer Wealth transformed our financial planning. Their mutual fund advice helped us grow our savings effectively!"
            />
            <TestimonialCard
              name="Priya Sharma"
              role="IT Professional"
              text="Excellent service and personalized attention. They made complex insurance decisions simple and effective."
            />
            <TestimonialCard
              name="Amit Patel"
              role="Entrepreneur"
              text="Highly professional team — their tax planning strategies saved me a lot last year. Highly recommend!"
            />
          </div>
        </section>
        <section className="bg-gradient-to-b from-white to-blue-50 py-16 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-2">
            Trusted by Leading Financial Institutions
          </p>

          <h2 className="text-3xl font-extrabold text-gray-800 mb-12">
            Our <span className="text-blue-600">Partners</span>
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-12 max-w-6xl mx-auto">

            <img
              src="/partners/hdfc.svg"
              alt="HDFC Bank"
              className="h-14 opacity-80 hover:opacity-100 transition-transform duration-300 hover:scale-110"
            />


            <img
              src="/partners/icici.svg"
              alt="ICICI Bank"
              className="h-14 opacity-80 hover:opacity-100 transition-transform duration-300 hover:scale-110"
            />


            <img
              src="/partners/axis3.jpeg"
              alt="Axis Bank"
              className="h-14 opacity-80 hover:opacity-100 transition-transform duration-300 hover:scale-110"
            />


            <img
              src="/partners/lic.png"
              alt="LIC"
              className="h-14 opacity-80 hover:opacity-100 transition-transform duration-300 hover:scale-110"
            />



          </div>
        </section>



        <section className="py-18 px-8 mx-8 bg-gradient-to-r from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-xl mt-1">
          <h2 className="text-4xl font-extrabold mb-4">
            Ready to <span className="text-yellow-300">Grow Your Wealth?</span>
          </h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto">
            Let’s build your personalized financial plan with our experts — crafted
            for your goals and dreams.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-12">
            <button className="bg-white text-blue-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 shadow-md transition">
              Get Started Today →
            </button>
            <Link href="/contact">
    <button className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition">
      Contact Us
    </button>
  </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-12 text-blue-100 text-sm">
            <div>
              <h3 className="text-white text-2xl font-bold mb-1">100%</h3>
              <p>Satisfaction Rate</p>
            </div>
            <div>
              <h3 className="text-white text-2xl font-bold mb-1">24/7</h3>
              <p>Customer Support</p>
            </div>
            <div>
              <h3 className="text-white text-2xl font-bold mb-1">Free</h3>
              <p>Consultation</p>
            </div>
          </div>
        </section>
      </div>
    );
  }
