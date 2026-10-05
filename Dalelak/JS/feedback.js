document.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.feedback-tab');
    const feedbackTypeInput = document.getElementById('feedbackType');
    const messageLabel = document.getElementById('messageLabel');
    const messageBody = document.getElementById('messageBody');
    const pageFieldGroup = document.getElementById('pageFieldGroup');
    const form = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('successMessage');

    // ==========================================
    // 1. تبديل بين "إبلاغ عن مشكلة" و "اقتراح ميزة"
    // ==========================================
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const type = tab.dataset.type;

            if (type === 'bug') {
                feedbackTypeInput.value = 'إبلاغ عن مشكلة';
                messageLabel.textContent = 'صف المشكلة بالتفصيل';
                messageBody.placeholder = 'مثال: زر "احسب المعدل" ما بيشتغل عند الضغط عليه من الموبايل...';
                pageFieldGroup.style.display = 'flex';
            } else {
                feedbackTypeInput.value = 'اقتراح ميزة';
                messageLabel.textContent = 'اشرح فكرتك بالتفصيل';
                messageBody.placeholder = 'مثال: ممكن تضيفوا خاصية تذكير بمواعيد تسليم الواجبات...';
                pageFieldGroup.style.display = 'none';
            }
        });
    });

    // ==========================================
    // 2. إرسال النموذج عبر AJAX (بدون إعادة تحميل الصفحة)
    // ==========================================
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'جارٍ الإرسال...';
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                form.style.display = 'none';
                successMessage.classList.add('visible');
                successMessage.scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error('فشل الإرسال');
            }
        } catch (error) {
            alert('⚠️ ما قدرنا نرسل رسالتك. تأكد إنك ضفت معرف Formspree الصحيح بملف الـ HTML (مكان YOUR_FORM_ID)، أو جرب لاحقاً.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

});