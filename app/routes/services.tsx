import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Services - Stokes Water Well" },
    {
      name: "description",
      content: "Professional residential well drilling services including new wells, repairs, maintenance, and water testing.",
    },
  ];
};

export default function Services() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
            alt="Professional well drilling equipment"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-primary-400">Services</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional residential well drilling services you can trust. 
              From new well installation to maintenance and repairs, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specializing in residential well drilling and water system services
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* New Well Drilling */}
            <div className="card">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  New Well Drilling
                </h3>
                <p className="text-gray-600">
                  Professional installation of new residential water wells. 
                  We handle everything from site assessment to final testing.
                </p>
              </div>
            </div>

            {/* Well Repairs */}
            <div className="card">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Well Repairs
                </h3>
                <p className="text-gray-600">
                  Expert diagnosis and repair of existing wells. 
                  From pump issues to casing problems, we fix it right the first time.
                </p>
              </div>
            </div>

            {/* Water Testing */}
            <div className="card">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Water Testing
                </h3>
                <p className="text-gray-600">
                  Comprehensive water quality testing to ensure your water is safe 
                  and meets all health standards for your family.
                </p>
              </div>
            </div>

            {/* Pump Installation */}
            <div className="card">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Pump Installation
                </h3>
                <p className="text-gray-600">
                  Professional installation and maintenance of water pumps. 
                  We ensure optimal performance and longevity.
                </p>
              </div>
            </div>

            {/* Well Maintenance */}
            <div className="card">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Well Maintenance
                </h3>
                <p className="text-gray-600">
                  Regular maintenance services to keep your well running smoothly 
                  and prevent costly repairs down the road.
                </p>
              </div>
            </div>

            {/* Emergency Service */}
            <div className="card">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Emergency Service
                </h3>
                <p className="text-gray-600">
                  Available for urgent well problems. When your water stops flowing, 
                  we're here to help get it running again quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              How we ensure quality service from start to finish
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consultation</h3>
              <p className="text-gray-600">We assess your needs and provide a detailed quote</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Planning</h3>
              <p className="text-gray-600">Site evaluation and permit acquisition</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Installation</h3>
              <p className="text-gray-600">Professional drilling and system installation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Testing</h3>
              <p className="text-gray-600">Water quality testing and system verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Well Services?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and quote. 
            We're here to help with all your residential well needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-block shadow-lg hover:shadow-xl"
            >
              Get Free Quote
            </a>
            <a
              href="tel:+14357649462"
              className="bg-accent-800 hover:bg-accent-900 text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-block shadow-lg hover:shadow-xl"
            >
              Call (435) 764-9462
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
