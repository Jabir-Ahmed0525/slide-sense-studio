import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  ChevronRight, 
  Edit, 
  RefreshCw, 
  Download, 
  Eye,
  FileText,
  MessageSquare 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateSlide, regenerateSlide } from '@/services/api';

interface Slide {
  id: string;
  title: string;
  content: string[];
  speakerNotes?: string;
  slideNumber: number;
}

const PreviewPage = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState<string[]>([]);
  const [editedNotes, setEditedNotes] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
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

  const currentSlide = slides[currentSlideIndex];

  const handleEdit = () => {
    if (currentSlide) {
      setEditedTitle(currentSlide.title);
      setEditedContent([...currentSlide.content]);
      setEditedNotes(currentSlide.speakerNotes || '');
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!currentSlide) return;

    try {
      // API call to backend - replace with actual endpoint
      const updatedSlide = await updateSlide(currentSlide.id, {
        title: editedTitle,
        content: editedContent,
        speakerNotes: editedNotes
      });

      // Update local state
      const updatedSlides = slides.map(slide => 
        slide.id === currentSlide.id ? updatedSlide : slide
      );
      setSlides(updatedSlides);
      sessionStorage.setItem('generatedSlides', JSON.stringify(updatedSlides));
      
      setIsEditing(false);
      toast({
        title: "Slide Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRegenerate = async () => {
    if (!currentSlide) return;

    setIsRegenerating(true);
    try {
      // API call to backend - replace with actual endpoint
      const regeneratedSlide = await regenerateSlide(currentSlide.id);
      
      // Update local state
      const updatedSlides = slides.map(slide => 
        slide.id === currentSlide.id ? regeneratedSlide : slide
      );
      setSlides(updatedSlides);
      sessionStorage.setItem('generatedSlides', JSON.stringify(updatedSlides));
      
      toast({
        title: "Slide Regenerated",
        description: "New content has been generated for this slide.",
      });
    } catch (error) {
      toast({
        title: "Regeneration Failed",
        description: "Failed to regenerate slide. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleContentChange = (index: number, value: string) => {
    const newContent = [...editedContent];
    newContent[index] = value;
    setEditedContent(newContent);
  };

  const addContentItem = () => {
    setEditedContent([...editedContent, '']);
  };

  const removeContentItem = (index: number) => {
    const newContent = editedContent.filter((_, i) => i !== index);
    setEditedContent(newContent);
  };

  if (!slides.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading slides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-consulting bg-clip-text text-transparent">
              Preview & Edit
            </h1>
            <p className="text-muted-foreground mt-2">
              Review your generated slides and make any necessary adjustments
            </p>
          </div>
          <Button 
            onClick={() => navigate('/export')}
            className="bg-gradient-primary text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Slides
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Slide Thumbnails */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Slides ({slides.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      index === currentSlideIndex
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => setCurrentSlideIndex(index)}
                  >
                    <div className="text-sm font-medium mb-1">
                      Slide {slide.slideNumber}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2">
                      {slide.title}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Slide View */}
          <div className="lg:col-span-3">
            <Card className="min-h-96">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">
                        Slide {currentSlide.slideNumber} of {slides.length}
                      </Badge>
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="text-2xl font-bold bg-transparent border-b border-muted-foreground focus:border-primary outline-none w-full"
                      />
                    ) : (
                      <h2 className="text-2xl font-bold">{currentSlide.title}</h2>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button size="sm" onClick={handleSaveEdit}>
                          Save
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={handleEdit}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleRegenerate}
                          disabled={isRegenerating}
                        >
                          {isRegenerating ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4 mr-1" />
                          )}
                          Regenerate
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Slide Content */}
                <div className="space-y-4 mb-6">
                  {isEditing ? (
                    <div className="space-y-3">
                      {editedContent.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleContentChange(index, e.target.value)}
                            className="flex-1 p-2 border rounded-md"
                            placeholder="Bullet point..."
                          />
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => removeContentItem(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={addContentItem}
                      >
                        Add Bullet Point
                      </Button>
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {currentSlide.content.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Speaker Notes */}
                {(currentSlide.speakerNotes || isEditing) && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4" />
                      <span className="font-medium">Speaker Notes</span>
                    </div>
                    {isEditing ? (
                      <Textarea
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        placeholder="Add speaker notes..."
                        className="min-h-20"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                        {currentSlide.speakerNotes}
                      </p>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                    disabled={currentSlideIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentSlideIndex + 1} / {slides.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                    disabled={currentSlideIndex === slides.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;