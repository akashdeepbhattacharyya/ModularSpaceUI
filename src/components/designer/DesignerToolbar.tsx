import { Button } from '../../components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/toolTip';
import { useKitchenStore, Tool } from '../../store/kitchenStore';
import { 
  MousePointer, 
  Square, 
  Minus, 
  Circle, 
  Flame, 
  Refrigerator,
  Trash2,
  Undo,
  Redo 
} from 'lucide-react';

const tools: Array<{
  id: Tool;
  icon: React.ComponentType<any>;
  label: string;
  description: string;
}> = [
  {
    id: 'select',
    icon: MousePointer,
    label: 'Select',
    description: 'Select and move objects'
  },
  {
    id: 'wall',
    icon: Minus,
    label: 'Draw Wall',
    description: 'Click to start, click to end wall'
  },
  {
    id: 'cabinet',
    icon: Square,
    label: 'Cabinet',
    description: 'Add kitchen cabinets'
  },
  {
    id: 'sink',
    icon: Circle,
    label: 'Sink',
    description: 'Add kitchen sink'
  },
  {
    id: 'stove',
    icon: Flame,
    label: 'Stove',
    description: 'Add cooking stove'
  },
  {
    id: 'fridge',
    icon: Refrigerator,
    label: 'Fridge',
    description: 'Add refrigerator'
  },
];

export const KitchenToolbar = () => {
  const { 
    activeTool, 
    setActiveTool, 
    undo, 
    redo, 
    history, 
    historyIndex 
  } = useKitchenStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="flex flex-col gap-2 p-3">
      {/* Tool buttons */}
      <div className="space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          
          return (
            <Tooltip key={tool.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="icon"
                  className={`w-12 h-12 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-medium' 
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => setActiveTool(tool.id)}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <div>
                  <p className="font-medium">{tool.label}</p>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Separator */}
      <div className="border-t border-border my-2" />

      {/* Action buttons */}
      <div className="space-y-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12"
              onClick={undo}
              disabled={!canUndo}
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <p>Undo (Ctrl+Z)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12"
              onClick={redo}
              disabled={!canRedo}
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <p>Redo (Ctrl+Y)</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Grid indicator */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="text-xs text-center text-muted-foreground">
          <div className="w-8 h-8 mx-auto mb-1 border border-grid-line rounded grid-bg">
            <div className="w-full h-full bg-grid-line/20" />
          </div>
          <span>Grid</span>
        </div>
      </div>
    </div>
  );
};