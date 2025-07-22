import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateSlides } from '@/services/api';

const GeneratePage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed previous steps
    const uploadedContent = sessionStorage.getItem('uploadedContent');
    const selectedTemplate = sessionStorage.getItem('selectedTemplate');
    
    if (!uploadedContent || !selectedTemplate) {
      navigate('/upload');
      return;
    }
  }, [navigate]);

  const steps = [
    { label: 'Analyzing content structure', duration: 1000 },
    { label: 'Extracting key themes', duration: 1500 },
    { label: 'Creating slide outlines', duration: 2000 },
    { label: 'Generating content', duration: 1500 },
    { label: 'Applying template design', duration: 1000 },
    { label: 'Finalizing slides', duration: 500 }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const contentId = sessionStorage.getItem('contentId');
      const selectedTemplate = JSON.parse(sessionStorage.getItem('selectedTemplate') || '{}');
      
      // Simulate progress with realistic steps
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i].label);
        
        // Update progress
        const progressIncrement = 100 / steps.length;
        setProgress((i + 1) * progressIncrement);
        
        // Wait for step duration
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      }
      
      // API call to backend - replace with actual endpoint
      const slides = await generateSlides(contentId!, selectedTemplate.id);
      
      // Store generated slides
      sessionStorage.setItem('generatedSlides', JSON.stringify(slides));
      
      toast({
        title: "Slides Generated Successfully",
        description: `Created ${slides.length} slides using ${selectedTemplate.name} template.`,
      });
      
      // Navigate to preview page
      navigate('/preview');
      
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate slides. Please try again.",
        variant: "destructive",
      });
      setProgress(0);
      setCurrentStep('');
    } finally {
      setIsGenerating(false);
    }
  };

  const uploadedContent = sessionStorage.getItem('uploadedContent');
  const selectedTemplate = JSON.parse(sessionStorage.getItem('selectedTemplate') || '{}');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-consulting bg-clip-text text-transparent mb-4">
            Generate Your Slides
          </h1>
          <p className="text-lg text-muted-foreground">
            AI is processing your content and creating professional slides.
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generation Summary</CardTitle>
            <CardDescription>
              Review your selections before generating slides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Content Preview</h4>
                <div className="bg-muted p-3 rounded text-sm">
                  {uploadedContent ? uploadedContent.substring(0, 150) + '...' : 'No content'}
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Selected Template</h4>
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedTemplate.image} 
                    alt={selectedTemplate.name}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{selectedTemplate.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplate.category}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Generation Controls */}
        <Card>
          <CardContent className="pt-6">
            {!isGenerating ? (
              <div className="text-center">
                <div className="mb-6">
                  <Sparkles className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Ready to Generate</h3>
                  <p className="text-muted-foreground">
                    Click below to start the AI-powered slide generation process
                  </p>
                </div>
                <Button 
                  onClick={handleGenerate}
                  size="lg"
                  className="bg-gradient-primary text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Slides
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div>
                  <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
                  <h3 className="text-xl font-semibold mb-2">Generating Your Slides</h3>
                  <p className="text-muted-foreground">{currentStep}</p>
                </div>
                
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(progress)}% complete
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">AI Generation Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">• The AI analyzes your content structure and key themes</p>
            <p className="text-sm">• Slides are optimized for your selected template style</p>
            <p className="text-sm">• You can edit and regenerate individual slides later</p>
            <p className="text-sm">• Speaker notes are automatically generated when relevant</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneratePage;