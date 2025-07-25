// Initialize Charts
document.addEventListener('DOMContentLoaded', function() {
    // Water Conservation Chart
    const waterCtx = document.getElementById('waterChart').getContext('2d');
    const waterChart = new Chart(waterCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Water Saved (kL)',
                data: [85, 120, 95, 150, 180, 220],
                backgroundColor: 'rgba(76, 175, 80, 0.7)',
                borderColor: 'rgba(46, 125, 50, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Monthly Water Savings'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Thousands of Liters'
                    }
                }
            }
        }
    });

    // Crop Health Improvement Chart
    const cropCtx = document.getElementById('cropChart').getContext('2d');
    const cropChart = new Chart(cropCtx, {
        type: 'line',
        data: {
            labels: ['2019', '2020', '2021', '2022', '2023'],
            datasets: [{
                label: 'Disease Incidence',
                data: [42, 38, 31, 25, 18],
                borderColor: 'rgba(244, 67, 54, 1)',
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                borderWidth: 3,
                tension: 0.2,
                fill: true
            }, {
                label: 'Crop Yield',
                data: [68, 72, 76, 82, 88],
                borderColor: 'rgba(76, 175, 80, 1)',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 3,
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Crop Health Trends'
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Percentage'
                    }
                }
            }
        }
    });

    // Emission Reduction Chart
    const emissionCtx = document.getElementById('emissionChart').getContext('2d');
    const emissionChart = new Chart(emissionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Transport', 'Fertilizers', 'Water Systems', 'Energy Use'],
            datasets: [{
                label: 'CO2 Emissions Reduced',
                data: [35, 40, 15, 10],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(139, 195, 74, 0.8)',
                    'rgba(205, 220, 57, 0.8)',
                    'rgba(255, 193, 7, 0.8)'
                ],
                borderColor: [
                    'rgba(76, 175, 80, 1)',
                    'rgba(139, 195, 74, 1)',
                    'rgba(205, 220, 57, 1)',
                    'rgba(255, 193, 7, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Emission Reduction Sources'
                }
            }
        }
    });

    // Yield Improvement Chart
    const yieldCtx = document.getElementById('yieldChart').getContext('2d');
    const yieldChart = new Chart(yieldCtx, {
        type: 'bar',
        data: {
            labels: ['Wheat', 'Rice', 'Corn', 'Soybeans', 'Vegetables'],
            datasets: [{
                label: 'Traditional Farming',
                data: [3.2, 4.1, 5.8, 2.7, 8.5],
                backgroundColor: 'rgba(156, 39, 176, 0.7)',
                borderColor: 'rgba(156, 39, 176, 1)',
                borderWidth: 1
            }, {
                label: 'With EcoFarm AI',
                data: [4.8, 5.9, 7.5, 4.2, 12.3],
                backgroundColor: 'rgba(33, 150, 243, 0.7)',
                borderColor: 'rgba(33, 150, 243, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Crop Yield (tons per hectare)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Tons per Hectare'
                    }
                }
            }
        }
    });

    // Store charts for export
    window.charts = {
        waterChart,
        cropChart,
        emissionChart,
        yieldChart
    };

    // Simulate real-time data updates
    setInterval(() => {
        // Update water chart
        const waterChart = Chart.getChart("waterChart");
        if (waterChart) {
            const newData = waterChart.data.datasets[0].data.map(value => {
                const change = Math.floor(Math.random() * 21) - 10; // -10 to +10
                return Math.max(50, value + change);
            });
            waterChart.data.datasets[0].data = newData;
            waterChart.update();
        }
    }, 5000);
});

