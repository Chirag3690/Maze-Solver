import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

import Webcam from "react-webcam";
import { drawRect } from "./utilities";
import "./Video.css";
import { Link } from "react-router-dom";
import VanillaTilt from 'vanilla-tilt';


function Tilt(props) {

  const { options, ...rest } = props;
  const tilt = useRef(null);

  useEffect(() => {
    VanillaTilt.init(tilt.current, options);
  }, [options]);

  return <div ref={tilt} {...rest} />;
}

function Video({ image, setImage, coord, setCoord }) {

  const[inst1,setInst1]=useState(1);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Main function
  const runCoco = async () => {

    const net = await tf.loadGraphModel(
      "https://tensorflowjsrealtimel.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"
    );
    
    setInterval(() => {
      if (!canvasRef) return;
      detect(net);
    }, 16.7);
  };

  const detect = async (net) => {
    if (!canvasRef) return;
    
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

     
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

    
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      
      const img = tf.browser.fromPixels(video);
      const resized = tf.image.resizeBilinear(img, [640, 480]);
      const casted = resized.cast("int32");
      const expanded = casted.expandDims(0);
      const obj = await net.executeAsync(expanded);
  

      const boxes = await obj[1].array();
   

      const classes = await obj[5].array();
      const scores = await obj[6].array(); 
      if (!canvasRef) return;
      let ctx = null;
      if (canvasRef)
        if (canvasRef.current)
   
          ctx = canvasRef.current.getContext("2d");
        else return;

      let c;
      requestAnimationFrame(() => {
        c = drawRect(
          boxes[0],
          classes[0],
          scores[0],
          0.8,
          videoWidth,
          videoHeight,
          ctx
        );
        if (c) setCoord(c);
      });
      tf.dispose(img);
      tf.dispose(resized);
      tf.dispose(casted);
      tf.dispose(expanded);
      tf.dispose(obj);
    }
  };

  useEffect(() => {
    setImage(null);
    if (canvasRef) runCoco();
  }, [setImage]);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);
  const optionsclick = {
    scale: 1.2,
    speed: 1000,
    max: 30,
    glare:true,
    "max-glare":1,
  };
  const optionsinstruct1 = {
    scale: 1.05,
    speed: 200,
    max: 5,
    glare:false,
    "max-glare":0.7,
  };
  return (
    <div>
    <div className="Video">
      {!image && (
        <div className="Video_Canvas">
          <Webcam
            ref={webcamRef}
            muted={true}
            screenshotFormat="image/jpeg"
            className="webcamb"
          />
          <canvas ref={canvasRef} className="webcamb" />
        </div>
      )}
      
        <Tilt options={optionsclick}
          type="button"
          className="designbutton3"
          style={{
            marginTop: "20px",
          }}
          onClick={capture}
        >
          <Link to="/cropper"  style={{textDecoration:"none",color:"#413e3e"} }>
          Click
          </Link>
        </Tilt>
      
    </div>
    <div className={inst1 ?"sliderinst": "slider closeinst"}>
    <center>
         <div  className="designIns">
           INSTRUCTIONS<br></br><br></br>
           In Front of you. You will see a Webcam!<br></br>
           These are the steps which you have to follow for further processing!<br></br>
           Step 1<br></br>
           Hold the image of your Maze in front of the Webcam.<br></br>
           Step 2<br></br>
           Wait Until the Webcam Starts to detect the Maze.<br></br>
           Step 3<br></br>
           When Satisfied by the detected Maze, Click on the "Click" button.<br></br>
           Step 3.1<br></br>
           If Maze not detected by the Webcam directly click on the "Click" button.<br></br>
           Step 4<br></br>
           A Cropper will be opened. Adjust the sides of Maze(if required) with the help of the cropper.<br></br>
           Step 5<br></br>
           When Satisfied Click on "Crop" button.<br></br>
           
         </div>
     </center>
     <center><Tilt options={optionsclick} type="button" classname="designIns" style={{
            marginTop: "30px",
          }} onClick={()=>{setInst1(!inst1)}}>
            <div style={{textDecoration:"none",color:"#413e3e",fontSize:"30px"}}> Proceed</div>
            </Tilt></center>
      
    </div>
    </div>
  );
}

export default Video;
