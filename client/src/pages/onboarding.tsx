import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/image-upload";
import { profileApi, imagesApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    bodyShape: "",
    faceShape: "",
    complexion: "",
    undertone: "",
    hairColor: "",
    styleTags: [] as string[],
    comfortNotes: ""
  });

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const createProfileMutation = useMutation({
    mutationFn: (data: any) => profileApi.create(data),
    onSuccess: () => {
      toast({
        title: "Profile Created!",
        description: "Your style profile has been created successfully.",
      });
      setLocation("/assistant");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStyleTagChange = (tag: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      styleTags: checked 
        ? [...prev.styleTags, tag]
        : prev.styleTags.filter(t => t !== tag)
    }));
  };

  const handleImageUpload = (file: File) => {
    setUploadedImages(prev => [...prev, file]);
    toast({
      title: "Image Uploaded",
      description: "Reference outfit image added successfully.",
    });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Create profile
      const profileData = {
        userId: "temp-user-id", // In real app, get from auth context
        ...formData
      };
      
      await createProfileMutation.mutateAsync(profileData);

      // Upload images
      for (const file of uploadedImages) {
        await imagesApi.upload(file, "temp-user-id", "reference");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
    }
  };

  const progressPercentage = (step / totalSteps) * 100;

  const styleOptions = [
    "Minimalist", "Traditional", "Streetwear", "Formal", 
    "Bohemian", "Modest", "Feminine", "Edgy"
  ];

  return (
    <div className="min-h-screen hero-gradient py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Create Your Style Profile
              </h2>
              <p className="text-muted-foreground text-lg">
                Help us understand your unique style preferences and body type
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Step {step} of {totalSteps}</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" data-testid="progress-bar" />
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6" data-testid="step-1">
                <h3 className="text-xl font-semibold mb-4">Tell us about yourself</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="bodyShape" className="text-sm font-medium text-foreground mb-2 block">
                      Body Shape
                    </Label>
                    <Select value={formData.bodyShape} onValueChange={(value) => handleInputChange('bodyShape', value)}>
                      <SelectTrigger data-testid="select-body-shape">
                        <SelectValue placeholder="Select body shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="pear">Pear</SelectItem>
                        <SelectItem value="hourglass">Hourglass</SelectItem>
                        <SelectItem value="rectangle">Rectangle</SelectItem>
                        <SelectItem value="inverted-triangle">Inverted Triangle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="faceShape" className="text-sm font-medium text-foreground mb-2 block">
                      Face Shape
                    </Label>
                    <Select value={formData.faceShape} onValueChange={(value) => handleInputChange('faceShape', value)}>
                      <SelectTrigger data-testid="select-face-shape">
                        <SelectValue placeholder="Select face shape" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oval">Oval</SelectItem>
                        <SelectItem value="round">Round</SelectItem>
                        <SelectItem value="square">Square</SelectItem>
                        <SelectItem value="heart">Heart</SelectItem>
                        <SelectItem value="diamond">Diamond</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="complexion" className="text-sm font-medium text-foreground mb-2 block">
                      Complexion
                    </Label>
                    <Select value={formData.complexion} onValueChange={(value) => handleInputChange('complexion', value)}>
                      <SelectTrigger data-testid="select-complexion">
                        <SelectValue placeholder="Select complexion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="olive">Olive</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="deep">Deep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="undertone" className="text-sm font-medium text-foreground mb-2 block">
                      Undertone
                    </Label>
                    <Select value={formData.undertone} onValueChange={(value) => handleInputChange('undertone', value)}>
                      <SelectTrigger data-testid="select-undertone">
                        <SelectValue placeholder="Select undertone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warm">Warm</SelectItem>
                        <SelectItem value="cool">Cool</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-foreground mb-2 block">
                    Style Preferences
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {styleOptions.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag}
                          checked={formData.styleTags.includes(tag)}
                          onCheckedChange={(checked) => handleStyleTagChange(tag, checked as boolean)}
                          data-testid={`checkbox-${tag.toLowerCase()}`}
                        />
                        <Label htmlFor={tag} className="text-sm cursor-pointer">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Upload Reference Images */}
            {step === 2 && (
              <div className="space-y-6" data-testid="step-2">
                <h3 className="text-xl font-semibold mb-4">Upload Reference Outfits</h3>
                <p className="text-muted-foreground mb-6">
                  Share 5-7 photos of outfits that made you feel confident and stylish
                </p>
                
                <ImageUpload
                  onImageUpload={handleImageUpload}
                  maxImages={7}
                  className="mb-6"
                />
                
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">
                    <i className="fas fa-info-circle mr-2"></i>
                    Upload clear, well-lit photos showing full outfits
                  </p>
                  <p>
                    <i className="fas fa-shield-alt mr-2"></i>
                    Your photos are processed securely and used only for style analysis
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {step === 3 && (
              <div className="space-y-6" data-testid="step-3">
                <h3 className="text-xl font-semibold mb-4">Review Your Profile</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Body Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Body Shape:</span>
                        <span className="text-foreground capitalize" data-testid="review-body-shape">
                          {formData.bodyShape || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Face Shape:</span>
                        <span className="text-foreground capitalize" data-testid="review-face-shape">
                          {formData.faceShape || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Complexion:</span>
                        <span className="text-foreground capitalize" data-testid="review-complexion">
                          {formData.complexion || "Not selected"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Undertone:</span>
                        <span className="text-foreground capitalize" data-testid="review-undertone">
                          {formData.undertone || "Not selected"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Style Preferences</h4>
                    <div className="flex flex-wrap gap-2" data-testid="review-style-tags">
                      {formData.styleTags.length > 0 ? (
                        formData.styleTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">No preferences selected</span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Reference Images</h4>
                  <p className="text-sm text-muted-foreground" data-testid="review-images-count">
                    {uploadedImages.length} images uploaded
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <div>
                {step > 1 ? (
                  <Button variant="outline" onClick={handleBack} data-testid="button-back">
                    Back
                  </Button>
                ) : (
                  <Link href="/">
                    <Button variant="outline" data-testid="button-home">
                      Back to Home
                    </Button>
                  </Link>
                )}
              </div>
              <div>
                {step < totalSteps ? (
                  <Button onClick={handleNext} data-testid="button-next">
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={createProfileMutation.isPending}
                    data-testid="button-complete-profile"
                  >
                    {createProfileMutation.isPending ? "Creating Profile..." : "Complete Profile"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
