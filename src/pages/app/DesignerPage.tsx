import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Trash2, Download, Move, Home, Square, Minus, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

// Type definitions
interface BaseObject {
  id: string;
  type: string;
}

interface Wall extends BaseObject {
  type: 'wall';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
}

interface Door extends BaseObject {
  type: 'door';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  doorType: 'swing-right' | 'swing-left';
}

interface Window extends BaseObject {
  type: 'window';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

type DesignObject = Wall | Door | Window;

interface Point {
  x: number;
  y: number;
}

interface DragStart {
  x: number;
  y: number;
  objectId: string;
}

interface CurrentLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface DesignData {
  objects: DesignObject[];
  zoom: number;
  pan: Point;
  backgroundColor: string;
  timestamp: string;
  version: string;
}

interface FeetInches {
  feet: number;
  inches: number;
  totalInches: number;
}

type SelectedTool = 'select' | 'wall' | 'door' | 'window';

const ArchitecturalDesigner: React.FC = () => {
  const [objects, setObjects] = useState<DesignObject[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<SelectedTool>('select');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentLine, setCurrentLine] = useState<CurrentLine | null>(null);
  const [dragStart, setDragStart] = useState<DragStart | null>(null);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<Point | null>(null);
  
  // Infinite canvas state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  
  // Scale conversion: 12 pixels = 1 foot (1 pixel = 1 inch)
  const PIXELS_PER_FOOT: number = 12;
  const PIXELS_PER_INCH: number = 1;
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateId = (): string => Math.random().toString(36).substr(2, 9);

  // Convert pixels to feet and inches
  const pixelsToFeet = (pixels: number): FeetInches => {
    const totalInches = pixels / PIXELS_PER_INCH;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches, totalInches };
  };

  // Format feet and inches for display
  const formatFeetInches = (pixels: number): string => {
    const { feet, inches } = pixelsToFeet(pixels);
    if (feet === 0) return `${inches}"`;
    if (inches === 0) return `${feet}'`;
    return `${feet}' ${inches}"`;
  };

  // Convert feet/inches input to pixels
  const feetToPixels = (feet: number, inches: number = 0): number => {
    return (feet * 12 + inches) * PIXELS_PER_INCH;
  };

  // Convert screen coordinates to world coordinates
  const screenToWorld = (screenX: number, screenY: number): Point => {
    return {
      x: (screenX - pan.x) / zoom,
      y: (screenY - pan.y) / zoom
    };
  };

  // Convert world coordinates to screen coordinates
  const worldToScreen = (worldX: number, worldY: number): Point => {
    return {
      x: worldX * zoom + pan.x,
      y: worldY * zoom + pan.y
    };
  };

  const addDoor = useCallback((): void => {
    const centerX = (400 - pan.x) / zoom;
    const centerY = (300 - pan.y) / zoom;
    
    const newDoor: Door = {
      id: generateId(),
      type: 'door',
      x: centerX,
      y: centerY,
      width: feetToPixels(3, 0), // 3 feet standard door width
      height: feetToPixels(0, 6), // 6 inches wall thickness
      rotation: 0,
      doorType: 'swing-right'
    };
    
    setObjects(prev => [...prev, newDoor]);
    setSelectedId(newDoor.id);
  }, [pan.x, pan.y, zoom]);

  const addWindow = useCallback((): void => {
    const centerX = (400 - pan.x) / zoom;
    const centerY = (300 - pan.y) / zoom;
    
    const newWindow: Window = {
      id: generateId(),
      type: 'window',
      x: centerX,
      y: centerY,
      width: feetToPixels(4, 0), // 4 feet standard window width
      height: feetToPixels(0, 6), // 6 inches wall thickness
      rotation: 0
    };
    
    setObjects(prev => [...prev, newWindow]);
    setSelectedId(newWindow.id);
  }, [pan.x, pan.y, zoom]);

  const deleteSelected = (): void => {
    if (selectedId) {
      setObjects(prev => prev.filter(obj => obj.id !== selectedId));
      setSelectedId(null);
    }
  };

  const clearCanvas = (): void => {
    setObjects([]);
    setSelectedId(null);
  };

