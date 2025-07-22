// API service layer for backend integration
// Replace these mock functions with actual HTTP calls to your backend

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api'  // Replace with your production API URL
  : 'http://localhost:3001/api';           // Replace with your development API URL

// Utility function for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // Add authentication headers here when implementing auth
      // 'Authorization': `Bearer ${getAuthToken()}`
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Mock data for development - remove when backend is ready
const mockSlides = [
  {
    id: '1',
    title: 'Executive Summary',
    content: [
      'Key findings from market analysis',
      'Revenue opportunities identified',
      'Strategic recommendations overview',
      'Implementation timeline proposal'
    ],
    speakerNotes: 'Start with the key findings and emphasize the revenue potential. Be prepared to dive deeper into any specific area.',
    slideNumber: 1
  },
  {
    id: '2',
    title: 'Market Analysis',
    content: [
      'Current market size: $2.4B globally',
      'Growth rate: 15% YoY for past 3 years',
      'Key competitors and positioning',
      'Market gaps and opportunities'
    ],
    speakerNotes: 'Highlight the growth trajectory and position our solution within the competitive landscape.',
    slideNumber: 2
  },
  {
    id: '3',
    title: 'Strategic Recommendations',
    content: [
      'Focus on enterprise segment first',
      'Develop partner ecosystem',
      'Invest in AI capabilities',
      'Expand to European markets by Q3'
    ],
    speakerNotes: 'Emphasize the logical progression from enterprise to broader market expansion.',
    slideNumber: 3
  }
];

const mockTemplates = [
  {
    id: 'consulting',
    name: 'Professional Consulting',
    description: 'Clean, professional design perfect for consulting presentations',
    image: '/src/assets/template-consulting.jpg',
    category: 'Business'
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Minimalist design focusing on content clarity',
    image: '/src/assets/template-minimal.jpg',
    category: 'Minimal'
  },
  {
    id: 'infographic',
    name: 'Data Visualization',
    description: 'Perfect for data-heavy presentations with infographic elements',
    image: '/src/assets/template-infographic.jpg',
    category: 'Data'
  }
];

const mockProjects = [
  {
    id: '1',
    name: 'Q4 Strategy Review',
    createdAt: '2024-01-15T10:30:00Z',
    slideCount: 12,
    status: 'completed' as const,
    template: 'consulting'
  },
  {
    id: '2',
    name: 'Market Research Findings',
    createdAt: '2024-01-10T14:20:00Z',
    slideCount: 8,
    status: 'exported' as const,
    template: 'infographic'
  }
];

// Content Upload API
export const uploadContent = async (content: string): Promise<{ contentId: string }> => {
  // TODO: Replace with actual API call
  // return apiCall('/content/upload', {
  //   method: 'POST',
  //   body: JSON.stringify({ content })
  // });

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { contentId: `content_${Date.now()}` };
};

// File Upload API
export const uploadFile = async (file: File): Promise<{ contentId: string; content: string }> => {
  // TODO: Replace with actual API call
  // const formData = new FormData();
  // formData.append('file', file);
  // return apiCall('/content/upload-file', {
  //   method: 'POST',
  //   body: formData,
  //   headers: {} // Remove Content-Type for FormData
  // });

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { 
    contentId: `file_${Date.now()}`, 
    content: 'Extracted file content...' 
  };
};

// Templates API
export const getTemplates = async () => {
  // TODO: Replace with actual API call
  // return apiCall('/templates');

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTemplates;
};

export const selectTemplate = async (contentId: string, templateId: string): Promise<void> => {
  // TODO: Replace with actual API call
  // return apiCall('/content/select-template', {
  //   method: 'POST',
  //   body: JSON.stringify({ contentId, templateId })
  // });

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
};

export const uploadCustomTemplate = async (templateData: FormData): Promise<{ templateId: string }> => {
  // TODO: Replace with actual API call
  // return apiCall('/templates/upload', {
  //   method: 'POST',
  //   body: templateData,
  //   headers: {} // Remove Content-Type for FormData
  // });

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { templateId: `template_${Date.now()}` };
};

// Slide Generation API
export const generateSlides = async (contentId: string, templateId: string) => {
  // TODO: Replace with actual API call
  // return apiCall('/slides/generate', {
  //   method: 'POST',
  //   body: JSON.stringify({ contentId, templateId })
  // });

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 3000));
  return mockSlides;
};

// Slide Editing API
export const updateSlide = async (slideId: string, updates: Partial<any>) => {
  // TODO: Replace with actual API call
  // return apiCall(`/slides/${slideId}`, {
  //   method: 'PATCH',
  //   body: JSON.stringify(updates)
  // });

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 500));
  const slide = mockSlides.find(s => s.id === slideId);
  return { ...slide, ...updates };
};

export const regenerateSlide = async (slideId: string) => {
  // TODO: Replace with actual API call
  // return apiCall(`/slides/${slideId}/regenerate`, {
  //   method: 'POST'
  // });

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 2000));
  const slide = mockSlides.find(s => s.id === slideId);
  return {
    ...slide,
    content: [
      'Regenerated content point 1',
      'Updated analysis and insights',
      'New data-driven recommendations',
      'Enhanced strategic approach'
    ]
  };
};

// Export API
export const exportSlides = async (slides: any[], options: any): Promise<{ downloadUrl: string }> => {
  // TODO: Replace with actual API call
  // return apiCall('/slides/export', {
  //   method: 'POST',
  //   body: JSON.stringify({ slides, options })
  // });

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { downloadUrl: `https://api.example.com/downloads/slides_${Date.now()}.${options.format}` };
};

// Projects API
export const getProjects = async () => {
  // TODO: Replace with actual API call
  // return apiCall('/projects');

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockProjects;
};

export const createProject = async (name: string, contentId: string): Promise<{ projectId: string }> => {
  // TODO: Replace with actual API call
  // return apiCall('/projects', {
  //   method: 'POST',
  //   body: JSON.stringify({ name, contentId })
  // });

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 500));
  return { projectId: `project_${Date.now()}` };
};

export const getProject = async (projectId: string) => {
  // TODO: Replace with actual API call
  // return apiCall(`/projects/${projectId}`);

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockProjects.find(p => p.id === projectId);
};

// Settings API
export const getUserSettings = async () => {
  // TODO: Replace with actual API call
  // return apiCall('/user/settings');

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 400));
  return {
    aiModel: 'gpt-4o',
    defaultTemplate: 'consulting',
    exportQuality: 'high',
    includeSpeakerNotes: true
  };
};

export const updateUserSettings = async (settings: any): Promise<void> => {
  // TODO: Replace with actual API call
  // return apiCall('/user/settings', {
  //   method: 'PATCH',
  //   body: JSON.stringify(settings)
  // });

  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 300));
};