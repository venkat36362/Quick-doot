const home = document.getElementById('home');
const camera = document.getElementById('camera');
const result = document.getElementById('result');

function show(screen){
  [home, camera, result].forEach(s => s.classList.remove("active"));
  document.getElementById(screen).classList.add("active");
}

document.getElementById('startBtn').onclick =
document.getElementById('homeMeasure').onclick =
document.getElementById('openCameraBtn').onclick = () => {
  show("camera");
  startCamera();
};

document.getElementById('uploadBtn').onclick = () => {
  fileInput.click();
};

let stream = null;
const video = document.getElementById("video");
const snapshot = document.getElementById("snapshot");
const previewMini = document.getElementById("previewMini");

function startCamera(){
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(s => { stream = s; video.srcObject = s; })
    .catch(() => alert("Camera not available"));
}

function stopCamera(){
  if(stream){
    stream.getTracks().forEach(t => t.stop());
    stream = null;
  }
}

document.getElementById('closeCam').onclick = () => {
  stopCamera();
  show("home");
};

document.getElementById('snap').onclick = () => {
  const w = video.videoWidth, h = video.videoHeight;
  snapshot.width = w; snapshot.height = h;
  snapshot.getContext("2d").drawImage(video, 0, 0, w, h);
  
  const img = new Image();
  img.onload = () => processImage(img);
  img.src = snapshot.toDataURL("image/jpeg");

  stopCamera();
};

fileInput.onchange = (e) => {
  const f = e.target.files[0];
  if(!f) return;
  const url = URL.createObjectURL(f);
  const img = new Image();
  img.onload = () => processImage(img);
  img.src = url;
};

function processImage(img){
  drawThumb(img);
  calculate(img);
  show("result");
}

const thumbCanvas = document.getElementById("thumbCanvas");
const thumbCtx = thumbCanvas.getContext("2d");

function drawThumb(img){
  thumbCtx.clearRect(0,0,thumbCanvas.width,thumbCanvas.height);
  thumbCtx.drawImage(img, 0, 0, thumbCanvas.width, thumbCanvas.height);
}

function calculate(img){
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  c.width = img.width; c.height = img.height;
  ctx.drawImage(img, 0, 0);

  const pxPerCm = parseFloat(calibRange.value);
  calibVal.textContent = pxPerCm;

  const widthCm = (img.width / pxPerCm).toFixed(1);
  const heightCm = (img.height / pxPerCm).toFixed(1);
  const estH = (Math.min(widthCm, heightCm) * 0.55).toFixed(1);

  document.getElementById("lengthVal").textContent = widthCm + " cm";
  document.getElementById("widthVal").textContent = heightCm + " cm";
  document.getElementById("heightVal").textContent = estH + " cm";
  document.getElementById("measuredSummary").textContent =
    `Length: ${widthCm} cm × Width: ${heightCm} cm × Height: ${estH} cm`;
}

document.getElementById('retakeBtn').onclick = () => {
  show("camera");
  startCamera();
};

document.getElementById('newMeasure').onclick = () => {
  show("camera");
  startCamera();
};
