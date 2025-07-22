import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Edit3, 
  RotateCcw, 
  Download, 
  FileText, 
  Presentation,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Slide {
  id: string;
  title: string;
  content: string[];
  speakerNotes?: string;
  slideNumber: number;
}

interface SlidePreviewProps {
  slides: Slide[];
  templateName: string;
  onEditSlide: (slideId: string) => void;
  onRegenerateSlide: (slideId: string) => void;
  onExport: (format: string) => void;
}

const SlidePreview = ({ 
  slides, 
  templateName, 
  onEditSlide, 
  onRegenerateSlide, 
  onExport 
}: SlidePreviewProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) {
    return (
      <Card className="w-full max-w-6xl mx-auto shadow-consulting">
        <CardContent className="p-12 text-center">
          <Presentation className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">
            Your generated slides will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Controls Header */}
      <Card className="shadow-consulting">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <CardTitle className="flex items-center space-x-2">
                <Presentation className="h-5 w-5 text-primary" />
                <span>Generated Slides</span>
              </CardTitle>
              <Badge variant="outline">{templateName}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                <Play className="h-4 w-4 mr-2" />
                {isPlaying ? "Stop" : "Preview"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExport("pptx")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Slide Display */}
      <Card className="shadow-consulting">
        <CardContent className="p-0">
          <div className="relative">
            {/* Slide Navigation */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={slides.length <= 1}
                className="rounded-full w-10 h-10 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={slides.length <= 1}
                className="rounded-full w-10 h-10 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Slide Content */}
            <div className="bg-white aspect-[16/9] p-12 border rounded-lg">
              <div className="h-full flex flex-col">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-consulting-dark mb-4">
                    {currentSlideData.title}
                  </h1>
                  <div className="w-20 h-1 bg-primary rounded"></div>
                </div>
                
                <div className="flex-1 space-y-4">
                  {currentSlideData.content.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-lg text-consulting-dark leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-end mt-8">
                  <div className="text-sm text-consulting-medium">
                    Slide {currentSlideData.slideNumber} of {slides.length}
                  </div>
                  <div className="text-sm text-consulting-medium">
                    Generated by SlideSense AI
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slide Actions */}
      <Card className="shadow-consulting">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">
                Slide {currentSlideData.slideNumber}: {currentSlideData.title}
              </span>
              {currentSlideData.speakerNotes && (
                <Badge variant="outline">
                  <FileText className="h-3 w-3 mr-1" />
                  Notes
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditSlide(currentSlideData.id)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRegenerateSlide(currentSlideData.id)}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Regenerate
              </Button>
            </div>
          </div>
          
          {currentSlideData.speakerNotes && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Speaker Notes:</strong> {currentSlideData.speakerNotes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Slide Thumbnails */}
      <Card className="shadow-consulting">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`flex-shrink-0 cursor-pointer transition-all ${
                  index === currentSlide 
                    ? 'ring-2 ring-primary scale-105' 
                    : 'hover:scale-105'
                }`}
                onClick={() => setCurrentSlide(index)}
              >
                <div className="w-32 h-20 bg-white border rounded-lg p-2 shadow-sm">
                  <div className="text-xs font-medium truncate mb-1">
                    {slide.title}
                  </div>
                  <div className="space-y-1">
                    {slide.content.slice(0, 3).map((_, i) => (
                      <div key={i} className="w-full h-1 bg-muted rounded"></div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {slide.slideNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlidePreview;