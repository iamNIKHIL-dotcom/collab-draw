import { getExistingShapes } from "./api";

export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "pencil";
      points: { x: number; y: number }[];
    };

export type Tool =
  | "rect"
  | "circle"
  | "eraser"
  | "pencil"
  | "line"
  | "text"
  | "color"
  | "pan";
export class Canvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private roomId: string;
  private socket: WebSocket;
  private clicked: boolean;
  private startX: number;
  private startY: number;
  private selectedTool: Tool;  private scale: number = 1;
  private offsetX: number = 0;
  private offsetY: number = 0;

  private pencilPoints: { x: number; y: number }[] = [];
  private isPanning: boolean = false;
  private lastPanPoint: { x: number; y: number } | null = null;
  private readonly LINE_WIDTH = 2;
  onScaleChange?: (scale: number) => void;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.startX = 0;
    this.startY = 0;
    this.selectedTool = "rect";
    this.isPanning = false;
    this.lastPanPoint = null;
    this.ctx.lineWidth = this.LINE_WIDTH;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();    
  }
  async init(){
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.existingShapes = await getExistingShapes(this.roomId);
    this.drawExistingShapes();    
  }
  drawExistingShapes(){
    this.existingShapes.forEach((shape) => {
      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = this.LINE_WIDTH;

      if(shape.type === "rect"){

      }
      else if(shape.type === "circle"){

      }
      else if(shape.type === "line"){

      }
      else if(shape.type === "pencil"){

      }
    })

  }
  initHandlers(){

  }
  initMouseHandlers(){
    
  }

  destroy() {}
}
