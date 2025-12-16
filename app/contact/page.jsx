"use client";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const contactInfo = [
    {
      icon: <MapPin className="text-blue-600" size={28} />,
      title: "Visit Us",
      details: (
        <>
          123 Financial District, Bandra West,
          <br />
          Mumbai, Maharashtra 400050
        </>
      ),
    },
    {
      icon: <Phone className="text-blue-600" size={28} />,
      title: "Call Us",
      details: (
        <>
          +91 98765 43210 <br /> +91 22 1234 5678
        </>
      ),
    },
    {
      icon: <Mail className="text-blue-600" size={28} />,
      title: "Email Us",
      details: (
        <>
          info@pioneerws.in <br /> support@pioneerws.in
        </>
      ),
    },
    {
      icon: <Clock className="text-blue-600" size={28} />,
      title: "Working Hours",
      details: (
        <>
          Mon - Sat: 9:00 AM - 6:00 PM
          <br />
          Sunday: Closed
        </>
      ),
    },
  ];




  return (
    <div className="min-h-screen bg-gray-50">
<section className="py-16 px-6 w-full  -mt-10 from-white to-indigo-500 text-white bg-white  pb-4">
        
      </section>

      <section className="py-20 px-6 mx-6 md:mx-12 bg-gradient-to-r mt-5 from-blue-600 to-indigo-500 text-center text-white rounded-3xl shadow-lg pt-5 pb-5">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Get In <span className="text-yellow-300"> Touch</span></h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          We'd love to hear from you. Let's discuss how we can help you achieve your financial goals.
        </p>

      </section>


      <section className="max-w-6xl mx-auto mt-16 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 text-center p-8"
            >
              <div className="flex justify-center items-center bg-blue-100 rounded-xl w-14 h-14 mx-auto mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.details}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-200 my-12 w-10/12 mx-auto"></div>


      <section className="max-w-6xl mx-auto  px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Send Us a Message
            </h2>
            <p className="text-gray-500 mb-8">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>

            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();

                const formData = {
                  name: e.target.name.value,
                  phone: e.target.phone.value,
                  email: e.target.email.value,
                  subject: e.target.subject.value,
                  message: e.target.message.value,
                };

                const res = await fetch("/api/contact", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formData),
                });

                const data = await res.json();
                if (data.success) {
                  alert("Thank you! Your message has been sent 😊");
                  e.target.reset(); // Clear form
                } else {
                  alert("Something went wrong! ❌");
                }
              }}
            >


              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                     name="name"
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 xxxxx xxxxx"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>


              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>


              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                   name="subject"
                  placeholder="How can we help you?"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>


              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Message *
                </label>
                <textarea
                  rows="4"
                  name="message" 
                  placeholder="Tell us more about your requirements..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                ></textarea>
              </div>


              <button
                type="submit"
                className="bg-blue-600 text-white w-full sm:w-auto px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
                
              >
                Send Message →
              </button>
            </form>
          </div>


          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Our Location
            </h2>
            <p className="text-gray-500 mb-6">
              Visit us at our office in Mumbai's financial district.
            </p>


            <div className="w-full h-80 bg-gray-200 rounded-2xl shadow-inner flex items-center justify-center text-gray-500 text-sm">
              📍 Map Integration Coming Soon
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
