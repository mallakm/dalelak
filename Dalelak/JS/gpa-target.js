function calculateTargetGPA() {
    const currentGPA = parseFloat(document.getElementById('current-gpa').value);
    const passedHours = parseFloat(document.getElementById('passed-hours').value);
    const targetGPA = parseFloat(document.getElementById('target-gpa').value);
    const remainingHours = parseFloat(document.getElementById('remaining-hours').value);
    const remainingSemesters = parseInt(document.getElementById('remaining-semesters').value) || 1;

    if (isNaN(currentGPA) || isNaN(passedHours) || isNaN(targetGPA) || isNaN(remainingHours)) {
        alert("يرجى ملء جميع الحقول بشكل صحيح.");
        return;
    }

    if (currentGPA > 4.2 || targetGPA > 4.2) {
        alert("أقصى معدل مسموح به حسب نظام الجامعة هو 4.20");
        return;
    }

    // حساب النقاط والمعدل المطلوب
    const currentPoints = currentGPA * passedHours;
    const totalHours = passedHours + remainingHours;
    const totalTargetPoints = targetGPA * totalHours;

    const requiredPoints = totalTargetPoints - currentPoints;
    const requiredGPA = requiredPoints / remainingHours;

    const resultBox = document.getElementById('target-result-box');
    resultBox.style.display = 'block';

    const scoreElem = document.getElementById('required-gpa-score');
    const ratingElem = document.getElementById('required-gpa-rating');
    const gaugeFill = document.getElementById('gauge-fill');
    const gaugeLabel = document.getElementById('gauge-label');
    const semesterText = document.getElementById('semester-gpa-text');
    const letterText = document.getElementById('letter-grade-text');
    const marginText = document.getElementById('margin-error-text');
    const adviceText = document.getElementById('target-advice-text');

    scoreElem.innerText = requiredGPA > 0 ? requiredGPA.toFixed(2) : "0.00";

    // إذا كان المعدل المطلوب أعلى من أقصى معدل ممكن بالجامعة (4.20)
    if (requiredGPA > 4.20) {
        ratingElem.innerText = "غير ممكن تعويض المعدل بهذا الحد من الساعات";
        ratingElem.style.color = "#ef4444";
        gaugeFill.style.width = "100%";
        gaugeFill.style.backgroundColor = "#ef4444";
        gaugeLabel.innerText = "مستحيل (يتجاوز الحد الأقصى 4.20)";
        gaugeLabel.style.color = "#ef4444";
        
        semesterText.innerText = "غير متاح";
        letterText.innerText = "A+ أعلى من المتاح";
        marginText.innerText = "0%";
        adviceText.innerText = "الهدف المطلوب يحتاج معدل أعلى من 4.20 في الساعات المتبقية. يُنصح بزيادة عدد الساعات المتبقية (رفع مواد إعادة) أو تعديل المعدل المستهدف لمستوى أسهل تحقيقه.";
    } 
    else if (requiredGPA <= 0) {
        ratingElem.innerText = "أنت بالفعل تتجاوز أو تحقق هذا المعدل!";
        ratingElem.style.color = "#10b981";
        gaugeFill.style.width = "100%";
        gaugeFill.style.backgroundColor = "#10b981";
        gaugeLabel.innerText = "مُحقق بالفعل 🎯";
        gaugeLabel.style.color = "#10b981";

        semesterText.innerText = `${currentGPA.toFixed(2)} / فصل`;
        letterText.innerText = "مستقر";
        marginText.innerText = "مفتوح";
        adviceText.innerText = "معدلك الحالي أعلى من أو يساوي المعدل المستهدف! واصل أدائك الحالي لتحافظ على تميزك الأكاديمي.";
    } 
    else {
        // حساب معدل الفصول والتقديرات الحرفية والتقدير النهائي حسب النظام الخاص
        const perSemester = requiredGPA;
        semesterText.innerText = `${perSemester.toFixed(2)} / كل فصل`;

        // تحديد الرموز المقترحة بحسب المعدل المطلوب
        let letter = "C / C+";
        if (requiredGPA >= 4.0) letter = "A / A+ (امتياز)";
        else if (requiredGPA >= 3.5) letter = "B+ / A- (ممتاز)";
        else if (requiredGPA >= 3.0) letter = "B- / B (جيد جداً)";
        else if (requiredGPA >= 2.5) letter = "C / C+ (جيد)";
        else if (requiredGPA >= 2.0) letter = "D+ / C- (مقبول)";
        else letter = "D / F";

        letterText.innerText = letter;

        // حساب نسبة شريط المؤشر من 4.20
        let percentage = (requiredGPA / 4.20) * 100;
        gaugeFill.style.width = `${percentage}%`;

        if (requiredGPA >= 3.80) {
            ratingElem.innerText = "تحدي ممتاز (يتطلب تقدير امتياز A/A+)";
            ratingElem.style.color = "#f59e0b";
            gaugeFill.style.backgroundColor = "#f59e0b";
            gaugeLabel.innerText = "صعب لكن ممكن (يتطلب التزام كامل)";
            gaugeLabel.style.color = "#f59e0b";
            marginText.innerText = "ضيق جداً (B أو أقل تؤثر على الهدف)";
            adviceText.innerText = `تحقيق هذا الهدف يتطلب منك الحصول على معدل فصلي يبلغ ${perSemester.toFixed(2)}، أي الحصول على تقدير A أو A+ في معظم المواد القادمة.`;
        } else if (requiredGPA >= 2.50) {
            ratingElem.innerText = "هدف واقعي ومتاح بنجاح";
            ratingElem.style.color = "#10b981";
            gaugeFill.style.backgroundColor = "#10b981";
            gaugeLabel.innerText = "واقعي ومستهدف جيد";
            gaugeLabel.style.color = "#10b981";
            marginText.innerText = "متوسط ومريح";
            adviceText.innerText = `هدف ممتاز وممكن تحقيقه! تحتاج لمعدل ${perSemester.toFixed(2)} في كل فصل قادم. المحافظة على درجات B و B+ سيوصلك للهيدف بكل سهولة.`;
        } else {
            ratingElem.innerText = "سهل الحصول عليه ومضمون";
            ratingElem.style.color = "#3b82f6";
            gaugeFill.style.backgroundColor = "#3b82f6";
            gaugeLabel.innerText = "سهل جداً";
            gaugeLabel.style.color = "#3b82f6";
            marginText.innerText = "مرن جداً";
            adviceText.innerText = `الهدف يتطلب درجات عادية. بتحقيق معدل فصلي ${perSemester.toFixed(2)} ستصل لهدفك بكل أريحية.`;
        }
    }

    resultBox.scrollIntoView({ behavior: 'smooth' });
}