// إضافة مادة جديدة للجدول
function addCourseRow() {
    const tbody = document.getElementById('coursesBody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td><input type="text" class="input-field" placeholder="اسم المادة"></td>
        <td>
            <select class="select-field hours-select">
                <option value="1">ساعة واحدة</option>
                <option value="2">ساعتان</option>
                <option value="3" selected>3 ساعات</option>
                <option value="4">4 ساعات</option>
                <option value="5">5 ساعات</option>
            </select>
        </td>
        <td>
            <select class="select-field grade-select">
                <option value="4.2">A+ (95-100 / 4.2)</option>
                <option value="4.0">A (85-94 / 4.0)</option>
                <option value="3.75">A- (80-84 / 3.75)</option>
                <option value="3.5">B+ (77-79 / 3.5)</option>
                <option value="3.25">B (73-76 / 3.25)</option>
                <option value="3.0">B- (70-72 / 3.0)</option>
                <option value="2.75">C+ (67-69 / 2.75)</option>
                <option value="2.5">C (63-66 / 2.5)</option>
                <option value="2.25">C- (60-62 / 2.25)</option>
                <option value="2.0">D+ (57-59 / 2.0)</option>
                <option value="1.75">D (53-56 / 1.75)</option>
                <option value="0.5">F (&lt; 49 / 0.5)</option>
            </select>
        </td>
        <td><button type="button" class="btn-remove" onclick="removeRow(this)">حذف</button></td>
    `;
    
    tbody.appendChild(newRow);
}

// حذف صف مادة
function removeRow(btn) {
    const tbody = document.getElementById('coursesBody');
    if (tbody.rows.length > 1) {
        btn.closest('tr').remove();
    } else {
        alert('يجب أن تحتوي الحاسبة على مادة واحدة على الأقل.');
    }
}

// الحصول على التقدير النصي بناءً على المعدل
function getRating(gpa) {
    if (gpa >= 4.00) return 'التقدير: إمتياز 🌟';
    if (gpa >= 3.50) return 'التقدير: ممتاز';
    if (gpa >= 3.00) return 'التقدير: جيد جداً';
    if (gpa >= 2.50) return 'التقدير: جيد';
    if (gpa >= 2.00) return 'التقدير: مقبول';
    return 'التقدير: إنذار (2 وما دون)';
}

// حساب المعدل والتفاصيل
function calculateGPA() {
    const hoursSelects = document.querySelectorAll('.hours-select');
    const gradeSelects = document.querySelectorAll('.grade-select');

    let termPoints = 0;
    let termHours = 0;

    for (let i = 0; i < hoursSelects.length; i++) {
        const hours = parseFloat(hoursSelects[i].value);
        const gradePoint = parseFloat(gradeSelects[i].value);

        termPoints += hours * gradePoint;
        termHours += hours;
    }

    if (termHours > 0) {
        // 1. حساب المعدل الفصلي
        const termGPA = (termPoints / termHours).toFixed(2);
        document.getElementById('termGPA').innerText = termGPA;
        document.getElementById('termRating').innerText = getRating(termGPA);
        document.getElementById('termHoursVal').innerText = termHours;

        // قراءة المدخلات الاختيارية
        const prevGPAInput = document.getElementById('prevGPA').value;
        const prevHoursInput = document.getElementById('prevHours').value;
        const totalMajorHoursInput = document.getElementById('totalMajorHours').value;

        const cumResultCard = document.getElementById('cumResultCard');
        const totalPassedCard = document.getElementById('totalPassedCard');
        const remainingHoursCard = document.getElementById('remainingHoursCard');

        let totalCumulativeHours = termHours;

        // 2. حساب المعدل التراكمي والساعات المقطوعة الإجمالية (إذا أدخل الطالب الساعات السابقة)
        if (prevHoursInput !== "" && parseFloat(prevHoursInput) >= 0) {
            const prevHours = parseFloat(prevHoursInput);
            totalCumulativeHours = prevHours + termHours;

            document.getElementById('totalPassedVal').innerText = totalCumulativeHours;
            totalPassedCard.style.display = 'flex';

            if (prevGPAInput !== "") {
                const prevGPA = parseFloat(prevGPAInput);
                const prevPoints = prevGPA * prevHours;
                const totalCumulativePoints = prevPoints + termPoints;

                const newCumulativeGPA = (totalCumulativePoints / totalCumulativeHours).toFixed(2);

                document.getElementById('cumGPA').innerText = newCumulativeGPA;
                document.getElementById('cumRating').innerText = getRating(newCumulativeGPA);
                cumResultCard.style.display = 'block';
            } else {
                cumResultCard.style.display = 'none';
            }
        } else {
            cumResultCard.style.display = 'none';
            totalPassedCard.style.display = 'none';
        }

        // 3. حساب الساعات المتبقية للتخرج (إذا أدخل الطالب ساعات التخصص)
        if (totalMajorHoursInput !== "" && parseFloat(totalMajorHoursInput) > 0) {
            const totalMajorHours = parseFloat(totalMajorHoursInput);
            const remainingHours = totalMajorHours - totalCumulativeHours;

            document.getElementById('remainingHoursVal').innerText = remainingHours > 0 ? remainingHours : 0;
            remainingHoursCard.style.display = 'flex';
        } else {
            remainingHoursCard.style.display = 'none';
        }

        document.getElementById('resultBox').style.display = 'block';
    }
}