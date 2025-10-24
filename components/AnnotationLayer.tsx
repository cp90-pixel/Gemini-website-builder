import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';

interface AnnotationLayerProps {
  targetElement: HTMLIFrameElement;
  onComplete: (imageDataUrl: string) => void;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({ targetElement, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.strokeStyle = 'rgba(255, 22, 22, 0.7)';
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    const getCoords = (event: MouseEvent | TouchEvent) => {
        const currentTarget = event.currentTarget as HTMLElement;
        const rect = currentTarget.getBoundingClientRect();
        if ('touches' in event) {
            return {
                x: event.touches[0].clientX - rect.left,
                y: event.touches[0].clientY - rect.top,
            };
        }
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    };

    const startDrawing = (event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const { x, y } = getCoords(event);
      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);
    };

    const draw = (event: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      event.preventDefault();
      const { x, y } = getCoords(event);
      context.lineTo(x, y);
      context.stroke();
    };

    const stopDrawing = () => {
      if (!isDrawing) return;
      context.closePath();
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing, { passive: false });

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);

      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing, targetElement]);

  const handleCapture = async () => {
      const drawingCanvas = canvasRef.current;
      if (!drawingCanvas || isCapturing) return;

      setIsCapturing(true);

      try {
        if (!targetElement.contentDocument || !targetElement.contentWindow) {
            throw new Error("Iframe content is not accessible.");
        }
        
        const captureTarget = targetElement.contentDocument.body;

        const screenshotCanvas = await html2canvas(captureTarget, {
            allowTaint: true,
            useCORS: true,
            logging: false,
            width: targetElement.clientWidth,
            height: targetElement.clientHeight,
            scrollX: targetElement.contentWindow.scrollX,
            scrollY: targetElement.contentWindow.scrollY,
        });

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = screenshotCanvas.width;
        finalCanvas.height = screenshotCanvas.height;
        const finalCtx = finalCanvas.getContext('2d');
        if (!finalCtx) throw new Error("Could not create final canvas context");

        finalCtx.drawImage(screenshotCanvas, 0, 0);
        finalCtx.drawImage(drawingCanvas, 0, 0);
        
        onComplete(finalCanvas.toDataURL('image/jpeg', 0.9));

      } catch (error) {
          console.error("Failed to capture annotation:", error);
          // Potentially show an error to the user
      } finally {
        setIsCapturing(false);
      }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col">
        <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
        <div className="absolute bottom-4 right-4">
            <button
                onClick={handleCapture}
                disabled={isCapturing}
                className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md shadow-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75 transition-colors disabled:bg-cyan-800 disabled:cursor-wait"
            >
                {isCapturing ? 'Capturing...' : 'Done Annotating'}
            </button>
        </div>
    </div>
  );
};

export default AnnotationLayer;