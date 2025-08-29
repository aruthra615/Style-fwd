import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Heart, History, Download, Shield, Camera, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Account() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Mock user data - in real app, this would come from auth context/API
  const mockUser = {
    name: "Priya Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43210",
    profile: {
      bodyShape: "Hourglass",
      faceShape: "Oval",
      complexion: "Medium",
      undertone: "Warm",
      styleTags: ["Traditional", "Feminine", "Minimalist", "Modest"]
    }
  };

  const [userInfo, setUserInfo] = useState(mockUser);

  const handleUpdateProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Data Export Started",
      description: "Your data export will be emailed to you within 24 hours.",
    });
  };

  const recentConsultations = [
    {
      id: 1,
      title: "Outfit Analysis - Blue Kurta",
      description: "Analyzed fit and color matching for traditional outfit",
      fitScore: 85,
      colorMatch: 92,
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      title: "Product Recommendations",
      description: "Received 6 personalized product suggestions",
      timestamp: "Yesterday"
    },
    {
      id: 3,
      title: "Style Consultation",
      description: "Fashion advice for upcoming wedding event",
      timestamp: "3 days ago"
    }
  ];

  const navigationItems = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "style", label: "Style Preferences", icon: Heart },
    { id: "history", label: "Consultation History", icon: History },
    { id: "export", label: "Export Data", icon: Download },
    { id: "privacy", label: "Privacy Settings", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <Card className="h-fit">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground" data-testid="user-name">
                    {userInfo.name}
                  </h3>
                  <p className="text-muted-foreground" data-testid="user-email">
                    {userInfo.email}
                  </p>
                </div>
                
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                          activeTab === item.id
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                        onClick={() => setActiveTab(item.id)}
                        data-testid={`nav-${item.id}`}
                      >
                        <IconComponent className="w-4 h-4 mr-3 inline" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <Card data-testid="profile-settings">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-sm font-medium text-foreground mb-2 block">
                          First Name
                        </Label>
                        <Input
                          id="firstName"
                          value={userInfo.name.split(' ')[0]}
                          onChange={(e) => setUserInfo({...userInfo, name: `${e.target.value} ${userInfo.name.split(' ')[1]}`})}
                          data-testid="input-first-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm font-medium text-foreground mb-2 block">
                          Last Name
                        </Label>
                        <Input
                          id="lastName"
                          value={userInfo.name.split(' ')[1]}
                          onChange={(e) => setUserInfo({...userInfo, name: `${userInfo.name.split(' ')[0]} ${e.target.value}`})}
                          data-testid="input-last-name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                        data-testid="input-email"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                        data-testid="input-phone"
                      />
                    </div>
                    
                    <Button type="submit" data-testid="button-update-profile">
                      Update Profile
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Style Preferences */}
            {activeTab === "style" && (
              <Card data-testid="style-preferences">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Your Style Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Body Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Body Shape:</span>
                          <span className="text-foreground" data-testid="style-body-shape">
                            {userInfo.profile.bodyShape}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Face Shape:</span>
                          <span className="text-foreground" data-testid="style-face-shape">
                            {userInfo.profile.faceShape}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Complexion:</span>
                          <span className="text-foreground" data-testid="style-complexion">
                            {userInfo.profile.complexion}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Undertone:</span>
                          <span className="text-foreground" data-testid="style-undertone">
                            {userInfo.profile.undertone}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Style Preferences</h4>
                      <div className="flex flex-wrap gap-2" data-testid="style-tags">
                        {userInfo.profile.styleTags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Link href="/onboarding">
                    <Button variant="outline" data-testid="button-update-style-profile">
                      Update Style Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Consultation History */}
            {activeTab === "history" && (
              <Card data-testid="consultation-history">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Recent AI Consultations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentConsultations.map((consultation) => (
                      <div
                        key={consultation.id}
                        className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg"
                        data-testid={`consultation-${consultation.id}`}
                      >
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                          {consultation.fitScore ? (
                            <Camera className="w-6 h-6 text-primary" />
                          ) : (
                            <ShoppingBag className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{consultation.title}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{consultation.description}</p>
                          <div className="flex items-center space-x-4 text-xs">
                            {consultation.fitScore && (
                              <span className="text-green-600">Fit Score: {consultation.fitScore}%</span>
                            )}
                            {consultation.colorMatch && (
                              <span className="text-purple-600">Color Match: {consultation.colorMatch}%</span>
                            )}
                            <span className="text-muted-foreground">{consultation.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {recentConsultations.length === 0 && (
                    <div className="text-center py-8" data-testid="empty-consultations">
                      <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No consultations yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start using our AI assistant to see your consultation history here
                      </p>
                      <Link href="/assistant">
                        <Button data-testid="button-start-consultation">
                          Start AI Consultation
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Data Export */}
            {activeTab === "export" && (
              <Card data-testid="data-export">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Export Your Data
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Download a copy of all your StyleForward data including your profile, consultation history, and preferences.
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-foreground">Profile Information</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-foreground">Style Preferences</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-foreground">Consultation History</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-foreground">Uploaded Images (metadata only)</span>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Data Privacy Note</h4>
                      <p className="text-sm text-muted-foreground">
                        Your exported data will be provided in JSON format and emailed to your registered email address. 
                        This process may take up to 24 hours to complete.
                      </p>
                    </div>
                    
                    <Button onClick={handleExportData} data-testid="button-export-data">
                      <Download className="w-4 h-4 mr-2" />
                      Request Data Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <Card data-testid="privacy-settings">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Data Usage</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-foreground">Profile data is used for personalized recommendations</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-foreground">Images are processed for style analysis only</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-foreground">No facial recognition data is permanently stored</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-foreground">Data is encrypted and securely stored</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Account Actions</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <h5 className="font-medium text-foreground">Delete Uploaded Images</h5>
                            <p className="text-sm text-muted-foreground">Remove all uploaded photos from your account</p>
                          </div>
                          <Button variant="outline" data-testid="button-delete-images">
                            Delete Images
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div>
                            <h5 className="font-medium text-foreground">Clear Consultation History</h5>
                            <p className="text-sm text-muted-foreground">Remove all AI consultation records</p>
                          </div>
                          <Button variant="outline" data-testid="button-clear-history">
                            Clear History
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <div>
                            <h5 className="font-medium text-destructive">Delete Account</h5>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                          </div>
                          <Button variant="destructive" data-testid="button-delete-account">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
