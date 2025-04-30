
//НАЧАЛО БЕЗ ИЗМЕНЕНИЙЙ!!!!!!!!!!!!!
var gl;

function initWebGL(canvas){
    gl = null;
    try { 
    gl = canvas.getContext("webgl2") || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}
    if (!gl) { 
    alert("Не удалось инициализировать WebGL. Ваш браузер может не поддерживать это.");
    gl = null;
    }
    return gl;
}
function initShaderProgram(gl, vsSource, fsSource) {

    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader); 
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram); 

     if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Не удается инициализировать шейдерную программу: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function loadShader(gl, type, source){

    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader); 
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('Произошла ошибка при компиляции шейдеров: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

//КОНЕЦ БЕЗ ИЗМЕНЕНИЙ!!!!!!!!!!!!!

//для пятиуг и квадрата
const vsPentagon =`
attribute vec2 vertPosition;
varying vec2 fragPosition; 
void main() {
    fragPosition = vertPosition;
    gl_Position = vec4(vertPosition,0.0, 1.0);
}`;



const vsCube =`
attribute vec3 vertPosition;
uniform mat4 matUnif;
void main() {
    gl_Position = matUnif * vec4(vertPosition, 1.0);
}`;

const fsPentagon=`
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);

}`;

const fsCube =`
precision mediump float;
void main() {
    gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
}`;

const fsSquare =`
precision mediump float;
varying vec2 fragPosition; 
void main() {
    int x = int(fragPosition.x*30.0+15.0 ); //полоски тут создаются
    float isColor = mod(float(x), 2.0); //тоже
    if (isColor == 0.0) {
        gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0); 
    } 
    else {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}`;

function start(){
    main("square");
    main("pentagon"); 
    main("cube");
 }

//MAIN!
function main(type){

    var canvas = document.getElementById(type);

    gl = initWebGL(canvas); 
    if (gl) { 
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);  
        gl.clearColor(0.0, 0.0, 0.0, 1.0); 
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL); 
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        if (type=="square")
        {
            const shaderProgram = initShaderProgram(gl, vsPentagon, fsSquare);
            gl.useProgram(shaderProgram);
            drawScene("square",shaderProgram);
        
        }
        else if (type=="pentagon"){
            const shaderProgram = initShaderProgram(gl, vsPentagon, fsPentagon);
            gl.useProgram(shaderProgram);

            drawScene("pentagon",shaderProgram);
        }
        else if(type=="cube"){
            const shaderProgram = initShaderProgram(gl, vsCube, fsCube);
            gl.useProgram(shaderProgram);

            drawScene("cube",shaderProgram);

        }
    
    }


}

function drawScene(type,shaderProgram){

    if (type=="pentagon"){
        const vertices = [];
        const rad=0.7; //rad
        const phi=-0.315; //const
        for(let i=0; i<=5; i++) {
            let x = rad * Math.cos(phi + 2 * Math.PI * i/5);
            let y = rad * Math.sin(phi + 2 * Math.PI * i/5);
            vertices.push(x); 
            vertices.push(y); 
        }

        var squareVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'vertPosition');
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false,0,0);

        gl.drawArrays(gl.TRIANGLE_FAN, 0,5);

    }
    else if(type="cube"){
        const vertices=[
            -0.5, -0.5, -0.5,  
            -0.5, 0.5, -0.5,   
            0.5, 0.5, -0.5,    
            -0.5, -0.5, -0.5,  
            0.5, 0.5, -0.5,    
            0.5, -0.5, -0.5, 

            -0.5, 0.5, -0.5, 
            -0.5, 0.5, 0.5,    
            0.5, 0.5, 0.5,     
            -0.5, 0.5, -0.5,   
            0.5, 0.5, -0.5,    
            0.5, 0.5, 0.5,     

            -0.5, -0.5, -0.5,  
            0.5, -0.5, 0.5,    
            0.5, -0.5, -0.5,   
            -0.5, -0.5, -0.5,  
            0.5, -0.5, 0.5,    
            -0.5, -0.5, 0.5,  

            -0.5, -0.5, -0.5, 
            -0.5, 0.5, -0.5,   
            -0.5, -0.5, 0.5,   
            -0.5, 0.5, 0.5,    
            -0.5, 0.5, -0.5,   
            -0.5, -0.5, 0.5,

            0.5, 0.5, -0.5,
            0.5, -0.5, 0.5,    
            0.5, -0.5, -0.5,   
            0.5, 0.5, -0.5,    
            0.5, -0.5, 0.5,    
            0.5, 0.5, 0.5,  

            -0.5, 0.5, 0.5, 
            0.5, 0.5, 0.5,     
            -0.5, -0.5, 0.5,   
            0.5, -0.5, 0.5,    
            0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5
        ];

        var squareVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'vertPosition');
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.vertexAttribPointer(vertexPositionAttribute,3,gl.FLOAT,false,3*Float32Array.BYTES_PER_ELEMENT,0);

        var matrixUnifromLocation=gl.getUniformLocation(shaderProgram,'matUnif');

        matUnif=new Float32Array(16);
        glMatrix.mat4.identity(matUnif);
        gl.uniformMatrix4fv(matrixUnifromLocation, gl.FALSE, matUnif); //установка разрешения текущей uniform-переменная
        
        var identityMatrix = new Float32Array(16);
        glMatrix.mat4.identity(identityMatrix);
        glMatrix.mat4.rotate(matUnif, identityMatrix, 0.5, [1, 1, 1]); //поврот чтоб видно
        gl.uniformMatrix4fv(matrixUnifromLocation, gl.FALSE, matUnif);

        gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
    else if(type=="square"){
        const vertices = [
            0.5, 0.5, 
            -0.5, 0.5, 
            0.5, -0.5, 
            -0.5, -0.5
        ];
        var squareVerticesBuffer = gl.createBuffer(); //создаем баффер, там хранятся данные о вершине и цвета
        gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer); //привязываем баффер к точкам привязки(array_buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); //создаем хранилице из данных буфера
        
        var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'vertPosition');
        gl.enableVertexAttribArray(vertexPositionAttribute); 
        gl.vertexAttribPointer( vertexPositionAttribute, 2,gl.FLOAT, false, 0, 0 );
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //рисуем примитивы из данных
    }



    
}
