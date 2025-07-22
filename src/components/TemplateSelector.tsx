import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Check } from "lucide-react";
import templateConsulting from "@/assets/template-consulting.jpg";
import templateMinimal from "@/assets/template-minimal.jpg";
import templateInfographic from "@/assets/template-infographic.jpg";

interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
}

interface TemplateSelectorProps {
  onTemplateSelect: (template: Template) => void;
  selectedTemplate?: Template;
}

const templates: Template[] = [
  {
    id: "consulting",
    name: "ZS Consulting",
    description: "Professional consulting template with charts and data visualization",
    image: templateConsulting,
    category: "Corporate"
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Clean, minimal design with plenty of white space",
    image: templateMinimal,
    category: "Minimal"
  },
  {
    id: "infographic",
    name: "Data Infographic",
    description: "Rich infographic template perfect for data-heavy presentations",
    image: templateInfographic,
    category: "Infographic"
  }
];

const TemplateSelector = ({ onTemplateSelect, selectedTemplate }: TemplateSelectorProps) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <Card className="w-full max-w-6xl mx-auto shadow-consulting">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Palette className="h-5 w-5 text-primary" />
          <span>Choose Your Template</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative cursor-pointer transition-all duration-300 ${
                hoveredTemplate === template.id ? 'transform scale-105' : ''
              }`}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              onClick={() => onTemplateSelect(template)}
            >
              <Card className={`overflow-hidden ${
                selectedTemplate?.id === template.id 
                  ? 'ring-2 ring-primary shadow-elegant' 
                  : 'hover:shadow-consulting'
              }`}>
                <div className="relative">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-48 object-cover"
                  />
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">{template.category}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  <Button 
                    variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                  >
                    {selectedTemplate?.id === template.id ? "Selected" : "Select Template"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;