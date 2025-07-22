import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  FileText, 
  Globe, 
  Presentation,
  CheckCircle,
  ArrowLeft,
  Settings,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportSlides } from '@/services/api';

interface ExportOptions {
  format: 'pptx' | 'pdf' | 'html';
  includeSpeakerNotes: boolean;
  includeDesignAssets: boolean;
  quality: 'standard' | 'high' | 'premium';
  theme: string;
}

const ExportPage = () => {
  const [slides, setSlides] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pptx',
    includeSpeakerNotes: true,
    includeDesignAssets: true,
    quality: 'high',
    theme: 'default'
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if slides exist
    const generatedSlides = sessionStorage.getItem('generatedSlides');
    if (!generatedSlides) {
      navigate('/upload');
      return;
    }
    
    const slidesData = JSON.parse(generatedSlides);
    setSlides(slidesData);
  }, [navigate]);

  const formatOptions = [
    {
      id: 'pptx',
      name: 'PowerPoint',
      description: 'Editable .pptx file compatible with Microsoft PowerPoint',
      icon: Presentation,
      recommended: true
    },
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Static PDF perfect for sharing and printing',
      icon: FileText,
      recommended: false
    },
    {
      id: 'html',
      name: 'Interactive Web',
      description: 'HTML presentation that can be viewed in any browser',
      icon: Globe,
      recommended: false
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // API call to backend - replace with actual endpoint
      const exportResult = await exportSlides(slides, exportOptions);
      
      // Simulate file download
      // In production, this would be a real file download
      const blob = new Blob(['Export data'], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `slides.${exportOptions.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: `Your slides have been exported as ${exportOptions.format.toUpperCase()}.`,
      });
      
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export slides. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const updateExportOptions = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/preview')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Preview
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-consulting bg-clip-text text-transparent">
              Export Your Slides
            </h1>
            <p className="text-muted-foreground mt-2">
              Choose your export format and customize the output settings
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Export Options */}
          <div className="lg:col-span-2 space-y-6">
            {/* Format Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Export Format</CardTitle>
                <CardDescription>
                  Choose the format that best suits your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formatOptions.map((format) => (
                  <div
                    key={format.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      exportOptions.format === format.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => updateExportOptions('format', format.id)}
                  >
                    <div className="flex items-start gap-3">
                      <format.icon className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{format.name}</span>
                          {format.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {format.description}
                        </p>
                      </div>
                      {exportOptions.format === format.id && (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Export Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Export Settings
                </CardTitle>
                <CardDescription>
                  Customize your export options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Include Speaker Notes */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="speaker-notes" className="font-medium">
                      Include Speaker Notes
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Add speaker notes to your exported slides
                    </p>
                  </div>
                  <Switch
                    id="speaker-notes"
                    checked={exportOptions.includeSpeakerNotes}
                    onCheckedChange={(checked) => 
                      updateExportOptions('includeSpeakerNotes', checked)
                    }
                  />
                </div>

                {/* Include Design Assets */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="design-assets" className="font-medium">
                      Include Design Assets
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Bundle template assets with the export
                    </p>
                  </div>
                  <Switch
                    id="design-assets"
                    checked={exportOptions.includeDesignAssets}
                    onCheckedChange={(checked) => 
                      updateExportOptions('includeDesignAssets', checked)
                    }
                  />
                </div>

                {/* Quality Settings */}
                <div className="space-y-2">
                  <Label className="font-medium">Export Quality</Label>
                  <Select 
                    value={exportOptions.quality} 
                    onValueChange={(value) => updateExportOptions('quality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard (Faster)</SelectItem>
                      <SelectItem value="high">High (Recommended)</SelectItem>
                      <SelectItem value="premium">Premium (Best Quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Summary & Action */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Export Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Slides:</span>
                    <span>{slides.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Format:</span>
                    <span className="capitalize">{exportOptions.format}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quality:</span>
                    <span className="capitalize">{exportOptions.quality}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Speaker Notes:</span>
                    <span>{exportOptions.includeSpeakerNotes ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full bg-gradient-primary text-white"
                    size="lg"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export Slides
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Export typically takes 10-30 seconds</p>
                  <p>• Large presentations may take longer</p>
                  <p>• You'll be notified when ready for download</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Exports */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Exports</CardTitle>
            <CardDescription>
              Your recently exported presentations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent exports. Export your first presentation above.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExportPage;