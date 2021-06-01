import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import "./Home.css";
import VanillaTilt from 'vanilla-tilt';

function refreshPage(){ 
  window.location.reload(); 
}

function Tilt(props) {
  const { options, ...rest } = props;
  const tilt = useRef(null);

  useEffect(() => {
    VanillaTilt.init(tilt.current, options);
  }, [options]);

  return <div ref={tilt} {...rest} />;
}


function Home() {
  const[active,setActive]=useState(0);
  const optionsvideo = {
    scale: 1.2,
    speed: 1000,
    max: 30,
    glare:true,
    "max-glare":1,
  };
  const optionsfront={
    scale: 1.05,
    speed: 200,
    max: 5,
    glare:false,
    "max-glare":0.7,
  }
  
  return (
    <div>
    

      <h1 className="heading">The Maze Solver</h1>
      <div>
        <Tilt options={optionsfront} type="button"  className={active ?"gotoback":"designfront"}  >
         <div className="frontcontent">HI!<br></br> This is a Maze Solver. 
         Here you can solve your mazes easily by showing it to the camera.
          The camera will detect the Maze and solve it.<br></br><br></br><Tilt options={optionsvideo} type="button" className="designbutton" onClick={()=>setActive(!active)}>Try it :)</Tilt></div>
        </Tilt>
      </div>
      <div className={active ?"slider": "slider close"}>
      
        <Tilt options={optionsvideo} type="button"  className="designvideo">
          <img src=".\images\videoicon.png" width="100px" height="100px"></img>
        <Link to="/video" style={{textDecoration:"none",}}>
         <div className="content">Video</div>
         </Link>
        </Tilt>
        <Tilt options={optionsvideo} type="button" className="designhome">
        <img src=".\images\homeicon.png" width="100px" height="100px"></img>
         <div className="content" onClick={()=>setActive(!active)}>Home</div>
        
        </Tilt>
        
      </div>
      
    </div>
    
  );
}

export default Home;
