import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800">
      <header className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700">FreightMe</h1>
        <nav className="space-x-4">
          <a href="#features" className="text-sm hover:text-blue-600">Features</a>
          <a href="#contact" className="text-sm hover:text-blue-600">Contact</a>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-blue-900 mb-6">
          Simplify Your Freight Tracking
        </h2>
        <p className="text-lg max-w-2xl text-gray-600 mb-8">
          Enter a ticket number, fetch data from Monday.com, and autofill forms seamlessly.
        </p>
        <a
          href="/login"
          className="px-6 py-3 bg-blue-700 text-white rounded-full text-sm font-medium shadow-lg hover:bg-blue-800 transition"
        >
          Get Started
        </a>
      </main>

      <section id="features" className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Real-Time Data</h3>
            <p className="text-sm text-gray-600">Fetch ticket data directly from Monday.com with one click.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Smart Autofill</h3>
            <p className="text-sm text-gray-600">Populate courier forms automatically to save time and reduce errors.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-700 mb-2">PDF & CSV Export</h3>
            <p className="text-sm text-gray-600">Download your data in the format you need.</p>
          </div>
        </div>
      </section>

      <footer id="contact" className="text-center py-8 text-sm text-gray-500">
        © {new Date().getFullYear()} FreightMe. All rights reserved.
      </footer>
    </div>
  );
}
