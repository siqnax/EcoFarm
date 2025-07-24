
// DOM Elements
const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const analyzeBtn = document.getElementById('analyze-btn');
const loader = document.getElementById('loader');
const diseaseResult = document.getElementById('disease-result');
const recommendBtn = document.getElementById('recommend-btn');
const recommendationResult = document.getElementById('recommendation-result');

// Set up event listeners
uploadArea.addEventListener('click', () => imageUpload.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('active');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('active');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('active');
    
    if (e.dataTransfer.files.length) {
        handleImageUpload(e.dataTransfer.files[0]);
    }
});

imageUpload.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleImageUpload(e.target.files[0]);
    }
});

analyzeBtn.addEventListener('click', analyzeImage);
recommendBtn.addEventListener('click', generateRecommendations);

// Initialize model variable
let model;

// Load MobileNet model
async function loadModel() {
    try {
        console.log("Loading TensorFlow.js model...");
        model = await mobilenet.load();
        console.log("Model loaded successfully!");
    } catch (error) {
        console.error("Error loading model:", error);
        diseaseResult.innerHTML = `<p class="disease-infected">Error loading AI model. Please refresh the page.</p>`;
    }
}

// Call model loading function
loadModel();

// Handle image upload
function handleImageUpload(file) {
    if (!file.type.match('image.*')) {
        alert('Please upload an image file');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        analyzeBtn.disabled = false;
        diseaseResult.innerHTML = '<p>Click "Analyze with AI" to check for diseases</p>';
    }
    
    reader.readAsDataURL(file);
}

// Analyze image with TensorFlow.js
async function analyzeImage() {
    if (!model) {
        alert('AI model is still loading. Please try again in a moment.');
        return;
    }
    
    if (!imagePreview.src || imagePreview.src === window.location.href) {
        alert('Please upload an image first');
        return;
    }
    
    // Show loader
    loader.style.display = 'block';
    diseaseResult.innerHTML = '';
    analyzeBtn.disabled = true;
    
    try {
        // Simulate processing time for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Classify the image
        const img = document.createElement('img');
        img.src = imagePreview.src;
        img.onload = async () => {
            try {
                // Classify the image
                const predictions = await model.classify(img);
                
                // Simulate disease detection (in a real app, we'd use a custom model)
                const isDiseased = Math.random() > 0.7;
                const diseases = [
                    "Powdery Mildew", "Leaf Rust", "Bacterial Blight", 
                    "Fusarium Wilt", "Leaf Spot", "Mosaic Virus"
                ];
                const diseaseName = diseases[Math.floor(Math.random() * diseases.length)];
                
                // Simulate confidence level
                const confidence = (Math.random() * 40 + 60).toFixed(1);
                
                // Display results
                loader.style.display = 'none';
                
                if (isDiseased) {
                    diseaseResult.innerHTML = `
                        <div class="disease-result disease-infected">
                            <h4>⚠️ Disease Detected!</h4>
                            <p>Likely disease: <strong>${diseaseName}</strong></p>
                            <p>Confidence: ${confidence}%</p>
                            <div class="confidence-meter">
                                <div class="confidence-level" style="width: ${confidence}%"></div>
                            </div>
                            <p>We detected signs of disease in your crop. Early treatment is recommended.</p>
                        </div>
                    `;
                } else {
                    diseaseResult.innerHTML = `
                        <div class="disease-result disease-healthy">
                            <h4>✅ Healthy Crop</h4>
                            <p>No significant diseases detected</p>
                            <p>Confidence: ${confidence}%</p>
                            <div class="confidence-meter">
                                <div class="confidence-level" style="width: ${confidence}%"></div>
                            </div>
                            <p>Your crop appears healthy. Continue monitoring for best results.</p>
                        </div>
                    `;
                }
                
                analyzeBtn.disabled = false;
            } catch (error) {
                console.error('Error classifying image:', error);
                loader.style.display = 'none';
                diseaseResult.innerHTML = `<p class="disease-infected">Error analyzing image. Please try again.</p>`;
                analyzeBtn.disabled = false;
            }
        };
    } catch (error) {
        console.error('Error during analysis:', error);
        loader.style.display = 'none';
        diseaseResult.innerHTML = `<p class="disease-infected">Error during analysis. Please try again.</p>`;
        analyzeBtn.disabled = false;
    }
}

// Generate crop recommendations
function generateRecommendations() {
    const soilType = document.getElementById('soil-type').value;
    const climate = document.getElementById('climate').value;
    const water = document.getElementById('water').value;
    
    // Define recommendation logic
    const recommendations = {
        loamy: {
            tropical: ["Rice", "Banana", "Sugarcane", "Papaya"],
            dry: ["Maize", "Beans", "Melons", "Tomatoes"],
            temperate: ["Wheat", "Barley", "Potatoes", "Cabbage"],
            continental: ["Oats", "Peas", "Carrots", "Apples"]
        },
        sandy: {
            tropical: ["Cassava", "Pineapple", "Sweet Potato", "Peanuts"],
            dry: ["Sorghum", "Millet", "Watermelon", "Onions"],
            temperate: ["Carrots", "Radishes", "Asparagus", "Strawberries"],
            continental: ["Lettuce", "Spinach", "Broccoli", "Blueberries"]
        },
        clay: {
            tropical: ["Taro", "Yam", "Plantain", "Okra"],
            dry: ["Cotton", "Olives", "Almonds", "Figs"],
            temperate: ["Rice", "Lentils", "Peppers", "Eggplant"],
            continental: ["Wheat", "Barley", "Sunflowers", "Cherries"]
        },
        silty: {
            tropical: ["Rice", "Cabbage", "Cauliflower", "Cucumber"],
            dry: ["Corn", "Squash", "Pumpkin", "Zucchini"],
            temperate: ["Beans", "Peas", "Lettuce", "Spinach"],
            continental: ["Potatoes", "Broccoli", "Celery", "Grapes"]
        }
    };
    
    // Water-specific adjustments
    const waterAdjustments = {
        high: [],
        medium: ["Drought-resistant varieties", "Mulching to retain moisture"],
        low: ["Drip irrigation", "Water harvesting techniques", "Drought-tolerant crops"]
    };
    
    // Get recommendations
    const crops = recommendations[soilType][climate];
    const waterTips = waterAdjustments[water];
    
    // Create HTML output
    let html = `
        <h3><span>💡</span> AI Recommendations</h3>
        <p>Based on your conditions:</p>
        <ul>
            <li><strong>Soil:</strong> ${soilType.charAt(0).toUpperCase() + soilType.slice(1)}</li>
            <li><strong>Climate:</strong> ${climate.charAt(0).toUpperCase() + climate.slice(1)}</li>
            <li><strong>Water:</strong> ${water.charAt(0).toUpperCase() + water.slice(1)} availability</li>
        </ul>
        
        <h4>Recommended Crops</h4>
        <p>${crops.join(', ')}</p>
        
        <h4>Water Management</h4>
        <ul>
    `;
    
    waterTips.forEach(tip => {
        html += `<li>${tip}</li>`;
    });
    
    html += `</ul>`;
    
    recommendationResult.innerHTML = html;
}

// Initialize with a sample recommendation
generateRecommendations();

