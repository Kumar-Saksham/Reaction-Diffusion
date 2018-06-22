var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
// canvas.height = 1500;
// canvas.width = 1500;

var dA = 1;
var dB = 0.5;
var feed = 0.055;
var k = 0.062;

function constrain(val, min, max){
	return Math.min(Math.max(val, min), max);
}

var pixels = c.createImageData(canvas.width, canvas.height);

var grid = [];
var next = [];


for(var x = 0; x < canvas.width; x++){
	grid[x] = [];
	next[x] = [];
	for(var y = 0; y < canvas.height; y++){
		grid[x][y] = { a: 1, b: 0};
		next[x][y] = { a: 1, b: 0};
	}
}

for(var i = Math.floor(canvas.width/2) - 5; i < Math.floor(canvas.width/2) + 5; i++){
	for(var j = Math.floor(canvas.height/2) - 5; j < Math.floor(canvas.height/2) + 5; j++){
			grid[i][j].b = 1;
	}
}

function draw(){

	requestAnimationFrame(draw);
	for(var x = 1; x < canvas.width-1; x++){
		for(var y = 1; y < canvas.height-1; y++){
			var a = grid[x][y].a;
			var b = grid[x][y].b
			next[x][y].a = a 
							+ (dA * laplaceA(x, y)) 
							- (a * b * b) 
							+ (feed * (1 - a));
			next[x][y].b = b 
							+ (dB * laplaceB(x, y)) 
							+ (a * b * b) 
							- ((k + feed) * b);
			next[x][y].a = constrain(next[x][y].a, 0, 1);
			next[x][y].b = constrain(next[x][y].b, 0, 1);
		}
	}

	for(var x = 0; x< canvas.width; x++){
		for(var y = 0; y < canvas.height; y++){
			var pix = (x + y*canvas.width)*4;
			var a = next[x][y].a;
			var b = next[x][y].b;
			var grey = Math.floor((a - b)*255);
			grey = constrain(grey, 0, 255);
			pixels.data[pix] = grey;
			pixels.data[pix + 1] = grey;
			pixels.data[pix + 2] = grey;
			pixels.data[pix + 3] = 255;
		}
	}

	c.clearRect(0, 0, canvas.width, canvas.height);
	c.putImageData(pixels, 0, 0);

	swap();

}



function laplaceA(x, y){
	var sumA = 0;
	sumA += grid[x][y].a * -1;
	sumA += grid[x][y+1].a * 0.2;
	sumA += grid[x+1][y].a * 0.2;
	sumA += grid[x][y-1].a * 0.2;
	sumA += grid[x-1][y].a * 0.2;
	sumA += grid[x+1][y+1].a * 0.05;
	sumA += grid[x+1][y-1].a * 0.05;
	sumA += grid[x-1][y+1].a * 0.05;
	sumA += grid[x-1][y-1].a * 0.05;
	return sumA;
}

function laplaceB(x, y){
	var sumB = 0;
	sumB += grid[x][y].b * -1;
	sumB += grid[x][y+1].b * 0.2;
	sumB += grid[x+1][y].b * 0.2;
	sumB += grid[x][y-1].b * 0.2;
	sumB += grid[x-1][y].b * 0.2;
	sumB += grid[x+1][y+1].b * 0.05;
	sumB += grid[x+1][y-1].b * 0.05;
	sumB += grid[x-1][y+1].b * 0.05;
	sumB += grid[x-1][y-1].b * 0.05;
	return sumB;
}

function swap(){
	var temp = grid;
	grid = next;
	next = temp;
}


draw();