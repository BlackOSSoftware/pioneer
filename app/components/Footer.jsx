export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700 pt-16 pb-8 px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 max-w-6xl mx-auto border-b border-gray-200 pb-10">
        {/* Column 1: Logo + Description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-lg font-bold text-lg">
              P
            </div>
            <h2 className="text-xl font-bold text-gray-800">Pioneer Wealth</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Your trusted partner in wealth creation, offering expert financial
            advice and tailored investment solutions.
          </p>

          <div className="flex gap-4 text-gray-500 text-lg">
            <a href="#" className="hover:text-blue-600">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="hover:text-blue-600">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-blue-600">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="hover:text-blue-600">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-600">Home</a></li>
            <li><a href="#" className="hover:text-blue-600">About Us</a></li>
            <li><a href="#" className="hover:text-blue-600">Services</a></li>
            <li><a href="#" className="hover:text-blue-600">Contact</a></li>
          </ul>
        </div>

        {/* Column 3: Our Services */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Our Services</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-blue-600">Mutual Funds</a></li>
            <li><a href="#" className="hover:text-blue-600">Life Insurance</a></li>
            <li><a href="#" className="hover:text-blue-600">Health Insurance</a></li>
            <li><a href="#" className="hover:text-blue-600">Tax Planning</a></li>
          </ul>
        </div>

        {/* Column 4: Get In Touch */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Get In Touch</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-location-dot text-blue-600"></i>
              123 Financial District, Mumbai, India
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-phone text-blue-600"></i>
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-envelope text-blue-600"></i>
              info@pioneerws.in
            </li>
          </ul>

          {/* Newsletter */}
          <div className="mt-5">
            <p className="text-sm mb-2">Subscribe to Newsletter</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-l-lg focus:outline-none"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 mt-8">
        <p>© 2025 Pioneer Wealth Solutions. All rights reserved.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-blue-600">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-blue-600">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
