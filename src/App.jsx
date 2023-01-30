import * as faceapi from "face-api.js";
import { useRef, useEffect } from "react";
import "./App.css";

function App() {
  const imgRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const loadModels = () => {
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        ,
        faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      ])
        .then(handleImage)
        .catch((e) => console.log(e));
    };
    imgRef.current && loadModels();
  }, []);

  async function handleImage() {
    const detections = await faceapi
      .detectAllFaces(imgRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(imgRef.current);
    faceapi.matchDimensions(canvasRef.current, {
      width: 400,
      height: 300,
    });
    const resized = faceapi.resizeResults(detections, {
      width: 400,
      height: 300,
    });
    faceapi.draw.drawDetections(canvasRef.current, resized);
    faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
  }

  return (
    <div className="app">
      <img
        crossOrigin=""
        ref={imgRef}
        src="https://media.istockphoto.com/id/1270066890/photo/multiethnic-parents-giving-children-piggyback-ride.jpg?s=612x612&w=0&k=20&c=8af-giLRvOhM2VL9VBBcYDfqRxJtU_uvdoHhw86UIew="
        width={400}
        height={300}
      />
      <canvas ref={canvasRef} width={400} height={300} />
    </div>
  );
}

export default App;
