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

