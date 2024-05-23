




const searchForm = document.querySelector(".search-form");
const cartItem = document.querySelector(".cart-items-container");
const navbar = document.querySelector(".navbar");


const searchBtn = document.querySelector("#search-btn");
const cartBtn = document.querySelector("#cart-btn");
const menuBtn = document.querySelector("#menu-btn");

searchBtn.addEventListener("click", function () {
  searchForm.classList.toggle("active");
  document.addEventListener("click", function (e) {
    if (
      !e.composedPath().includes(searchBtn) &&
      !e.composedPath().includes(searchForm)
    ) {
      searchForm.classList.remove("active");
    }
  });
});

cartBtn.addEventListener("click", function () {
  cartItem.classList.toggle("active");
  document.addEventListener("click", function (e) {
    if (
      !e.composedPath().includes(cartBtn) &&
      !e.composedPath().includes(cartItem)
    ) {
      cartItem.classList.remove("active");
    }
  });
});

menuBtn.addEventListener("click", function () {
  navbar.classList.toggle("active");
  document.addEventListener("click", function (e) {
    if (
      !e.composedPath().includes(menuBtn) &&
      !e.composedPath().includes(navbar)
    ) {
      navbar.classList.remove("active");
    }
  });
});
function basligiDegistir() {
  document.getElementById("baslik").innerHTML = "ÜYE OLUNDU";
}
function karakterSayisiniGoster() {
  var metin = document.getElementById("search-box").value;
  document.getElementById("karakterSayisi").innerHTML = "Karakter sayısı: " + metin.length;
}
function mesajGoster() {
  alert("Merhaba");
}

function saatGoster() {
  let simdi = new Date();
  let saat = simdi.getHours();
  let dakika = simdi.getMinutes();
  let saniye = simdi.getSeconds();
  document.getElementById("saat").innerHTML = `Şu an saat: ${saat}:${dakika}:${saniye}`;
}


// Sayfa yüklendiğinde saat bilgisini güncelle
window.onload = saatGoster;

function resmiDegistir() {
  document.querySelector("img").src = "img/logo2.png";
}
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var gl = canvas.getContext('webgl');
if (!gl) {
  console.error("Unable to initialize WebGL.");
}

var time = 0.0;

var vertexSource = `  
  attribute vec2 position;  
  void main() {  
    gl_Position = vec4(position, 0.0, 1.0);  
  }  
  `;
var fragmentSource = `  
  precision highp float;  
  uniform float width;  
  uniform float height;  
  vec2 resolution = vec2(width, height);  
  uniform float time;  

  #define POINT_COUNT 8  

  vec2 points[POINT_COUNT];  
  const float speed = -0.5;  
  const float len = 0.25;  
  float intensity = 1.3;  
  float radius = 0.008;  

  float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C){    
      vec2 a = B - A;  
      vec2 b = A - 2.0*B + C;  
      vec2 c = a * 2.0;  
      vec2 d = A - pos;  
      float kk = 1.0 / dot(b,b);  
      float kx = kk * dot(a,b);  
      float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;  
      float kz = kk * dot(d,a);     
      float res = 0.0;  

      float p = ky - kx*kx;  
      float p3 = p*p*p;  
      float q = kx*(2.0*kx*kx - 3.0*ky) + kz;  
      float h = q*q + 4.0*p3;  
      if(h >= 0.0){   
          h = sqrt(h);  
          vec2 x = (vec2(h, -h) - q) / 2.0;  
          vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));  
          float t = uv.x + uv.y - kx;  
          t = clamp( t, 0.0, 1.0 );  
          
          vec2 qos = d + (c + b*t)*t;  
          res = length(qos);  
      }else{  
          float z = sqrt(-p);  
          float v = acos( q/(p*z*2.0) ) / 3.0;  
          float m = cos(v);  
          float n = sin(v)*1.732050808;  
          vec3 t = vec3(m + m, -n - m, n - m) * z - kx;  
          t = clamp( t, 0.0, 1.0 );  

          vec2 qos = d + (c + b*t.x)*t.x;  
          float dis = dot(qos,qos);  
          res = dis;  
          qos = d + (c + b*t.y)*t.y;  
          dis = dot(qos,qos);  
          res = min(res,dis);  
          qos = d + (c + b*t.z)*t.z;  
          dis = dot(qos,qos);  
          res = min(res,dis);  
          res = sqrt( res );  
      }  
      return res;  
}  

vec2 getHeartPosition(float t){  
      return vec2(16.0 * sin(t) * sin(t) * sin(t),  
                                    -(13.0 * cos(t) - 5.0 * cos(2.0*t)  
                                    - 2.0 * cos(3.0*t) - cos(4.0*t)));  
}  

float getGlow(float dist, float radius, float intensity){  
      return pow(radius/dist, intensity);  
}  
float getSegment(float t, vec2 pos, float offset, float scale){  
      for(int i = 0; i < POINT_COUNT; i++){  
          points[i] = getHeartPosition(offset + float(i)*len + fract(speed * t) * 6.28);  
      }  
      vec2 c = (points[0] + points[1]) / 2.0;  
      vec2 c_prev;  
      float dist = 10000.0;  
      for(int i = 0; i < POINT_COUNT-1; i++){  

          c_prev = c;  
          c = (points[i] + points[i+1]) / 2.0;  
          dist = min(dist, sdBezier(pos, scale * c_prev, scale * points[i], scale * c));  
      }  
      return max(0.0, dist);  
}  
void main(){  
      vec2 uv = gl_FragCoord.xy/resolution.xy;  
      float widthHeightRatio = resolution.x/resolution.y;  
      vec2 centre = vec2(0.5, 0.5);  
      vec2 pos = centre - uv;  
      pos.y /= widthHeightRatio;  
      
      pos.y += 0.02;  
      float scale = 0.000015 * height;  
      float t = time;  
      
  float dist = getSegment(t, pos, 0.0, scale);  
  float glow = getGlow(dist, radius, intensity);  
  vec3 col = vec3(0.0);  
      
  col += 10.0*vec3(smoothstep(0.003, 0.001, dist));  

  col += glow * vec3(1.0,0.05,0.3);  

  dist = getSegment(t, pos, 3.4, scale);  
  glow = getGlow(dist, radius, intensity);  

  col += 10.0*vec3(smoothstep(0.003, 0.001, dist));  

  col += glow * vec3(0.1,0.4,1.0);  
  
      col = 1.0 - exp(-col);  

      col = pow(col, vec3(0.4545));  

      gl_FragColor = vec4(col,1.0);  
}  
`;

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(widthHandle, window.innerWidth);
  gl.uniform1f(heightHandle, window.innerHeight);
}
  
