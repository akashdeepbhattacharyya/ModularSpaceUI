export interface BaseObject {
  id: string;
  type: string;
}

export interface Wall extends BaseObject {
  type: 'wall';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  height: number;
}

export interface Door extends BaseObject {
  type: 'door';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  doorType: 'swing-right' | 'swing-left';
}

export interface Window extends BaseObject {
  type: 'window';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export type DesignObject = Wall | Door | Window | KitchenItem |Floor;

export interface Point {
  x: number;
  y: number;
}

export interface DragStart {
  x: number;
  y: number;
  objectId: string;
}

export interface CurrentLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface DesignData {
  objects: DesignObject[];
  zoom: number;
  pan: Point;
  backgroundColor: string;
  timestamp: string;
  version: string;
}

export interface FeetInches {
  feet: number;
  inches: number;
  totalInches: number;
}

export interface Floor extends BaseObject {
  type: 'floor';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  floorType: 'hardwood' | 'tile' | 'carpet' | 'laminate' | 'stone' | 'vinyl';
}

export type SelectedTool = 'select' | 'wall' | 'door' | 'window';
export interface KitchenItemConfig {
  name: string;
  icon: string;
  color: string;
  defaultWidth: number;
  defaultHeight: number;
  category: string;
}

export interface KitchenSidePanelProps {
  isVisible: boolean;
  kitchenItems: { [key: string]: KitchenItemConfig };
  expandedCategories: { [key: string]: boolean };
  onToggleCategory: (category: string) => void;
  onAddKitchenItem: (itemType: string) => void;
}

export interface KitchenItemConfig {
  name: string;
  icon: string;
  color: string;
  defaultWidth: number;
  defaultHeight: number;
  category: string;
}

export interface KitchenItem extends BaseObject {
  type: 'refrigerator' | 'stove' | 'dishwasher' | 'sink' | 'island' | 'upper-cabinet' | 'lower-cabinet' | 'kitchen-table' | 'bar-stool' | 'microwave' | 'pantry';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export type UpdateableProperties = Partial<{
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  doorType: 'swing-right' | 'swing-left';
}>;