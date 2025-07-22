import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FileText, 
  Clock, 
  Download,
  MoreHorizontal,
  Presentation,
  Upload,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getProjects, getTemplates } from '@/services/api';

interface Project {
  id: string;
  name: string;
  createdAt: string;
  slideCount: number;
  status: 'draft' | 'completed' | 'exported';
  template: string;
}

const DashboardPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // API calls to backend - replace with actual endpoints
      const [projectsData, templatesData] = await Promise.all([
        getProjects(),
        getTemplates()
      ]);
      
      setProjects(projectsData);
      setTemplates(templatesData);
    } catch (error) {
      toast({
        title: "Failed to Load Dashboard",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewProject = () => {
    // Clear any existing session data
    sessionStorage.clear();
    navigate('/upload');
  };

  const handleOpenProject = (projectId: string) => {
    // TODO: Load project data and navigate to appropriate page
    toast({
      title: "Opening Project",
      description: "Loading project data...",
    });
    // navigate('/preview'); // or appropriate page based on project status
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'exported':
        return <Badge className="bg-blue-100 text-blue-800">Exported</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-consulting bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your presentations and templates
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button onClick={handleNewProject} className="bg-gradient-primary text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Presentation
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Presentation className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{templates.length}</p>
                  <p className="text-sm text-muted-foreground">Templates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Download className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {projects.filter(p => p.status === 'exported').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Exported</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {projects.filter(p => p.status === 'draft').length}
                  </p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Recent Projects</h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          {projects.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="text-center py-12">
                <Presentation className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first AI-powered presentation
                </p>
                <Button onClick={handleNewProject} className="bg-gradient-primary text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Presentation
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="cursor-pointer hover:shadow-elegant transition-shadow"
                  onClick={() => handleOpenProject(project.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">
                          {project.name}
                        </CardTitle>
                        <CardDescription>
                          {formatDate(project.createdAt)}
                        </CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Open project menu
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Slides:</span>
                        <span>{project.slideCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Template:</span>
                        <span className="capitalize">{project.template}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        {getStatusBadge(project.status)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
              <CardContent className="text-center py-8">
                <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Custom Template</h3>
                <p className="text-muted-foreground mb-4">
                  Add your company's branded template for consistent presentations
                </p>
                <Button variant="outline">
                  Upload Template
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
              <CardContent className="text-center py-8">
                <Settings className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Configure AI model preferences and default settings
                </p>
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  Open Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;