import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Save,
  Download,
  Share2,
  Settings,
  Undo,
  Redo,
  Grid3X3,
  Layers,
  Box,
  Eye,
  Package,
  Palette,
  DollarSign,
  FileText,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Camera,
  Video,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Move,
  X
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

// Import custom components
import DesignerCanvas from '../../components/designer/DesignerCanvas';
import Designer2DCanvas from '../../components/designer/Designer2DCanvas';
import AIChat from '../../components/ai/AIChat';
import CollaborationPanel from '../../components/collaboration/CollaborationPanel';
import { useAuth } from '../../contexts/AuthContext';

interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  data: any;
  settings: {
    units: 'metric' | 'imperial';
    gridSize: number;
    snapToGrid: boolean;
    autoSave: boolean;
  };
  collaborators: any[];
  createdAt: string;
  updatedAt: string;
}

interface DesignElement {
  id: string;
  type: 'cabinet' | 'appliance' | 'countertop' | 'sink' | 'other';
  name: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  material?: string;
  color?: string;
  price?: number;
  metadata?: any;
}

const DesignerPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');
  const [selectedTool, setSelectedTool] = useState<'select' | 'move' | 'rotate' | 'scale'>('select');
  const [selectedElement, setSelectedElement] = useState<DesignElement | null>(null);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [designElements, setDesignElements] = useState<DesignElement[]>([]);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Fetch project data
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await axios.get(`/projects/${projectId}`);
      return response.data as Project;
    },
    enabled: !!projectId
  });

  // Auto-save mutation
  const autoSaveMutation = useMutation({
    mutationFn: async (data: any) => {
      await axios.put(`/projects/${projectId}`, data);
    },
    onSuccess: () => {
      console.log('Project auto-saved');
    }
  });

  // Cabinet library
  const cabinetLibrary = [
    {
      category: 'Base Cabinets',
      items: [
        { id: 'base-600', name: 'Base Cabinet 600mm', width: 600, height: 850, depth: 600, price: 299 },
        { id: 'base-800', name: 'Base Cabinet 800mm', width: 800, height: 850, depth: 600, price: 349 },
        { id: 'base-corner', name: 'Corner Base Cabinet', width: 900, height: 850, depth: 900, price: 449 },
        { id: 'base-drawer', name: 'Base Drawer Unit', width: 600, height: 850, depth: 600, price: 399 },
      ]
    },
    {
      category: 'Wall Cabinets',
      items: [
        { id: 'wall-600', name: 'Wall Cabinet 600mm', width: 600, height: 700, depth: 350, price: 199 },
        { id: 'wall-800', name: 'Wall Cabinet 800mm', width: 800, height: 700, depth: 350, price: 249 },
        { id: 'wall-corner', name: 'Corner Wall Cabinet', width: 600, height: 700, depth: 600, price: 299 },
        { id: 'wall-glass', name: 'Glass Door Cabinet', width: 600, height: 700, depth: 350, price: 349 },
      ]
    },
    {
      category: 'Tall Units',
      items: [
        { id: 'tall-pantry', name: 'Pantry Unit', width: 600, height: 2100, depth: 600, price: 599 },
        { id: 'tall-oven', name: 'Oven Housing', width: 600, height: 2100, depth: 600, price: 499 },
        { id: 'tall-fridge', name: 'Fridge Housing', width: 700, height: 2100, depth: 650, price: 549 },
      ]
    }
  ];

  // Appliance library
  const applianceLibrary = [
    {
      category: 'Cooking',
      items: [
        { id: 'hob-gas', name: 'Gas Hob', width: 600, depth: 510, price: 399 },
        { id: 'hob-induction', name: 'Induction Hob', width: 600, depth: 510, price: 599 },
        { id: 'oven-single', name: 'Single Oven', width: 595, height: 595, depth: 550, price: 499 },
        { id: 'oven-double', name: 'Double Oven', width: 595, height: 888, depth: 550, price: 799 },
      ]
    },
    {
      category: 'Refrigeration',
      items: [
        { id: 'fridge-integrated', name: 'Integrated Fridge', width: 595, height: 1770, depth: 550, price: 899 },
        { id: 'fridge-american', name: 'American Fridge', width: 910, height: 1790, depth: 745, price: 1499 },
      ]
    },
    {
      category: 'Cleaning',
      items: [
        { id: 'dishwasher', name: 'Dishwasher', width: 598, height: 815, depth: 550, price: 449 },
        { id: 'sink-single', name: 'Single Bowl Sink', width: 860, depth: 500, price: 299 },
        { id: 'sink-double', name: 'Double Bowl Sink', width: 1160, depth: 500, price: 399 },
      ]
    }
  ];

  // Material options
  const materials = [
    { id: 'oak', name: 'Oak', type: 'wood', price: 50 },
    { id: 'walnut', name: 'Walnut', type: 'wood', price: 80 },
    { id: 'white-gloss', name: 'White Gloss', type: 'laminate', price: 30 },
    { id: 'grey-matt', name: 'Grey Matt', type: 'laminate', price: 35 },
    { id: 'marble', name: 'Marble', type: 'stone', price: 150 },
    { id: 'granite', name: 'Granite', type: 'stone', price: 120 },
    { id: 'quartz', name: 'Quartz', type: 'engineered', price: 100 },
  ];

  // Auto-save effect
  useEffect(() => {
    if (!project?.settings?.autoSave) return;

    const saveTimer = setInterval(() => {
      autoSaveMutation.mutate({
        designElements,
        updatedAt: new Date().toISOString()
      });
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveTimer);
  }, [designElements, project]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            saveProject();
            break;
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'c':
            e.preventDefault();
            copyElement();
            break;
          case 'v':
            e.preventDefault();
            pasteElement();
            break;
          case 'd':
            e.preventDefault();
            duplicateElement();
            break;
        }
      } else {
        switch (e.key) {
          case 'Delete':
            deleteElement();
            break;
          case 'Escape':
            setSelectedElement(null);
            setSelectedTool('select');
            break;
          case '1':
            setViewMode('3d');
            break;
          case '2':
            setViewMode('2d');
            break;
          case 'q':
            setSelectedTool('select');
            break;
          case 'w':
            setSelectedTool('move');
            break;
          case 'e':
            setSelectedTool('rotate');
            break;
          case 'r':
            setSelectedTool('scale');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElement]);

  // Project actions
  const saveProject = async () => {
    try {
      await axios.put(`/projects/${projectId}`, {
        designElements,
        updatedAt: new Date().toISOString()
      });
      toast.success('Project saved successfully!');
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const exportProject = () => {
    // Implement export functionality
    toast.success('Exporting project...');
  };

  const shareProject = () => {
    setShowCollaboration(true);
  };

  // Element actions
  const addElement = (element: any, category: string) => {
    const newElement: DesignElement = {
      id: `${element.id}-${Date.now()}`,
      type: category as any,
      name: element.name,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      price: element.price,
      metadata: element
    };

    setDesignElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
    
    // Add to undo stack
    setUndoStack(prev => [...prev, { action: 'add', element: newElement }]);
    setRedoStack([]);
  };

  const updateElement = (elementId: string, updates: Partial<DesignElement>) => {
    setDesignElements(prev => prev.map(el => 
      el.id === elementId ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = () => {
    if (!selectedElement) return;

    setDesignElements(prev => prev.filter(el => el.id !== selectedElement.id));
    setUndoStack(prev => [...prev, { action: 'delete', element: selectedElement }]);
    setRedoStack([]);
    setSelectedElement(null);
  };

  const copyElement = () => {
    if (!selectedElement) return;
    localStorage.setItem('copiedElement', JSON.stringify(selectedElement));
    toast.success('Element copied');
  };

  const pasteElement = () => {
    const copied = localStorage.getItem('copiedElement');
    if (!copied) return;

    const element = JSON.parse(copied);
    const newElement: DesignElement = {
      ...element,
      id: `${element.id}-copy-${Date.now()}`,
      position: {
        x: element.position.x + 100,
        y: element.position.y,
        z: element.position.z + 100
      }
    };

    addElement(newElement, newElement.type);
  };

  const duplicateElement = () => {
    if (!selectedElement) return;

    const newElement: DesignElement = {
      ...selectedElement,
      id: `${selectedElement.id}-dup-${Date.now()}`,
      position: {
        x: selectedElement.position.x + 100,
        y: selectedElement.position.y,
        z: selectedElement.position.z + 100
      }
    };

    addElement(newElement, newElement.type);
  };

  // Undo/Redo
  const undo = () => {
    if (undoStack.length === 0) return;

    const lastAction = undoStack[undoStack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, lastAction]);

    // Implement undo logic based on action type
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const lastAction = redoStack[redoStack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, lastAction]);

    // Implement redo logic based on action type
  };

  // Calculate total cost
  const calculateTotalCost = () => {
    return designElements.reduce((total, element) => total + (element.price || 0), 0);
  };

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header Toolbar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/app/projects')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{project?.name}</h1>
              <p className="text-sm text-gray-500">Last saved: 2 minutes ago</p>
            </div>

            <div className="flex items-center space-x-1 border-l pl-4">
              <button
                onClick={() => setViewMode('2d')}
                className={`px-3 py-1 rounded ${
                  viewMode === '2d' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                2D
              </button>
              <button
                onClick={() => setViewMode('3d')}
                className={`px-3 py-1 rounded ${
                  viewMode === '3d' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                3D
              </button>
            </div>

            <div className="flex items-center space-x-2 border-l pl-4">
              <button
                onClick={undo}
                disabled={undoStack.length === 0}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-4 w-4" />
              </button>
              <button
                onClick={redo}
                disabled={redoStack.length === 0}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAIChat(!showAIChat)}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
            >
              <HelpCircle className="h-4 w-4" />
              <span>AI Assistant</span>
            </button>
            
            <button
              onClick={shareProject}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            
            <button
              onClick={exportProject}
              className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            
            <button
              onClick={saveProject}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Library */}
        <AnimatePresence>
          {showLeftPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-r border-gray-200 overflow-y-auto"
            >
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Elements Library</h2>
                
                {/* Cabinets */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Package className="h-4 w-4 mr-2" />
                    Cabinets
                  </h3>
                  {cabinetLibrary.map((category) => (
                    <div key={category.category} className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        {category.category}
                      </h4>
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => addElement(item, 'cabinet')}
                            className="w-full text-left p-2 rounded hover:bg-gray-50 text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500">${item.price}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.width} × {item.height} × {item.depth}mm
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Appliances */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Box className="h-4 w-4 mr-2" />
                    Appliances
                  </h3>
                  {applianceLibrary.map((category) => (
                    <div key={category.category} className="mb-4">
                      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        {category.category}
                      </h4>
                      <div className="space-y-2">
                        {category.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => addElement(item, 'appliance')}
                            className="w-full text-left p-2 rounded hover:bg-gray-50 text-sm"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500">${item.price}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Left Panel Button */}
        <button
          onClick={() => setShowLeftPanel(!showLeftPanel)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-r-lg p-2 z-10"
        >
          {showLeftPanel ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          {viewMode === '3d' ? (
            <DesignerCanvas
              selectedTool={selectedTool}
              onObjectSelect={setSelectedElement as any}
              showGrid={true}
              showStats={false}
            />
          ) : (
            <Designer2DCanvas
              onObjectSelect={setSelectedElement as any}
              gridSize={20}
              showGrid={true}
              showRulers={true}
            />
          )}

          {/* Tool Selection */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 flex space-x-2">
            <button
              onClick={() => setSelectedTool('select')}
              className={`p-2 rounded ${
                selectedTool === 'select' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="Select (Q)"
            >
              <Box className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedTool('move')}
              className={`p-2 rounded ${
                selectedTool === 'move' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="Move (W)"
            >
              <Move className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedTool('rotate')}
              className={`p-2 rounded ${
                selectedTool === 'rotate' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="Rotate (E)"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedTool('scale')}
              className={`p-2 rounded ${
                selectedTool === 'scale' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
              title="Scale (R)"
            >
              <Maximize2 className="h-5 w-5" />
            </button>
          </div>

          {/* View Controls */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-2 flex flex-col space-y-2">
            <button className="p-2 hover:bg-gray-100 rounded" title="Zoom In">
              <ZoomIn className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded" title="Zoom Out">
              <ZoomOut className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded" title="Reset View">
              <RefreshCw className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded" title="Screenshot">
              <Camera className="h-5 w-5" />
            </button>
          </div>

          {/* Timeline (for animations) */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-96">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Animation Timeline</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentFrame(0)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <SkipBack className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setCurrentFrame(100)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <SkipForward className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div
                className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
                style={{ width: `${currentFrame}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Properties */}
        <AnimatePresence>
          {showRightPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-l border-gray-200 overflow-y-auto"
            >
              <div className="p-4">
                {selectedElement ? (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Properties</h2>
                    
                    {/* Element Info */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Element Info</h3>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs text-gray-500">Name</label>
                          <input
                            type="text"
                            value={selectedElement.name}
                            onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Type</label>
                          <p className="text-sm font-medium capitalize">{selectedElement.type}</p>
                        </div>
                        {selectedElement.price && (
                          <div>
                            <label className="text-xs text-gray-500">Price</label>
                            <p className="text-sm font-medium">${selectedElement.price}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Transform */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Transform</h3>
                      <div className="space-y-3">
                        {/* Position */}
                        <div>
                          <label className="text-xs text-gray-500">Position</label>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={selectedElement.position.x?? 0}
                              onChange={(e) => updateElement(selectedElement.id, {
                                position: { ...selectedElement.position, x: parseFloat(e.target.value) }
                              })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="X"
                            />
                            <input
                              type="number"
                              value={selectedElement.position.y}
                              onChange={(e) => updateElement(selectedElement.id, {
                                position: { ...selectedElement.position, y: parseFloat(e.target.value) }
                              })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Y"
                            />
                            <input
                              type="number"
                              value={selectedElement.position.z}
                              onChange={(e) => updateElement(selectedElement.id, {
                                position: { ...selectedElement.position, z: parseFloat(e.target.value) }
                              })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Z"
                            />
                          </div>
                        </div>

                        {/* Rotation */}
                        <div>
                          <label className="text-xs text-gray-500">Rotation</label>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={selectedElement.rotation.x}
                              onChange={(e) => updateElement(selectedElement.id, {
                                rotation: { ...selectedElement.rotation, x: parseFloat(e.target.value) }
                              })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="X"
                            />
                            <input
                              type="number"
                              value={selectedElement.rotation.y}
                              onChange={(e) => updateElement(selectedElement.id, {
                                rotation: { ...selectedElement.rotation, y: parseFloat(e.target.value) }
                              })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Y"
                            />
                            <input
                              type="number"
                              value={selectedElement.rotation.z}
                              onChange={(e) => updateElement(selectedElement.id, {
                                rotation: { ...selectedElement.rotation, z: parseFloat(e.target.value) }
                              })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Z"
                            />
                          </div>
                        </div>

                        {/* Scale */}
                        <div>
                          <label className="text-xs text-gray-500">Scale</label>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={selectedElement.scale.x}
                              onChange={(e) => updateElement(selectedElement.id, {
                                scale: { ...selectedElement.scale, x: parseFloat(e.target.value) }
                              })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="X"
                              step="0.1"
                            />
                            <input
                              type="number"
                              value={selectedElement.scale.y}
                              onChange={(e) => updateElement(selectedElement.id, {
                                scale: { ...selectedElement.scale, y: parseFloat(e.target.value) }
                              })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Y"
                              step="0.1"
                            />
                            <input
                              type="number"
                              value={selectedElement.scale.z}
                              onChange={(e) => updateElement(selectedElement.id, {
                                scale: { ...selectedElement.scale, z: parseFloat(e.target.value) }
                              })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              placeholder="Z"
                              step="0.1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Materials */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <Palette className="h-4 w-4 mr-2" />
                        Materials
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {materials.map((material) => (
                          <button
                            key={material.id}
                            onClick={() => updateElement(selectedElement.id, { material: material.id })}
                            className={`p-2 rounded border text-sm ${
                              selectedElement.material === material.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <p className="font-medium">{material.name}</p>
                            <p className="text-xs text-gray-500">+${material.price}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={duplicateElement}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50"
                      >
                        <Copy className="h-4 w-4 inline mr-1" />
                        Duplicate
                      </button>
                      <button
                        onClick={deleteElement}
                        className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 inline mr-1" />
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h2>
                    
                    {/* Project Stats */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Statistics</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total Elements</span>
                            <span className="text-sm font-medium">{designElements.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total Cost</span>
                            <span className="text-sm font-medium">${calculateTotalCost()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-900 mb-1">Design Tips</h3>
                        <p className="text-xs text-blue-700">
                          Use the AI Assistant to get personalized suggestions for your kitchen layout.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Right Panel Button */}
        <button
          onClick={() => setShowRightPanel(!showRightPanel)}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-l-lg p-2 z-10"
        >
          {showRightPanel ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* AI Chat */}
      {showAIChat && (
        <AIChat
          projectId={projectId}
          context={{ designElements, project }}
          onSuggestionApply={(suggestion) => {
            console.log('Applying AI suggestion:', suggestion);
          }}
        />
      )}

      {/* Collaboration Panel */}
      {showCollaboration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-[800px] h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Collaboration</h2>
              <button
                onClick={() => setShowCollaboration(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1">
              <CollaborationPanel
                projectId={projectId!}
                currentUser={{
  id: user?.id?.toString() || '',
  name: `${user?.firstName} ${user?.lastName}`,
  email: user?.email || '',
  avatar: `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=3B82F6&color=fff`,
  status: 'online',
  role: 'owner'
}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerPage;