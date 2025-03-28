document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cameraElement = document.getElementById('camera');
    const canvasElement = document.getElementById('canvas');
    const captureBtn = document.getElementById('captureBtn');
    const retakeBtn = document.getElementById('retakeBtn');
    const toggleFlashBtn = document.getElementById('toggleFlashBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const saveBtn = document.getElementById('saveBtn');
    const capturedImage = document.getElementById('capturedImage');
    const resultContainer = document.querySelector('.result-container');
    const cameraContainer = document.querySelector('.camera-container');
    
    // Global variables
    let stream = null;
    let flashEnabled = false;
    let track = null;
    
    // Initialize the camera
    async function initCamera() {
        try {
            // Request camera access with preferred settings
            const constraints = {
                video: {
                    facingMode: 'environment', // Use back camera if available
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    aspectRatio: { ideal: 16/9 }
                }
            };
            
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            cameraElement.srcObject = stream;
            track = stream.getVideoTracks()[0];
            
            // Set canvas dimensions based on video dimensions
            cameraElement.onloadedmetadata = () => {
                canvasElement.width = cameraElement.videoWidth;
                canvasElement.height = cameraElement.videoHeight;
            };
            
            // Check if flash is available
            const capabilities = track.getCapabilities();
            if (capabilities.torch) {
                toggleFlashBtn.style.display = 'inline-block';
            } else {
                toggleFlashBtn.style.display = 'none';
            }
            
            console.log('Camera initialized successfully');
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Error accessing camera: ' + error.message);
        }
    }
    
    // Capture image from camera
    function captureImage() {
        const context = canvasElement.getContext('2d');
        
        // Draw the current video frame onto the canvas (mirrored if using front camera)
        context.drawImage(cameraElement, 0, 0, canvasElement.width, canvasElement.height);
        
        // Get the image data
        const imageData = canvasElement.toDataURL('image/jpeg', 0.9);
        
        // Display the captured image
        capturedImage.src = imageData;
        
        // Show result container and hide camera container
        cameraContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        
        // Show retake button and hide capture button
        captureBtn.style.display = 'none';
        retakeBtn.style.display = 'inline-block';
        toggleFlashBtn.style.display = 'none';
    }
    
    // Retake photo
    function retakePhoto() {
        // Show camera container and hide result container
        cameraContainer.style.display = 'block';
        resultContainer.style.display = 'none';
        
        // Show capture button and hide retake button
        captureBtn.style.display = 'inline-block';
        retakeBtn.style.display = 'none';
        
        // Show flash toggle if available
        if (track && track.getCapabilities().torch) {
            toggleFlashBtn.style.display = 'inline-block';
        }
    }
    
    // Toggle flash
    async function toggleFlash() {
        if (!track) return;
        
        try {
            flashEnabled = !flashEnabled;
            await track.applyConstraints({
                advanced: [{ torch: flashEnabled }]
            });
            
            toggleFlashBtn.textContent = flashEnabled ? 'Turn Off Flash' : 'Toggle Flash';
        } catch (error) {
            console.error('Error toggling flash:', error);
            alert('Error toggling flash: ' + error.message);
        }
    }
    
    // Download captured image
    function downloadImage() {
        const link = document.createElement('a');
        link.download = 'ktp-image-' + new Date().toISOString().slice(0, 10) + '.jpg';
        link.href = capturedImage.src;
        link.click();
    }
    
    // Save image (placeholder for server-side implementation)
    function saveImage() {
        alert('Image saved successfully! (This is a client-side demo, no actual server storage)');
    }
    
    // Event listeners
    captureBtn.addEventListener('click', captureImage);
    retakeBtn.addEventListener('click', retakePhoto);
    toggleFlashBtn.addEventListener('click', toggleFlash);
    downloadBtn.addEventListener('click', downloadImage);
    saveBtn.addEventListener('click', saveImage);
    
    // Initialize camera on page load
    initCamera();
    
    // Clean up resources when page is unloaded
    window.addEventListener('beforeunload', () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    });
});