import React, { useRef, useEffect, useState, useCallback } from 'react';
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
  Redo,
  ZoomIn,
  ZoomOut,
  Home,
  Plus,
  Minus,
  CornerUpLeft,
  Edit3,
  Settings,
  Check,
  X
} from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  height: number;
  material: string;
  color: string;
}

interface Room {
  id: string;
  name: string;
  walls: Wall[];
  area: number;
  perimeter: number;
}

interface Designer2DCanvasProps {
  onObjectSelect?: (object: fabric.FabricObject | null) => void;
  onRoomCreate?: (room: Room) => void;
  onWallCreate?: (wall: Wall) => void;
  gridSize?: number;
  showGrid?: boolean;
  showRulers?: boolean;
}

const Designer2DCanvas: React.FC<Designer2DCanvasProps> = ({
  onObjectSelect,
  onRoomCreate,
  onWallCreate,
  gridSize = 20,
  showGrid = true,
  showRulers = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.FabricObject | null>(null);
  const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedTool, setSelectedTool] = useState<'select' | 'move' | 'wall' | 'room' | 'rect' | 'circle' | 'text'>('select');
  const [zoom, setZoom] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Wall creation states
  const [isDrawingWall, setIsDrawingWall] = useState(false);
  const [wallStartPoint, setWallStartPoint] = useState<Point | null>(null);
  const [currentWall, setCurrentWall] = useState<fabric.Line | null>(null);
  const [walls, setWalls] = useState<Wall[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  // Wall properties
  const [wallThickness, setWallThickness] = useState(8);
  const [wallHeight, setWallHeight] = useState(2400);
  const [wallMaterial, setWallMaterial] = useState('drywall');
  const [wallColor, setWallColor] = useState('#8B7355');
  
  // Room creation
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomPoints, setRoomPoints] = useState<Point[]>([]);
  const [showRoomDialog, setShowRoomDialog] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  // Cabinet presets
  const cabinetPresets = [
    { name: 'Base Cabinet', width: 600, height: 850, depth: 600 },
    { name: 'Wall Cabinet', width: 600, height: 700, depth: 350 },
    { name: 'Tall Cabinet', width: 600, height: 2100, depth: 600 },
    { name: 'Corner Cabinet', width: 900, height: 850, depth: 900 },
  ];

  // Wall materials
  const wallMaterials = [
    { name: 'Drywall', value: 'drywall', color: '#F5F5F5' },
    { name: 'Brick', value: 'brick', color: '#8B4513' },
    { name: 'Concrete', value: 'concrete', color: '#A9A9A9' },
    { name: 'Wood', value: 'wood', color: '#8B7355' },
    { name: 'Glass', value: 'glass', color: '#E0F6FF' },
  ];

  // Debounced save function
  const debouncedSaveCanvasState = useCallback(
    debounce(() => {
      if (!fabricCanvasRef.current) return;

      const currentState = JSON.stringify(fabricCanvasRef.current.toJSON());
      const newHistory = canvasHistory.slice(0, historyIndex + 1);
      newHistory.push(currentState);
      
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      
      setCanvasHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }, 300),
    [canvasHistory, historyIndex]
  );

  // Draw grid with performance optimization
  const drawGrid = useCallback((canvas: fabric.Canvas) => {
    if (!showGrid) return;

    const width = canvas.getWidth();
    const height = canvas.getHeight();

    canvas.getObjects().forEach((obj: fabric.FabricObject) => {
      if ((obj as any).name === 'grid-line') {
        canvas.remove(obj);
      }
    });

    const gridLines: fabric.Line[] = [];

    for (let i = 0; i <= width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false,
      });
      (line as any).name = 'grid-line';
      gridLines.push(line);
    }

    for (let i = 0; i <= height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: '#e0e0e0',
        strokeWidth: 1,
        selectable: false,
        evented: false,
        objectCaching: false,
      });
      (line as any).name = 'grid-line';
      gridLines.push(line);
    }

    gridLines.forEach(line => {
      canvas.add(line);
      canvas.sendObjectToBack(line);
    });

    canvas.requestRenderAll();
  }, [gridSize, showGrid]);

  // Snap point to grid
  const snapToGrid = useCallback((point: Point): Point => {
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize,
    };
  }, [gridSize]);

  // Create wall from two points
  const createWall = useCallback((start: Point, end: Point): Wall => {
    const id = `wall_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id,
      start: snapToGrid(start),
      end: snapToGrid(end),
      thickness: wallThickness,
      height: wallHeight,
      material: wallMaterial,
      color: wallColor,
    };
  }, [snapToGrid, wallThickness, wallHeight, wallMaterial, wallColor]);

  // Draw wall on canvas
  const drawWall = useCallback((wall: Wall) => {
    if (!fabricCanvasRef.current) return null;

    const line = new fabric.Line([wall.start.x, wall.start.y, wall.end.x, wall.end.y], {
      stroke: wall.color,
      strokeWidth: wall.thickness,
      selectable: true,
      evented: true,
      objectCaching: true,
      strokeLineCap: 'round',
    });
    
    (line as any).name = 'wall';
    (line as any).wallData = wall;

    fabricCanvasRef.current.add(line);
    
    return line;
  }, []);

  // Calculate room area and perimeter
  const calculateRoomMetrics = useCallback((points: Point[]) => {
    if (points.length < 3) return { area: 0, perimeter: 0 };

    // Calculate area using shoelace formula
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    area = Math.abs(area) / 2;

    // Calculate perimeter
    let perimeter = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const dx = points[j].x - points[i].x;
      const dy = points[j].y - points[i].y;
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }

    return { 
      area: Math.round(area / (gridSize * gridSize) * 10) / 10, // Convert to square meters approximation
      perimeter: Math.round(perimeter / gridSize * 10) / 10    // Convert to meters approximation
    };
  }, [gridSize]);

  // Create room from points
  const createRoom = useCallback((points: Point[], name: string): Room => {
    const id = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const { area, perimeter } = calculateRoomMetrics(points);
    
    // Create walls from consecutive points
    const roomWalls: Wall[] = [];
    for (let i = 0; i < points.length; i++) {
      const start = points[i];
      const end = points[(i + 1) % points.length];
      const wall = createWall(start, end);
      roomWalls.push(wall);
    }

    return {
      id,
      name,
      walls: roomWalls,
      area,
      perimeter,
    };
  }, [calculateRoomMetrics, createWall]);

  // Draw room on canvas
  const drawRoom = useCallback((room: Room) => {
    if (!fabricCanvasRef.current) return;

    // Draw room walls
    room.walls.forEach(wall => {
      drawWall(wall);
    });

    // Draw room polygon
    const points = room.walls.map(wall => new fabric.Point(wall.start.x, wall.start.y));
    const polygon = new fabric.Polygon(points, {
      fill: 'rgba(173, 216, 230, 0.1)',
      stroke: '#4169E1',
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
    });
    (polygon as any).name = 'room-outline';
    (polygon as any).roomData = room;

    // Add room label
    const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
    
    const label = new fabric.FabricText(`${room.name}\n${room.area}m²`, {
      left: centerX,
      top: centerY,
      fontSize: 14,
      fill: '#4169E1',
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
    });
    (label as any).name = 'room-label';

    fabricCanvasRef.current.add(polygon, label);
    fabricCanvasRef.current.sendObjectToBack(polygon);
  }, [drawWall]);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    try {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: Math.max(800, window.innerWidth - 400),
        height: Math.max(600, window.innerHeight - 200),
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true,
        renderOnAddRemove: true,
        enableRetinaScaling: true,
      });

      fabricCanvasRef.current = canvas;
      fabric.FabricObject.prototype.objectCaching = true;

      drawGrid(canvas);

      // Handle mouse events for wall drawing
      canvas.on('mouse:down', (options) => {
        if (selectedTool === 'wall' && !isDrawingWall) {
          const pointer = canvas.getPointer(options.e);
          const snappedPoint = snapToGrid(pointer);
          
          setWallStartPoint(snappedPoint);
          setIsDrawingWall(true);
        } else if (selectedTool === 'room' && isCreatingRoom) {
          const pointer = canvas.getPointer(options.e);
          const snappedPoint = snapToGrid(pointer);
          
          setRoomPoints(prev => [...prev, snappedPoint]);
        }
      });

      canvas.on('mouse:move', (options) => {
        if (selectedTool === 'wall' && isDrawingWall && wallStartPoint) {
          const pointer = canvas.getPointer(options.e);
          const snappedPoint = snapToGrid(pointer);

          // Remove previous preview line
          if (currentWall) {
            canvas.remove(currentWall);
          }

          // Draw preview line
          const previewLine = new fabric.Line([
            wallStartPoint.x, wallStartPoint.y,
            snappedPoint.x, snappedPoint.y
          ], {
            stroke: wallColor,
            strokeWidth: wallThickness,
            strokeDashArray: [5, 5],
            selectable: false,
            evented: false,
          });

          canvas.add(previewLine);
          setCurrentWall(previewLine);
          canvas.requestRenderAll();
        }
      });

      canvas.on('mouse:up', (options) => {
        if (selectedTool === 'wall' && isDrawingWall && wallStartPoint) {
          const pointer = canvas.getPointer(options.e);
          const snappedPoint = snapToGrid(pointer);

          // Remove preview line
          if (currentWall) {
            canvas.remove(currentWall);
            setCurrentWall(null);
          }

          // Create actual wall
          const wall = createWall(wallStartPoint, snappedPoint);
          const wallLine = drawWall(wall);
          
          setWalls(prev => [...prev, wall]);
          
          if (onWallCreate) {
            onWallCreate(wall);
          }

          setIsDrawingWall(false);
          setWallStartPoint(null);
          canvas.requestRenderAll();
        }
      });

      // Handle selection
      const handleSelectionCreated = (options: any) => {
        const obj = options.selected?.[0] || null;
        setSelectedObject(obj);
        if (onObjectSelect) onObjectSelect(obj);
      };

      const handleSelectionUpdated = (options: any) => {
        const obj = options.selected?.[0] || null;
        setSelectedObject(obj);
        if (onObjectSelect) onObjectSelect(obj);
      };

      const handleSelectionCleared = () => {
        setSelectedObject(null);
        if (onObjectSelect) onObjectSelect(null);
      };

      canvas.on('selection:created', handleSelectionCreated);
      canvas.on('selection:updated', handleSelectionUpdated);
      canvas.on('selection:cleared', handleSelectionCleared);

      canvas.on('object:modified', debouncedSaveCanvasState);
      canvas.on('object:added', debouncedSaveCanvasState);
      canvas.on('object:removed', debouncedSaveCanvasState);

      // Keyboard shortcuts
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
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
              copyObject();
              break;
            case 'v':
              e.preventDefault();
              pasteObject();
              break;
            case 's':
              e.preventDefault();
              saveCanvas();
              break;
          }
        } else if (e.key === 'Delete' || e.key === 'Backspace') {
          e.preventDefault();
          deleteSelectedObject();
        } else if (e.key === 'Escape') {
          // Cancel current operation
          if (isDrawingWall) {
            if (currentWall) {
              canvas.remove(currentWall);
              setCurrentWall(null);
            }
            setIsDrawingWall(false);
            setWallStartPoint(null);
          }
          if (isCreatingRoom) {
            setIsCreatingRoom(false);
            setRoomPoints([]);
          }
        } else if (e.key === 'Enter' && isCreatingRoom && roomPoints.length >= 3) {
          // Complete room creation
          setShowRoomDialog(true);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      const handleResize = throttle(() => {
        const newWidth = Math.max(800, window.innerWidth - 400);
        const newHeight = Math.max(600, window.innerHeight - 200);
        
        canvas.setDimensions({
          width: newWidth,
          height: newHeight,
        });
        
        drawGrid(canvas);
        canvas.requestRenderAll();
      }, 100);

      window.addEventListener('resize', handleResize);

      setTimeout(() => {
        debouncedSaveCanvasState();
        setIsInitialized(true);
      }, 100);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', handleResize);
        canvas.off('selection:created', handleSelectionCreated);
        canvas.off('selection:updated', handleSelectionUpdated);
        canvas.off('selection:cleared', handleSelectionCleared);
        canvas.off('object:modified', debouncedSaveCanvasState);
        canvas.off('object:added', debouncedSaveCanvasState);
        canvas.off('object:removed', debouncedSaveCanvasState);
        canvas.dispose();
        setIsInitialized(false);
      };
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
    }
  }, [isInitialized, drawGrid, debouncedSaveCanvasState]);

  // Complete room creation
  const completeRoom = useCallback(() => {
    if (roomPoints.length < 3 || !newRoomName.trim()) return;

    const room = createRoom(roomPoints, newRoomName.trim());
    drawRoom(room);
    
    setRooms(prev => [...prev, room]);
    
    if (onRoomCreate) {
      onRoomCreate(room);
    }

    // Reset states
    setIsCreatingRoom(false);
    setRoomPoints([]);
    setShowRoomDialog(false);
    setNewRoomName('');
    setSelectedTool('select');
  }, [roomPoints, newRoomName, createRoom, drawRoom, onRoomCreate]);

  // Tool functions
  const undo = useCallback(() => {
    if (!fabricCanvasRef.current || historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    try {
      fabricCanvasRef.current.loadFromJSON(canvasHistory[newIndex]).then(() => {
        fabricCanvasRef.current?.requestRenderAll();
        setHistoryIndex(newIndex);
      });
    } catch (error) {
      console.error('Failed to undo:', error);
    }
  }, [canvasHistory, historyIndex]);

  const redo = useCallback(() => {
    if (!fabricCanvasRef.current || historyIndex >= canvasHistory.length - 1) return;
    const newIndex = historyIndex + 1;
    try {
      fabricCanvasRef.current.loadFromJSON(canvasHistory[newIndex]).then(() => {
        fabricCanvasRef.current?.requestRenderAll();
        setHistoryIndex(newIndex);
      });
    } catch (error) {
      console.error('Failed to redo:', error);
    }
  }, [canvasHistory, historyIndex]);

  const addCabinet = useCallback((preset: typeof cabinetPresets[0]) => {
    if (!fabricCanvasRef.current) return;

    const scale = 0.5;
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
      objectCaching: true,
    });
    (rect as any).name = preset.name;

    const text = new fabric.FabricText(preset.name, {
      left: 0,
      top: 0,
      fontSize: 12,
      fill: '#ffffff',
      originX: 'center',
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
    fabricCanvasRef.current.requestRenderAll();
  }, []);

  const addShape = useCallback((type: 'rect' | 'circle') => {
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
        objectCaching: true,
      });
    } else {
      shape = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: '#3B82F6',
        stroke: '#1E40AF',
        strokeWidth: 2,
        objectCaching: true,
      });
    }

    fabricCanvasRef.current.add(shape);
    fabricCanvasRef.current.setActiveObject(shape);
    fabricCanvasRef.current.requestRenderAll();
  }, []);

  const addText = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    const text = new fabric.IText('Click to edit', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#000000',
      fontFamily: 'Arial',
      objectCaching: true,
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.requestRenderAll();
  }, []);

  const deleteSelectedObject = useCallback(() => {
    if (!fabricCanvasRef.current || !selectedObject) return;

    fabricCanvasRef.current.remove(selectedObject);
    fabricCanvasRef.current.requestRenderAll();
    setSelectedObject(null);
  }, [selectedObject]);

  const copyObject = useCallback(async () => {
    if (!selectedObject) return;
    try {
      const cloned = await selectedObject.clone();
      (window as any).copiedObject = cloned;
    } catch (error) {
      console.error('Failed to copy object:', error);
    }
  }, [selectedObject]);

  const pasteObject = useCallback(async () => {
    if (!fabricCanvasRef.current || !(window as any).copiedObject) return;
    try {
      const copiedObject = (window as any).copiedObject;
      const cloned = await copiedObject.clone();
      
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
      });
      
      fabricCanvasRef.current.add(cloned);
      fabricCanvasRef.current.setActiveObject(cloned);
      fabricCanvasRef.current.requestRenderAll();
    } catch (error) {
      console.error('Failed to paste object:', error);
    }
  }, []);

  const handleZoom = useCallback((delta: number) => {
    if (!fabricCanvasRef.current) return;
    const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
    fabricCanvasRef.current.setZoom(newZoom);
    setZoom(newZoom);
    fabricCanvasRef.current.requestRenderAll();
  }, [zoom]);

  const exportCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3,
      enableRetinaScaling: true,
    });
    const link = document.createElement('a');
    link.download = 'kitchen-layout.png';
    link.href = dataURL;
    link.click();
  }, []);

  const saveCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    try {
      const canvasData = JSON.stringify(fabricCanvasRef.current.toJSON());
      localStorage.setItem('kitchen-design-2d', canvasData);
      console.log('Canvas saved successfully!');
    } catch (error) {
      console.error('Failed to save canvas:', error);
    }
  }, []);

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Toolbar */}
      <div className="w-16 bg-white shadow-lg flex flex-col items-center py-4 space-y-2">
        <button
          onClick={() => setSelectedTool('select')}
          className={`p-3 rounded-lg transition-colors ${
            selectedTool === 'select' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Select Tool"
        >
          <MousePointer className="h-5 w-5" />
        </button>

        <button
          onClick={() => setSelectedTool('move')}
          className={`p-3 rounded-lg transition-colors ${
            selectedTool === 'move' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Move Tool"
        >
          <Move className="h-5 w-5" />
        </button>

        <div className="w-full h-px bg-gray-200" />

        {/* Wall and Room Tools */}
        <button
          onClick={() => {
            setSelectedTool('wall');
            setIsDrawingWall(false);
            setWallStartPoint(null);
          }}
          className={`p-3 rounded-lg transition-colors ${
            selectedTool === 'wall' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Draw Walls"
        >
          <CornerUpLeft className="h-5 w-5" />
        </button>

        <button
          onClick={() => {
            setSelectedTool('room');
            setIsCreatingRoom(true);
            setRoomPoints([]);
          }}
          className={`p-3 rounded-lg transition-colors ${
            selectedTool === 'room' 
              ? 'bg-purple-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Create Room"
        >
          <Home className="h-5 w-5" />
        </button>

        <div className="w-full h-px bg-gray-200" />

        {/* Shape Tools */}
        <button
          onClick={() => addShape('rect')}
          className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Add Rectangle"
        >
          <Square className="h-5 w-5" />
        </button>

        <button
          onClick={() => addShape('circle')}
          className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Add Circle"
        >
          <Circle className="h-5 w-5" />
        </button>

        <button
          onClick={addText}
          className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Add Text"
        >
          <Type className="h-5 w-5" />
        </button>

        <div className="w-full h-px bg-gray-200" />

        {/* Action Tools */}
        <button
          onClick={deleteSelectedObject}
          disabled={!selectedObject}
          className="p-3 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete Selected"
        >
          <Trash2 className="h-5 w-5" />
        </button>

        <button
          onClick={copyObject}
          disabled={!selectedObject}
          className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Copy"
        >
          <Copy className="h-5 w-5" />
        </button>

        <div className="w-full h-px bg-gray-200" />

        {/* History Tools */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <Undo className="h-5 w-5" />
        </button>

        <button
          onClick={redo}
          disabled={historyIndex >= canvasHistory.length - 1}
          className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <Redo className="h-5 w-5" />
        </button>

        <div className="w-full h-px bg-gray-200" />

        {/* Zoom Tools */}
        <button
          onClick={() => handleZoom(0.1)}
          className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        <button
          onClick={() => handleZoom(-0.1)}
          className="p-3 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>

        <div className="w-full h-px bg-gray-200" />

        {/* Save/Export Tools */}
        <button
          onClick={saveCanvas}
          className="p-3 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
          title="Save"
        >
          <Save className="h-5 w-5" />
        </button>

        <button
          onClick={exportCanvas}
          className="p-3 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          title="Export"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>

      {/* Side Panel */}
      <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto">
        {/* Wall Properties Panel */}
        {selectedTool === 'wall' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Wall Properties</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thickness (mm)
                </label>
                <input
                  type="range"
                  min="4"
                  max="20"
                  value={wallThickness}
                  onChange={(e) => setWallThickness(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-gray-500">{wallThickness}mm</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (mm)
                </label>
                <input
                  type="number"
                  value={wallHeight}
                  onChange={(e) => setWallHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material
                </label>
                <select
                  value={wallMaterial}
                  onChange={(e) => {
                    setWallMaterial(e.target.value);
                    const material = wallMaterials.find(m => m.value === e.target.value);
                    if (material) setWallColor(material.color);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {wallMaterials.map(material => (
                    <option key={material.value} value={material.value}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={wallColor}
                    onChange={(e) => setWallColor(e.target.value)}
                    className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={wallColor}
                    onChange={(e) => setWallColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">
                <strong>Instructions:</strong> Click to start drawing a wall, then click again to finish. 
                Press Escape to cancel.
              </p>
            </div>
          </div>
        )}

        {/* Room Creation Panel */}
        {selectedTool === 'room' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Room Creation</h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-600">
                  <strong>Points added:</strong> {roomPoints.length}
                </p>
                <p className="text-sm text-purple-600 mt-2">
                  Click to add points. Press Enter when done (minimum 3 points).
                </p>
              </div>

              {roomPoints.length >= 3 && (
                <button
                  onClick={() => setShowRoomDialog(true)}
                  className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Complete Room
                </button>
              )}

              <button
                onClick={() => {
                  setIsCreatingRoom(false);
                  setRoomPoints([]);
                  setSelectedTool('select');
                }}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Cabinet Presets */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cabinet Presets</h3>
          <div className="space-y-2">
            {cabinetPresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => addCabinet(preset)}
                className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="font-medium text-gray-900">{preset.name}</div>
                <div className="text-sm text-gray-500">
                  {preset.width}×{preset.height}×{preset.depth}mm
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Created Rooms List */}
        {rooms.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rooms</h3>
            <div className="space-y-2">
              {rooms.map((room) => (
                <div key={room.id} className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">{room.name}</div>
                  <div className="text-sm text-blue-600">
                    Area: {room.area}m² | Perimeter: {room.perimeter}m
                  </div>
                  <div className="text-xs text-blue-500 mt-1">
                    {room.walls.length} walls
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <div>Zoom: {Math.round(zoom * 100)}%</div>
            <div>Tool: {selectedTool}</div>
            <div>Walls: {walls.length}</div>
            <div>Rooms: {rooms.length}</div>
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 cursor-crosshair"
          style={{ backgroundColor: '#ffffff' }}
        />
        
        {!isInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
            <div className="text-gray-500">Initializing canvas...</div>
          </div>
        )}

        {/* Tool Instructions */}
        {(selectedTool === 'wall' || selectedTool === 'room') && (
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md">
            <div className="text-sm text-gray-600">
              {selectedTool === 'wall' && 'Click to start drawing a wall, click again to finish'}
              {selectedTool === 'room' && 'Click to add room points, press Enter when done'}
            </div>
          </div>
        )}
      </div>

      {/* Room Creation Dialog */}
      {showRoomDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Room</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Name
                </label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g., Kitchen, Living Room"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="text-sm text-gray-500">
                Points: {roomPoints.length} | 
                Area: {calculateRoomMetrics(roomPoints).area}m² | 
                Perimeter: {calculateRoomMetrics(roomPoints).perimeter}m
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={completeRoom}
                disabled={!newRoomName.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-4 w-4 inline mr-2" />
                Create Room
              </button>
              <button
                onClick={() => {
                  setShowRoomDialog(false);
                  setNewRoomName('');
                }}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="h-4 w-4 inline mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Utility functions
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(this, args);
    }.bind(this), wait);
  } as T;
}

function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean;
  return (function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}

export default Designer2DCanvas;