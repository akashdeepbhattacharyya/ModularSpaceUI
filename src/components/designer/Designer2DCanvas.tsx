import React, { useRef, useEffect, useState } from 'react';
import * as fabric from 'fabric';
import { motion } from 'framer-motion';
import {
  Square,
  Circle,
  Move,
  MousePointer,
  Trash2,
  Copy,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Layers,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Ruler,
  Grid,
  Type,
  Palette,
  Save,
  Undo,
  Redo
} from 'lucide-react';

interface Designer2DCanvasProps {
  onObjectSelect?: (object: fabric.FabricObject | null) => void;
  gridSize?: number;
  showGrid?: boolean;
  showRulers?: boolean;
}

const Designer2DCanvas: React.FC<Designer2DCanvasProps> = ({
  onObjectSelect,
  gridSize = 20,
  showGrid = true,
  showRulers = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null);
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedTool, setSelectedTool] = useState<'select' | 'move' | 'rect' | 'circle' | 'text'>('select');
  const [zoom, setZoom] = useState(1);

  // Cabinet presets
  const cabinetPresets = [
    { name: 'Base Cabinet', width: 600, height: 850, depth: 600 },
    { name: 'Wall Cabinet', width: 600, height: 700, depth: 350 },
    { name: 'Tall Cabinet', width: 600, height: 2100, depth: 600 },
    { name: 'Corner Cabinet', width: 900, height: 850, depth: 900 },
  ];

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth - 300,
      height: window.innerHeight,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = canvas;

    // Enable object caching for better performance
    fabric.FabricObject.prototype.objectCaching = true;

    // Set up grid
    if (showGrid) {
      drawGrid(canvas);
    }

    // Set up rulers
    if (showRulers) {
      drawRulers(canvas);
    }

    // Snap to grid
    canvas.on('object:moving', (options) => {
      const obj = options.target;
      if (!obj) return;

      obj.set({
        left: Math.round((obj.left || 0) / gridSize) * gridSize,
        top: Math.round((obj.top || 0) / gridSize) * gridSize,
      });
    });

    // Handle selection
    canvas.on('selection:created', (options) => {
      const obj = options.selected?.[0] || null;
      setSelectedObject(obj);
      if (onObjectSelect) onObjectSelect(obj);
    });

    canvas.on('selection:updated', (options) => {
      const obj = options.selected?.[0] || null;
      setSelectedObject(obj);
      if (onObjectSelect) onObjectSelect(obj);
    });

    canvas.on('selection:cleared', () => {
      setSelectedObject(null);
      if (onObjectSelect) onObjectSelect(null);
    });

    // Save state for undo/redo
    canvas.on('object:modified', () => {
      saveCanvasState();
    });

    // Handle keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            e.preventDefault();
            break;
          case 'c':
            copyObject();
            e.preventDefault();
            break;
          case 'v':
            pasteObject();
            e.preventDefault();
            break;
          case 's':
            saveCanvas();
            e.preventDefault();
            break;
          case 'Delete':
          case 'Backspace':
            deleteSelectedObject();
            e.preventDefault();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Handle window resize
    const handleResize = () => {
      canvas.setDimensions({
        width: window.innerWidth - 300,
        height: window.innerHeight - 200,
      });
      if (showGrid) drawGrid(canvas);
      if (showRulers) drawRulers(canvas);
    };

    window.addEventListener('resize', handleResize);

    // Initial canvas state
    saveCanvasState();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, []);

  // Draw grid
  const drawGrid = (canvas: fabric.Canvas) => {
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    // Remove existing grid
    const objects = canvas.getObjects();
    objects.forEach((obj: fabric.FabricObject) => {
      if ((obj as any).name === 'grid-line') {
        canvas.remove(obj);
      }
    });

    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      (line as any).name = 'grid-line';
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }

    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      });
      (line as any).name = 'grid-line';
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
  };

  // Draw rulers
  const drawRulers = (canvas: fabric.Canvas) => {
    // Implementation for rulers would go here
    // This is a simplified version
  };

  // Save canvas state for undo/redo
  const saveCanvasState = () => {
    if (!fabricCanvasRef.current) return;

    const currentState = JSON.stringify(fabricCanvasRef.current.toJSON());
    const newHistory = canvasHistory.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    
    setCanvasHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (!fabricCanvasRef.current || historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    fabricCanvasRef.current.loadFromJSON(canvasHistory[newIndex]).then(() => {
      fabricCanvasRef.current?.renderAll();
      setHistoryIndex(newIndex);
    });
  };

  // Redo
  const redo = () => {
    if (!fabricCanvasRef.current || historyIndex >= canvasHistory.length - 1) return;

    const newIndex = historyIndex + 1;
    fabricCanvasRef.current.loadFromJSON(canvasHistory[newIndex]).then(() => {
      fabricCanvasRef.current?.renderAll();
      setHistoryIndex(newIndex);
    });
  };

  // Add cabinet
  const addCabinet = (preset: typeof cabinetPresets[0]) => {
    if (!fabricCanvasRef.current) return;

    const scale = 0.5; // Scale for 2D representation
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: preset.width * scale,
      height: preset.depth * scale,
      fill: '#8B7355',
      stroke: '#654321',
      strokeWidth: 2,
      cornerColor: '#3B82F6',
      cornerSize: 10,
      transparentCorners: false,
    });
    (rect as any).name = preset.name;

    // Add text label
    const text = new fabric.FabricText(preset.name, {
      left: rect.left || 0,
      top: (rect.top || 0) + (rect.height || 0) / 2,
      fontSize: 14,
      fill: '#ffffff',
      originX: 'left',
      originY: 'center',
      selectable: false,
      evented: false,
    });

    const group = new fabric.Group([rect, text], {
      left: 100,
      top: 100,
    });
    (group as any).name = preset.name;

    fabricCanvasRef.current.add(group);
    fabricCanvasRef.current.setActiveObject(group);
    fabricCanvasRef.current.renderAll();
    saveCanvasState();
  };

  // Add shape
  const addShape = (type: 'rect' | 'circle') => {
    if (!fabricCanvasRef.current) return;

    let shape: fabric.FabricObject;

    if (type === 'rect') {
      shape = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: '#3B82F6',
        stroke: '#1E40AF',
        strokeWidth: 2,
      });
    } else {
      shape = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: '#3B82F6',
        stroke: '#1E40AF',
        strokeWidth: 2,
      });
    }

    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.setActiveObject(shape);
    fabricCanvasRef.current.renderAll();
    saveCanvasState();
  };

  // Add text
  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new fabric.IText('Click to edit', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#000000',
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
    saveCanvasState();
  };

  // Delete selected object
  const deleteSelectedObject = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;

    fabricCanvasRef.current.remove(selectedObject);
    fabricCanvasRef.current.renderAll();
    setSelectedObject(null);
    saveCanvasState();
  };

  // Copy object
  const copyObject = () => {
    if (!selectedObject) return;

    selectedObject.clone().then((cloned: fabric.FabricObject) => {
      // Store cloned object for paste
      (window as any).copiedObject = cloned;
    });
  };

  // Paste object
  const pasteObject = () => {
    if (!fabricCanvasRef.current || !(window as any).copiedObject) return;

    const copiedObject = (window as any).copiedObject;
    copiedObject.clone().then((cloned: fabric.FabricObject) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      });
      fabricCanvasRef.current?.add(cloned);
      fabricCanvasRef.current?.setActiveObject(cloned);
      fabricCanvasRef.current?.renderAll();
      saveCanvasState();
    });
  };

  // Flip object
  const flipObject = (direction: 'horizontal' | 'vertical') => {
    if (!selectedObject) return;

    if (direction === 'horizontal') {
      selectedObject.set('flipX', !selectedObject.flipX);
    } else {
      selectedObject.set('flipY', !selectedObject.flipY);
    }
    
    fabricCanvasRef.current?.renderAll();
    saveCanvasState();
  };

  // Lock/unlock object
  const toggleLock = () => {
    if (!selectedObject) return;

    const isLocked = selectedObject.lockMovementX;
    selectedObject.set({
      lockMovementX: !isLocked,
      lockMovementY: !isLocked,
      lockRotation: !isLocked,
      lockScalingX: !isLocked,
      lockScalingY: !isLocked,
    });

    fabricCanvasRef.current?.renderAll();
  };

  // Export canvas
  const exportCanvas = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });

    const link = document.createElement('a');
    link.download = 'kitchen-layout.png';
    link.href = dataURL;
    link.click();
  };

  // Save canvas
  const saveCanvas = () => {
    if (!fabricCanvasRef.current) return;

    const canvasData = JSON.stringify(fabricCanvasRef.current.toJSON());
    localStorage.setItem('kitchen-design-2d', canvasData);
    
    // Show save notification
    console.log('Canvas saved!');
  };

  // Load canvas
  const loadCanvas = (data: string) => {
    if (!fabricCanvasRef.current) return;

    fabricCanvasRef.current.loadFromJSON(data).then(() => {
      fabricCanvasRef.current?.renderAll();
      saveCanvasState();
    });
  };

  // Zoom controls
  const handleZoom = (delta: number) => {
    if (!fabricCanvasRef.current) return;

    const newZoom = Math.max(0.1, Math.min(3, zoom + delta));
    fabricCanvasRef.current.setZoom(newZoom);
    setZoom(newZoom);
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Toolbar */}
      <div className="w-16 bg-white shadow-lg flex flex-col items-center py-4 space-y-2">
        <button
          onClick={() => setSelectedTool('select')}
          className={`p-3 rounded-lg transition-colors ${
            selectedTool === 'select' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
          }`}
          title="Select"
        >
          <MousePointer className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => addShape('rect')}
          className="p-3 rounded-lg hover:bg-gray-100"
          title="Add Rectangle"
        >
          <Square className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => addShape('circle')}
          className="p-3 rounded-lg hover:bg-gray-100"
          title="Add Circle"
        >
          <Circle className="h-5 w-5" />
        </button>
        
        <button
          onClick={addText}
          className="p-3 rounded-lg hover:bg-gray-100"
          title="Add Text"
        >
          <Type className="h-5 w-5" />
        </button>
        
        <div className="border-t pt-2 space-y-2">
          <button
            onClick={undo}
            className="p-3 rounded-lg hover:bg-gray-100"
            title="Undo"
            disabled={historyIndex <= 0}
          >
            <Undo className="h-5 w-5" />
          </button>
          
          <button
            onClick={redo}
            className="p-3 rounded-lg hover:bg-gray-100"
            title="Redo"
            disabled={historyIndex >= canvasHistory.length - 1}
          >
            <Redo className="h-5 w-5" />
          </button>
        </div>
        
        <div className="border-t pt-2 space-y-2">
          <button
            onClick={exportCanvas}
            className="p-3 rounded-lg hover:bg-gray-100"
            title="Export"
          >
            <Download className="h-5 w-5" />
          </button>
          
          <button
            onClick={saveCanvas}
            className="p-3 rounded-lg hover:bg-gray-100"
            title="Save"
          >
            <Save className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 relative overflow-hidden">
        <canvas ref={canvasRef} />
        
        {/* Cabinet Presets Panel */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 w-64 hidden">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Cabinet Presets</h3>
          <div className="space-y-2">
            {cabinetPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => addCabinet(preset)}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-50 text-sm"
              >
                <span className="font-medium">{preset.name}</span>
                <span className="text-gray-500 text-xs block">
                  {preset.width} x {preset.height} x {preset.depth}mm
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Object Properties Panel */}
        {selectedObject && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 w-64"
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Properties</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Position</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={Math.round(selectedObject.left || 0)}
                    onChange={(e) => {
                      selectedObject.set('left', parseInt(e.target.value));
                      fabricCanvasRef.current?.renderAll();
                    }}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                    placeholder="X"
                  />
                  <input
                    type="number"
                    value={Math.round(selectedObject.top || 0)}
                    onChange={(e) => {
                      selectedObject.set('top', parseInt(e.target.value));
                      fabricCanvasRef.current?.renderAll();
                    }}
                    className="flex-1 px-2 py-1 border rounded text-sm"
                    placeholder="Y"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => flipObject('horizontal')}
                  className="flex-1 p-2 border rounded hover:bg-gray-50"
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="h-4 w-4 mx-auto" />
                </button>
                <button
                  onClick={() => flipObject('vertical')}
                  className="flex-1 p-2 border rounded hover:bg-gray-50"
                  title="Flip Vertical"
                >
                  <FlipVertical className="h-4 w-4 mx-auto" />
                </button>
                <button
                  onClick={toggleLock}
                  className="flex-1 p-2 border rounded hover:bg-gray-50"
                  title="Lock/Unlock"
                >
                  {selectedObject.lockMovementX ? (
                    <Lock className="h-4 w-4 mx-auto" />
                  ) : (
                    <Unlock className="h-4 w-4 mx-auto" />
                  )}
                </button>
                <button
                  onClick={deleteSelectedObject}
                  className="flex-1 p-2 border rounded hover:bg-gray-50 text-red-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Zoom Controls */}
        {/* <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 flex items-center space-x-2">
          <button
            onClick={() => handleZoom(-0.1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            -
          </button>
          <span className="text-sm font-medium px-2">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => handleZoom(0.1)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            +
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Designer2DCanvas;