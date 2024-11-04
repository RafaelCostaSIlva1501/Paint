const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const screenSize = document.querySelector(".screen-size");

const tool = document.querySelectorAll(".pencil");
const size = document.querySelector(".size");
const color = document.querySelectorAll(".color");
let Icolor = document.getElementById("Icolor");

const clear = document.querySelector(".clear");
const download = document.querySelector(".download");

//Inicia o click como false
let isDrawing = false;

//Inicia o modo de pintura como brush (Pincel)
let painting = {
  pencil: "brush",
  size: 5,
  color: "black",
};

const resize = () => {
  const width = screenSize.offsetWidth;
  const height = screenSize.offsetHeight;

  canvas.width = width - 100;
  canvas.height = height - 100;

  canvas.style.width = width - 100;
  canvas.style.height = height - 100;
};

resize()

window.addEventListener("resize", resize);

tool.forEach((e) => {
  e.addEventListener("click", () => {
    painting.pencil = e.dataset.tool;
  });
});

size.addEventListener("input", (e) => {
  painting.size = e.target.value;
});

Icolor.addEventListener("input", (e) => {
  painting.color = e.target.value;
});

color.forEach((e) => {
  e.addEventListener("click", () => {
    painting.color = e.dataset.color;
    Icolor.value = e.dataset.color;
  });
});

//Detecta o click do mouse
canvas.addEventListener("mousedown", ({ clientX, clientY }) => {
  isDrawing = true;
  draw(clientX, clientY);
});

//Detecta o movimento do mouse
canvas.addEventListener("mousemove", ({ clientX, clientY }) => {
  if (isDrawing) {
    draw(clientX, clientY);
  }
});

//Detecta quando o click do mouse termina
canvas.addEventListener("mouseup", ({ clientX, clientY }) => {
  isDrawing = false;
  initSize = 1;
});

const brush = (x, y) => {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = painting.color;
  ctx.arc(
    x - canvas.offsetLeft,
    y - canvas.offsetTop,
    painting.size,
    0,
    2 * Math.PI
  );
  ctx.fill();
};

console.log(painting.size);

let initSize = 1;

const brushTwo = (x, y) => {
  const maxSize = 20;

  if (initSize < maxSize) {
    initSize += 0.1;
  }

  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = painting.color;
  ctx.beginPath();
  ctx.arc(
    x - canvas.offsetLeft,
    y - canvas.offsetTop,
    initSize,
    0,
    2 * Math.PI
  );
  ctx.fill();
};

const bucket = (x, y) => {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = painting.color;
  ctx.arc(x, y, 5000, 0, 2 * Math.PI);
  ctx.fill();
};

const erase = (x, y) => {
  ctx.globalCompositeOperation = "destination-out";
  ctx.arc(
    x - canvas.offsetLeft,
    y - canvas.offsetTop,
    painting.size,
    0,
    2 * Math.PI
  );
  ctx.fill();
};

//Desenha unsando as ferramentas
const draw = (x, y) => {
  ctx.beginPath();

  if (painting.pencil === "brush") {
    brush(x, y);
  } else if (painting.pencil === "bucket") {
    bucket(x, y);
  } else if (painting.pencil === "erase") {
    erase(x, y);
  } else if (painting.pencil === "brush-two") {
    brushTwo(x, y);
  }
};

//Limpa a tela
clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

//Faz download da imagem que está na tela
download.addEventListener("click", function () {
  const dataURL = canvas.toDataURL();

  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "meu_desenho.png";

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
});
