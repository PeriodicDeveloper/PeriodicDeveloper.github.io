class Artwork {
   constructor() {
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext('2d');
      document.body.appendChild(this.canvas);
      this.fileName = "Artwork";
      this.timesSaved = 0;
      this.backgroundColor = "black";
   }
   fitToScreen() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
   }
   save() {
      let imgData = this.canvas.toDataURL();
      let link = document.createElement('a');
      link.href = imgData;
      link.download = `${this.fileName}${this.timesSaved}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   }
   setScale(factor) {
      this.canvas.width *= factor;
      this.canvas.height *= factor;
   }
}

class RainDrop {
   constructor(rain, speed, dropSize) {
      this.speed = speed;
      this.rain = rain;
      this.dropSize = dropSize;
      this.splashSize = dropSize * 3;
      this.reset();
   }
   draw() {
      this.rain.ctx.beginPath();
      let rx = this.size / (this.splashPoint / this.y);
      let ry = (this.splashPoint / this.y) * this.size / 5;
      this.rain.ctx.ellipse(this.x, this.y, rx, ry, 0, 0, Math.PI * 2);
      this.rain.ctx.stroke();
   }
   reset() {
      this.splashPoint = this.rain.ground.start + Math.random() * this.rain.config.groundHeight;
      this.state = "falling";
      this.r = this.dropSize;
      this.x = Math.floor(Math.random() * this.rain.canvas.width);
      this.y = 0;
      this.size = this.dropSize;
   }
   tick() {
      if(this.state == "falling") this.fall();
      else if(this.state == "splashing") this.splash();
      else if(this.state == "finished") this.reset();
   }
   fall() {
      if(this.y >= this.splashPoint) this.state = "splashing";
      else this.y += this.speed;
   }
   splash() {
      if(this.size >= this.splashSize) this.state = "finished";
      else this.size += this.speed / 10;
   }
    
}
class Rain extends Artwork {
   constructor(config) {
      super();
      this.fitToScreen();
      this.config = config;
      this.ground = {
         start: this.canvas.height - this.config.groundHeight,
         end: this.canvas.height,
      };
      this.drops = [];
      for(let i = 0; i < this.config.dropCount; i++) {
         let speed = this.config.avgSpeed + this.config.avgSpeed * Math.random();
         let size = Math.sqrt(speed);
         this.drops.push(new RainDrop(
            this,
            speed,
            size,
         ));
      }
      this.refresh();
   }
   randParam(avg, deviance = 0.7) {
      let sign = Math.random() > 0.5 ? 1 : -1;
      let param = avg + sign * (avg * deviance);
      return param;
   }
   refresh() {
      this.fitToScreen();
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "#111111";
      this.ctx.fillRect(0, this.ground.start - 10, this.canvas.width, this.ground.end)
      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 0.5;
      for(let drop of this.drops) {
         drop.tick();
         drop.draw();
      }
      window.requestAnimationFrame(() => {this.refresh()});
   }
}

let rain = new Rain({
   groundHeight: 150,
   dropCount: 150,
   avgSize: {
      drop: 3,
      splash: 10,
   },
   avgSpeed: 10,
});