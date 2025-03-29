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
    const ktpFrame = document.querySelector('.ktp-frame');
    const cornerElements = document.querySelectorAll('.corner');
    
    // Global variables
    let stream = null;
    let flashEnabled = false;
    let track = null;
    
    // KTP card has aspect ratio of 85.6mm × 54mm (roughly 1.585:1)
    const KTP_ASPECT_RATIO = 85.6 / 54;
    
    // Function to update KTP frame dimensions based on orientation
    function updateKtpFrameDimensions() {
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        const containerWidth = cameraContainer.clientWidth;
        const containerHeight = cameraContainer.clientHeight;
        
        console.log(`Container dimensions: ${containerWidth}x${containerHeight}, Orientation: ${isPortrait ? 'Portrait' : 'Landscape'}`);
        
        // If container dimensions are not available yet, try again after a short delay
        if (containerWidth === 0 || containerHeight === 0) {
            console.log('Container dimensions not available yet, retrying...');
            setTimeout(updateKtpFrameDimensions, 100);
            return;
        }
        
        // Calculate frame dimensions to maintain KTP aspect ratio
        let frameWidth, frameHeight;
        
        if (isPortrait) {
            // In portrait mode, we want the width to be a percentage of container width
            // and height calculated to maintain the KTP aspect ratio
            frameWidth = containerWidth * 0.8; // 80% of container width
            frameHeight = frameWidth / KTP_ASPECT_RATIO;
            
            // Make sure the frame isn't too tall for the container
            if (frameHeight > containerHeight * 0.7) {
                frameHeight = containerHeight * 0.7;
                frameWidth = frameHeight * KTP_ASPECT_RATIO;
            }
        } else {
            // In landscape mode, we want the height to be a percentage of container height
            // and width calculated to maintain the KTP aspect ratio
            frameHeight = containerHeight * 0.7; // 70% of container height
            frameWidth = frameHeight * KTP_ASPECT_RATIO;
            
            // Make sure the frame isn't too wide for the container
            if (frameWidth > containerWidth * 0.8) {
                frameWidth = containerWidth * 0.8;
                frameHeight = frameWidth / KTP_ASPECT_RATIO;
            }
        }
        
        // Apply the calculated dimensions
        ktpFrame.style.width = `${frameWidth}px`;
        ktpFrame.style.height = `${frameHeight}px`;
        
        console.log(`KTP frame dimensions: ${frameWidth}px x ${frameHeight}px, Ratio: ${frameWidth/frameHeight}`);
        
        // Update corner positions
        updateCornerPositions(frameWidth, frameHeight);
    }
    
    // Function to update corner positions based on frame dimensions
    function updateCornerPositions(frameWidth, frameHeight) {
        // Calculate half dimensions for positioning
        const halfWidth = frameWidth / 2;
        const halfHeight = frameHeight / 2;
        
        // Update each corner position
        cornerElements.forEach(corner => {
            if (corner.classList.contains('top-left')) {
                corner.style.transform = `translate(-50%, -50%) translate(${-halfWidth}px, ${-halfHeight}px)`;
            } else if (corner.classList.contains('top-right')) {
                corner.style.transform = `translate(-50%, -50%) translate(${halfWidth}px, ${-halfHeight}px)`;
            } else if (corner.classList.contains('bottom-left')) {
                corner.style.transform = `translate(-50%, -50%) translate(${-halfWidth}px, ${halfHeight}px)`;
            } else if (corner.classList.contains('bottom-right')) {
                corner.style.transform = `translate(-50%, -50%) translate(${halfWidth}px, ${halfHeight}px)`;
            }
        });
    }

    // Initialize the camera
    async function initCamera() {
        try {
            // Check if device is in portrait mode
            const isPortrait = window.matchMedia("(orientation: portrait)").matches;
            console.log(`Current orientation: ${isPortrait ? 'Portrait' : 'Landscape'}`);
            
            const constraints = {
                video: {
                    facingMode: 'environment', // Use back camera if available
                    width: { ideal: isPortrait ? 1080 : 1920 },
                    height: { ideal: isPortrait ? 1920 : 1080 }
                }
            };
            
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            cameraElement.srcObject = stream;
            track = stream.getVideoTracks()[0];
            
            // Set canvas dimensions based on video dimensions
            cameraElement.onloadedmetadata = () => {
                // Set canvas to match video dimensions
                canvasElement.width = cameraElement.videoWidth;
                canvasElement.height = cameraElement.videoHeight;
                
                // Log the actual dimensions we got
                console.log(`Video dimensions: ${cameraElement.videoWidth}x${cameraElement.videoHeight}`);
                
                // Adjust the camera container to match video aspect ratio if needed
                const actualRatio = cameraElement.videoWidth / cameraElement.videoHeight;
                console.log(`Actual video aspect ratio: ${actualRatio}`);
            };
            
            // Wait for video to start playing before updating frame dimensions
            cameraElement.onloadeddata = () => {
                console.log('Video data loaded, updating frame dimensions');
                // Give a small delay to ensure container dimensions are available
                setTimeout(updateKtpFrameDimensions, 300);
            };
            
            // Additional event to ensure frame is updated when video starts playing
            cameraElement.onplay = () => {
                console.log('Video started playing');
                setTimeout(updateKtpFrameDimensions, 500);
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
    
    // Initialize camera on page load with a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        initCamera();
        
        // Fallback: If after 2 seconds the frame hasn't been updated by JavaScript,
        // force an update to ensure it's visible
        setTimeout(() => {
            console.log('Fallback: Forcing frame update');
            updateKtpFrameDimensions();
        }, 2000);
    }, 100);
    
    // Listen for orientation changes and reinitialize camera
    window.addEventListener('orientationchange', () => {
        // Small delay to allow the browser to complete the orientation change
        setTimeout(() => {
            console.log('Reinitializing camera after orientation change');
            // Stop current stream before reinitializing
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            initCamera();
        }, 300);
    });
    
    // Listen for resize events to update KTP frame dimensions
    window.addEventListener('resize', () => {
        console.log('Window resized');
        // Only update dimensions if camera is active
        if (cameraContainer.style.display !== 'none') {
            updateKtpFrameDimensions();
        }
    });
    
    // Clean up resources when page is unloaded
    window.addEventListener('beforeunload', () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    });
});
