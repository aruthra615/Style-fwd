import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/catalog", label: "Catalog" },
    { path: "/assistant", label: "AI Assistant" },
    { path: "/account", label: "Account" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="text-primary text-2xl" />
              <span className="text-xl font-bold text-foreground">StyleForward</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-muted-foreground hover:text-primary transition-colors ${
                    isActive(item.path) ? "text-primary" : ""
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button 
                className="md:hidden text-muted-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="hidden md:flex items-center space-x-2">
                <Button data-testid="button-signin">Sign In</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b border-border" data-testid="mobile-menu">
            <div className="px-4 py-2 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block w-full text-left py-2 text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button className="w-full mt-2" data-testid="button-signin-mobile">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Floating AI Assistant Button */}
      <Link href="/assistant">
        <button 
          className="fixed bottom-6 right-6 bg-primary text-primary-foreground w-14 h-14 rounded-full shadow-2xl hover:opacity-90 transition-opacity z-40 floating-button"
          data-testid="button-ai-assistant-floating"
        >
          <Sparkles className="w-6 h-6 mx-auto" />
        </button>
      </Link>
    </>
  );
}
