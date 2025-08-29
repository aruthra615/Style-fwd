import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Brain, Palette, MapPin, TrendingUp, ShoppingBag, Shield, Star, Camera, Users, ChartLine } from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced computer vision analyzes fit, color harmony, and style compatibility"
    },
    {
      icon: Palette,
      title: "Color Matching",
      description: "Get recommendations based on your skin undertone and personal color palette"
    },
    {
      icon: MapPin,
      title: "Indian Fashion Focus",
      description: "Curated for Indian body types, skin tones, and cultural style preferences"
    },
    {
      icon: TrendingUp,
      title: "Fit Scoring",
      description: "Objective fit scores help you make confident clothing choices"
    },
    {
      icon: ShoppingBag,
      title: "Smart Shopping",
      description: "Find similar items from our curated catalog with Indian brands and pricing"
    },
    {
      icon: Shield,
      title: "Privacy Focused",
      description: "Your photos are analyzed securely with no facial data stored permanently"
    }
  ];

  const steps = [
    {
      icon: Users,
      title: "1. Create Your Profile",
      description: "Tell us about your body type, style preferences, and upload reference outfits you love"
    },
    {
      icon: Camera,
      title: "2. Upload & Analyze",
      description: "Share photos of outfits you're trying on and get instant AI-powered fit and style analysis"
    },
    {
      icon: ChartLine,
      title: "3. Get Recommendations",
      description: "Receive personalized product suggestions and styling tips based on your unique profile"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-gradient py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Your Personal
                <span className="text-primary"> AI Style</span>
                {" "}Assistant
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Get personalized fashion recommendations tailored to your body type, skin tone, and style preferences. Upload your photos for instant AI-powered fashion advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/onboarding">
                  <Button size="lg" className="floating-button" data-testid="button-try-ai-assistant">
                    Try AI Assistant
                  </Button>
                </Link>
                <Link href="/catalog">
                  <Button variant="outline" size="lg" data-testid="button-browse-catalog">
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://pixabay.com/get/g57030854ca3d9140c2655136ca83d71d0c4cd258c2febbc0c97953225d0b6aac4f27e9db77ffcf2fc8d1079be5237530c0917889af1ff2c1f2cdd28a151b9315_1280.jpg"
                alt="Fashion styling and shopping" 
                className="rounded-2xl shadow-2xl w-full" 
                data-testid="hero-image"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg glass-card">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">95% Match</div>
                    <div className="text-xs text-muted-foreground">Perfect for your style!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How StyleForward Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Get personalized fashion recommendations in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center space-y-4" data-testid={`step-${index + 1}`}>
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                    <IconComponent className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose StyleForward?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-shadow" data-testid={`feature-${index}`}>
                  <CardContent className="p-6">
                    <IconComponent className="w-12 h-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Style?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users who've discovered their perfect style with AI assistance</p>
          <Link href="/onboarding">
            <Button size="lg" variant="secondary" className="floating-button" data-testid="button-get-started-cta">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
