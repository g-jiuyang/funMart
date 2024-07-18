window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

var canvas = document.getElementById("particle");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var settings = {
  basic: {
    emission_rate: 10,
    min_life: 0.8, //粒子最小壽命 (消失速度)
    life_range: 0.5, //粒子壽命範圍 (最大壽命 = min_life + life_range)
    min_angle: 0,
    angle_range: 360,
    min_speed: 100, //最小速度
    speed_range: 50, //速度範圍 (最大速度 = min_speed + speed_range
    min_size: 15, //最小尺寸
    size_range: 15, //尺寸範圍 (最大速度 = min_size + size_range
    colour: "#82c4f5",
    imagePath:
      "https://cdn-icons-png.freepik.com/512/616/616493.png?ga=GA1.1.1248607140.1676883952&",
  },
};

var Particle = function (x, y, angle, speed, life, size, imagePath) {
  /* the particle's position */
  this.pos = {
    // x: x || 0,
    // y: y || 0
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  /* set specified or default values */
  this.speed = speed || 125; //預設速度
  this.life = life || 1; //預設壽命
  this.size = size || 20; //預設尺寸
  this.lived = 0;

  this.image = new Image();
  this.image.onload = () => {
    // Once image is loaded, we can start using it
    this.ready = true;
  };
  this.image.src = imagePath || "";

  /* the particle's velocity */
  var radians = (angle * Math.PI) / 180;
  this.vel = {
    x: Math.cos(radians) * speed,
    y: -Math.sin(radians) * speed,
  };
};

var Emitter = function (x, y, settings) {
  /* the emitter's position */
  this.pos = {
    x: x,
    y: y,
  };

  /* set specified values */
  this.settings = settings;

  /* How often the emitter needs to create a particle in milliseconds */
  this.emission_delay = 1000 / settings.emission_rate;

  /* we'll get to these later */
  this.last_update = 0;
  this.last_emission = 0;

  /* the emitter's particle objects */
  this.particles = [];
};

Emitter.prototype.update = function () {
  /* set the last_update variable to now if it's the first update */
  if (!this.last_update) {
    this.last_update = Date.now();
    return;
  }

  /* get the current time */
  var time = Date.now();

  /* work out the milliseconds since the last update */
  var dt = time - this.last_update;

  /* add them to the milliseconds since the last particle emission */
  this.last_emission += dt;

  /* set last_update to now */
  this.last_update = time;

  /* check if we need to emit a new particle */
  if (this.last_emission > this.emission_delay) {
    /* find out how many particles we need to emit */
    var i = Math.floor(this.last_emission / this.emission_delay);

    /* subtract the appropriate amount of milliseconds from last_emission */
    this.last_emission -= i * this.emission_delay;

    while (i--) {
      /* calculate the particle's properties based on the emitter's settings */
      this.particles.push(
        new Particle(
          0,
          0,
          this.settings.min_angle + Math.random() * this.settings.angle_range,
          this.settings.min_speed + Math.random() * this.settings.speed_range,
          this.settings.min_life + Math.random() * this.settings.life_range,
          this.settings.min_size + Math.random() * this.settings.size_range,
          this.settings.imagePath
        )
      );
    }
  }

  /* convert dt to seconds */
  dt /= 1000;

  /* loop through the existing particles */

  var i = this.particles.length;

  while (i--) {
    var particle = this.particles[i];

    /* skip if the particle is dead */
    if (particle.dead) {
      /* remove the particle from the array */
      this.particles.splice(i, 1);

      continue;
    }

    /* add the seconds passed to the particle's life */
    particle.lived += dt;

    /* check if the particle should be dead */
    if (particle.lived >= particle.life) {
      particle.dead = true;
      continue;
    }

    /* calculate the particle's new position based on the seconds passed */
    particle.pos.x += particle.vel.x * dt;
    particle.pos.y += particle.vel.y * dt;

    if (particle.ready) {
      ctx.drawImage(
        particle.image,
        particle.pos.x,
        particle.pos.y,
        particle.size,
        particle.size
      );
    }

    /* draw the particle */
    ctx.fillStyle = this.settings.colour;
    var x = this.pos.x + particle.pos.x;
    var y = this.pos.y + particle.pos.y;
    ctx.beginPath();
    ctx.arc(x, y, particle.size, 0, Math.PI * 2);
    // ctx.fill();
  }
};

var emitter = new Emitter(canvas.width / 2, canvas.height / 2, settings.basic);

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  emitter.update();
  requestAnimFrame(loop);
}

loop();
