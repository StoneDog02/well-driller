import type { MetaFunction } from "@remix-run/node";
import { InteractiveMap } from "~/components/InteractiveMap";

export const meta: MetaFunction = () => {
  return [
    { title: "General Information - Stokes Water Well" },
    {
      name: "description",
      content: "Learn about Stokes Water Well services, service area, and general information about our residential well drilling company.",
    },
  ];
};

export default function GeneralInfo() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              General <span className="text-primary-600">Information</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about our residential well drilling services, 
              service areas, and what makes us your trusted water well partner.
            </p>
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Service Area
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We proudly serve residential customers throughout Northern Utah and Southern Idaho. 
                Our experienced team brings professional well drilling services directly to your property.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Whether you need a new well installed, existing well repairs, or water quality testing, 
                we're committed to providing reliable service when you need it most. We recommend 
                calling (435) 764-9462 to confirm service availability for your specific address.
              </p>
              <div className="bg-accent-50 rounded-lg p-6 border-l-4 border-accent-800">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-700 mb-4">
                  Contact us today to discuss your well drilling needs and get a free consultation.
                </p>
                <a
                  href="/request"
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition-colors duration-200 inline-block"
                >
                  Request Quote
                </a>
              </div>
            </div>
            <div className="card">
              <div className="rounded-lg overflow-hidden">
                <InteractiveMap className="w-full h-96" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="section-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specializing in residential well drilling and water system services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card overflow-hidden">
              <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Residential well drilling equipment"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Residential Well Drilling
                </h3>
                <p className="text-gray-600 mb-4">
                  We specialize in drilling new residential water wells for homeowners. 
                  Our experienced team uses state-of-the-art equipment to ensure quality results.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Site assessment and planning</li>
                  <li>• Professional drilling services</li>
                  <li>• Well casing installation</li>
                  <li>• Water quality testing</li>
                </ul>
              </div>
            </div>
            <div className="card overflow-hidden">
              <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Well maintenance and repair work"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Well Maintenance & Repairs
                </h3>
                <p className="text-gray-600 mb-4">
                  Keep your existing well running smoothly with our maintenance and repair services. 
                  We diagnose problems quickly and provide lasting solutions.
                </p>
                <ul className="text-gray-600 space-y-2">
                  <li>• Pump installation and repair</li>
                  <li>• Well casing repairs</li>
                  <li>• Water pressure issues</li>
                  <li>• Emergency service calls</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Stokes Water Well?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience, reliability, and customer satisfaction are our top priorities
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Licensed & Insured
              </h3>
              <p className="text-gray-600">
                Fully licensed and insured for your peace of mind. 
                We meet all local and state requirements for well drilling.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quick Response
              </h3>
              <p className="text-gray-600">
                We understand water is essential. That's why we provide 
                quick response times for all service calls.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Workmanship
              </h3>
              <p className="text-gray-600">
                We take pride in our work and stand behind every project. 
                Quality materials and expert installation guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to discuss your well drilling needs? Contact us today for a free consultation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Phone</h3>
              <a href="tel:+14357649462" className="text-accent-600 hover:text-accent-700 transition-colors duration-200">
                (435) 764-9462
              </a>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <a href="mailto:info@stokeswaterwell.com" className="text-accent-600 hover:text-accent-700 transition-colors duration-200">
                info@stokeswaterwell.com
              </a>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Hours</h3>
              <p className="text-gray-300">
                Mon-Fri: 8AM-6PM<br />
                Sat: 9AM-4PM<br />
                Sun: Emergency Only
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
