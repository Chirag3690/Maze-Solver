
const labelMap = ["RecMaze", "TriMaze", "CirMaze", "HexMaze"];
export const drawRect = (
  boxes,
  classes,
  scores,
  threshold,
  imgWidth,
  imgHeight,
  ctx
) => {

  for (let i = 0; i < boxes.length; i++) {

    if (boxes[i] && classes[i] && scores[i] > threshold) {
    
      const [y, x, height, width] = boxes[i];
      const text = classes[i];
   
      ctx.strokeStyle = "#0997C7";
      ctx.lineWidth = 5;
      ctx.fillStyle = "white";
      ctx.font = "30px Arial";
      
      ctx.beginPath();
      ctx.fillText(
        labelMap[text - 1] + " - " + Math.round(scores[i] * 100) / 100,
        x * imgWidth,
        y * imgHeight - 10
      );
      ctx.rect(
        x * imgWidth,
        y * imgHeight,
        (width * imgWidth) / 1.2,
        (height * imgHeight) / 1.2
      );
      ctx.stroke();
      return [
        x * imgWidth,
        y * imgHeight,
        (width * imgWidth) / 1.2,
        (height * imgHeight) / 1.2,
      ];
     
    }
  }
};
