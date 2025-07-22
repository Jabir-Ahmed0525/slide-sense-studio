import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, ArrowRight, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getTemplates, selectTemplate } from '@/services/api';

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
}

const TemplatesPage = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has uploaded content
    const uploadedContent = sessionStorage.getItem('uploadedContent');
    if (!uploadedContent) {
      navigate('/upload');
      return;
    }

    loadTemplates();
  }, [navigate]);

  const loadTemplates = async () => {
    try {
      // API call to backend - replace with actual endpoint
      const templatesData = await getTemplates();
      setTemplates(templatesData);
    } catch (error) {
      toast({
        title: "Failed to Load Templates",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = async (template: Template) => {
    try {
      const contentId = sessionStorage.getItem('contentId');
      
      // API call to backend - replace with actual endpoint
      await selectTemplate(contentId!, template.id);
      
      setSelectedTemplate(template);
      sessionStorage.setItem('selectedTemplate', JSON.stringify(template));
      
      toast({
        title: "Template Selected",
        description: `${template.name} template has been applied.`,
      });
    } catch (error) {
      toast({
        title: "Selection Failed",
        description: "Failed to select template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      navigate('/generate');
    }
  };

  const handleUploadCustomTemplate = () => {
    // TODO: Implement custom template upload
    // This would navigate to a template upload page or open a modal
    toast({
      title: "Coming Soon",
      description: "Custom template upload will be available soon.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted"></div>
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-consulting bg-clip-text text-transparent mb-4">
            Choose Your Template
          </h1>
          <p className="text-lg text-muted-foreground">
            Select a professional template that matches your presentation style and audience.
          </p>
        </div>

        {/* Custom Template Upload */}
        <Card className="mb-8 border-dashed border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Custom Template
                </CardTitle>
                <CardDescription>
                  Upload your company's branded template or slide master
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleUploadCustomTemplate}>
                Upload Template
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Template Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-elegant ${
                selectedTemplate?.id === template.id
                  ? 'ring-2 ring-primary shadow-elegant'
                  : 'hover:ring-1 hover:ring-primary/50'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="relative">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm"
                >
                  {template.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        {selectedTemplate && (
          <div className="text-center">
            <Button 
              onClick={handleContinue}
              size="lg"
              className="bg-gradient-primary text-white"
            >
              Generate Slides with {selectedTemplate.name}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;