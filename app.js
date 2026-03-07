// 1. State Variables & Data Fetch
let currentStep = 1;
let currentUserGender = null;
let currentTargetGender = null;
let appData = null;

async function initData() {
    try {
        const response = await fetch('data.json');
        appData = await response.json();
    } catch (error) {
        console.error("Error loading demographic data:", error);
    }
}
initData();

// 2. DOM Elements (Emojis & Inputs)
const ageEmoji = document.getElementById('age_emoji');
const heightEmoji = document.getElementById('height_emoji');
const incomeEmoji = document.getElementById('income_emoji');
const marriedEmoji = document.getElementById('married_emoji');

const minAgeInput = document.getElementById('min_age');
const maxAgeInput = document.getElementById('max_age');
const policeModal = document.getElementById('police_modal');

// 3. Math Functions (CDF & Normal Distribution)
function erf(x) {
    const sign = (x >= 0) ? 1 : -1;
    x = Math.abs(x);
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
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

// 4. Navigation & UI Logic
function showStep(step) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById('step_' + step).classList.add('active');
    
    const navArea = document.getElementById('nav_area');
    const nextBtn = document.querySelector('.next-btn');

    if (step > 2 && step <= 6) {
        navArea.classList.remove('hidden');
    } else {
        navArea.classList.add('hidden');
    }
    
    if (step === 6) {
        nextBtn.textContent = "Hesapla (Sonucu Gör)";
    } else {
        nextBtn.textContent = "Devam Et";
    }
}

// Global functions for HTML onClick events
window.setUserGender = function(gender) { 
    currentUserGender = gender; 
    currentStep = 2; 
    showStep(2); 
}

window.setTargetGender = function(gender) {
    currentTargetGender = gender;
    
    // Toggle relevant inputs based on target gender
    if (gender === 'female') {
        document.getElementById('height_female_ui').classList.remove('hidden');
        document.getElementById('height_male_ui').classList.add('hidden');
        document.getElementById('income_female_ui').classList.remove('hidden');
        document.getElementById('income_male_ui').classList.add('hidden');
    } else {
        document.getElementById('height_female_ui').classList.add('hidden');
        document.getElementById('height_male_ui').classList.remove('hidden');
        document.getElementById('income_female_ui').classList.add('hidden');
        document.getElementById('income_male_ui').classList.remove('hidden');
    }
    currentStep = 3; 
    showStep(3);
}

window.goToNext = function() {
    if (currentStep === 6) {
        calculateFinalProbability();
        return;
    }
    currentStep++; 
    showStep(currentStep);
}

// 5. Dynamic Emoji Reactions
function handleAge() {
    let minVal = parseInt(minAgeInput.value);
    let maxVal = parseInt(maxAgeInput.value);
    
    if (minVal < 18 || maxVal < 18) {
        policeModal.classList.remove('hidden');
        ageEmoji.textContent = "🤨";
        return;
    }
    
    if (currentTargetGender === 'female') {
        if (maxVal >= 40) ageEmoji.textContent = "🤤";
        else if (maxVal >= 30) ageEmoji.textContent = "😏";
        else if (maxVal >= 25) ageEmoji.textContent = "🙂";
        else ageEmoji.textContent = "😒";
    } else {
        if (minVal <= 22) ageEmoji.textContent = "🤤";
        else if (minVal <= 26) ageEmoji.textContent = "😏";
        else if (minVal <= 32) ageEmoji.textContent = "🙂";
        else ageEmoji.textContent = "😒";
    }
}
minAgeInput.addEventListener('input', handleAge);
maxAgeInput.addEventListener('input', handleAge);

window.closePoliceModal = function() {
    policeModal.classList.add('hidden');
    minAgeInput.value = 18;
    if (parseInt(maxAgeInput.value) < 18) maxAgeInput.value = 20;
    handleAge();
}

window.updateHeightEmoji = function() {
    if (currentTargetGender === 'female') {
        let val = parseInt(document.getElementById('h_min_f').value);
        document.getElementById('h_min_f_display').textContent = val;
        if (val >= 190) heightEmoji.textContent = "🤤";
        else if (val >= 180) heightEmoji.textContent = "😏";
        else if (val >= 170) heightEmoji.textContent = "🙂";
        else heightEmoji.textContent = "😐";
    }
}