function compileShader(shaderSource, shaderType) {
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw "Shader compile failed with: " + gl.getShaderInfoLog(shader);
  }
  return shader;
}

function getAttribLocation(program, name) {
  var attributeLocation = gl.getAttribLocation(program, name);
  if (attributeLocation === -1) {
    throw 'Cannot find attribute ' + name + '.';
  }
  return attributeLocation;
}
function getUniformLocation(program, name) {
  var attributeLocation = gl.getUniformLocation(program, name);
  if (attributeLocation === -1) {
    throw 'Cannot find uniform ' + name + '.';
  }
  return attributeLocation;
}

var vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
var fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

var vertexData = new Float32Array([
  -1.0, 1.0,   
  -1.0, -1.0,    
  1.0, 1.0,     
  1.0, -1.0,   
]);

var vertexDataBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexDataBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

var positionHandle = getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionHandle);
gl.vertexAttribPointer(positionHandle,
  2,
  gl.FLOAT,
  false,
  2 * 4,
  0
);

var timeHandle = getUniformLocation(program, 'time');
var widthHandle = getUniformLocation(program, 'width');
var heightHandle = getUniformLocation(program, 'height');
gl.uniform1f(widthHandle, window.innerWidth);
gl.uniform1f(heightHandle, window.innerHeight);
var lastFrame = Date.now();
var thisFrame;
function draw() {

  thisFrame = Date.now();
  time += (thisFrame - lastFrame) / 1000;
  lastFrame = thisFrame;

  gl.uniform1f(timeHandle, time);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(draw);
}
draw();  
KayanYazi=function(nesne,zaman){
  let yaziNesne=nesne;
 
 setInterval(function(){
     let yazi  = yaziNesne.innerHTML;
     let harf  = yazi.substring(0,1);
     let kalan = yazi.substring(1,yazi.length);
     kalan=kalan+harf
     yaziNesne.innerHTML=kalan;
 }, zaman);
}
 
var nesne=document.getElementById("yazi"); 
KayanYazi(nesne,750);  
var d = new Date();
var gunler= ["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
document.getElementById("test").innerHTML = gunler[d.getDay()];

let currentPlayer = 'X'; // Player X always starts
let gameBoard = ['', '', '', '', '', '', '', '', '']; // 3x3 game board
let gameActive = true;
function handlePlayerTurn(clickedCellIndex) {
  if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
      return;
  }
  gameBoard[clickedCellIndex] = currentPlayer;
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}
const cells = document.querySelectorAll('.cell');
cells.forEach(cell => {
  cell.addEventListener('click', cellClicked, false);
});
function cellClicked(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.id.replace('cell-', '')) - 1;
 
  if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
      return;
  }


  handlePlayerTurn(clickedCellIndex);
  updateUI();
}
function updateUI() {
  for (let i = 0; i < cells.length; i++) {
      cells[i].innerText = gameBoard[i];
  }
}
const winConditions = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Left-to-right diagonal
  [2, 4, 6]  // Right-to-left diagonal
];
function checkForWinOrDraw() {
  let roundWon = false;

  for (let i = 0; i < winConditions.length; i++) {
      const [a, b, c] = winConditions[i];
      if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
          roundWon = true;
          break;
      }
  }

  if (roundWon) {
      announceWinner(currentPlayer);
      gameActive = false;
      return;
  }

  let roundDraw = !gameBoard.includes('');
  if (roundDraw) {
      announceDraw();
      gameActive = false;
      return;
  }
}
function announceWinner(player) {
  const messageElement = document.getElementById('gameMessage');
  messageElement.innerText = `Player ${player} Wins!`;
}

function announceDraw() {
  const messageElement = document.getElementById('gameMessage');
  messageElement.innerText = 'Game Draw!';
}
function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', '']; // Clear the game board
  gameActive = true; // Set the game as active
  currentPlayer = 'X'; // Reset to player X
  // Clear all cells on the UI
  cells.forEach(cell => {
      cell.innerText = '';
  });
  document.getElementById('gameMessage').innerText = '';
}
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', resetGame, false);

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
}


    $(document).ready(function() {
        $('#greeting').text('Merhaba, Dünya!');
    });
    
    $('.item').css('background-color', 'yellow');