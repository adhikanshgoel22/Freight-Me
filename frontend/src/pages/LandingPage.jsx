
import { ArrowRight, Truck, MapPin, Clock, Package, Briefcase, CheckCircle } from "lucide-react";
import { Button } from '../components/ui/button.tsx'  // adjust relative path as needed
import { useState } from "react";
import { Menu, X} from "lucide-react";
import logo from './logo.jpg';
import main from './Main2.png'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card.tsx";

const LandingPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-17">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div  className="h-10 w-12 text-blue-600"><img src={logo} alt=""  className="h-15 w-12 text-blue-600"/></div>
        <span className="text-xl font-bold text-gray-900">FreightMe</span>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center space-x-20">
        {/* <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a> */}
        <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
        {/* <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a> */}
        <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
        <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
          <a href="/login">Sign In</a>
        </Button>
        
      </div>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button onClick={() => setOpen(!open)} className="text-gray-600 hover:text-blue-600">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </div>
  </div>

  {/* Mobile Menu */}
  {open && (
    <div className="md:hidden px-4 pb-4">
      <div className="flex flex-col space-y-4 mt-4">
        
        {/* <a href="/about" className="text-gray-700 hover:text-blue-600">About Us</a> */}
        <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
        {/* <a href="/contact" className="text-gray-700 hover:text-blue-600">Pricing</a> */}
        <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
        <a href="/login" className="text-gray-700 hover:text-blue-600 border rounded px-4 py-2 border-blue-200">Sign In</a>
        
      </div>
    </div>
  )}
</nav>


      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Revolutionise Your
                <span className="text-blue-600 block">Delivery Business</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline operations, track deliveries in real-time, and grow..
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                  Sign in to Transport!
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                </a>
                
              </div>
              
            </div>
            <div className="relative animate-fade-in">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 shadow-2xl">
                <img 
                  src={main}
                  alt="Dashboard Preview" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              {/* <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                {/* <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">1,247 Deliveries</p>
                    <p className="text-sm text-gray-500">Completed today</p>
                  </div>
                </div> }
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From route optimization to customer notifications, our platform provides all the tools your courier business needs to thrive.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300 border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Real-Time Tracking</CardTitle>
                <CardDescription>
                  Track every delivery in real-time with GPS monitoring and live updates for customers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Route Optimization</CardTitle>
                <CardDescription>
                  Automatically optimize delivery routes to save time, fuel costs, and increase efficiency.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Inventory Management</CardTitle>
                <CardDescription>
                  Manage your fleet, packages, and warehouse operations from a single dashboard.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Customer Portal</CardTitle>
                <CardDescription>
                  Provide customers with self-service portals for booking, tracking, and managing deliveries.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Fleet Management</CardTitle>
                <CardDescription>
                  Monitor vehicle performance, maintenance schedules, and driver assignments efficiently.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300 border-gray-100">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl">Analytics & Reports</CardTitle>
                <CardDescription>
                  Get detailed insights into your operations with comprehensive analytics and reporting tools.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section
      <section className="py-20 bg-blue-600 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Deliveries per day</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime guarantee</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Happy customers</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Customer support</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Delivery Business?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of courier companies already using SwiftDelivery to optimize their operations and delight their customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
              Start Today!
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
          </div>
        </div>
      </section> */}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-15 sm:grid-rows-1">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={logo} alt="" className="h-15 w-12"/>
                <span className="text-xl font-bold">FreightMe</span>
              </div>
              <p className="text-gray-400">
               Get started with delivery today!
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                {/* <li><a href="/contact" className="hover:text-white transition-colors">Pricing</a></li> */}
                
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                {/* <li><a href="/about" className="hover:text-white transition-colors">About</a></li> */}
                
                {/* <li><a href="/contact" className="hover:text-white transition-colors">Careers</a></li> */}
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
          </div>
          <div className="border-t border-gray-800 mt-6 pt-4 text-center text-gray-400">
            <p>&copy; FreightMe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;