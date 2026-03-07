<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Standart Hesaplayıcı</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background-color: #111; color: #fff; display: flex; justify-content: center; min-height: 100vh; }
        .app-container { width: 100%; max-width: 480px; background: #1a1a1a; min-height: 100vh; display: flex; flex-direction: column; position: relative; box-shadow: 0 0 30px rgba(0,0,0,0.5); }
        
        .app-header { padding: 20px; text-align: center; border-bottom: 1px solid #333; }
        .app-header h1 { font-size: 20px; font-weight: 800; color: #fff; }

        .step { flex: 1; padding: 40px 20px; display: none; animation: fadeIn 0.4s ease; }
        .step.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        h2 { font-size: 32px; font-weight: 800; margin-bottom: 10px; text-align: center; color: #fff; }
        .subtitle { font-size: 15px; color: #888; text-align: center; margin-bottom: 30px; }
        
        .choice-grid { display: flex; flex-direction: column; gap: 15px; }
        .choice-btn { padding: 20px; font-size: 18px; font-weight: 800; background: #333; color: #fff; border: 2px solid #444; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
        .choice-btn:hover { background: #444; border-color: #666; }
        
        .input-group { margin-bottom: 20px; text-align: center; }
        .input-row { display: flex; gap: 15px; justify-content: center; }
        .input-group label { display: block; font-size: 14px; font-weight: 600; color: #aaa; margin-bottom: 8px; }
        input[type="number"], input[type="range"] { width: 100%; max-width: 200px; padding: 15px; font-size: 24px; font-weight: 800; text-align: center; background: #222; color: #fff; border: 2px solid #444; border-radius: 10px; outline: none; }
        input[type="number"]:focus { border-color: #007aff; }
        
        .slider-container { text-align: center; }
        input[type="range"] { max-width: 100%; height: 8px; background: #444; border-radius: 4px; padding: 0; -webkit-appearance: none; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #007aff; cursor: pointer; }
        .value-display { font-size: 32px; font-weight: 800; color: #007aff; margin-bottom: 15px; }

        .emoji-display { font-size: 80px; text-align: center; margin-top: 20px; transition: all 0.3s ease; }

        /* Modal & Checks */
        .checkbox-container { display: flex; align-items: center; justify-content: space-between; padding: 20px; background: #222; border-radius: 10px; margin-bottom: 15px; font-weight: 800; font-size: 18px; border: 2px solid #333; cursor: pointer;}
        .checkbox-container input { width: 24px; height: 24px; accent-color: #007aff; }

        .police-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,0,0,0.95); display: flex; justify-content: center; align-items: center; z-index: 100; padding: 20px; flex-direction: column; }
        .police-content { background: #111; padding: 40px 20px; border-radius: 16px; text-align: center; border: 4px solid #fff; max-width: 400px; }
        .police-content h3 { color: #ff3333; font-size: 28px; margin-bottom: 15px; font-weight: 900; }
        .police-content p { font-size: 18px; color: #fff; margin-bottom: 30px; line-height: 1.5; font-weight: 600; }
        .police-btn-row { display: flex; flex-direction: column; gap: 15px; }
        .btn-joke { background: #fff; color: #111; padding: 15px; font-weight: 800; border-radius: 8px; border: none; cursor: pointer; font-size: 16px; }
        .btn-illegal { background: #333; color: #666; padding: 15px; font-weight: 800; border-radius: 8px; border: none; cursor: not-allowed; font-size: 16px; }

        .hidden { display: none !important; }
        .nav-controls { padding: 20px; text-align: center; border-top: 1px solid #333;}
        .next-btn { padding: 15px 40px; font-size: 18px; font-weight: 800; background: #007aff; color: #fff; border: none; border-radius: 8px; cursor: pointer; width: 100%; transition: 0.2s;}
        .next-btn:hover { background: #005bb5; }
    </style>
</head>
<body>
    <div class="app-container">
        <header class="app-header"><h1>Standart Hesaplayıcı</h1></header>

        <div id="step_1" class="step active">
            <h2>Ben bir,</h2>
            <div class="choice-grid">
                <button class="choice-btn" onclick="setUserGender('female')">Kadınım</button>
                <button class="choice-btn" onclick="setUserGender('male')">Erkeğim</button>
                <button class="choice-btn" onclick="alert('Üzgünüm bu verileri hesaplayamıyoruz.')">Transım</button>
            </div>
        </div>

        <div id="step_2" class="step">
            <h2>...arıyorum.</h2>
            <div class="choice-grid">
                <button class="choice-btn" onclick="setTargetGender('female')">Kadın</button>
                <button class="choice-btn" onclick="setTargetGender('male')">Erkek</button>
            </div>
        </div>

        <div id="step_3" class="step">
            <h2>Yaş Aralığı</h2>
            <div class="input-row">
                <div class="input-group">
                    <label>Min</label>
                    <input type="number" id="min_age" value="20">
                </div>
                <div class="input-group">
                    <label>Maks</label>
                    <input type="number" id="max_age" value="25">
                </div>
            </div>
            <div class="emoji-display" id="age_emoji">😐</div>
        </div>

        <div id="step_4" class="step">
            <h2>Boy Kriteri</h2>
            
            <div id="height_female_ui" class="hidden">
                <p class="subtitle">Minimum kaç cm olmalı?</p>
                <div class="slider-container">
                    <div class="value-display"><span id="h_min_f_display">165</span> cm</div>
                    <input type="range" id="h_min_f" min="140" max="200" value="165" oninput="updateHeightEmoji()">
                </div>
            </div>

            <div id="height_male_ui" class="hidden">
                <p class="subtitle">Hangi aralıkta olmalı?</p>
                <div class="input-row">
                    <div class="input-group">
                        <label>Min (cm)</label>
                        <input type="number" id="h_min_m" value="175">
                    </div>
                    <div class="input-group">
                        <label>Maks (cm)</label>
                        <input type="number" id="h_max_m" value="190">
                    </div>
                </div>
            </div>
            <div class="emoji-display" id="height_emoji">😐</div>
        </div>

        <div id="step_5" class="step">
            <h2>Aylık Gelir</h2>
            
            <div id="income_female_ui" class="hidden">
                <p class="subtitle">Minimum ne kadar kazanmalı?</p>
                <div class="slider-container">
                    <div class="value-display"><span id="inc_min_f_display">30.000</span> TL</div>
                    <input type="range" id="inc_min_f" min="17000" max="250000" step="1000" value="30000" oninput="updateIncomeEmoji()">
                </div>
            </div>

            <div id="income_male_ui" class="hidden">
                <p class="subtitle">Hangi aralıkta kazanmalı?</p>
                <div class="input-row">
                    <div class="input-group">
                        <label>Min (TL)</label>
                        <input type="number" id="inc_min_m" value="50000" step="5000">
                    </div>
                    <div class="input-group">
                        <label>Maks (TL)</label>
                        <input type="number" id="inc_max_m" value="150000" step="5000">
                    </div>
                </div>
            </div>
            <div class="emoji-display" id="income_emoji">😐</div>
        </div>

        <div id="step_6" class="step">
            <h2>Son Filtreler</h2>
            <label class="checkbox-container">
                Evliler de dahil olsun mu?
                <input type="checkbox" id="include_married" onchange="updateMarriedEmoji()">
            </label>
            <label class="checkbox-container" style="margin-top:20px;">
                Obezleri hariç tut
                <input type="checkbox" id="exclude_obese">
            </label>
            <div class="emoji-display" id="married_emoji">😐</div>
        </div>

        <div class="nav-controls hidden" id="nav_area">
            <button class="next-btn" onclick="goToNext()">Devam Et</button>
        </div>

        <div id="police_modal" class="police-modal hidden">
            <div class="police-content">
                <h3>🚔 DİKKAT!</h3>
                <p>18 yaşının altını da araştırabilirim ama önce emniyete haber vermem gerekiyor. Emin misin?</p>
                <div class="police-btn-row">
                    <button class="btn-joke" onclick="closePoliceModal()">Şaka şaka (Geri Dön)</button>
                    <button class="btn-illegal" disabled>Ara sıkıntı yok</button>
                </div>
            </div>
        </div>

    </div>

    <script>
        let currentStep = 1;
        let currentUserGender = null;
        let currentTargetGender = null;
        
        // Emojiler
        const ageEmoji = document.getElementById('age_emoji');
        const heightEmoji = document.getElementById('height_emoji');
        const incomeEmoji = document.getElementById('income_emoji');
        const marriedEmoji = document.getElementById('married_emoji');

        function showStep(step) {
            document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
            document.getElementById('step_' + step).classList.add('active');
            
            // Buton kontrolü
            if(step > 2 && step <= 6) document.getElementById('nav_area').classList.remove('hidden');
            else document.getElementById('nav_area').classList.add('hidden');
            
            // 6. adımda butonu "Hesapla" yap
            if(step === 6) document.querySelector('.next-btn').textContent = "Sonucu Gör";
            else document.querySelector('.next-btn').textContent = "Devam Et";
        }

        function setUserGender(gender) { currentUserGender = gender; currentStep = 2; showStep(2); }

        function setTargetGender(gender) {
            currentTargetGender = gender;
            
            // UI Dinamik Değişimi
            if(gender === 'female') {
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
            
            currentStep = 3; showStep(3);
        }

        function goToNext() {
            if(currentStep === 6) {
                alert("Hesaplama ekranı ve Stats modülü bir sonraki aşamada buraya bağlanacak!");
                return;
            }
            currentStep++; showStep(currentStep);
        }

        // --- YAŞ MANTIĞI ---
        const minAgeInput = document.getElementById('min_age');
        const maxAgeInput = document.getElementById('max_age');
        
        function handleAge() {
            let minVal = parseInt(minAgeInput.value);
            let maxVal = parseInt(maxAgeInput.value);
            if (minVal < 18 || maxVal < 18) {
                document.getElementById('police_modal').classList.remove('hidden');
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

        function closePoliceModal() {
            document.getElementById('police_modal').classList.add('hidden');
            minAgeInput.value = 18;
            if(parseInt(maxAgeInput.value) < 18) maxAgeInput.value = 20;
            handleAge();
        }

        // --- BOY MANTIĞI ---
        function updateHeightEmoji() {
            if(currentTargetGender === 'female') {
                let val = parseInt(document.getElementById('h_min_f').value);
                document.getElementById('h_min_f_display').textContent = val;
                if(val >= 190) heightEmoji.textContent = "🤤";
                else if(val >= 180) heightEmoji.textContent = "😏";
                else if(val >= 170) heightEmoji.textContent = "🙂";
                else heightEmoji.textContent = "😐";
            }
        }

        // --- GELİR MANTIĞI ---
        function updateIncomeEmoji() {
            if(currentTargetGender === 'female') {
                let val = parseInt(document.getElementById('inc_min_f').value);
                document.getElementById('inc_min_f_display').textContent = val.toLocaleString('tr-TR');
                if(val >= 100000) incomeEmoji.textContent = "🤤";
                else if(val >= 70000) incomeEmoji.textContent = "😏";
                else if(val >= 40000) incomeEmoji.textContent = "🙂";
                else incomeEmoji.textContent = "😐";
            }
        }

        // --- EVLİLİK MANTIĞI ---
        function updateMarriedEmoji() {
            if(document.getElementById('include_married').checked) {
                marriedEmoji.textContent = "😏";
            } else {
                marriedEmoji.textContent = "😐";
            }
        }
    </script>
</body>
</html>
