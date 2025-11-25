export default function About() {
  // ---------- REUSABLE CARD COMPONENT ----------
  function ServiceCard({ icon, color, title, description,className }) {
    return (
      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center relative overflow-hidden group">

        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-100 blur-2xl transition duration-500"></div>

        <div
          className={`relative bg-${color}-100 text-${color}-600 w-16 h-16 flex items-center justify-center rounded-2xl mb-6 mx-auto shadow-inner`}
        >
          <i className={`fa-solid ${icon} text-3xl`}></i>
        </div>
        <h3 className="relative text-2xl font-bold text-gray-800 mb-3">
          {title}
        </h3>
        <p className="relative text-gray-600 text-base leading-relaxed px-2">
          {description}
        </p>
      </div>
    );
  }

  // ---------- SECTION HEADER COMPONENT ----------
  function SectionHeader({ label, title, subtitle, color }) {
    return (
      <div className="text-center mb-14">
        {label && (
          <p className={`text-${color}-600 font-semibold uppercase mb-2`}>
            {label}
          </p>
        )}
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
          {title}
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">{subtitle}</p>
      </div>
    );
  }

  // ---------- TEAM CARD COMPONENT ----------
  function TeamCard({ image, name, role }) {
    return (
      <div className="relative bg-white rounded-3xl shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-center p-8">
        <div className="w-28 h-28 mx-auto mb-5">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-full border-4 border-blue-200 shadow-md"
          />
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-500">{role}</p>


        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition duration-700 -z-10"></div>
      </div>
    );
  }

  // ---------- MAIN RETURN ----------
  return (
    <>

      <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-19 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pb-5 pt-5">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
          About <span className="text-yellow-300">Pioneer Wealth</span> Solutions
        </h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Building trust, delivering excellence, and empowering financial futures since 2009.
        </p>
      </section>


      <section className="py-20 px-6 text-center md:text-left bg-gray max-w-6xl mx-auto relative overflow-hidden rounded-3xl shadow-xl mt-10 border-gray-100  transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl 
">

        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-transparent opacity-80 blur-3xl -z-10"></div>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center 
             relative inline-block px-3 py-1 
             bg-gray-100 rounded-md
             transition-all duration-300 hover:-translate-y-1 ml-115 
        ">
          Who We Are
        </h2>

        <div className="grid md:grid-cols-2 gap-8 items-center">

          <div className="flex justify-center">
            <img
              src="/neww.jpg"
              alt="Team Collaboration"
              className="rounded-3xl shadow-2xl w-full max-w-2xl md:max-w-2xl transform hover:scale-105 transition duration-500 object-cover"
            />
          </div>


          {/* Right Text Section */}
          <div>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              <span className="font-semibold text-blue-600">Pioneer Wealth Solutions</span> isn’t just
              another financial firm — we’re a passionate team on a mission to simplify finance and help
              dreams come true. Since our inception in 2009, we’ve guided thousands of individuals and
              families toward a life of confidence, clarity, and financial independence.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              From smart investments to secure insurance and tax strategies, we tailor each plan with
              precision — blending innovation, ethics, and a touch of human empathy. Our goal is simple:
              to ensure your money works harder for you, while you focus on what truly matters —{" "}
              <span className="italic text-indigo-600">living your best life.</span>
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              With over <span className="font-semibold text-blue-600">15 years</span> of excellence, we
              continue to evolve, inspire, and empower our clients to build wealth that lasts for
              generations.
            </p>
          </div>
        </div>
      </section>


      <section className="text-center py-20 bg-gray-50 px-6">

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10">
          <ServiceCard
            icon="fa-bullseye"
            color="blue"
            title="Our Mission"
            description="To empower individuals and families to achieve financial security and prosperity through expert guidance, innovative solutions, and unwavering commitment to their success."
          />
          <ServiceCard
            icon="fa-eye"
            color="indigo"
            title="Our Vision"
            description="To be India’s most trusted and respected financial advisory firm, recognized for transforming lives through wealth creation, protection, and sustainable financial planning."
          />
        </div>
      </section>


      <section className="text-center py-20 bg-white px-6">
        <SectionHeader  
        

          title=" Our Core Values"
          subtitle="The principles that guide everything we do."
          color="blue"
        />
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <ServiceCard
            icon="fa-shield"
            color="blue"
            title="Integrity"
            description="We uphold the highest standards of honesty and transparency in all our dealings."
          />
          <ServiceCard
            icon="fa-user-group"
            color="indigo"
            title="Trust"
            description="Building lasting relationships based on reliability and consistent performance."
          />
          <ServiceCard
            icon="fa-award"
            color="blue"
            title="Excellence"
            description="Delivering superior service quality and exceeding client expectations."
          />
          <ServiceCard
            icon="fa-chart-line"
            color="indigo"
            title="Growth"
            description="Committed to continuous improvement and helping clients achieve their financial goals."
          />
        </div>
      </section>


      <section className="text-center py-20 bg-gray-50 px-6">
        <SectionHeader

          title=" Meet Our Team"
          subtitle="Experienced professionals dedicated to your financial success."
          color="blue"
        />
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <TeamCard image="/anu.jpg" name="Rajesh Mehta" role="Founder & CEO" />
          <TeamCard image="/item33.jpg" name="Anjali Desai" role="Head of Investments" />
          <TeamCard image="/item45.jpg" name="Vikram Singh" role="Insurance Specialist" />
          <TeamCard image="/item44.jpg" name="Sneha Reddy" role="Tax Consultant" />
        </div>
      </section>
    </>
  );
}
