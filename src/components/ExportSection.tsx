import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  Presentation, 
  Globe,
  Settings,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportSectionProps {
  slideCount: number;
  templateName: string;
  onExport: (format: string, options?: any) => void;
}

const ExportSection = ({ slideCount, templateName, onExport }: ExportSectionProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string>("");
  const { toast } = useToast();

  const exportOptions = [
    {
      id: "pptx",
      name: "PowerPoint",
      description: "Export as .pptx file for editing in PowerPoint",
      icon: Presentation,
      format: "PPTX",
      recommended: true
    },
    {
      id: "pdf",
      name: "PDF Document",
      description: "Export as PDF for sharing and printing",
      icon: FileText,
      format: "PDF",
      recommended: false
    },
    {
      id: "html",
      name: "Live Deck",
      description: "Export as interactive HTML presentation",
      icon: Globe,
      format: "HTML",
      recommended: false
    }
  ];

  const handleExport = async (format: string) => {
    setIsExporting(true);
    setExportFormat(format);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onExport(format, {
        includeNotes: true,
        template: templateName,
        slideCount: slideCount
      });
      
      toast({
        title: "Export completed",
        description: `Your ${format.toUpperCase()} presentation has been generated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "There was an error exporting your presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setExportFormat("");
    }
  };

  if (slideCount === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto shadow-consulting opacity-50">
        <CardContent className="p-8 text-center">
          <Download className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            Generate slides first to enable export options
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-consulting">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Download className="h-5 w-5 text-primary" />
          <span>Export Your Presentation</span>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>{slideCount} slides</span>
          <span>•</span>
          <span>{templateName} template</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          {exportOptions.map((option) => (
            <Card 
              key={option.id} 
              className={`cursor-pointer transition-all hover:shadow-consulting ${
                exportFormat === option.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleExport(option.id)}
            >
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <option.icon className="h-12 w-12 mx-auto text-primary" />
                  {option.recommended && (
                    <Badge 
                      variant="default" 
                      className="absolute -top-2 -right-2 text-xs"
                    >
                      Recommended
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold mb-2">{option.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {option.description}
                </p>
                <Button
                  variant={option.recommended ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  disabled={isExporting}
                >
                  {isExporting && exportFormat === option.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export {option.format}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Export Options */}
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Settings className="h-4 w-4 text-primary" />
              <span className="font-medium">Export Options</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Include speaker notes</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Maintain template styling</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Preserve animations</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Include metadata</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default ExportSection;