window.onload = function () {
    // Definitions
    var canvas = document.getElementById("paint-canvas");
    var context = canvas.getContext("2d");
    var boundings = canvas.getBoundingClientRect();

    // Specifications
    var mouseX = 0;
    var mouseY = 0;
    context.strokeStyle = 'black'; // initial brush color
    context.lineWidth = 3; // initial brush width
    context.lineJoin = 'round';
    var isDrawing = false;
    
    // Variables used on the undo button
    var colora = 'black'; 
    var linewidtha = 3; 
    let points = [];
    let pathsry = [];

    document.body.style.cursor="url('/static/img/pencil.png'), auto";

    // Mouse Down Event
    canvas.addEventListener('mousedown', function(event) {
        setMouseCoordinates(event);
        isDrawing = true;

        // Start Drawing
        context.beginPath();
        context.moveTo(mouseX, mouseY);

        points = [];

        // Save the coords, color and linewidth to use on the undo button
        points.push({x:mouseX,y:mouseY,color:colora,linewidth:linewidtha});
          
    });

    // Mouse Move Event
    canvas.addEventListener('mousemove', function(event) {
        setMouseCoordinates(event);

        if(isDrawing){
            context.lineTo(mouseX, mouseY);
            context.stroke();

            // Save the coords, color and linewidth to use on the undo button
            points.push({x:mouseX,y:mouseY,color:colora,linewidth:linewidtha});
        }
    });

    // Mouse Up Event
    canvas.addEventListener('mouseup', function(event) {
        setMouseCoordinates(event);
        isDrawing = false;
        pathsry.push(points);
        
    }, false);

    // Handle Mouse Coordinates
    function setMouseCoordinates(event) {
        mouseX = event.clientX - boundings.left;
        mouseY = event.clientY - boundings.top;
    }

/* --- Bottom Buttons --- */

    // Handle Clear Button
    var clearButton = document.getElementById('clear');

    clearButton.addEventListener('click', function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        points = [];
        pathsry = [];
    });

    // Handle Save Button
    var saveButton = document.getElementById('save');

    saveButton.addEventListener('click', function() {
        var canvasDataURL = canvas.toDataURL();
        console.log(canvasDataURL)
        $.ajax({
            type: "POST",
            url: "/upload",
            data: canvasDataURL,
            success: function(data) {
              window.location.href = "/results";
            }
          });
    });

/* --- Side Buttons --- */

    // Handle Pencil
    var pencil = document.getElementById('pencil');
    pencil.addEventListener('click', function() {
      context.strokeStyle = 'black';
      context.lineWidth = 3; 
      document.body.style.cursor="url('/static/img/pencil.png'), auto";
      
      // Save the color/linewidth to use on the undo button
      colora = context.strokeStyle;
      linewidtha = context.lineWidth;      
    });

    // Handle Eraser
    var eraser = document.getElementById('eraser');
    eraser.addEventListener('click', function() {
      context.strokeStyle = '#ffffff';
      context.lineWidth = 15; 
      document.body.style.cursor="url('/static/img/eraser1.png'), crosshair"; 

      // Save the color/linewidth to use on the undo button
      colora = context.strokeStyle;
      linewidtha = context.lineWidth;      
    });

    // Handle undo
    undo.addEventListener("click",Undo);

    function drawPaths(){
      // delete everything
      context.clearRect(0,0,canvas.width,canvas.height);
      // draw all the paths in the paths array

      pathsry.forEach(path=>{
      for(let i = 0; i < path.length-1; i++){
        context.beginPath();
        context.moveTo(path[i].x,path[i].y);  
        context.lineTo(path[i+1].x,path[i+1].y);
        context.strokeStyle = path[i].color;
        context.lineWidth = path[i].linewidth;
        context.stroke();
      }
      })
    }  
    
    function Undo(){
      // remove the last path from the paths array
      pathsry.splice(-1,1);
      // draw all the paths in the paths array
      drawPaths();

      // continue drawing with the same tool (pencil/eraser)
      if(colora == '#ffffff'){context.strokeStyle = '#ffffff';context.lineWidth = 15;}
      else {context.strokeStyle = '#000000';context.lineWidth = 3;}
    }
};
