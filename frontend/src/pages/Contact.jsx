import { Mail, MapPin, FolderPen } from "lucide-react";
import { Button } from "../components/ui/button.tsx";
import { useState } from "react";
import axios from "axios";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await axios.post("https://freight-me-1.onrender.com/submit-query", formData); // replace with your backend URL
      setStatus("Query submitted successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus(error.response?.data?.error || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Header Section */}
      <section className="bg-blue-600 text-white py-16 px-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition">
  <a href="/" className="flex items-center">
    <span className="text-xl">←</span>
    <span className="ml-1">Go Back</span>
  </a>
</button>

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
          <form
            onSubmit={handleSubmit}
            className="bg-blue-50 p-8 rounded-xl shadow-md space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us what you need..."
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>

            {status && (
              <p className={`text-sm ${status.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                {status}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
