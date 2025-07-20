// Mock AI Functions (Replace with real API calls)
function analyzeSoil() {
    document.getElementById('soil-status').innerHTML = "🔍 Analyzing soil...";
    
    setTimeout(() => {
      const nutrients = {
        nitrogen: (Math.random() * 100).toFixed(2),
        phosphorus: (Math.random() * 100).toFixed(2),
        potassium: (Math.random() * 100).toFixed(2)
      };
      
      const recommendation = nutrients.nitrogen < 50 ? 
        "⚠️ Add nitrogen-rich fertilizer." : "✅ Soil is healthy!";
      
      document.getElementById('soil-status').innerHTML = `
        Nitrogen: ${nutrients.nitrogen}%<br>
        Phosphorus: ${nutrients.phosphorus}%<br>
        Potassium: ${nutrients.potassium}%<br>
        <strong>${recommendation}</strong>
      `;
      
      updateAIOutput(`Soil Analysis Results:<br>${recommendation}`);
    }, 1500);
  }
  
  function detectDisease() {
    const fileInput = document.getElementById('crop-image');
    if (!fileInput.files[0]) {
      alert("Please upload an image first!");
      return;
    }
    
    document.getElementById('disease-result').innerHTML = "🖼️ Processing image...";
    
    setTimeout(() => {
      const diseases = ["Leaf Rust", "Powdery Mildew", "Healthy"];
      const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
      
      const result = randomDisease === "Healthy" ?
        "✅ No diseases detected!" : `⚠️ Detected: <strong>${randomDisease}</strong>`;
      
      document.getElementById('disease-result').innerHTML = result;
      updateAIOutput(`Disease Detection:<br>${result}`);
    }, 2000);
  }
  
  function updateAIOutput(message) {
    const outputDiv = document.getElementById('ai-output');
    outputDiv.innerHTML += `<p>${message}</p>`;
  }
  