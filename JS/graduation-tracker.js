document.addEventListener('DOMContentLoaded', () => {

    const RING_CIRCUMFERENCE = 553; // نفس قيمة r=88 بملف الـ CSS (2 * π * 88)

    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('resultsSection');

    const totalHoursInput = document.getElementById('totalHours');
    const completedHoursInput = document.getElementById('completedHours');
    const currentHoursInput = document.getElementById('currentHours');
    const hoursPerSemesterInput = document.getElementById('hoursPerSemester');
    const graduationDateInput = document.getElementById('graduationDate');
    const planYearsSelect = document.getElementById('planYears');

    const progressPercentEl = document.getElementById('progressPercent');
    const progressRing = document.getElementById('progressRing');
    const statCompleted = document.getElementById('statCompleted');
    const statRemaining = document.getElementById('statRemaining');
    const statSemesters = document.getElementById('statSemesters');

    const daysNum = document.getElementById('daysNum');
    const weeksNum = document.getElementById('weeksNum');
    const monthsNum = document.getElementById('monthsNum');
    const countdownNote = document.getElementById('countdownNote');

    const roadmapTrack = document.getElementById('roadmapTrack');

    calculateBtn.addEventListener('click', calculateAndRender);

    function calculateAndRender() {
        const totalHours = parseFloat(totalHoursInput.value);
        const completedHours = parseFloat(completedHoursInput.value) || 0;
        const currentHours = parseFloat(currentHoursInput.value) || 0;
        const hoursPerSemester = parseFloat(hoursPerSemesterInput.value) || 15;
        const graduationDate = graduationDateInput.value;

        if (!totalHours || totalHours <= 0) {
            alert('يرجى إدخال إجمالي ساعات الخطة بشكل صحيح.');
            return;
        }

        const effectiveCompleted = Math.min(completedHours + currentHours, totalHours);
        const remainingHours = Math.max(totalHours - effectiveCompleted, 0);
        const percent = Math.min(Math.round((effectiveCompleted / totalHours) * 100), 100);

        const remainingSemesters = remainingHours > 0 ? Math.ceil(remainingHours / hoursPerSemester) : 0;

        const planYears = resolvePlanYears(totalHours);

        renderProgress(percent, effectiveCompleted, remainingHours, remainingSemesters);
        renderCountdown(graduationDate);
        renderRoadmap(totalHours, effectiveCompleted, planYears);

        resultsSection.classList.add('visible');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // ==========================================
    // 0. تحديد عدد سنوات الخطة (يدوي أو تلقائي حسب الساعات)
    // ==========================================
    function estimatePlanYears(totalHours) {
        // عتبات تقريبية شائعة بالجامعات: 132 ساعة ≈ 4 سنوات، 160 ≈ 5 سنوات، 210 ≈ 6 سنوات
        if (totalHours <= 140) return 4;
        if (totalHours <= 175) return 5;
        if (totalHours <= 220) return 6;
        return 7;
    }

    function resolvePlanYears(totalHours) {
        const selected = planYearsSelect.value;
        if (selected === 'auto') {
            return estimatePlanYears(totalHours);
        }
        return parseInt(selected);
    }

    // ==========================================
    // 1. دائرة نسبة التقدّم
    // ==========================================
    function renderProgress(percent, completed, remaining, remainingSemesters) {
        progressPercentEl.textContent = `${percent}%`;
        const offset = RING_CIRCUMFERENCE * (1 - percent / 100);
        progressRing.style.strokeDashoffset = offset;

        if (percent >= 90) {
            progressRing.style.stroke = '#10b981';
        } else if (percent >= 50) {
            progressRing.style.stroke = 'rgb(226, 166, 76)';
        } else {
            progressRing.style.stroke = 'rgb(45, 133, 214)';
        }

        statCompleted.textContent = completed;
        statRemaining.textContent = remaining;
        statSemesters.textContent = remainingSemesters;
    }

    // ==========================================
    // 2. العدّاد التنازلي لتاريخ التخرج
    // ==========================================
    function renderCountdown(graduationDateStr) {
        if (!graduationDateStr) {
            daysNum.textContent = '--';
            weeksNum.textContent = '--';
            monthsNum.textContent = '--';
            countdownNote.textContent = 'حدد تاريخ التخرج المتوقع لعرض العدّاد.';
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(graduationDateStr);
        const diffMs = targetDate - today;

        if (diffMs <= 0) {
            daysNum.textContent = '0';
            weeksNum.textContent = '0';
            monthsNum.textContent = '0';
            countdownNote.textContent = '🎉 مبروك! تاريخ التخرج المحدد وصل أو مضى بالفعل.';
            return;
        }

        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        const diffWeeks = Math.floor(diffDays / 7);
        const diffMonths = Math.floor(diffDays / 30);

        daysNum.textContent = diffDays;
        weeksNum.textContent = diffWeeks;
        monthsNum.textContent = diffMonths;
        countdownNote.textContent = 'بالتوفيق! حافظ على الاستمرارية حتى تصل لهدفك 🎯';
    }

    // ==========================================
    // 3. مسار السنوات الدراسية (عدد السنين متغيّر حسب الخطة)
    // ==========================================
    const arabicOrdinals = [
        'الأولى', 'الثانية', 'الثالثة', 'الرابعة',
        'الخامسة', 'السادسة', 'السابعة', 'الثامنة'
    ];

    function renderRoadmap(totalHours, completedHours, planYears) {
        roadmapTrack.innerHTML = '';
        const hoursPerYear = totalHours / planYears;

        for (let index = 0; index < planYears; index++) {
            const yearStartHours = hoursPerYear * index;
            const yearEndHours = hoursPerYear * (index + 1);
            const yearName = `السنة ${arabicOrdinals[index] || index + 1}`;

            let status = 'upcoming';
            let statusText = 'لم تبدأ بعد';

            if (completedHours >= yearEndHours) {
                status = 'completed';
                statusText = '✅ مكتملة';
            } else if (completedHours > yearStartHours) {
                status = 'current';
                statusText = '📍 السنة الحالية';
            }

            const yearDiv = document.createElement('div');
            yearDiv.className = `roadmap-year ${status}`;
            yearDiv.innerHTML = `
                <div class="roadmap-year-title">${yearName}</div>
                <div class="roadmap-year-status">${statusText}</div>
            `;
            roadmapTrack.appendChild(yearDiv);
        }
    }

    // تشغيل تلقائي بالقيم الافتراضية عند فتح الصفحة لأول مرة
    calculateAndRender();
});
