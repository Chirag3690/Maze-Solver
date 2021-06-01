import React, { useRef,useState,useEffect } from "react";
import "./Cropper.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
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

function Cropper({ image, coord, setResult }) {
  const [crop, setCrop] = useState({
    aspect: 1 / 1,
    unit: "px",
    width: Math.round(coord[2]),
    height: Math.round(coord[3]),
    x: Math.round(coord[0]),
    y: Math.round(coord[1]),
  });
  const getCroppedImg = () => {
    let img = new Image();
    img.src = image;
    const canvas = document.createElement("canvas");
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    const base64Image = canvas.toDataURL("image/jpeg");
    setResult(base64Image);
  };
  const optionscrop = {
    scale: 1.2,
    speed: 1000,
    max: 30,
    glare:true,
    "max-glare":1,
  };
  return (
    <div className="Cropper">
      {image && (
        <div className="imgContainer">
          <ReactCrop
            src={image}
            crop={crop}
            // onImageLoaded={setResult}
            onChange={(newCrop) => setCrop(newCrop)}
          />
        </div>
      )}
      
        <Tilt className="designbutton2" type="button"  onClick={getCroppedImg} options={optionscrop} style={{
            marginTop: "20px",
          }}>
        <Link to="/draw" style={{textDecoration:"none", color:"#413e3e"}}>
          Crop
          </Link>
        </Tilt>
      
    </div>
  );
}

export default Cropper;