// Crop Disease Detection Functionality
const uploadArea = document.getElementById('upload-area');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const analyzeBtn = document.getElementById('analyze-btn');
const detectionLoader = document.getElementById('detection-loader');
const detectionResult = document.getElementById('detection-result');

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
        detectionResult.innerHTML = `<p class="diseased">Error loading AI model. Please refresh the page.</p>`;
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
        detectionResult.innerHTML = '<p>Click "Analyze with AI" to check for diseases</p>';
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
    detectionLoader.style.display = 'block';
    detectionResult.innerHTML = '';
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
                detectionLoader.style.display = 'none';
                
                if (isDiseased) {
                    detectionResult.className = 'detection-result diseased';
                    detectionResult.innerHTML = `
                        <h4>⚠️ Disease Detected!</h4>
                        <p>Likely disease: <strong>${diseaseName}</strong></p>
                        <p>Confidence: ${confidence}%</p>
                        <div class="confidence-meter">
                            <div class="confidence-level" style="width: ${confidence}%; background: #F44336;"></div>
                        </div>
                        <p>We detected signs of disease in your crop. Early treatment is recommended.</p>
                        <div class="recommendation">
                            <h5>Recommended Actions:</h5>
                            <ul>
                                <li>Remove and destroy infected plants</li>
                                <li>Apply organic fungicide treatment</li>
                                <li>Improve air circulation around plants</li>
                                <li>Rotate crops next season</li>
                            </ul>
                        </div>
                    `;
                } else {
                    detectionResult.className = 'detection-result healthy';
                    detectionResult.innerHTML = `
                        <h4>✅ Healthy Crop</h4>
                        <p>No significant diseases detected</p>
                        <p>Confidence: ${confidence}%</p>
                        <div class="confidence-meter">
                            <div class="confidence-level" style="width: ${confidence}%; background: #4CAF50;"></div>
                        </div>
                        <p>Your crop appears healthy. Continue monitoring for best results.</p>
                        <div class="recommendation">
                            <h5>Preventive Tips:</h5>
                            <ul>
                                <li>Maintain proper plant spacing</li>
                                <li>Water at the base of plants</li>
                                <li>Use disease-resistant varieties</li>
                                <li>Regularly inspect plants</li>
                            </ul>
                        </div>
                    `;
                }
                
                analyzeBtn.disabled = false;
            } catch (error) {
                console.error('Error classifying image:', error);
                detectionLoader.style.display = 'none';
                detectionResult.innerHTML = `<p class="diseased">Error analyzing image. Please try again.</p>`;
                analyzeBtn.disabled = false;
            }
        };
    } catch (error) {
        console.error('Error during analysis:', error);
        detectionLoader.style.display = 'none';
        detectionResult.innerHTML = `<p class="diseased">Error during analysis. Please try again.</p>`;
        analyzeBtn.disabled = false;
    }
}

// Crop Recommendations Functionality
const recommendBtn = document.getElementById('recommend-btn');
const recommendationResult = document.getElementById('recommendation-result');

recommendBtn.addEventListener('click', generateRecommendations);

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
        <h3><i class="fas fa-lightbulb"></i> AI Recommendations</h3>
        <p>Based on your conditions:</p>
        <ul>
            <li><strong>Soil:</strong> ${soilType.charAt(0).toUpperCase() + soilType.slice(1)}</li>
            <li><strong>Climate:</strong> ${climate.charAt(0).toUpperCase() + climate.slice(1)}</li>
            <li><strong>Water:</strong> ${water.charAt(0).toUpperCase() + water.slice(1)} availability</li>
        </ul>
        
        <h4><i class="fas fa-seedling"></i> Recommended Crops</h4>
        <div class="crop-list">
    `;
    
    crops.forEach(crop => {
        html += `<div class="crop-item"><i class="fas fa-leaf"></i> ${crop}</div>`;
    });
    
    html += `</div>`;
    
    html += `
        <h4 style="margin-top: 20px;"><i class="fas fa-tint"></i> Water Management</h4>
        <ul>
    `;
    
    waterTips.forEach(tip => {
        html += `<li>${tip}</li>`;
    });
    
    html += `</ul>`;
    
    recommendationResult.innerHTML = html;
}

// Export Report functionality
document.getElementById('export-report-btn').addEventListener('click', function() {
    exportDashboardAsPDF();
});

function exportDashboardAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const dashboard = document.getElementById('dashboard-content');
    
    // Show loading state
    const originalText = document.querySelector('#export-report-btn span');
    document.querySelector('#export-report-btn span').textContent = 'Generating PDF...';
    document.querySelector('#export-report-btn i').className = 'fas fa-spinner fa-spin';
    document.getElementById('export-report-btn').disabled = true;
    
    html2canvas(dashboard, {
        scale: 2,
        useCORS: true,
        logging: false
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = doc.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add image to PDF
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        
        // Add footer
        doc.setFontSize(10);
        doc.text('EcoFarm AI Sustainability Report', 
                 imgWidth / 2, doc.internal.pageSize.getHeight() - 10, 
                 { align: 'center' });
        
        // Save the PDF
        doc.save('EcoFarm_AI_Sustainability_Report.pdf');
        
        // Reset button state
        document.querySelector('#export-report-btn span').textContent = 'Export Report';
        document.querySelector('#export-report-btn i').className = 'fas fa-download';
        document.getElementById('export-report-btn').disabled = false;
        
        // Show toast notification
        showToast('Dashboard exported as PDF successfully!');
    });
}

// Farmer Dashboard button
document.getElementById('dashboard-btn').addEventListener('click', function() {
    showToast('Redirecting to Farmer Dashboard...');
    
    // Simulate navigation after a short delay
    setTimeout(() => {
        document.querySelector('header h1').textContent = "Farmer Dashboard";
        document.querySelector('.impact-header h2').textContent = "Your Farm Analytics";
        document.querySelector('.impact-header p').textContent = "Personalized insights for your farm operations";
        showToast('Welcome to your Farmer Dashboard!');
    }, 1500);
});

// Toast notification function
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize with recommendations
generateRecommendations();


