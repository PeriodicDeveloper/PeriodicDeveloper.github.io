// Definition for the Guy class
class Guy {
  constructor(canvas, aCtx, aDest, x, y, acceleration) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.w = 20;
    this.h = 40;
    this.x1 = x;
    this.y1 = y;
    this.updateCoord2();
    this.scale = 1;
    this.grow = 0;
    this.maxSpeed = 80;
    this.bounce = 0.75;
    this.drag = 0.01;
    this.acceleration = acceleration;
    
    this.velocity = {
      x: 0,
      y: 0 
    };
    
    // Create oscillator and gain and connect to aCtx
    this.aCtx = aCtx;
    this.gainNode = this.aCtx.createGain();
    this.oscill = this.aCtx.createOscillator();
    this.oscill.type = 'square';
    this.oscill.connect(this.gainNode);
    this.gainNode.connect(aDest);
    this.updateOscill();
    this.oscill.start();
  }
  updateOscill() {
    this.gainNode.gain.setValueAtTime(this.speed()/this.maxSpeed/100, this.aCtx.currentTime);
    this.oscill.frequency.setValueAtTime((this.canvas.height - this.y1)/this.canvas.height*2000, this.aCtx.currentTime);
  }
  updateCoord2() {
    this.x2 = this.x1 + this.w;
    this.y2 = this.y1 + this.h;
  }
  speed(axis) {
    if(axis == 'x' || axis == 'y') {
      return Math.abs(this.velocity[axis]);
    }
    else {
       return Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
    }
  }
  bounceOffWalls() {
    let bounds = {
      "left":   [this.x1 < 0, 'x', 1],
      "right":  [this.x2 > this.canvas.width, 'x', -1],
      "top":    [this.y1 < 0, 'y', 1],
      "bottom": [this.y2 > this.canvas.height, 'y', -1],
    };
    for(let bound of Object.values(bounds)) {
      let collision = bound[0];
      let axis =      bound[1];
      let direction = bound[2];
      if(collision) {
        this.velocity[axis] = Math.abs(this.velocity[axis]) 
          * direction * this.bounce;
      }
    }
  }
  move(events) {
    this.handleArrowKeys(events.keys);
    this.handleMouse(events.mouse);
    this.updateCoord2();
    this.bounceOffWalls();
    this.velocity.x *= 1 - this.drag;
    this.velocity.y *= 1 - this.drag;
    this.x1 += this.velocity.x;
    this.y1 += this.velocity.y;
  }
  handleArrowKeys(keys) {
    if(this.speed('y') < this.maxSpeed) {
      if(keys.ArrowUp) {
        this.velocity.y -= this.acceleration;
      }
      if(keys.ArrowDown) {
        this.velocity.y += this.acceleration;
      }
    }
    if(this.speed('x') < this.maxSpeed) {
      if(keys.ArrowLeft) {
        this.velocity.x -= this.acceleration;
      }
      if(keys.ArrowRight) {
        this.velocity.x += this.acceleration;
      }
    }
  }
  handleMouse(mouse) {
    if(!mouse.down) return;
    let center = {
      x: this.x1 + this.w/2,
      y: this.y1 + this.h/2,
    }
    let diff = {
      x: mouse.x - center.x,
      y: mouse.y - center.y,
    }
    let max = Math.max(Math.abs(diff.x), Math.abs(diff.y));
    this.velocity.x += (diff.x / max)*this.acceleration;
    this.velocity.y += (diff.y / max)*this.acceleration;
  }
  draw() {
    // Controls the size of the guy and sets
      // the width and height for collision physics
    if(this.scale > 1.5) {
      this.grow = false; 
    } 
    else if(this.scale < 1) {
      this.grow = true;
    }
    if(this.grow) {
      this.scale += 0.003;
    }
    else {
      this.scale -= 0.0055;
    }
    this.w = this.scale * 20;
    this.h = this.scale * 40;
    this.updateCoord2();

    let x = this.x1;
    let y = this.y1;
    let s = this.scale;
    let ctx = this.ctx;
    
    // Draws the guy line by line
    let movements = [
      ['m', 0, 10],
      ['l', 10, 0],
      ['l', 20, 10],
      ['l', 0, 10],
      ['m', 5, 10],
      ['l', 10, 15],
      ['l', 15, 10],
      ['m', 10, 15],
      ['l', 10, 30],
      ['m', 0, 20],
      ['l', 20, 20],
      ['m', 5, 40],
      ['l', 10, 30],
      ['m', 15, 40],
      ['l', 10, 30],
    ];
    
    for(let m of movements) {
      if(m[0] == 'l') 
        ctx.lineTo(x + m[1]*s, y + m[2]*s);
      else if(m[0] == 'm') 
        ctx.moveTo(x + m[1]*s, y + m[2]*s);
    }
    this.updateOscill();
  }
}