  const updateObject = (id: string, updates: Partial<Omit<DesignObject, 'id' | 'type'>>): void => {
    setObjects(prev => prev.map(obj => 
      obj.id === id ? { ...obj, ...updates } as DesignObject : obj
    ));
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>): void => {
    e.preventDefault();
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, zoom * zoomFactor));
    
    // Zoom towards mouse position
    const zoomRatio = newZoom / zoom;
    setPan(prev => ({
      x: mouseX - (mouseX - prev.x) * zoomRatio,
      y: mouseY - (mouseY - prev.y) * zoomRatio
    }));
    
    setZoom(newZoom);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>): void => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = screenToWorld(screenX, screenY);

    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) { // Middle mouse or Ctrl+Left
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: screenX - pan.x, y: screenY - pan.y });
      return;
    }

    if (selectedTool === 'wall') {
      setIsDrawing(true);
      setStartPoint(worldPos);
      setCurrentLine({ x1: worldPos.x, y1: worldPos.y, x2: worldPos.x, y2: worldPos.y });
    } else if (selectedTool === 'select') {
      setSelectedId(null);
    }
  };

  const handleObjectMouseDown = (e: React.MouseEvent, objectId: string): void => {
    e.stopPropagation();
    if (selectedTool === 'select' && svgRef.current) {
      setSelectedId(objectId);
      const rect = svgRef.current.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const worldPos = screenToWorld(screenX, screenY);
      const obj = objects.find(o => o.id === objectId);
      if (obj && obj.type !== 'wall') {
        const positionedObj = obj as Door | Window;
        setDragStart({
          x: worldPos.x - positionedObj.x,
          y: worldPos.y - positionedObj.y,
          objectId
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>): void => {
    if (!svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPos = screenToWorld(screenX, screenY);

    if (isPanning && panStart) {
      setPan({
        x: screenX - panStart.x,
        y: screenY - panStart.y
      });
      return;
    }

    if (selectedTool === 'wall' && isDrawing && startPoint) {
      setCurrentLine({ x1: startPoint.x, y1: startPoint.y, x2: worldPos.x, y2: worldPos.y });
    } else if (dragStart && selectedTool === 'select') {
      const obj = objects.find(o => o.id === dragStart.objectId);
      if (obj && obj.type !== 'wall') {
        updateObject(dragStart.objectId, {
          x: worldPos.x - dragStart.x,
          y: worldPos.y - dragStart.y
        });
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent<SVGSVGElement>): void => {
    if (isPanning) {
      setIsPanning(false);
      setPanStart(null);
      return;
    }

    if (selectedTool === 'wall' && isDrawing && currentLine) {
      const newWall: Wall = {
        id: generateId(),
        type: 'wall',
        x1: currentLine.x1,
        y1: currentLine.y1,
        x2: currentLine.x2,
        y2: currentLine.y2,
        thickness: feetToPixels(0, 6) // 6 inches standard wall thickness
      };
      setObjects(prev => [...prev, newWall]);
      setSelectedId(newWall.id);
    }
    
    setIsDrawing(false);
    setStartPoint(null);
    setCurrentLine(null);
    setDragStart(null);
  };

  const resetView = (): void => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const zoomIn = (): void => {
    setZoom(prev => Math.min(5, prev * 1.2));
  };

  const zoomOut = (): void => {
    setZoom(prev => Math.max(0.1, prev / 1.2));
  };

  const exportAsImage = (): void => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create a temporary SVG with current view
    const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tempSvg.setAttribute('width', '800');
    tempSvg.setAttribute('height', '600');
    tempSvg.setAttribute('viewBox', '0 0 800 600');
    
    // Add grid background
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');
    pattern.setAttribute('id', 'exportGrid');
    pattern.setAttribute('width', String(PIXELS_PER_FOOT * zoom));
    pattern.setAttribute('height', String(PIXELS_PER_FOOT * zoom));
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('x', String(pan.x % (PIXELS_PER_FOOT * zoom)));
    pattern.setAttribute('y', String(pan.y % (PIXELS_PER_FOOT * zoom)));
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${PIXELS_PER_FOOT * zoom} 0 L 0 0 0 ${PIXELS_PER_FOOT * zoom}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#f0f0f0');
    path.setAttribute('stroke-width', '1');
    
    pattern.appendChild(path);
    defs.appendChild(pattern);
    tempSvg.appendChild(defs);
    
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('width', '100%');
    bgRect.setAttribute('height', '100%');
    bgRect.setAttribute('fill', 'url(#exportGrid)');
    tempSvg.appendChild(bgRect);
    
    // Add transformed group
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('transform', `translate(${pan.x}, ${pan.y}) scale(${zoom})`);
    
    // Add all objects
    objects.forEach(obj => {
      const element = createSVGElement(obj);
      if (element) group.appendChild(element);
    });
    
    tempSvg.appendChild(group);
    
    // Convert to image
    const svgString = new XMLSerializer().serializeToString(tempSvg);
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = 'floor-plan.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const createSVGElement = (obj: DesignObject): SVGElement | null => {
    const ns = 'http://www.w3.org/2000/svg';
    
    switch (obj.type) {
      case 'wall':
        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', String(obj.x1));
        line.setAttribute('y1', String(obj.y1));
        line.setAttribute('x2', String(obj.x2));
        line.setAttribute('y2', String(obj.y2));
        line.setAttribute('stroke', '#333');
        line.setAttribute('stroke-width', String(obj.thickness / zoom));
        line.setAttribute('stroke-linecap', 'round');
        
        // Add dimension text
        const wallLengthPixels = Math.sqrt(Math.pow(obj.x2 - obj.x1, 2) + Math.pow(obj.y2 - obj.y1, 2));
        const wallLengthFormatted = formatFeetInches(wallLengthPixels);
        const wallThicknessFormatted = formatFeetInches(obj.thickness);
        
        const midX = (obj.x1 + obj.x2) / 2;
        const midY = (obj.y1 + obj.y2) / 2;
        const wallAngle = Math.atan2(obj.y2 - obj.y1, obj.x2 - obj.x1);
        const perpAngle = wallAngle + Math.PI / 2;
        const textOffset = 20 / zoom;
        const textX = midX + Math.cos(perpAngle) * textOffset;
        const textY = midY + Math.sin(perpAngle) * textOffset;
        
        const group = document.createElementNS(ns, 'g');
        group.appendChild(line);
        
        const text = document.createElementNS(ns, 'text');
        text.setAttribute('x', String(textX));
        text.setAttribute('y', String(textY));
        text.setAttribute('font-size', String(12 / zoom));
        text.setAttribute('fill', '#666');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('transform', `rotate(${wallAngle * 180 / Math.PI}, ${textX}, ${textY})`);
        text.textContent = `L: ${wallLengthFormatted} | T: ${wallThicknessFormatted}`;
        group.appendChild(text);
        
        return group;
        
      case 'door':
        const doorGroup = document.createElementNS(ns, 'g');
        doorGroup.setAttribute('transform', `translate(${obj.x}, ${obj.y}) rotate(${obj.rotation}) scale(${1/zoom})`);
        
        const doorRect = document.createElementNS(ns, 'rect');
        doorRect.setAttribute('width', String(obj.width));
        doorRect.setAttribute('height', String(obj.height));
        doorRect.setAttribute('fill', '#8B4513');
        doorRect.setAttribute('stroke', '#654321');
        doorRect.setAttribute('stroke-width', '1');
        doorGroup.appendChild(doorRect);
        
        return doorGroup;
        
      case 'window':
        const windowGroup = document.createElementNS(ns, 'g');
        windowGroup.setAttribute('transform', `translate(${obj.x}, ${obj.y}) rotate(${obj.rotation}) scale(${1/zoom})`);
        
        const windowRect = document.createElementNS(ns, 'rect');
        windowRect.setAttribute('width', String(obj.width));
        windowRect.setAttribute('height', String(obj.height));
        windowRect.setAttribute('fill', '#E6F3FF');
        windowRect.setAttribute('stroke', '#4A90E2');
        windowRect.setAttribute('stroke-width', '2');
        windowGroup.appendChild(windowRect);
        
        return windowGroup;
        
      default:
        return null;
    }
  };

  const saveAsJSON = (): void => {
    const designData: DesignData = {
      objects,
      zoom,
      pan,
      backgroundColor,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const jsonString = JSON.stringify(designData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = 'floor-plan.json';
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  const loadFromJSON = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const designData: DesignData = JSON.parse(result);
          
          if (designData.objects) {
            setObjects(designData.objects);
            setSelectedId(null);
            
            if (designData.zoom) setZoom(designData.zoom);
            if (designData.pan) setPan(designData.pan);
            if (designData.backgroundColor) setBackgroundColor(designData.backgroundColor);
          }
        }
      } catch (error) {
        alert('Error loading file: Invalid JSON format');
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };

  useEffect(() => {
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const renderObject = (obj: DesignObject): JSX.Element | null => {
    const isSelected = obj.id === selectedId;
    const selectionStyle = isSelected ? { stroke: '#007bff', strokeWidth: 2 / zoom, strokeDasharray: `${5/zoom},${5/zoom}` } : {};

    switch (obj.type) {
      case 'wall':
        // Calculate wall length in pixels
        const wallLengthPixels = Math.sqrt(
          Math.pow(obj.x2 - obj.x1, 2) + Math.pow(obj.y2 - obj.y1, 2)
        );
        
        // Convert to feet and inches
        const wallLengthFormatted = formatFeetInches(wallLengthPixels);
        const wallThicknessFormatted = formatFeetInches(obj.thickness);
        
        // Calculate midpoint for text positioning
        const midX = (obj.x1 + obj.x2) / 2;
        const midY = (obj.y1 + obj.y2) / 2;
        
        // Calculate perpendicular offset for text
        const wallAngle = Math.atan2(obj.y2 - obj.y1, obj.x2 - obj.x1);
        const perpAngle = wallAngle + Math.PI / 2;
        const textOffset = 20 / zoom; // Scale offset with zoom
        const textX = midX + Math.cos(perpAngle) * textOffset;
        const textY = midY + Math.sin(perpAngle) * textOffset;
        
        return (
          <g key={obj.id}>
            <line
              x1={obj.x1}
              y1={obj.y1}
              x2={obj.x2}
              y2={obj.y2}
              stroke="#333"
              strokeWidth={obj.thickness / zoom}
              strokeLinecap="round"
              onMouseDown={(e) => handleObjectMouseDown(e, obj.id)}
              style={{ cursor: selectedTool === 'select' ? 'move' : 'default' }}
            />
            {isSelected && (
              <line
                x1={obj.x1}
                y1={obj.y1}
                x2={obj.x2}
                y2={obj.y2}
                stroke="#007bff"
                strokeWidth={(obj.thickness + 4) / zoom}
                strokeDasharray={`${5/zoom},${5/zoom}`}
                opacity={0.5}
                style={{ pointerEvents: 'none' }}
              />
            )}
            
            {/* Wall dimensions text */}
            <text
              x={textX}
              y={textY}
              fontSize={12 / zoom}
              fill="#666"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ pointerEvents: 'none' }}
              transform={`rotate(${wallAngle * 180 / Math.PI}, ${textX}, ${textY})`}
            >
              L: {wallLengthFormatted} | T: {wallThicknessFormatted}
            </text>
          </g>
        );

      case 'door':
        const doorArcRadius = obj.width;
        const doorScale = 1 / zoom;
        
        return (
          <g key={obj.id} transform={`translate(${obj.x}, ${obj.y}) rotate(${obj.rotation}) scale(${doorScale})`}>
            <rect
              x={0}
              y={0}
              width={obj.width}
              height={obj.height}
              fill="#8B4513"
              stroke="#654321"
              strokeWidth={1}
              onMouseDown={(e) => handleObjectMouseDown(e, obj.id)}
              style={{ cursor: selectedTool === 'select' ? 'move' : 'default' }}
            />
            
            <path
              d={`M ${obj.doorType === 'swing-right' ? 0 : obj.width} ${obj.height/2} 
                  A ${doorArcRadius} ${doorArcRadius} 0 0 ${obj.doorType === 'swing-right' ? 1 : 0} 
                  ${obj.doorType === 'swing-right' ? doorArcRadius : obj.width - doorArcRadius} ${obj.height/2 + doorArcRadius}`}
              fill="none"
              stroke="#666"
              strokeWidth={1}
              strokeDasharray="3,3"
              style={{ pointerEvents: 'none' }}
            />
            
            <line
              x1={obj.doorType === 'swing-right' ? 0 : obj.width}
              y1={obj.height/2}
              x2={obj.doorType === 'swing-right' ? obj.width * 0.7 : obj.width * 0.3}
              y2={obj.height/2 + obj.width * 0.7}
              stroke="#8B4513"
              strokeWidth={2}
              style={{ pointerEvents: 'none' }}
            />
            
            {isSelected && (
              <rect
                x={-2}
                y={-2}
                width={obj.width + 4}
                height={obj.height + 4}
                fill="none"
                {...selectionStyle}
                style={{ pointerEvents: 'none' }}
                transform={`scale(${zoom})`}
              />
            )}
          </g>
        );

      case 'window':
        const windowScale = 1 / zoom;
        
        return (
          <g key={obj.id} transform={`translate(${obj.x}, ${obj.y}) rotate(${obj.rotation}) scale(${windowScale})`}>
            <rect
              x={0}
              y={0}
              width={obj.width}
              height={obj.height}
              fill="#E6F3FF"
              stroke="#4A90E2"
              strokeWidth={2}
              onMouseDown={(e) => handleObjectMouseDown(e, obj.id)}
              style={{ cursor: selectedTool === 'select' ? 'move' : 'default' }}
            />
            
            <line
              x1={obj.width/2}
              y1={0}
              x2={obj.width/2}
              y2={obj.height}
              stroke="#4A90E2"
              strokeWidth={1}
              style={{ pointerEvents: 'none' }}
            />
            
            <line
              x1={0}
              y1={obj.height/2}
              x2={obj.width}
              y2={obj.height/2}
              stroke="#4A90E2"
              strokeWidth={1}
              style={{ pointerEvents: 'none' }}
            />
            
            {isSelected && (
              <rect
                x={-2}
                y={-2}
                width={obj.width + 4}
                height={obj.height + 4}
                fill="none"
                {...selectionStyle}
                style={{ pointerEvents: 'none' }}
                transform={`scale(${zoom})`}
              />
            )}
          </g>
        );

      default:
        return null;
    }
  };

  const getSelectedObject = (): DesignObject | undefined => {
    return selectedId ? objects.find(obj => obj.id === selectedId) : undefined;
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Infinite Floor Plan Designer</h1>
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white rounded-lg shadow-md">
        {/* Tools */}
        <button
          onClick={() => setSelectedTool('select')}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            selectedTool === 'select' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Move size={16} />
          Select
        </button>
        
        <button
          onClick={() => setSelectedTool('wall')}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            selectedTool === 'wall' 
              ? 'bg-gray-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Minus size={16} />
          Wall
        </button>
        
        {/* Architectural Elements */}
        <button
          onClick={addDoor}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors"
        >
          <Square size={16} />
          Door
        </button>
        
        <button
          onClick={addWindow}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
        >
          <Home size={16} />
          Window
        </button>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 ml-4 border-l pl-4">
          <button
            onClick={zoomIn}
            className="flex items-center gap-1 px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          
          <span className="px-2 py-1 bg-gray-100 rounded text-sm min-w-16 text-center">
            {Math.round(zoom * 100)}%
          </span>
          
          <button
            onClick={zoomOut}
            className="flex items-center gap-1 px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          
          <button
            onClick={resetView}
            className="flex items-center gap-1 px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
        
        {/* File Operations */}
        <div className="flex items-center gap-2 ml-4 border-l pl-4">
          <input
            type="file"
            accept=".json"
            onChange={loadFromJSON}
            className="hidden"
            id="json-upload"
          />
          <label
            htmlFor="json-upload"
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors cursor-pointer"
          >
            📁 Load JSON
          </label>
          
          <button
            onClick={saveAsJSON}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            💾 Save JSON
          </button>
          
          <button
            onClick={exportAsImage}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            Export PNG
          </button>
        </div>
        
        {/* Utility Tools */}
        <button
          onClick={deleteSelected}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          disabled={!selectedId}
        >
          <Trash2 size={16} />
          Delete
        </button>
        
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Clear All
        </button>
      </div>
      
      {/* Canvas */}
      <div 
        ref={containerRef}
        className="border-2 border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden"
        style={{ width: '800px', height: '600px' }}
      >
        <svg
          ref={svgRef}
          width="800"
          height="600"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`${selectedTool === 'wall' ? 'cursor-crosshair' : 'cursor-default'} ${isPanning ? 'cursor-move' : ''}`}
          style={{ userSelect: 'none' }}
        >
          {/* Infinite grid pattern */}
          <defs>
            <pattern 
              id="grid" 
              width={PIXELS_PER_FOOT * zoom} 
              height={PIXELS_PER_FOOT * zoom} 
              patternUnits="userSpaceOnUse"
              x={pan.x % (PIXELS_PER_FOOT * zoom)}
              y={pan.y % (PIXELS_PER_FOOT * zoom)}
            >
              <path 
                d={`M ${PIXELS_PER_FOOT * zoom} 0 L 0 0 0 ${PIXELS_PER_FOOT * zoom}`} 
                fill="none" 
                stroke="#f0f0f0" 
                strokeWidth={1}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {objects.map(renderObject)}
            
            {/* Current wall being drawn */}
            {selectedTool === 'wall' && currentLine && (
              <line
                x1={currentLine.x1}
                y1={currentLine.y1}
                x2={currentLine.x2}
                y2={currentLine.y2}
                stroke="#666"
                strokeWidth={8 / zoom}
                strokeDasharray={`${5/zoom},${5/zoom}`}
                opacity={0.7}
                style={{ pointerEvents: 'none' }}
              />
            )}
          </g>
        </svg>
      </div>
      
      {/* Selected Object Properties */}
      {selectedId && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Selected Object Properties</h3>
          <div className="flex gap-4 items-center">
            {(() => {
              const selectedObj = getSelectedObject();
              if (!selectedObj) return null;
              
              if (selectedObj.type === 'wall') {
                return (
                  <label className="flex items-center gap-2">
                    Wall Thickness:
                    <input
                      type="range"
                      min={feetToPixels(0, 2)} // 2 inches minimum
                      max={feetToPixels(1, 0)} // 12 inches maximum
                      step="1"
                      value={selectedObj.thickness}
                      onChange={(e) => updateObject(selectedId, { thickness: parseInt(e.target.value) })}
                      className="w-32"
                    />
                    <span className="text-sm min-w-12">
                      {formatFeetInches(selectedObj.thickness)}
                    </span>
                  </label>
                );
              }
              
              if (selectedObj.type === 'door') {
                return (
                  <>
                    <label className="flex items-center gap-2">
                      Door Type:
                      <select
                        value={selectedObj.doorType}
                        onChange={(e) => updateObject(selectedId, { doorType: e.target.value as 'swing-right' | 'swing-left' })}
                        className="px-2 py-1 border rounded"
                      >
                        <option value="swing-right">Swing Right</option>
                        <option value="swing-left">Swing Left</option>
                      </select>
                    </label>
                    <label className="flex items-center gap-2">
                      Width:
                      <input
                        type="range"
                        min={feetToPixels(2, 0)} // 2 feet minimum
                        max={feetToPixels(5, 0)} // 5 feet maximum
                        step="3" // 3 inches steps
                        value={selectedObj.width}
                        onChange={(e) => updateObject(selectedId, { width: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm min-w-12">
                        {formatFeetInches(selectedObj.width)}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      Rotation:
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="45"
                        value={selectedObj.rotation}
                        onChange={(e) => updateObject(selectedId, { rotation: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm">{selectedObj.rotation}°</span>
                    </label>
                  </>
                );
              }
              
              if (selectedObj.type === 'window') {
                return (
                  <>
                    <label className="flex items-center gap-2">
                      Width:
                      <input
                        type="range"
                        min={feetToPixels(1, 0)} // 1 foot minimum
                        max={feetToPixels(8, 0)} // 8 feet maximum
                        step="6" // 6 inches steps
                        value={selectedObj.width}
                        onChange={(e) => updateObject(selectedId, { width: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm min-w-12">
                        {formatFeetInches(selectedObj.width)}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      Rotation:
                      <input
                        type="range"
                        min="0"
                        max="360"
                        step="45"
                        value={selectedObj.rotation}
                        onChange={(e) => updateObject(selectedId, { rotation: parseInt(e.target.value) })}
                        className="w-20"
                      />
                      <span className="text-sm">{selectedObj.rotation}°</span>
                    </label>
                  </>
                );
              }
              
              return null;
            })()}
          </div>
        </div>
      )}
      
      {/* Instructions */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md max-w-2xl">
        <h3 className="text-lg font-semibold mb-2">Architectural Floor Plan Designer:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• <strong>Scale:</strong> 1 pixel = 1 inch (12 pixels = 1 foot)</li>
          <li>• <strong>Grid:</strong> 1-foot grid squares for precise alignment</li>
          <li>• <strong>Wall dimensions:</strong> Length and thickness shown in feet and inches (e.g., "8' 6\"", "6\"")</li>
          <li>• <strong>Standard sizes:</strong> Doors: 3' wide, Windows: 4' wide, Walls: 6" thick</li>
          <li>• <strong>Wall thickness:</strong> Adjustable from 2" to 12" using the properties panel</li>
          <li>• <strong>Door/Window width:</strong> Adjustable in properties panel</li>
          <li>• <strong>Mouse wheel:</strong> Zoom in/out</li>
          <li>• <strong>Middle mouse drag:</strong> Pan around the infinite canvas</li>
          <li>• <strong>Ctrl + Left mouse drag:</strong> Alternative pan method</li>
          <li>• <strong>Save/Load:</strong> Save your design as JSON and load it back later</li>
          <li>• <strong>Export PNG:</strong> Export current view as image file</li>
        </ul>
      </div>
    </div>
  );
};

export default ArchitecturalDesigner;