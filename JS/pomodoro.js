document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. الإعدادات والحالة العامة
    // ==========================================
    const RING_CIRCUMFERENCE = 628; // نفس القيمة الابتدائية بملف الـ CSS (2 * π * 100)

    let settings = {
        work: 25,
        short: 5,
        long: 15,
        sessionsUntilLongBreak: 4
    };

    let currentMode = 'work';
    let totalSeconds = settings.work * 60;
    let secondsLeft = totalSeconds;
    let isRunning = false;
    let timerInterval = null;
    let completedSessions = 0;

    // ==========================================
    // 2. عناصر DOM
    // ==========================================
    const timeLeftEl = document.getElementById('timeLeft');
    const modeLabelEl = document.getElementById('modeLabel');
    const ringProgress = document.getElementById('ringProgress');
    const startPauseBtn = document.getElementById('startPauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const skipBtn = document.getElementById('skipBtn');
    const sessionCountEl = document.getElementById('sessionCount');
    const modeTabs = document.querySelectorAll('.mode-tab');

    const workInput = document.getElementById('workMinutes');
    const shortInput = document.getElementById('shortBreakMinutes');
    const longInput = document.getElementById('longBreakMinutes');
    const sessionsInput = document.getElementById('sessionsUntilLongBreak');
    const applySettingsBtn = document.getElementById('applySettingsBtn');

    const soundToggleBtn = document.getElementById('soundToggleBtn');

    // ==========================================
    // 3. دوال التحكم بالعرض
    // ==========================================
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function updateDisplay() {
        timeLeftEl.textContent = formatTime(secondsLeft);

        const progressRatio = secondsLeft / totalSeconds;
        const offset = RING_CIRCUMFERENCE * (1 - progressRatio);
        ringProgress.style.strokeDashoffset = offset;

        // تغيير لون الحلقة حسب الوضع
        if (currentMode === 'work') {
            ringProgress.style.stroke = 'rgb(226, 166, 76)';
        } else if (currentMode === 'short') {
            ringProgress.style.stroke = 'rgb(45, 133, 214)';
        } else {
            ringProgress.style.stroke = '#10b981';
        }
    }

    function updateModeLabel() {
        const labels = {
            work: 'جلسة مذاكرة',
            short: 'راحة قصيرة',
            long: 'راحة طويلة'
        };
        modeLabelEl.textContent = labels[currentMode];
    }

    function setActiveTab() {
        modeTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === currentMode);
        });
    }

    // ==========================================
    // 4. تبديل الوضع (مذاكرة / راحة قصيرة / راحة طويلة)
    // ==========================================
    function switchMode(mode) {
        pauseTimer();
        currentMode = mode;
        totalSeconds = settings[mode] * 60;
        secondsLeft = totalSeconds;
        updateModeLabel();
        setActiveTab();
        updateDisplay();
        startPauseBtn.textContent = 'ابدأ';
    }

    modeTabs.forEach(tab => {
        tab.addEventListener('click', () => switchMode(tab.dataset.mode));
    });

    // ==========================================
    // 5. منطق العد التنازلي
    // ==========================================
    function tick() {
        if (secondsLeft <= 0) {
            handleSessionComplete();
            return;
        }
        secondsLeft--;
        updateDisplay();
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        startPauseBtn.textContent = 'إيقاف مؤقت';
        timerInterval = setInterval(tick, 1000);
    }

    function pauseTimer() {
        isRunning = false;
        startPauseBtn.textContent = 'ابدأ';
        clearInterval(timerInterval);
    }

    function resetTimer() {
        pauseTimer();
        secondsLeft = totalSeconds;
        updateDisplay();
    }

    function handleSessionComplete() {
        pauseTimer();
        playBeep();

        if (currentMode === 'work') {
            completedSessions++;
            sessionCountEl.textContent = completedSessions;

            const nextMode = (completedSessions % settings.sessionsUntilLongBreak === 0) ? 'long' : 'short';
            switchMode(nextMode);
        } else {
            switchMode('work');
        }
    }

    startPauseBtn.addEventListener('click', () => {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    resetBtn.addEventListener('click', resetTimer);

    skipBtn.addEventListener('click', () => {
        if (currentMode === 'work') {
            handleSessionComplete();
        } else {
            switchMode('work');
        }
    });

    // ==========================================
    // 6. تطبيق الإعدادات المخصصة
    // ==========================================
    applySettingsBtn.addEventListener('click', () => {
        const work = parseInt(workInput.value) || 25;
        const short = parseInt(shortInput.value) || 5;
        const long = parseInt(longInput.value) || 15;
        const sessionsCount = parseInt(sessionsInput.value) || 4;

        settings = { work, short, long, sessionsUntilLongBreak: sessionsCount };

        // إعادة ضبط الوضع الحالي بالقيم الجديدة
        switchMode(currentMode);
    });

    // ==========================================
    // 7. صوت تنبيه بسيط عند انتهاء الجلسة (بدون ملفات خارجية)
    // ==========================================
    function playBeep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.15;

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.4);
        } catch (e) {
            console.warn('تنبيه الصوت غير مدعوم على هذا المتصفح.');
        }
    }

    // ==========================================
    // 8. صوت خلفية هادئ (White Noise) بدون ملفات خارجية
    // ==========================================
    let noiseCtx = null;
    let noiseNode = null;
    let gainNode = null;
    let isSoundPlaying = false;

    function createWhiteNoise(audioCtx) {
        const bufferSize = 2 * audioCtx.sampleRate;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoiseSource = audioCtx.createBufferSource();
        whiteNoiseSource.buffer = buffer;
        whiteNoiseSource.loop = true;
        return whiteNoiseSource;
    }

    soundToggleBtn.addEventListener('click', () => {
        if (!isSoundPlaying) {
            noiseCtx = new (window.AudioContext || window.webkitAudioContext)();
            noiseNode = createWhiteNoise(noiseCtx);
            gainNode = noiseCtx.createGain();
            gainNode.gain.value = 0.04; // صوت هادئ جداً

            noiseNode.connect(gainNode);
            gainNode.connect(noiseCtx.destination);
            noiseNode.start();

            isSoundPlaying = true;
            soundToggleBtn.textContent = '🔊 إيقاف الصوت';
            soundToggleBtn.classList.add('playing');
        } else {
            noiseNode.stop();
            noiseCtx.close();
            isSoundPlaying = false;
            soundToggleBtn.textContent = '🔈 تشغيل الصوت';
            soundToggleBtn.classList.remove('playing');
        }
    });

    // ==========================================
    // 9. الإقلاع الأولي
    // ==========================================
    updateDisplay();
    updateModeLabel();
});