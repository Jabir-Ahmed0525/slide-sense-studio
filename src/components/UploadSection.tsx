import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadSectionProps {
  onContentSubmit: (content: string) => void;
}

const UploadSection = ({ onContentSubmit }: UploadSectionProps) => {
  const [textContent, setTextContent] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const textFile = files.find(file => 
      file.type === 'text/plain' || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.md')
    );

    if (textFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTextContent(content);
        toast({
          title: "File uploaded successfully",
          description: `Loaded ${textFile.name}`,
        });
      };
      reader.readAsText(textFile);
    } else {
      toast({
        title: "Unsupported file type",
        description: "Please upload a .txt or .md file",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setTextContent(content);
      toast({
        title: "File uploaded successfully",
        description: `Loaded ${file.name}`,
      });
    };
    reader.readAsText(file);
  };

  const handleSubmit = () => {
    if (textContent.trim()) {
      onContentSubmit(textContent);
    } else {
      toast({
        title: "No content to process",
        description: "Please enter text or upload a file",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-consulting">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-primary" />
          <span>Upload Your Content</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={() => setIsDragging(true)}
          onDragLeave={() => setIsDragging(false)}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
          <p className="text-sm text-muted-foreground mb-4">
            Supports .txt, .md files with meeting notes, briefs, or outlines
          </p>
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Text Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Or paste your text directly:</label>
          <Textarea
            placeholder="Paste your meeting notes, email threads, or presentation outline here..."
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            className="min-h-[200px] resize-none"
          />
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleSubmit}
            size="lg"
            className="px-8"
            disabled={!textContent.trim()}
          >
            <Zap className="h-4 w-4 mr-2" />
            Generate Slides with AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadSection;