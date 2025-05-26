import { Tool } from "@/app/draw/Canvas";
import { Button } from "@repo/ui/components/button";
import { Circle, Hand, Minus, Pencil, RotateCcw, Square } from "lucide-react";

export function Actionbar({
  tool,
  setSelectedTool,
  onResetView,
  scale,
}: {
  tool: Tool;
  setSelectedTool: (tool: Tool) => void;
  onResetView: () => void;
  scale: number;
}) {
  const activeClass = "bg-accent text-accent-foreground shadow-inner";
  const inactiveClass = "hover:bg-accent/50 text-foreground/80";

  return (
    <div className="fixed left-1/2 top-4 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 p-1.5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border shadow-lg">
        <Button>
          <Hand className="h-5 w-5" />
        </Button>
        <div />
        <Button>
          <Pencil className="h-5 w-5" />
        </Button>
        <div />
        <Button
          size="icon"
          variant="ghost"
          title="Rectangle (R)"
          className={`h-9 w-9 rounded-md transition-colors ${
            tool === "rect" ? activeClass : inactiveClass
          }`}
          onClick={() => setSelectedTool("rect")}
        >
          <Square className="h-5 w-5" />
        </Button>
        <div />
        <Button
          size="icon"
          variant="ghost"
          title="Circle (C)"
          className={`h-9 w-9 rounded-md transition-colors ${
            tool === "circle" ? activeClass : inactiveClass
          }`}
          onClick={() => setSelectedTool("circle")}
        >
          <Circle className="h-5 w-5" />
        </Button>
        <div />
        <Button>
          <Minus className="h-5 w-5" />
        </Button>
        {/* scaling zoom in & out  */}

        <div />
        <div>{Math.round(scale * 100)}%</div>
        <Button>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
