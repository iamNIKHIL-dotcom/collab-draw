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
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }
      else if(shape.type === "circle"){

      }
      else if(shape.type === "line"){

      }
      else if(shape.type === "pencil"){

      }
    })

  }

  setTool(tool : Tool){
    this.selectedTool = tool;
    // Update cursor based on tool
    if (tool === "pan") {
      this.canvas.style.cursor = "grab";
    } else {
      this.canvas.style.cursor = "crosshair";
    }
  }

  initHandlers(){
    this.socket.onmessage = (event) =>{
      try{
        const message = JSON.parse(event.data);
        if(message.type === "shape_update"){
          const parsedShape = JSON.parse(message.message);
          this.existingShapes.push(parsedShape);
          this.redraw();
        }
      }catch(error){
        console.log("error handline webSocket message:", error);
      }
    }

  }

  redraw(){
    this.clearCanvas();

      this.ctx.setTransform(
      this.scale,
      0,
      0,
      this.scale,
      this.offsetX,
      this.offsetY
    );

    this.drawExistingShapes();
  }

  resetView(){
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.onScaleChange?.(this.scale);
    this.redraw();
  }

  clearCanvas(){
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();    
  }

  initMouseHandlers(){
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }
  mouseDownHandler = (e :MouseEvent) =>{
    if(this.selectedTool === "pan" || e.buttons === 2 || e.button === 2){
      e.preventDefault();
      this.isPanning = true;
      this.lastPanPoint = { x: e.clientX, y: e.clientY };
      // Change cursor to grabbing when actively panning
      if (this.selectedTool === "pan") {
        this.canvas.style.cursor = "grabbing";
      }
      return;
    }

    this.clicked = true;
    this.startX = (e.clientX - this.offsetX) / this.scale;
    this.startY = (e.clientY - this.offsetY) / this.scale;

    if(this.selectedTool === "pencil"){

    }

  }
  mouseUpHandler = (e : MouseEvent) => {
    if(this.isPanning){
      this.isPanning = false;
      this.lastPanPoint = null;

      if(this.selectedTool == "pan"){
        this.canvas.style.cursor = "grab";
      }
      return;
    }

    this.clicked = false;
    
    // Transform mouse coordinates
    const endX = (e.clientX - this.offsetX) / this.scale;
    const endY = (e.clientY - this.offsetY) / this.scale;

    if (this.selectedTool === "pencil") {
      const shape: Shape = {
        type: "pencil",
        points: this.pencilPoints,
      };
      this.existingShapes.push(shape);
      this.socket.send(
        JSON.stringify({
          type: "shape_update",
          message: JSON.stringify(shape),
          roomId: Number(this.roomId),
        })
      );
      this.pencilPoints = [];
    }
    else{
      const width = endX - this.startX;
      const height = endY - this.startY;
      let shape: Shape | null = null;

      if (this.selectedTool === "rect") {
        shape = {
          type: "rect",
          x: this.startX,
          y: this.startY,
          width,
          height,
        };
      }else if(this.selectedTool === "circle"){



      }else if(this.selectedTool === "line"){


      }

      if(shape){
        this.existingShapes.push(shape);
        this.socket.send(JSON.stringify({
          type:"shape_update",
          message : JSON.stringify(shape),
          roomId : Number(this.roomId)
        }))
      }



    }

  } 

  mouseMoveHandler = (e : MouseEvent) => {
    if (this.isPanning && this.lastPanPoint) {
      const dx = e.clientX - this.lastPanPoint.x;
      const dy = e.clientY - this.lastPanPoint.y;

      this.offsetX += dx;
      this.offsetY += dy;

      this.lastPanPoint = { x: e.clientX, y: e.clientY };
      this.redraw();
      return;
    }

    if(this.clicked){
      const x = (e.clientX - this.offsetX) / this.scale;
      const y = (e.clientY - this.offsetY) / this.scale;

      if(this.selectedTool === "pencil"){


      }else{
        this.redraw();
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = this.LINE_WIDTH;

        const width = x - this.startX;
        const height = y - this.startY;

        if(this.selectedTool ==="rect"){
          this.ctx.strokeRect(this.startX, this.startY, width, height);
        }else if(this.selectedTool === "circle"){


        }else if(this.selectedTool === "line"){


        }

      }
    }
  }

  destroy() {
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }
}
