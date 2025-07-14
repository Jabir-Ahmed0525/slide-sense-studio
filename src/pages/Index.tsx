import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Palette, Edit3, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import Header from "@/components/Header";
import UploadSection from "@/components/UploadSection";
import TemplateSelector from "@/components/TemplateSelector";
import SlidePreview from "@/components/SlidePreview";
import ExportSection from "@/components/ExportSection";

import heroImage from "@/assets/hero-image.jpg";

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
}

interface Slide {
  id: string;
  title: string;
  content: string[];
  speakerNotes?: string;
  slideNumber: number;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<"upload" | "template" | "generate" | "preview">("upload");
  const [uploadedContent, setUploadedContent] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>();
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleContentSubmit = (content: string) => {
    setUploadedContent(content);
    setCurrentStep("template");
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentStep("generate");
  };

  const generateSlides = async () => {
    if (!uploadedContent || !selectedTemplate) return;

    setIsGenerating(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated slides
      const mockSlides: Slide[] = [
        {
          id: "slide-1",
          title: "Executive Summary",
          content: [
            "Key insights from analysis of uploaded content",
            "Strategic recommendations for implementation",
            "Expected outcomes and success metrics",
            "Timeline for execution and milestones"
          ],
          speakerNotes: "Start with the most important findings and build credibility early",
          slideNumber: 1
        },
        {
          id: "slide-2",
          title: "Market Analysis",
          content: [
            "Current market landscape and trends",
            "Competitive positioning and opportunities",
            "Customer segmentation and behavior patterns",
            "Growth projections and market sizing"
          ],
          speakerNotes: "Focus on data-driven insights and visualizations",
          slideNumber: 2
        },
        {
          id: "slide-3",
          title: "Strategic Recommendations",
          content: [
            "Primary strategic initiatives for immediate action",
            "Resource allocation and investment priorities",
            "Risk mitigation strategies and contingency plans",
            "Performance indicators and success metrics"
          ],
          speakerNotes: "Emphasize actionable recommendations with clear ownership",
          slideNumber: 3
        },
        {
          id: "slide-4",
          title: "Implementation Roadmap",
          content: [
            "Phase 1: Foundation and quick wins (0-3 months)",
            "Phase 2: Core implementation (3-9 months)",
            "Phase 3: Optimization and scaling (9-18 months)",
            "Ongoing monitoring and adjustment processes"
          ],
          speakerNotes: "Break down complex implementations into manageable phases",
          slideNumber: 4
        }
      ];

      setGeneratedSlides(mockSlides);
      setCurrentStep("preview");
      
      toast({
        title: "Slides generated successfully",
        description: `Created ${mockSlides.length} slides using ${selectedTemplate.name} template`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "There was an error generating your slides. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditSlide = (slideId: string) => {
    toast({
      title: "Edit mode",
      description: "Slide editing functionality would open here",
    });
  };

  const handleRegenerateSlide = (slideId: string) => {
    toast({
      title: "Regenerating slide",
      description: "AI is regenerating this slide with new content",
    });
  };

  const handleExport = (format: string, options?: any) => {
    toast({
      title: "Export started",
      description: `Preparing your ${format.toUpperCase()} file for download`,
    });
  };

  const steps = [
    { id: "upload", label: "Upload Content", icon: Zap, completed: currentStep !== "upload" },
    { id: "template", label: "Choose Template", icon: Palette, completed: ["generate", "preview"].includes(currentStep) },
    { id: "generate", label: "Generate Slides", icon: Edit3, completed: currentStep === "preview" },
    { id: "preview", label: "Preview & Export", icon: Download, completed: false }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge variant="outline" className="w-fit">
                  AI-Powered Slide Generation
                </Badge>
                <h1 className="text-5xl font-bold bg-gradient-consulting bg-clip-text text-transparent">
                  Transform Notes into Professional Slides
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Upload your meeting notes, briefs, or outlines and let our AI generate beautiful, 
                  consulting-quality slide decks in minutes.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button size="lg" onClick={() => setCurrentStep("upload")}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  View Demo
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="SlideSense AI Interface" 
                className="rounded-lg shadow-elegant w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  currentStep === step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : step.completed 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  <step.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 mx-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12">
          {currentStep === "upload" && (
            <UploadSection onContentSubmit={handleContentSubmit} />
          )}

          {currentStep === "template" && (
            <TemplateSelector 
              onTemplateSelect={handleTemplateSelect}
              selectedTemplate={selectedTemplate}
            />
          )}

          {currentStep === "generate" && (
            <Card className="w-full max-w-4xl mx-auto shadow-consulting">
              <CardContent className="p-12 text-center">
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold">Ready to Generate Your Slides</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your content is uploaded and template selected. Click generate to create your professional slide deck.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button 
                      size="lg" 
                      onClick={generateSlides}
                      disabled={isGenerating}
                      className="px-8"
                    >
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          Generating Slides...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Generate Slides with AI
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setCurrentStep("template")}
                    >
                      Back to Templates
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "preview" && (
            <div className="space-y-12">
              <SlidePreview 
                slides={generatedSlides}
                templateName={selectedTemplate?.name || "Default"}
                onEditSlide={handleEditSlide}
                onRegenerateSlide={handleRegenerateSlide}
                onExport={handleExport}
              />
              <ExportSection 
                slideCount={generatedSlides.length}
                templateName={selectedTemplate?.name || "Default"}
                onExport={handleExport}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
