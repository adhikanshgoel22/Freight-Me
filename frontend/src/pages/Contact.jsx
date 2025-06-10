import { Mail, Phone, MapPin, FolderPen } from "lucide-react";
import { Button } from "../components/ui/button.tsx";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Need More Info or Custom Pricing?</h1>
          <p className="text-lg">We’re here to help you scale. Reach out for custom plans or enterprise solutions.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="text-gray-600">Fill out the form or reach us via the methods below. We typically respond within 1 business day.</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <FolderPen className="text-blue-600 w-6 h-6" />
                <span>InstallMe</span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="text-blue-600 w-6 h-6" />
                <span>projects@installme.com.au</span>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="text-blue-600 w-6 h-6" />
                <span>Brisbane</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="bg-blue-50 p-8 rounded-xl shadow-md space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="Tell us what you need..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
