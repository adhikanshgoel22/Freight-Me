import react from "react";
import { Truck } from "lucide-react";

import { Button } from "./ui/button.tsx";

const Header=()=>{
    return(
        <div>
            <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900"><a href="/">InstallMe</a></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                <a href="/login">Sign In</a>
              </Button>
              
            </div>
          </div>
        </div>
      </nav>
        </div>
    )
}

export default Header;