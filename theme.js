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
    // عداد الزوار الذكي وحركة تصاعد الأرقام
    // ==========================================
  // ==========================================
    // عداد الزوار الحقيقي والسحابي الموحد
    // ==========================================
    const visitorEl = document.getElementById('visitorCount');
    if (visitorEl) {
        // نطلب من السيرفر زيادة العداد بمقدار 1 وجلب المجموع الكلي الحقيقي
        // ملاحظة: يمكنك تغيير 'dalelak-just-2026' لأي اسم مفتاح خاص بموقعك
        fetch('https://api.counterapi.dev/v1/dalelak-just-2026/visits/up')
            .then(res => res.json())
            .then(data => {
                if (data && data.count) {
                    animateCounter(visitorEl, data.count);
                }
            })
            .catch(() => {
                // رقم احتياطي يظهر فقط في حال تعطل اتصال الإنترنت
                visitorEl.textContent = '1,500+';
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
});