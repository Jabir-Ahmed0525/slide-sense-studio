import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Settings, User, Home, Upload, Presentation } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Upload', path: '/upload', icon: Upload },
    { name: 'Templates', path: '/templates', icon: Presentation },
  ];

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold bg-gradient-consulting bg-clip-text text-transparent">
                SlideSense
              </span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-4">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={location.pathname === item.path ? "bg-primary text-primary-foreground" : ""}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;