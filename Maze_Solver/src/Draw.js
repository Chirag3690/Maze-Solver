import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import VanillaTilt from 'vanilla-tilt';
import "./Draw.css";
import { Link } from "react-router-dom";
function Tilt(props) {
  const { options, ...rest } = props;
  const tilt = useRef(null);

  useEffect(() => {
    VanillaTilt.init(tilt.current, options);
  }, [options]);

  return <div ref={tilt} {...rest} />;
}

let i=0;
function Draw({ result }) {
  
  const[inst2,setInst2]=useState(1);
  const[showim,setShowim]=useState(0);
  const [coordinate, setCoordinate] = useState([]);
  useEffect(() => {
    i=0;
  }, []);


   const getAnswer = async() => {
    await axios
      .post("http://localhost:9000", {
        img: result,
        co: coordinate,
      })
      .then((res) => {
        var f=res.data
        console.log(f);      
          document.getElementById("fimg").src=f;
        
      })
      .catch((error) => {
        
        console.error(error);
        
      });

    // fetch("http://localhost:9000")
    //   .then((res) => res.text())
    //   .then((res) => console.log(res));
  };
  
  function FindPosition(oElement) {
    if (typeof oElement.offsetParent != "undefined") {
      for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
        posX += oElement.offsetLeft;
        posY += oElement.offsetTop;
      }
      return [posX, posY];
    } else {
      return [oElement.x, oElement.y];
    }
  }

  function GetCoordinates(e) {
    if (i < 4) {
      var myImg = document.getElementById("myimg");
      var PosX = 0;
      var PosY = 0;
      var ImgPos;
      ImgPos = FindPosition(myImg);
      if (!e) e = window.event;
      if (e.pageX || e.pageY) {
        PosX = e.pageX;
        PosY = e.pageY;
      } else if (e.clientX || e.clientY) {
        PosX =
          e.clientX +
          document.body.scrollLeft +
          document.documentElement.scrollLeft;
        PosY =
          e.clientY +
          document.body.scrollTop +
          document.documentElement.scrollTop;
      }
      PosX = PosX - ImgPos[0];
      PosY = PosY - ImgPos[1];
      document.getElementById("x").innerHTML = PosX;
      document.getElementById("y").innerHTML = PosY;
      // coordinate[i] = [PosX, PosY];
      setCoordinate([...coordinate, [PosX, PosY]]);
      i++;
      
    }

    if (i == 4) {
      i++;
    }
  }

  const optionsbut={
    scale: 1.2,
    speed: 1000,
    max: 30,
    glare:true,
    "max-glare":1,
  }
  const optionsfimg={
    scale: 1.05,
    speed: 200,
    max: 5,
    glare:false,
    "max-glare":0.7,
  }
  return (
    <div>
      {!result && <h1>Loading..</h1>}
      {result && (
        <img
          src={result}
          id="myimg"
          width="auto"
          height="auto"
          alt=""
          onClick={(e) => {
            GetCoordinates(e);
          }}
        />
      )}
      <div className="designcoor">
      <p>
        X:<span id="x"></span>
      </p>
      </div>
      <div className="designcoor">
      <p>
        Y:<span id="y"></span>
      </p>
      </div>
      <Tilt className="designbutton2" type="button"  onClick={getAnswer} options={optionsbut} style={{
            marginTop: "20px",
          }}>
        <div style={{textDecoration:"none", color:"#413e3e"}}>
          Solve
          </div>
        </Tilt>
      
      
      <Tilt className="designbutton2" type="button"  onClick={()=>setShowim(!showim)} options={optionsbut} style={{
            marginTop: "20px",
          }}>
        <div style={{textDecoration:"none", color:"#413e3e"}}>
          Image
          </div>
        </Tilt>
      
      <div className={showim?"slider1":"slider close1"} >
    
        <Tilt options={optionsfimg} type="button">
        <center><img id="fimg" width="auto" heigth="auto" alt="" className="finalimage"></img></center>    
      </Tilt>
      <center>
        <Tilt options={optionsbut} type="button" className="designbutton1">
        <Link to="/Home" style={{textDecoration:"none", color:"#413e3e"}}>
          Home
          </Link>
        </Tilt>
        </center>
      </div>
     
      <div className={inst2 ?"sliderinst": "slider closeinst"}>
        <center>
         <div  className="designIns">
           INSTRUCTIONS<br></br><br></br>
           These are the steps which you have to follow for further processing!<br></br>
           Step 1<br></br>
           You will see the cropped image in front of you.<br></br>You have to mark the points on maze as show in figure<br></br>
           Step 1.1<br></br>
            1st, 2nd Point: Starting point of Maze is a opening which consist of two Vertices Mark them with the Cursor one by one<br></br>
           Step 1.2<br></br>
           3rd Point: Mark a point on the Starting point inside the maze<br></br>
           Step 1.3<br></br>
           4th Point: Mark a point on the Finishing point of the Maze<br></br>
           Step 4<br></br>
           Click on "Solve" to find the solution.<br></br>
           Step 5<br></br>
           Click on "Show" to see the solution image<br></br>
           <img src=".\images\mazeinst.jpg" width="400px" height="400px"></img><br></br>
           
         </div>
     </center>
     <center><Tilt options={optionsbut} type="button" classname="designIns" style={{
            marginTop: "30px",
          }} onClick={()=>{setInst2(!inst2)}}>
            <div style={{textDecoration:"none",color:"#413e3e",fontSize:"30px"}}> Proceed</div>
            </Tilt></center>
      
    </div>

    </div>
  );
}

export default Draw;
