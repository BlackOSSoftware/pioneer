
"use client";

export default function Hero() {
  // ---------- REUSABLE COMPONENTS ----------

  // InfoCard Component
  function InfoCard({ number, text }) {
    return (
      <div className="flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
        <div className="text-blue-600 text-4xl font-extrabold mb-2">{number}</div>
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    );
  }

  // MissionBox Component
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

  // ServiceCard Component
  function ServiceCard({ icon, color, title, description }) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 border border-gray-100 transition-all duration-300 text-center">
        <div
          className={`bg-${color}-100 text-${color}-600 w-14 h-14 flex items-center justify-center rounded-2xl mb-4 mx-auto text-2xl`}
        >
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 text-base leading-relaxed">{description}</p>
      </div>
    );
  }

  // TestimonialCard Component
  function TestimonialCard({ name, role, text }) {
    return (
      <div className="bg-white p-8 rounded-3xl shadow-md hover:shadow-lg border border-gray-100 transition-all duration-300">
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

        <p className="text-gray-600 text-base italic leading-relaxed">
          “{text}”
        </p>
      </div>
    );
  }

  // SectionHeader Component
  function SectionHeader({ label, title, color, subtitle }) {
    return (
      <div className="text-center mb-16">
        <p
          className={`text-${color}-600 bg-${color}-100 px-6 py-2 rounded-full font-semibold inline-block mb-4`}
        >
          {label}
        </p>

        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
          {title.split(" ").slice(0, -2).join(" ")}{" "}
          <span className={`text-${color}-600`}>
            {title.split(" ").slice(-2).join(" ")}
          </span>
        </h2>

        <p className="text-gray-500 max-w-2xl mx-auto text-lg">{subtitle}</p>
      </div>
    );
  }

  // ---------- MAIN RETURN ----------
  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="flex flex-col items-center justify-center min-h-screen text-center bg-white px-6 py-20">
        <p className="text-gray-700 text-lg font-medium bg-blue-50 px-6 py-2 rounded-full border border-blue-200 shadow-sm mb-6">
          Trusted Financial Partner Since 2009
        </p>

        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">
          Your Trusted Partner In
        </h2>

        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 mb-5 drop-shadow-sm">
          Wealth Creation
        </h1>

        <p className="text-gray-600 text-lg mb-10 max-w-2xl">
          Pioneer Wealth Solutions offers expert financial advice, investment
          planning, and insurance solutions tailored to your life goals.
        </p>

        <div className="flex flex-wrap gap-5 mb-14 justify-center">
          <button className="px-7 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition duration-300">
            Explore Services
          </button>

          <button className="px-7 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white shadow-sm transition duration-300">
            Book Consultation
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-5xl mt-6">
          <InfoCard number="5,000+" text="Clients Served" />
          <InfoCard number="15+" text="Years of Experience" />
          <InfoCard number="₹500Cr+" text="Assets Managed" />
        </div>
      </section>


      {/* ========== MISSION SECTION ========== */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-14 bg-gray-50 py-20 px-8">

        <div className="relative md:w-1/2 w-full">
          <img
            src="/team1.jpg"
            alt="Financial Team"
            className="rounded-3xl shadow-2xl w-full h-[480px] object-cover border border-gray-100"
          />


          <div className="absolute bottom-6 right-6 bg-white shadow-lg rounded-2xl px-5 py-3 flex items-center gap-3 border border-gray-100">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
              <i className="fa-solid fa-trophy text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">15+</h3>
              <p className="text-sm text-gray-500">Awards Won</p>
            </div>
          </div>

        </div>


        <div className="md:w-1/2 w-full text-left">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-5">
            Building Financial Futures{" "}
            <span className="text-blue-600">Since 2009</span>
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            Pioneer Wealth Solutions is your dedicated partner in navigating
            the complex world of finance. We combine deep expertise with
            personalized service to help you achieve your financial dreams.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <MissionBox
              icon="fa-bullseye"
              title="Our Mission"
              text="Empowering individuals and families to achieve financial security through expert guidance and innovative solutions."
            />
            <MissionBox
              icon="fa-eye"
              title="Our Vision"
              text="To be India’s most trusted financial advisory firm, transforming lives through wealth creation and protection."
            />
          </div>

          <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md">
            Learn More About Us
          </button>
        </div>
      </section>


      {/* ========== SERVICES SECTION ========== */}
      <section className="text-center py-24 bg-white px-6">
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

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section className="bg-blue-50 py-20 text-center px-6">
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
      src="/partners/hdfc.png"
      alt="HDFC Bank"
      className="h-14 opacity-80 hover:opacity-100 transition-transform duration-300 hover:scale-110"
    />

    
    <img
      src="/partners/icici.png"
      alt="ICICI Bank"
      className="h-14 opacity-80 hover:opacity-100 transition-transform duration-300 hover:scale-110"
    />

    
    <img
      src="/partners/axis.png"
      alt="Axis Bank"
      className="h-14 opacity-80 hover:opacity-100 transition-transform duration-300 hover:scale-110"
    />

    
    <img
      src="/partners/lic.png"
      alt="LIC"
      className="h-14 opacity-80 hover:opacity-100 transition-transform duration-300 hover:scale-110"
    />

    
    <img
      src="/partners/maxlife.png"
      alt="Max Life Insurance"
      className="h-14 opacity-80 hover:opacity-100 transition-transform duration-300 hover:scale-110"
    />
  </div>
</section>


      {/* ---------- READY TO GROW SECTION ---------- */}
      <section className="py-20 px-8 mx-8 bg-gradient-to-r from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-xl mt-20">
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
          <button className="border border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition">
            Contact Us
          </button>
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
    </>
  );
}
