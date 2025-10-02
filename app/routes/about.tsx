import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "About Us - Stokes Water Well" },
    {
      name: "description",
      content:
        "Learn about Stokes Water Well's experience, team, and commitment to quality residential well drilling services.",
    },
  ];
};

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About <span className="text-primary-600">Stokes Water Well</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Your trusted local experts in residential well drilling. 
              We bring years of experience and a commitment to quality service to every project.
            </p>
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto border-l-4 border-primary-600">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Located in Garland, Utah</h3>
                <p className="text-gray-700">
                  Serving Garland, UT and the surrounding communities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Stokes Drilling is a well-established well drilling contractor located in Garland, Utah. 
                We are recognized for our reliability and commitment to serving the local community 
                with high-quality drilling services. With our base in the heart of Garland, we have 
                built a reputation for providing essential water well solutions to our clients.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                We understand that access to clean, reliable water is essential for every home. 
                Our mission is to provide professional residential well drilling services that 
                exceed expectations, ensuring your family has the water they need for years to come. 
                Our experienced team works tirelessly to ensure that every well installation, repair, 
                or maintenance service meets the highest standards of quality and reliability.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="text-center sm:text-left">
                                <div className="text-3xl font-bold text-accent-800 mb-2">
                10+
              </div>
                  <div className="text-gray-600">Years of Experience</div>
                </div>
                <div className="text-center sm:text-left">
                                <div className="text-3xl font-bold text-accent-800 mb-2">
                200+
              </div>
                  <div className="text-gray-600">Wells Drilled</div>
                </div>
                <div className="text-center sm:text-left">
                                <div className="text-3xl font-bold text-accent-800 mb-2">
                24/7
              </div>
                  <div className="text-gray-600">Emergency Service</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                  alt="Professional well drilling team at work"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-light py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the way we
              interact with our customers and deliver our well drilling services.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality
              </h3>
              <p className="text-gray-600">
                We strive for excellence in every well drilling project, ensuring the highest
                quality standards and attention to detail in all our work.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reliability
              </h3>
              <p className="text-gray-600">
                We believe in being dependable and trustworthy, working
                closely with our clients to ensure their water needs are met reliably.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Integrity
              </h3>
              <p className="text-gray-600">
                We conduct business with honesty and transparency, providing
                fair pricing and honest assessments for all our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our experienced team of well drilling professionals is committed to delivering
              exceptional results for every residential well project.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Zachary Larsen
              </h3>
              <p className="text-accent-800 mb-2">Owner & Lead Driller</p>
              <p className="text-gray-600">
                Licensed well drilling professional spearheading Stokes Drilling's operations 
                and customer service with extensive knowledge in residential well drilling 
                and water system installation.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Field Technician
              </h3>
              <p className="text-accent-800 mb-2">Well Maintenance Specialist</p>
              <p className="text-gray-600">
                Skilled technician specializing in well repairs, pump installation, 
                and water system maintenance.
              </p>
            </div>
            <div className="card text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Customer Service
              </h3>
              <p className="text-accent-800 mb-2">Project Coordinator</p>
              <p className="text-gray-600">
                Dedicated to ensuring excellent customer service and smooth 
                project coordination from start to finish.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
