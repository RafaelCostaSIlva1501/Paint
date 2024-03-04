const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const btnBrush = document.getElementById("brush");
const btnErase = document.getElementById("erase");
const btnBucketColor = document.getElementById("bucketColor");
const color = document.getElementById("color");
const brushSize = document.getElementById("brushSize");
const clear = document.getElementById("clear");
const download = document.getElementById("download");
const saveImage = document.getElementById("saveImage");
const openGallery = document.getElementById("openGallery");
const containerGallery = document.getElementById("container-gallery");
const btnCloseGallery = document.getElementById("close-gallery");
const gallery = document.getElementById("gallery");

//Inicia o click como false
let click = false;

//Inicia o modo de pintura como brush (Pincel)
let painting = "brush";

//Seleciona o Pincel
btnBrush.addEventListener("click", function () {
    painting = "brush";
});

//Seleciona a borracha
btnErase.addEventListener("click", function () {
    painting = "erase";
});

//seleciona o balde de tinta
btnBucketColor.addEventListener("click", function () {
    painting = "bucketColor";
});

//Detecta o click do mouse
canvas.addEventListener("mousedown", function ({ clientX, clientY }) {
    click = true;
    draw(clientX, clientY);
});

//Detecta o movimento do mouse
canvas.addEventListener("mousemove", function ({ clientX, clientY }) {
    if (click) {
        draw(clientX, clientY);
    }
});

//Detecta quando o click do mouse termina
canvas.addEventListener("mouseup", function ({ clientX, clientY }) {
    click = false;
});

//Desenha unsando as ferramentas
const draw = function (x, y) {
    let size = brushSize.value;

    ctx.beginPath();

    if (painting === "brush") {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = color.value;
        ctx.arc(
            x - canvas.offsetLeft,
            y - canvas.offsetTop,
            size,
            0,
            2 * Math.PI
        );
        ctx.fill();
    } else if (painting === "erase") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.arc(
            x - canvas.offsetLeft,
            y - canvas.offsetTop,
            size,
            0,
            2 * Math.PI
        );
        ctx.fill();
    } else if (painting === "bucketColor") {
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = color.value;
        ctx.arc(x, y, 5000, 0, 2 * Math.PI);
        ctx.fill();
    }
};

//Limpa a tela
clear.addEventListener("click", function () {
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

//Array com imagens salvas
let capturedImage = [];

//Salva as imagens dentro da galeria (Array)
saveImage.addEventListener("click", function () {
    const dataURL = canvas.toDataURL();
    const image = new Image();

    image.src = dataURL;

    capturedImage.push(dataURL);

    saveToLocalStorage();

    displayImages();
});

//Abre a galeria
openGallery.addEventListener("click", function () {
    loadFromLocalStorage();
    displayImages();
    containerGallery.style.display = "flex";
});

//Fecha a galeria
btnCloseGallery.addEventListener("click", function () {
    containerGallery.style.display = "none";
});

//Coloca a imagem dentro da galeria
function displayImages() {
    gallery.innerHTML = "";

    capturedImage.forEach(function (imageUrl, index) {
        const article = createImageArticle(imageUrl, index);
        gallery.appendChild(article);
    });
}

function createImageArticle(imageUrl, index) {
    const article = document.createElement("article");
    const img = document.createElement("img");
    const div = document.createElement("div");

    img.src = imageUrl;
    article.appendChild(img);

    div.appendChild(
        createButton("download", function () {
            downloadImage(imageUrl, index);
        })
    );

    div.appendChild(
        createButton("delete", function () {
            deleteImage(index);
        })
    );

    article.appendChild(div);
    return article;
}

function createButton(symbol, clickHandler) {
    const button = document.createElement("button");
    const span = document.createElement("span");

    span.classList.add("material-symbols-outlined");
    span.innerText = symbol;

    button.appendChild(span);
    button.addEventListener("click", clickHandler);

    return button;
}

function downloadImage(imageUrl, index) {
    const downloadLink = document.createElement("a");
    downloadLink.href = imageUrl;
    downloadLink.download = `image_${index + 1}.jpg`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function deleteImage(index) {
    capturedImage.splice(index, 1);
    saveToLocalStorage();
    displayImages();
}

//Salva a Url da imagem no navegador
function saveToLocalStorage() {
    const convertImage = JSON.stringify(capturedImage);
    localStorage.setItem("localImage", convertImage);
}

//Recupera a Url
function loadFromLocalStorage() {
    const convertImage = localStorage.getItem("localImage");

    if (convertImage) {
        const loadedImage = JSON.parse(convertImage);
        console.log("Imagens recuperadas do localStorage:", loadedImage);
        capturedImage = loadedImage;
    }
}

loadFromLocalStorage();
