import { KitchenItemConfig } from "./interface";


export const PIXELS_PER_INCH: number = 1;


export const feetToPixels = (feet: number, inches: number = 0): number => {
  return (feet * 12 + inches) * PIXELS_PER_INCH;
};

export const kitchenItems: { [key: string]: KitchenItemConfig } = {
  refrigerator: {
    name: "Refrigerator",
    icon: "🧊",
    color: "#E5E7EB",
    defaultWidth: feetToPixels(3, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "appliances",
  },
  stove: {
    name: "Stove",
    icon: "🔥",
    color: "#374151",
    defaultWidth: feetToPixels(2, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "appliances",
  },
  dishwasher: {
    name: "Dishwasher",
    icon: "🍽️",
    color: "#6B7280",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "appliances",
  },
  microwave: {
    name: "Microwave",
    icon: "📱",
    color: "#9CA3AF",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(1, 0),
    category: "appliances",
  },
  sink: {
    name: "Kitchen Sink",
    icon: "🚿",
    color: "#D1D5DB",
    defaultWidth: feetToPixels(2, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "fixtures",
  },
  island: {
    name: "Kitchen Island",
    icon: "🏝️",
    color: "#F3F4F6",
    defaultWidth: feetToPixels(4, 0),
    defaultHeight: feetToPixels(2, 6),
    category: "fixtures",
  },
  "upper-cabinet": {
    name: "Upper Cabinet",
    icon: "📦",
    color: "#D97706",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(1, 0),
    category: "cabinets",
  },
  "lower-cabinet": {
    name: "Lower Cabinet",
    icon: "🗄️",
    color: "#B45309",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  pantry: {
    name: "Pantry",
    icon: "🥫",
    color: "#92400E",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  "kitchen-table": {
    name: "Kitchen Table",
    icon: "🍽️",
    color: "#78716C",
    defaultWidth: feetToPixels(5, 0),
    defaultHeight: feetToPixels(3, 0),
    category: "furniture",
  },
  "bar-stool": {
    name: "Bar Stool",
    icon: "🪑",
    color: "#57534E",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(1, 6),
    category: "furniture",
  },
};


export const additionalCabinetItems = {
  // Corner Cabinets
  "corner-cabinet": {
    name: "Corner Cabinet",
    icon: "🔄",
    color: "#A16207",
    defaultWidth: feetToPixels(3, 0),
    defaultHeight: feetToPixels(3, 0),
    category: "cabinets",
  },
  "lazy-susan": {
    name: "Lazy Susan Corner",
    icon: "⭐",
    color: "#A16207",
    defaultWidth: feetToPixels(3, 0),
    defaultHeight: feetToPixels(3, 0),
    category: "cabinets",
  },

  // Specialized Cabinets
  "tall-cabinet": {
    name: "Tall Cabinet",
    icon: "🏢",
    color: "#92400E",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(1, 6),
    category: "cabinets",
  },
  "wine-cabinet": {
    name: "Wine Cabinet",
    icon: "🍷",
    color: "#7C2D12",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  "display-cabinet": {
    name: "Display Cabinet",
    icon: "💎",
    color: "#B45309",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(1, 0),
    category: "cabinets",
  },

  // Storage Solutions
  "drawer-cabinet": {
    name: "Drawer Cabinet",
    icon: "📊",
    color: "#A16207",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  "pull-out-drawer": {
    name: "Pull-Out Drawer",
    icon: "↗️",
    color: "#92400E",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  "spice-rack": {
    name: "Spice Rack",
    icon: "🧂",
    color: "#B45309",
    defaultWidth: feetToPixels(1, 0),
    defaultHeight: feetToPixels(0, 6),
    category: "cabinets",
  },

  // Wall Mount Options
  "floating-cabinet": {
    name: "Floating Cabinet",
    icon: "☁️",
    color: "#D97706",
    defaultWidth: feetToPixels(3, 0),
    defaultHeight: feetToPixels(1, 0),
    category: "cabinets",
  },
  "open-shelf": {
    name: "Open Shelf",
    icon: "📚",
    color: "#F59E0B",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(0, 8),
    category: "cabinets",
  },

  // Island Storage
  "island-cabinet": {
    name: "Island Cabinet",
    icon: "🏝️",
    color: "#A16207",
    defaultWidth: feetToPixels(4, 0),
    defaultHeight: feetToPixels(2, 6),
    category: "cabinets",
  },
  "breakfast-bar": {
    name: "Breakfast Bar",
    icon: "🥞",
    color: "#92400E",
    defaultWidth: feetToPixels(6, 0),
    defaultHeight: feetToPixels(1, 6),
    category: "cabinets",
  },

  // Utility Cabinets
  "trash-cabinet": {
    name: "Trash Pull-Out",
    icon: "🗑️",
    color: "#78716C",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  "appliance-garage": {
    name: "Appliance Garage",
    icon: "🚪",
    color: "#A16207",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(1, 0),
    category: "cabinets",
  }
};

// Updated complete kitchenItems object with all cabinet types
export const enhancedKitchenItems: { [key: string]: KitchenItemConfig } = {
  // Existing appliances
  refrigerator: {
    name: "Refrigerator",
    icon: "🧊",
    color: "#E5E7EB",
    defaultWidth: feetToPixels(3, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "appliances",
  },
  stove: {
    name: "Stove",
    icon: "🔥",
    color: "#374151",
    defaultWidth: feetToPixels(2, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "appliances",
  },
  dishwasher: {
    name: "Dishwasher",
    icon: "🍽️",
    color: "#6B7280",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "appliances",
  },
  microwave: {
    name: "Microwave",
    icon: "📱",
    color: "#9CA3AF",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(1, 0),
    category: "appliances",
  },

  // Existing fixtures
  sink: {
    name: "Kitchen Sink",
    icon: "🚿",
    color: "#D1D5DB",
    defaultWidth: feetToPixels(2, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "fixtures",
  },
  island: {
    name: "Kitchen Island",
    icon: "🏝️",
    color: "#F3F4F6",
    defaultWidth: feetToPixels(4, 0),
    defaultHeight: feetToPixels(2, 6),
    category: "fixtures",
  },

  // EXPANDED CABINET COLLECTION
  // Basic Cabinets
  "upper-cabinet": {
    name: "Upper Cabinet",
    icon: "📦",
    color: "#D97706",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(1, 0),
    category: "cabinets",
  },
  "lower-cabinet": {
    name: "Lower Cabinet",
    icon: "🗄️",
    color: "#B45309",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  pantry: {
    name: "Pantry",
    icon: "🥫",
    color: "#92400E",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },

  // Corner Solutions
  "corner-cabinet": {
    name: "Corner Cabinet",
    icon: "🔄",
    color: "#A16207",
    defaultWidth: feetToPixels(3, 0),
    defaultHeight: feetToPixels(3, 0),
    category: "cabinets",
  },
  "lazy-susan": {
    name: "Lazy Susan Corner",
    icon: "⭐",
    color: "#A16207",
    defaultWidth: feetToPixels(3, 0),
    defaultHeight: feetToPixels(3, 0),
    category: "cabinets",
  },

  // Specialized Storage
  "tall-cabinet": {
    name: "Tall Cabinet",
    icon: "🏢",
    color: "#92400E",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(1, 6),
    category: "cabinets",
  },
  "wine-cabinet": {
    name: "Wine Cabinet",
    icon: "🍷",
    color: "#7C2D12",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  "display-cabinet": {
    name: "Display Cabinet",
    icon: "💎",
    color: "#B45309",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(1, 0),
    category: "cabinets",
  },
  "drawer-cabinet": {
    name: "Drawer Cabinet",
    icon: "📊",
    color: "#A16207",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  "pull-out-drawer": {
    name: "Pull-Out Drawer",
    icon: "↗️",
    color: "#92400E",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  "spice-rack": {
    name: "Spice Rack",
    icon: "🧂",
    color: "#B45309",
    defaultWidth: feetToPixels(1, 0),
    defaultHeight: feetToPixels(0, 6),
    category: "cabinets",
  },

  // Wall Mount & Floating
  "floating-cabinet": {
    name: "Floating Cabinet",
    icon: "☁️",
    color: "#D97706",
    defaultWidth: feetToPixels(3, 0),
    defaultHeight: feetToPixels(1, 0),
    category: "cabinets",
  },
  "open-shelf": {
    name: "Open Shelf",
    icon: "📚",
    color: "#F59E0B",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(0, 8),
    category: "cabinets",
  },

  // Island & Bar Storage
  "island-cabinet": {
    name: "Island Cabinet",
    icon: "🏝️",
    color: "#A16207",
    defaultWidth: feetToPixels(4, 0),
    defaultHeight: feetToPixels(2, 6),
    category: "cabinets",
  },
  "breakfast-bar": {
    name: "Breakfast Bar",
    icon: "🥞",
    color: "#92400E",
    defaultWidth: feetToPixels(6, 0),
    defaultHeight: feetToPixels(1, 6),
    category: "cabinets",
  },

  // Utility Solutions
  "trash-cabinet": {
    name: "Trash Pull-Out",
    icon: "🗑️",
    color: "#78716C",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(2, 0),
    category: "cabinets",
  },
  "appliance-garage": {
    name: "Appliance Garage",
    icon: "🚪",
    color: "#A16207",
    defaultWidth: feetToPixels(2, 0),
    defaultHeight: feetToPixels(1, 0),
    category: "cabinets",
  },

  // Existing furniture
  "kitchen-table": {
    name: "Kitchen Table",
    icon: "🍽️",
    color: "#78716C",
    defaultWidth: feetToPixels(5, 0),
    defaultHeight: feetToPixels(3, 0),
    category: "furniture",
  },
  "bar-stool": {
    name: "Bar Stool",
    icon: "🪑",
    color: "#57534E",
    defaultWidth: feetToPixels(1, 6),
    defaultHeight: feetToPixels(1, 6),
    category: "furniture",
  },
};


