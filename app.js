// 1. State Variables
let currentStep = 1;
const totalSteps = 6;
let targetGender = null;

// 2. DOM Elements
const steps = document.querySelectorAll('.step');
const progressFill = document.getElementById('progress_fill');
const prevBtn = document.getElementById('prev_btn');
const nextBtn = document.getElementById('next_btn');
const calcBtn = document.getElementById('calc_btn');
const navControls = document.getElementById('nav_controls');

// Step 1: Gender Buttons
const genderBtns = document.querySelectorAll('.gender-btn');

// Dynamic UI Elements
const heightTitle = document.getElementById('height_title');
const heightSlider = document.getElementById('height_slider');
const heightDisplay = document.getElementById('height_display');
const incomeSingleWrapper = document.getElementById('income_single_wrapper');
const incomeRangeWrapper = document.getElementById('income_range_wrapper');
const incomeSlider = document.getElementById('income_slider');
const incomeDisplay = document.getElementById('income_display');
const marriedLabel = document.getElementById('married_label');

// Math Functions (Normal Distribution & CDF)
function erf(x) {
    const sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);
    const a1 =  0.254829592, a2 = -0.284496736, a3 =  1.421413741, a4 = -1.453152027, a5 =  1.061405429, p  =  0.3275911;
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
}

function normalCDF(x, mean, stdDev) {
    return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
}

function incomeCDF(amount, median) {
    if (amount <= 0) return 0;
    return 1 - Math.pow(0.5, amount / median);
}

// 3. Navigation Logic
function updateUI() {
    // Show/Hide Steps
    steps.forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Update Progress Bar
    progressFill.style.width = `${(currentStep / totalSteps) * 100}%`;

    // Button Visibility Logic
    if (currentStep === 1) {
        // Step 1: Hide nav, wait for gender click
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
        calcBtn.classList.add('hidden');
    } else if (currentStep === totalSteps) {
        // Step 6 (Results): Hide nav entirely
        navControls.classList.add('hidden');
    } else {
        // Steps 2-5: Show nav
        navControls.classList.remove('hidden');
        prevBtn.classList.remove('hidden');
        
        if (currentStep === totalSteps - 1) {
            nextBtn.classList.add('hidden');
            calcBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            calcBtn.classList.add('hidden');
        }
    }
}

function adaptUIforGender() {
    if (targetGender === 'male') {
        heightTitle.textContent = "Minimum Boy";
        incomeSingleWrapper.classList.remove('hidden');
        incomeRangeWrapper.classList.add('hidden');
        marriedLabel.textContent = "Evlileri Hariç Tut";
    } else {
        heightTitle.textContent = "Maksimum Boy";
        incomeSingleWrapper.classList.add('hidden');
        incomeRangeWrapper.classList.remove('hidden');
        marriedLabel.textContent = "Evlileri Dahil Et";
    }
}

// 4. Event Listeners
genderBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        targetGender = e.target.getAttribute('data-gender');
        adaptUIforGender();
        currentStep++;
        updateUI();
    });
});

nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps - 1) currentStep++;
    updateUI();
});

prevBtn.addEventListener('click', () => {
    if (currentStep > 1) currentStep--;
    updateUI();
});

document.getElementById('restart_btn').addEventListener('click', () => {
    currentStep = 1;
    targetGender = null;
    navControls.classList.remove('hidden');
    updateUI();
});

// Real-time Slider Updates
heightSlider.addEventListener('input', (e) => heightDisplay.textContent = e.target.value);
incomeSlider.addEventListener('input', (e) => incomeDisplay.textContent = parseInt(e.target.value).toLocaleString('tr-TR'));

// 5. Calculate Result
calcBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('data.json');
        const data = await response.json();

        let basePopulation = targetGender === 'male' ? data.turkey_male_population : data.turkey_female_population;
        let ageProbability = 0.20; // Placeholder
        let heightProbability = 1.0;
        let incomeProbability = 1.0;
        let statusMultiplier = 1.0;

        const marriedChecked = document.getElementById('married_checkbox').checked;
        const obeseChecked = document.getElementById('exclude_obese').checked;

        if (targetGender === 'male') {
            const minHeight = parseInt(heightSlider.value);
            const minIncome = parseInt(incomeSlider.value);
            
            heightProbability = 1 - normalCDF(minHeight, data.height_distribution.male_mean, data.height_distribution.male_std_dev);
            incomeProbability = 1 - incomeCDF(minIncome, data.income_distribution.median);
            if (marriedChecked) statusMultiplier *= 0.40; 
        } else {
            const maxHeight = parseInt(heightSlider.value);
            const minIncF = parseInt(document.getElementById('min_income_f').value);
            const maxIncF = parseInt(document.getElementById('max_income_f').value);
            
            heightProbability = normalCDF(maxHeight, data.height_distribution.female_mean, data.height_distribution.female_std_dev);
            
            let pMax = incomeCDF(maxIncF, data.income_distribution.median);
            let pMin = incomeCDF(minIncF, data.income_distribution.median);
            incomeProbability = Math.max(0, pMax - pMin);
            
            statusMultiplier = marriedChecked ? 1.0 : 0.40;
        }

        if (obeseChecked) statusMultiplier *= 0.70; 

        const jointProbability = ageProbability * heightProbability * incomeProbability * statusMultiplier;
        const finalPercentage = (jointProbability * 100).toFixed(4);
        const estimatedPool = Math.floor(basePopulation * jointProbability);

        document.getElementById('final_probability').textContent = `${finalPercentage}%`;
        document.getElementById('estimated_count').textContent = estimatedPool.toLocaleString('tr-TR');
        
        currentStep++; // Move to results step
        updateUI();

    } catch (error) {
        console.error("Data loading error:", error);
    }
});

// Initialize UI
updateUI();