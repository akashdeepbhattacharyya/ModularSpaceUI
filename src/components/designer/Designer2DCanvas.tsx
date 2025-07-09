import { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Rect, Circle, Text } from 'fabric';
import { useKitchenStore } from '../../store/kitchenStore';
import toast from 'react-hot-toast';

const Designer2DCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);

  const {
    activeTool,
    isDrawingWall,
    currentWallStart,
    design,
    zoom,
    panOffset,
    startWallDrawing,
    finishWallDrawing,
    cancelWallDrawing,
    addElement,
    selectElement,
    selectWall,
    clearSelection,
    deleteElement,
    deleteWall,
    snapToGrid,
  } = useKitchenStore();

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 4000,
      height: 4000,
      backgroundColor: '#ffffff',
      selection: activeTool === 'select',
    });

    // Configure canvas
    canvas.preserveObjectStacking = true;
    canvas.imageSmoothingEnabled = false;

    setFabricCanvas(canvas);
    toast.success('Kitchen designer ready! Start by drawing walls.');

    return () => {
      canvas.dispose();
    };
  }, []);

  // Draw grid
  const drawGrid = (canvas: FabricCanvas) => {
    const { gridSize, snapToGrid: showGrid } = design;

    // Remove existing grid
    const gridObjects = canvas.getObjects().filter(obj => (obj as any).name === 'grid');
    gridObjects.forEach(obj => canvas.remove(obj));

    if (!showGrid) return;

    const canvasWidth = canvas.width!;
    const canvasHeight = canvas.height!;

    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      const line = new Line([x, 0, x, canvasHeight], {
        stroke: '#d1d5db',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        name: 'grid',
      } as any);
      canvas.add(line);
    }

    // Horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      const line = new Line([0, y, canvasWidth, y], {
        stroke: '#d1d5db',
        strokeWidth: 0.5,
        selectable: false,
        evented: false,
        name: 'grid',
      } as any);
      canvas.add(line);
    }
  };

  // Update canvas when design changes
  useEffect(() => {
    if (!fabricCanvas) return;

    // Clear existing objects (except grid)
    const nonGridObjects = fabricCanvas.getObjects().filter(obj => (obj as any).name !== 'grid');
    nonGridObjects.forEach(obj => fabricCanvas.remove(obj));

    // Draw grid
    drawGrid(fabricCanvas);

    // Draw walls
    design.walls.forEach(wall => {
      const line = new Line([wall.start.x, wall.start.y, wall.end.x, wall.end.y], {
        stroke: wall.selected ? '#3b82f6' : '#374151',
        strokeWidth: wall.thickness,
        strokeLineCap: 'round',
        selectable: activeTool === 'select',
        evented: true,
        name: 'wall',
        data: { id: wall.id, type: 'wall' },
      } as any);

      fabricCanvas.add(line);

      // Add dimension text
      if (wall.selected) {
        const length = Math.sqrt(
          Math.pow(wall.end.x - wall.start.x, 2) +
          Math.pow(wall.end.y - wall.start.y, 2)
        );
        const midX = (wall.start.x + wall.end.x) / 2;
        const midY = (wall.start.y + wall.end.y) / 2;

        const dimensionText = new Text(`${(length / 20).toFixed(1)}ft`, {
          left: midX,
          top: midY - 15,
          fontSize: 12,
          fill: '#374151',
          fontFamily: 'system-ui',
          selectable: false,
          evented: false,
          name: 'dimension',
        });

        fabricCanvas.add(dimensionText);
      }
    });

    // Draw elements
    design.elements.forEach(element => {
      let fabricObject;

      switch (element.type) {
        case 'cabinet':
          fabricObject = new Rect({
            left: element.position.x,
            top: element.position.y,
            width: element.width,
            height: element.height,
            fill: element.selected ? '#fb923c' : '#f3f4f6',
            stroke: element.selected ? '#3b82f6' : '#d1d5db',
            strokeWidth: 2,
            rx: 4,
            ry: 4,
          });
          break;

        case 'sink':
          fabricObject = new Circle({
            left: element.position.x,
            top: element.position.y,
            radius: Math.min(element.width, element.height) / 2,
            fill: element.selected ? '#fb923c' : '#e8f4f8',
            stroke: element.selected ? '#3b82f6' : '#4a90a4',
            strokeWidth: 2,
          });
          break;

        case 'stove':
          fabricObject = new Rect({
            left: element.position.x,
            top: element.position.y,
            width: element.width,
            height: element.height,
            fill: element.selected ? '#fb923c' : '#2c2c2c',
            stroke: element.selected ? '#3b82f6' : '#1a1a1a',
            strokeWidth: 2,
            rx: 6,
            ry: 6,
          });
          break;

        case 'fridge':
          fabricObject = new Rect({
            left: element.position.x,
            top: element.position.y,
            width: element.width,
            height: element.height,
            fill: element.selected ? '#fb923c' : '#f5f5f5',
            stroke: element.selected ? '#3b82f6' : '#d0d0d0',
            strokeWidth: 2,
            rx: 8,
            ry: 8,
          });
          break;

        default:
          fabricObject = new Rect({
            left: element.position.x,
            top: element.position.y,
            width: element.width,
            height: element.height,
            fill: element.color,
            stroke: element.selected ? '#3b82f6' : '#d1d5db',
            strokeWidth: 2,
          });
      }

      if (fabricObject) {
        fabricObject.set({
          angle: element.rotation,
          selectable: activeTool === 'select',
          evented: true,
          name: 'element',
          data: { id: element.id, type: 'element' },
        });

        fabricCanvas.add(fabricObject);

        // Add label
        const label = new Text(element.type.charAt(0).toUpperCase() + element.type.slice(1), {
          left: element.position.x + element.width / 2,
          top: element.position.y + element.height / 2,
          fontSize: 10,
          fill: '#374151',
          fontFamily: 'system-ui',
          selectable: false,
          evented: false,
          originX: 'center',
          originY: 'center',
          name: 'label',
        });

        fabricCanvas.add(label);
      }
    });

    fabricCanvas.renderAll();
  }, [design, activeTool, fabricCanvas]);

  // Handle canvas interactions
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleMouseDown = (e: any) => {
      const pointer = fabricCanvas.getPointer(e.e);

      if (activeTool === 'wall' && !isDrawingWall) {
        startWallDrawing(pointer);
      } else if (activeTool === 'wall' && isDrawingWall) {
        finishWallDrawing(pointer);
      } else if (['cabinet', 'sink', 'stove', 'fridge'].includes(activeTool)) {
        const snappedPoint = snapToGrid(pointer);

        const elementSizes: Record<string, { width: number; height: number }> = {
          cabinet: { width: 60, height: 60 },
          sink: { width: 40, height: 40 },
          stove: { width: 60, height: 60 },
          fridge: { width: 70, height: 40 },
        };
        const elementSize = elementSizes[activeTool] || { width: 50, height: 50 };

        addElement({
          type: activeTool as any,
          position: snappedPoint,
          width: elementSize.width,
          height: elementSize.height,
          rotation: 0,
          color: 'hsl(var(--element-base))',
        });
      }
    };

    const handleObjectSelected = (e: any) => {
      const target = e.selected?.[0];
      if (target?.data) {
        if (target.data.type === 'wall') {
          selectWall(target.data.id);
        } else if (target.data.type === 'element') {
          selectElement(target.data.id);
        }
      }
    };

    const handleSelectionCleared = () => {
      clearSelection();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedWall = design.walls.find(w => w.selected);
        const selectedElement = design.elements.find(el => el.selected);

        if (selectedWall) {
          deleteWall(selectedWall.id);
        } else if (selectedElement) {
          deleteElement(selectedElement.id);
        }
      } else if (e.key === 'Escape') {
        if (isDrawingWall) {
          cancelWallDrawing();
        } else {
          clearSelection();
        }
      }
    };

    fabricCanvas.on('mouse:down', handleMouseDown);
    fabricCanvas.on('selection:created', handleObjectSelected);
    fabricCanvas.on('selection:updated', handleObjectSelected);
    fabricCanvas.on('selection:cleared', handleSelectionCleared);

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      fabricCanvas.off('mouse:down', handleMouseDown);
      fabricCanvas.off('selection:created', handleObjectSelected);
      fabricCanvas.off('selection:updated', handleObjectSelected);
      fabricCanvas.off('selection:cleared', handleSelectionCleared);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fabricCanvas, activeTool, isDrawingWall, design]);

  // Handle drawing preview
  useEffect(() => {
    if (!fabricCanvas || !isDrawingWall || !currentWallStart) return;

    const handleMouseMove = (e: any) => {
      const pointer = fabricCanvas.getPointer(e.e);
      const snappedPoint = snapToGrid(pointer);

      // Remove existing preview
      const previewLines = fabricCanvas.getObjects().filter(obj => (obj as any).name === 'preview');
      previewLines.forEach(obj => fabricCanvas.remove(obj));

      // Add new preview line
      const previewLine = new Line([
        currentWallStart.x,
        currentWallStart.y,
        snappedPoint.x,
        snappedPoint.y
      ], {
        stroke: '#3b82f6',
        strokeWidth: 8,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        name: 'preview',
      });

      fabricCanvas.add(previewLine);
      fabricCanvas.renderAll();
    };

    fabricCanvas.on('mouse:move', handleMouseMove);

    return () => {
      fabricCanvas.off('mouse:move', handleMouseMove);
    };
  }, [fabricCanvas, isDrawingWall, currentWallStart, snapToGrid]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <canvas
        width={4000}
        height={4000}
        ref={canvasRef}
        className="border border-border shadow-soft rounded-lg m-4"
      />

      {/* Instructions overlay */}
      {activeTool === 'wall' && !isDrawingWall && (
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md shadow-medium">
          <p className="text-sm font-medium"> Wall Tool Active - Click on canvas to start drawing</p>
        </div>
      )}

      {isDrawingWall && (
        <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-4 py-2 rounded-md shadow-medium">
          <p className="text-sm font-medium">✏️ Click to finish wall, ESC to cancel</p>
        </div>
      )}
    </div>
  );
};

export default Designer2DCanvas;
// this is my canvas how to make this infinite