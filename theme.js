document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    // 1. استرجاع الثيم المحفوظ في ذاكرة المتصفح
    const savedTheme = localStorage.getItem('site-theme');

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) themeIcon.textContent = '🌙';
    } else {
        if (themeIcon) themeIcon.textContent = '☀️';
    }

    // 2. تفعيل التبديل عند النقر على الزر
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');

            if (document.body.classList.contains('light-theme')) {
                if (themeIcon) themeIcon.textContent = '🌙';
                localStorage.setItem('site-theme', 'light');
            } else {
                if (themeIcon) themeIcon.textContent = '☀️';
                localStorage.setItem('site-theme', 'dark');
            }
        });
    }

    // 3. تحديث سنة الحقوق في الفوتر تلقائياً لجميع الصفحات
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ==========================================
    // عداد الزوار الحقيقي والسحابي الموحد
    // ==========================================
    // هذا هو السطر الذي كان مفقوداً في الكود الخاص بك:
    const visitorEl = document.getElementById('visitorCount');

    // نضع الـ fetch داخل شرط للتأكد من وجود العنصر في الصفحة الحالية
    if (visitorEl) {
        fetch('https://abacus.jasoncameron.dev/hit/dalelak-just-2026/visits')
        .then(res => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(data => {
            const n = Number(data.value);
            if (Number.isFinite(n)) {
                animateCounter(visitorEl, n);
            } else {
                throw new Error('no value in response');
            }
        })
        .catch(err => {
            console.error('Counter error:', err);
            visitorEl.textContent = '1,500+'; // إظهار رقم تقريبي لو تعطل الإنترنت بدلاً من الصفر
        });
    }

    // حركة تصاعدية سلسة للرقم عند فتح الصفحة
    function animateCounter(element, target) {
        let start = Math.max(target - 40, 0);
        const duration = 1000;
        const stepTime = Math.max(Math.floor(duration / (target - start || 1)), 20);

        const timer = setInterval(() => {
            start += 1;
            element.textContent = start.toLocaleString('en-US');
            if (start >= target) {
                element.textContent = target.toLocaleString('en-US');
                clearInterval(timer);
            }
        }, stepTime);
    }

    // ==========================================
    // إشعار حقوق ملك محمد (يظهر عند كل تحديث للرئيسية)
    // ==========================================
    const creditToast = document.getElementById('creditToast');
    
    // سيعمل الكود فقط إذا كان العنصر موجوداً (أي في الصفحة الرئيسية)
    if (creditToast) {
        
        // إظهار الإشعار بعد ثانيتين من فتح الصفحة
        setTimeout(() => {
            creditToast.classList.add('show');
        }, 2000);

        // إخفاء الإشعار بعد 6 ثوانٍ
        setTimeout(() => {
            creditToast.classList.remove('show');
        }, 8000);
    }
});