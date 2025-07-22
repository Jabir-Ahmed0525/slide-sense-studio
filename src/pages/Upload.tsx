import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadContent } from '@/services/api';

const UploadPage = () => {
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleContentSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some content to process.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // API call to backend - replace with actual endpoint
      const result = await uploadContent(content);
      
      toast({
        title: "Content Uploaded",
        description: "Your content has been processed successfully.",
      });
      
      // Store content in sessionStorage for demo purposes
      // In production, this would be handled by backend state management
      sessionStorage.setItem('uploadedContent', content);
      sessionStorage.setItem('contentId', result.contentId);
      
      navigate('/templates');
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to process your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement file upload to backend
      // This would typically send the file to /api/upload/file
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-consulting bg-clip-text text-transparent mb-4">
            Upload Your Content
          </h1>
          <p className="text-lg text-muted-foreground">
            Start by uploading your meeting notes, briefs, or any text content that needs to be transformed into slides.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* File Upload */}
          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload File
              </CardTitle>
              <CardDescription>
                Upload a text file (.txt, .docx) containing your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".txt,.docx,.doc"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload file
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Text Input */}
          <Card>
            <CardHeader>
              <CardTitle>Or Paste Content</CardTitle>
              <CardDescription>
                Directly paste your text content here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your meeting notes, briefs, or any content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32 resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview and Submit */}
        {content && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Content Preview</CardTitle>
              <CardDescription>
                Review your content before processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="text-sm whitespace-pre-wrap line-clamp-6">
                  {content}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {content.length} characters
                </span>
                <Button 
                  onClick={handleContentSubmit}
                  disabled={isUploading}
                  className="bg-gradient-primary text-white"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Templates
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UploadPage;