class GuyGroup {
  constructor(parentElement) {
    
    // Initializing the canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d"); 
    this.canvas.width = self.innerWidth;
    this.canvas.height = self.innerHeight;
    this.parentElement = parentElement;
    this.parentElement.appendChild(this.canvas);
    
    // Initializing audio context with gain
    this.aCtx = new window.AudioContext();
    this.gain = 1;
    this.gainNode = this.aCtx.createGain();
    this.gainNode.gain.setValueAtTime(this.gain, this.aCtx.currentTime);
    this.gainNode.connect(this.aCtx.destination)
    
    this.color = new RGB(2);
    this.gSpacing = 10;
    this.guyCount = 100;
    this.guys = [];
    this.scale = 1;
    
    this.guyCanvas = document.createElement("canvas");
    
    this.events = {
      keys: {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        c: false,
      },
      mouse: {
        down: false,
        x: null,
        y: null,
      }
    };
    function randrange(max, min) {
      return Math.random() * (max - min) + min;
    }
    // Generate guys
    for(let i = 0; i < this.guyCount; i++) {
      this.guys.push(
        new Guy(this.canvas, this.aCtx, this.gainNode, this.canvas.width/2, this.canvas.height/2, randrange(0.5, 1))
      );
    }

    // Keyboard events
    this.parentElement.addEventListener('keydown', function(event) {
      this.events.keys[event.key] = true;
      if(event.key == 'c') {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      else if(event.key == 'm') {
        this.toggleMute();
      }
    }.bind(this));
    this.parentElement.addEventListener('keyup', function(event) {
      this.events.keys[event.key] = false;
    }.bind(this));
    
    // Mouse events
    this.canvas.addEventListener('mousedown', function(event) {
      this.events.mouse.down = true;
    }.bind(this));
    this.canvas.addEventListener('mouseup', function(event) {
      this.events.mouse.down = false;
    }.bind(this));
    this.canvas.addEventListener('mousemove', function(event) {
      this.events.mouse.x = event.clientX;
      this.events.mouse.y = event.clientY;
    }.bind(this));
    
    // Touch events
    this.canvas.addEventListener('touchstart', function(event) {
      event.preventDefault();
      console.log("oof");
      this.events.mouse.down = true;
    }.bind(this));
    this.canvas.addEventListener('touchcancel', function(event) {
      event.preventDefault();
      this.events.mouse.down = false;
    }.bind(this));
    this.canvas.addEventListener('touchend', function(event) {
      event.preventDefault();
      this.events.mouse.down = false;
    }.bind(this));
    this.canvas.addEventListener('touchmove', function(event) {
      event.preventDefault();
      this.events.mouse.x = event.changedTouches[0].pageX;
      this.events.mouse.y = event.changedTouches[1].pageY;
    }.bind(this));
    
    
    // This event listener is responsible for this.scale
    document.addEventListener('wheel', event => {
      this.scale += event.deltaY/1000;
      this.canvas.style.width = window.innerWidth + "px";
      this.canvas.style.height = window.innerHeight + "px";
      this.canvas.width = (window.innerWidth)*this.scale;
      this.canvas.height = (window.innerHeight)*this.scale;
    });
    window.requestAnimationFrame(this.drawFrame.bind(this));
  }
  
  drawFrame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.color.increment();
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = this.color.cssify();
    for(let i = 0; i < this.guyCount; i++) {
      this.guys[i].move(this.events);
      this.guys[i].draw();
    }
    this.ctx.stroke();
    
    
    window.requestAnimationFrame(this.drawFrame.bind(this));
  }
  
  toggleMute() {
    if(this.gainNode.gain.value == 0) {
      this.gainNode.gain.setValueAtTime(this.gain, this.aCtx.currentTime);
    }
    else {
      this.gainNode.gain.setValueAtTime(0, this.aCtx.currentTime);
    }
    return this.gainNode.gain.value;
  }
}

class RGB {
  constructor(speed) {
    this.phase = 0; // integer between 0 and 2 represents which color is 255
    this.value = 0; // value of color before the phase
    this.color = [255, 0, 0];
    this.speed = speed;
  }
  increment() {
    this.value += this.speed;
    if(this.value > 255) {
      this.phase = (this.phase + 1) % 3;
      this.value = 0;
    }
    this.color[(this.phase + 1)%3] = Math.round(this.value);
    this.color[(this.phase + 2)%3] = Math.round(255-this.value);
  }
  cssify() {
    return `rgb(${this.color[0]}, ${this.color[1]}, ${this.color[2]})`;
  }
}


let guyGroup = new GuyGroup(document.body);