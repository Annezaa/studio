
"use client";
import { useEffect, useRef } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import * as drawingUtils from "@mediapipe/drawing_utils";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      if (!canvasRef.current) return;
      const canvasCtx = canvasRef.current.getContext("2d")!;
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      if (results.poseLandmarks) {
        drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, Pose.POSE_CONNECTIONS,
          { color: "#FF00B0", lineWidth: 4 }); // Fuchsia Pink
        drawingUtils.drawLandmarks(canvasCtx, results.poseLandmarks,
          { color: "#B30079", lineWidth: 2 }); // Deep Orchid
      }
      canvasCtx.restore();
    });

    if (videoRef.current) {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if(videoRef.current) {
                await pose.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });
        camera.start();

        return () => {
          // Stop the camera and cleanup resources when the component unmounts
          camera.stop();
          pose.close();
        }
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4 text-primary font-headline">Pose Tracking Demo</h1>
      <div className="relative w-[640px] h-[480px]">
        <video ref={videoRef} className="hidden" />
        <canvas ref={canvasRef} width={640} height={480} className="rounded-lg shadow-lg w-full h-full" />
      </div>
    </div>
  );
}
