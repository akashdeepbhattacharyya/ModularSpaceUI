import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export type Tool = 'select' | 'wall' | 'cabinet' | 'sink' | 'stove' | 'fridge' | 'delete';

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  start: Point;
  end: Point;
  thickness: number;
  selected: boolean;
}

export interface KitchenElement {
  id: string;
  type: 'cabinet' | 'sink' | 'stove' | 'fridge' | 'counter';
  position: Point;
  width: number;
  height: number;
  rotation: number;
  selected: boolean;
  color: string;
}

export interface Design {
  walls: Wall[];
  elements: KitchenElement[];
  gridSize: number;
  snapToGrid: boolean;
}

interface KitchenStore {
  // UI State
  activeTool: Tool;
  isDrawingWall: boolean;
  currentWallStart: Point | null;
  
  // Design State
  design: Design;
  history: Design[];
  historyIndex: number;
  
  // Canvas State
  zoom: number;
  panOffset: Point;
  
  // Actions
  setActiveTool: (tool: Tool) => void;
  startWallDrawing: (point: Point) => void;
  finishWallDrawing: (point: Point) => void;
  cancelWallDrawing: () => void;
  
  addElement: (element: Omit<KitchenElement, 'id' | 'selected'>) => void;
  updateElement: (id: string, updates: Partial<KitchenElement>) => void;
  deleteElement: (id: string) => void;
  selectElement: (id: string) => void;
  clearSelection: () => void;
  
  deleteWall: (id: string) => void;
  selectWall: (id: string) => void;
  
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: Point) => void;
  
  toggleGrid: () => void;
  setGridSize: (size: number) => void;
  
  snapToGrid: (point: Point) => Point;
}

const initialDesign: Design = {
  walls: [],
  elements: [],
  gridSize: 20,
  snapToGrid: true,
};

export const useKitchenStore = create<KitchenStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    activeTool: 'select',
    isDrawingWall: false,
    currentWallStart: null,
    design: initialDesign,
    history: [initialDesign],
    historyIndex: 0,
    zoom: 1,
    panOffset: { x: 0, y: 0 },

    // Actions
    setActiveTool: (tool) => set({ activeTool: tool }),

    startWallDrawing: (point) => {
      const { snapToGrid } = get();
      const snappedPoint = snapToGrid(point);
      set({ 
        isDrawingWall: true, 
        currentWallStart: snappedPoint 
      });
    },

    finishWallDrawing: (point) => {
      const { currentWallStart, snapToGrid, saveToHistory } = get();
      if (!currentWallStart) return;

      const snappedPoint = snapToGrid(point);
      const distance = Math.sqrt(
        Math.pow(snappedPoint.x - currentWallStart.x, 2) +
        Math.pow(snappedPoint.y - currentWallStart.y, 2)
      );

      // Only create wall if it's longer than minimum distance
      if (distance > 20) {
        const newWall: Wall = {
          id: `wall-${Date.now()}`,
          start: currentWallStart,
          end: snappedPoint,
          thickness: 8,
          selected: false,
        };

        set((state) => ({
          design: {
            ...state.design,
            walls: [...state.design.walls, newWall],
          },
          isDrawingWall: false,
          currentWallStart: null,
        }));

        saveToHistory();
      } else {
        // Cancel if too short
        set({ 
          isDrawingWall: false, 
          currentWallStart: null 
        });
      }
    },

    cancelWallDrawing: () => set({ 
      isDrawingWall: false, 
      currentWallStart: null 
    }),

    addElement: (elementData) => {
      const { saveToHistory } = get();
      const newElement: KitchenElement = {
        ...elementData,
        id: `${elementData.type}-${Date.now()}`,
        selected: false,
      };

      set((state) => ({
        design: {
          ...state.design,
          elements: [...state.design.elements, newElement],
        },
      }));

      saveToHistory();
    },

    updateElement: (id, updates) => {
      set((state) => ({
        design: {
          ...state.design,
          elements: state.design.elements.map((el) =>
            el.id === id ? { ...el, ...updates } : el
          ),
        },
      }));
    },

    deleteElement: (id) => {
      const { saveToHistory } = get();
      set((state) => ({
        design: {
          ...state.design,
          elements: state.design.elements.filter((el) => el.id !== id),
        },
      }));
      saveToHistory();
    },

    selectElement: (id) => {
      set((state) => ({
        design: {
          ...state.design,
          elements: state.design.elements.map((el) => ({
            ...el,
            selected: el.id === id,
          })),
          walls: state.design.walls.map((wall) => ({
            ...wall,
            selected: false,
          })),
        },
      }));
    },

    clearSelection: () => {
      set((state) => ({
        design: {
          ...state.design,
          elements: state.design.elements.map((el) => ({
            ...el,
            selected: false,
          })),
          walls: state.design.walls.map((wall) => ({
            ...wall,
            selected: false,
          })),
        },
      }));
    },

    deleteWall: (id) => {
      const { saveToHistory } = get();
      set((state) => ({
        design: {
          ...state.design,
          walls: state.design.walls.filter((wall) => wall.id !== id),
        },
      }));
      saveToHistory();
    },

    selectWall: (id) => {
      set((state) => ({
        design: {
          ...state.design,
          walls: state.design.walls.map((wall) => ({
            ...wall,
            selected: wall.id === id,
          })),
          elements: state.design.elements.map((el) => ({
            ...el,
            selected: false,
          })),
        },
      }));
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        set({
          design: history[newIndex],
          historyIndex: newIndex,
        });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        set({
          design: history[newIndex],
          historyIndex: newIndex,
        });
      }
    },

    saveToHistory: () => {
      const { design, history, historyIndex } = get();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ ...design });
      
      // Limit history size
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),

    setPanOffset: (offset) => set({ panOffset: offset }),

    toggleGrid: () => {
      set((state) => ({
        design: {
          ...state.design,
          snapToGrid: !state.design.snapToGrid,
        },
      }));
    },

    setGridSize: (size) => {
      set((state) => ({
        design: {
          ...state.design,
          gridSize: size,
        },
      }));
    },

    snapToGrid: (point) => {
      const { design } = get();
      if (!design.snapToGrid) return point;
      
      const { gridSize } = design;
      return {
        x: Math.round(point.x / gridSize) * gridSize,
        y: Math.round(point.y / gridSize) * gridSize,
      };
    },
  }))
);