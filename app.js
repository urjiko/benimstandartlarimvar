// app.js

// 1. DOM Elements
const heightSlider = document.getElementById('min_height');
const heightDisplay = document.getElementById('height_display');
const incomeSlider = document.getElementById('min_income');
const incomeDisplay = document.getElementById('income_display');
const calculateBtn = document.getElementById('calculate_btn');
const resultsSection = document.getElementById('results');
const probabilityDisplay = document.getElementById('final_probability');
const countDisplay = document.getElementById('estimated_count');

// 2. Event Listeners for Sliders (UI Updates)
heightSlider.addEventListener('input', (e) => {
    heightDisplay.textContent = e.target.value;
});

incomeSlider.addEventListener('input', (e) => {
    incomeDisplay.textContent = parseInt(e.target.value).toLocaleString('tr-TR');
});

// 3. Core Math Functions
// Error function approximation for Normal Distribution
function erf(x) {
    const sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);
    
    // Constants for approximation
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
}

// Cumulative Distribution Function (CDF)
function normalCDF(x, mean, stdDev) {
    return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
}

// 4. Main Calculation Logic
calculateBtn.addEventListener('click', async () => {
    try {
        // Fetch demographic data
        const response = await fetch('data.json');
        const data = await response.json();

        // Get user inputs
        const targetGender = document.getElementById('target_gender').value;
        const minAge = parseInt(document.getElementById('min_age').value);
        const maxAge = parseInt(document.getElementById('max_age').value);
        const minHeight = parseInt(heightSlider.value);
        const minIncome = parseInt(incomeSlider.value);
        const excludeMarried = document.getElementById('exclude_married').checked;
        const excludeObese = document.getElementById('exclude_obese').checked;

        // Base Population Calculation (Mocking with Male Data for now)
        let basePopulation = data.turkey_male_population;

        // 1. Age Probability (Simplified linear estimation based on mock data)
        // In a real scenario, you sum the exact percentages from TUİK
        let ageProbability = 0.20; // Placeholder for the 20-30 range

        // 2. Height Probability (1 - CDF since we want height > minHeight)
        const heightMean = data.height_distribution.mean;
        const heightStdDev = data.height_distribution.std_dev;
        let heightProbability = 1 - normalCDF(minHeight, heightMean, heightStdDev);

        // 3. Income Probability (Simplified logarithmic or percentile estimation)
        // Placeholder math: assuming exponential drop-off
        let incomeProbability = 1.0;
        if (minIncome > data.income_distribution.median) {
            incomeProbability = Math.pow(0.5, (minIncome / data.income_distribution.median));
        }

        // 4. Exclusions (Static multipliers for MVP)
        let statusMultiplier = 1.0;
        if (excludeMarried) statusMultiplier *= 0.40; // Assuming 60% are married
        if (excludeObese) statusMultiplier *= 0.70;   // Assuming 30% are obese

        // 5. Calculate Joint Probability (Naive Bayes approach)
        const jointProbability = ageProbability * heightProbability * incomeProbability * statusMultiplier;
        
        // Final Numbers
        const finalPercentage = (jointProbability * 100).toFixed(4);
        const estimatedPool = Math.floor(basePopulation * jointProbability);

        // Update UI
        probabilityDisplay.textContent = `${finalPercentage}%`;
        countDisplay.textContent = estimatedPool.toLocaleString('tr-TR');
        
        resultsSection.classList.remove('hidden');

    } catch (error) {
        console.error("Data loading error:", error);
        alert("Failed to load calculation data. Are you running this on a server?");
    }
});