window.updateIncomeEmoji = function() {
    if (currentTargetGender === 'female') {
        let val = parseInt(document.getElementById('inc_min_f').value);
        document.getElementById('inc_min_f_display').textContent = val.toLocaleString('tr-TR');
        if (val >= 100000) incomeEmoji.textContent = "🤤";
        else if (val >= 70000) incomeEmoji.textContent = "😏";
        else if (val >= 40000) incomeEmoji.textContent = "🙂";
        else incomeEmoji.textContent = "😐";
    }
}

window.updateMarriedEmoji = function() {
    if (document.getElementById('include_married').checked) {
        marriedEmoji.textContent = "😏";
    } else {
        marriedEmoji.textContent = "😐";
    }
}

// 6. Core Algorithm & Calculation Engine
function calculateFinalProbability() {
    if (!appData) {
        alert("Data is still loading, please wait a second.");
        return;
    }

    let basePopulation = currentTargetGender === 'male' ? appData.turkey_male_population : appData.turkey_female_population;
    
    // Placeholder age logic (this should ideally be a CDF based on demographic age brackets too)
    let ageProbability = 0.20; 
    let heightProbability = 1.0;
    let incomeProbability = 1.0;
    let statusMultiplier = 1.0;

    let targetIncome = 0;

    // A. Calculate Core Probabilities (Height & Income)
    if (currentTargetGender === 'male') {
        const minHeightM = parseInt(document.getElementById('h_min_m').value);
        const maxHeightM = parseInt(document.getElementById('h_max_m').value);
        const minIncM = parseInt(document.getElementById('inc_min_m').value);
        const maxIncM = parseInt(document.getElementById('inc_max_m').value);
        targetIncome = maxIncM;

        let pHeightMax = normalCDF(maxHeightM, appData.height_distribution.male_mean, appData.height_distribution.male_std_dev);
        let pHeightMin = normalCDF(minHeightM, appData.height_distribution.male_mean, appData.height_distribution.male_std_dev);
        heightProbability = Math.max(0, pHeightMax - pHeightMin);

        let pIncMax = incomeCDF(maxIncM, appData.income_distribution.median);
        let pIncMin = incomeCDF(minIncM, appData.income_distribution.median);
        incomeProbability = Math.max(0, pIncMax - pIncMin);

    } else {
        const minHeightF = parseInt(document.getElementById('h_min_f').value);
        const minIncF = parseInt(document.getElementById('inc_min_f').value);
        targetIncome = minIncF;

        heightProbability = 1 - normalCDF(minHeightF, appData.height_distribution.female_mean, appData.height_distribution.female_std_dev);
        incomeProbability = 1 - incomeCDF(minIncF, appData.income_distribution.median);
    }

    // B. Base Status Exclusions
    if (document.getElementById('exclude_obese').checked) statusMultiplier *= 0.70;
    if (!document.getElementById('include_married').checked) statusMultiplier *= 0.40;

    // C. Demographic Filters with Correlation Weighting
    let syrianMultiplier = 1.0;
    let kurdishMultiplier = 1.0;
    let blackMultiplier = 1.0;

    // Weighting factor: If income requirement > 80k, impact of immigrant filters drops to 0
    let immigrantImpactWeight = targetIncome > 80000 ? 0.0 : 1.0;

    if (document.getElementById('exclude_syrian').checked) {
        syrianMultiplier = 1 - (appData.demographics.syrian_ratio * immigrantImpactWeight);
    }
    if (document.getElementById('exclude_kurdish').checked) {
        kurdishMultiplier = 1 - appData.demographics.kurdish_ratio; // Endemic population, constant correlation
    }
    if (document.getElementById('exclude_black').checked) {
        blackMultiplier = 1 - (appData.demographics.black_ratio * immigrantImpactWeight);
    }

    // D. Final Joint Probability
    const jointProbability = ageProbability * heightProbability * incomeProbability * statusMultiplier * syrianMultiplier * kurdishMultiplier * blackMultiplier;
    
    const finalPercentage = (jointProbability * 100).toFixed(4);
    const estimatedPool = Math.floor(basePopulation * jointProbability);

    // This alert is a placeholder until the HTML results page is finalized.
    alert(`Hesaplanan Sonuçlar:\nTahmini Havuz: ${estimatedPool.toLocaleString('tr-TR')} Kişi\nTopluma Oranı: %${finalPercentage}`);
}