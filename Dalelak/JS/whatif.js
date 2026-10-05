// ==========================================
// تبديل تفعيل حقل "العلامة القديمة" حسب نوع المادة
// ==========================================
function toggleOldGrade(selectEl) {
    const row = selectEl.closest('tr');
    const oldGradeSelect = row.querySelector('.old-grade-select');
    oldGradeSelect.disabled = (selectEl.value !== 'replace');
}

// ==========================================
// إضافة صف جديد لجدول السيناريو
// ==========================================
function addWhatifRow() {
    const tbody = document.getElementById('whatifBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td><input type="text" class="input-field" placeholder="اسم المادة (اختياري)"></td>
        <td>
            <select class="select-field type-select" onchange="toggleOldGrade(this)">
                <option value="new">مادة جديدة</option>
                <option value="replace">إعادة مادة (تستبدل علامة سابقة)</option>
            </select>
        </td>
        <td>
            <select class="select-field hours-select">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3" selected>3</option>
                <option value="4">4</option>
            </select>
        </td>
        <td>
            <select class="select-field grade-select">
                <option value="4.2">A+ (4.2)</option>
                <option value="4.0" selected>A (4.0)</option>
                <option value="3.75">A- (3.75)</option>
                <option value="3.5">B+ (3.5)</option>
                <option value="3.25">B (3.25)</option>
                <option value="3.0">B- (3.0)</option>
                <option value="2.75">C+ (2.75)</option>
                <option value="2.5">C (2.5)</option>
                <option value="2.25">C- (2.25)</option>
                <option value="2.0">D+ (2.0)</option>
                <option value="1.75">D (1.75)</option>
                <option value="0.5">F (0.5)</option>
            </select>
        </td>
        <td>
            <select class="select-field old-grade-select" disabled>
                <option value="4.2">A+ (4.2)</option>
                <option value="4.0">A (4.0)</option>
                <option value="3.75">A- (3.75)</option>
                <option value="3.5">B+ (3.5)</option>
                <option value="3.25">B (3.25)</option>
                <option value="3.0">B- (3.0)</option>
                <option value="2.75">C+ (2.75)</option>
                <option value="2.5">C (2.5)</option>
                <option value="2.25">C- (2.25)</option>
                <option value="2.0">D+ (2.0)</option>
                <option value="1.75" selected>D (1.75)</option>
                <option value="0.5">F (0.5)</option>
            </select>
        </td>
        <td><button type="button" class="btn-remove" onclick="removeWhatifRow(this)">حذف</button></td>
    `;

    tbody.appendChild(newRow);
}

function removeWhatifRow(button) {
    const row = button.closest('tr');
    const tbody = document.getElementById('whatifBody');
    if (tbody.rows.length > 1) {
        row.remove();
    } else {
        alert('لازم يضل سطر واحد على الأقل بالجدول.');
    }
}

// ==========================================
// حساب أثر السيناريو الافتراضي على المعدل التراكمي
// ==========================================
function calculateWhatIf() {
    const currentGPA = parseFloat(document.getElementById('currentGPA').value);
    const currentHours = parseFloat(document.getElementById('currentHours').value);

    if (isNaN(currentGPA) || isNaN(currentHours) || currentHours <= 0) {
        alert('يرجى إدخال المعدل التراكمي الحالي والساعات المقطوعة بشكل صحيح.');
        return;
    }

    let currentPoints = currentGPA * currentHours;
    let totalHours = currentHours;

    const rows = document.querySelectorAll('#whatifBody tr');

    rows.forEach(row => {
        const type = row.querySelector('.type-select').value;
        const hours = parseFloat(row.querySelector('.hours-select').value);
        const newGrade = parseFloat(row.querySelector('.grade-select').value);

        if (type === 'new') {
            // مادة جديدة: تُضاف ساعاتها ونقاطها بالكامل
            currentPoints += newGrade * hours;
            totalHours += hours;
        } else {
            // إعادة مادة: تُستبدل العلامة القديمة بالجديدة بدون إضافة ساعات جديدة
            const oldGrade = parseFloat(row.querySelector('.old-grade-select').value);
            currentPoints += (newGrade - oldGrade) * hours;
            // الساعات ما بتزيد لأنها نفس المادة المعادة
        }
    });

    const newGPA = currentPoints / totalHours;
    const clampedGPA = Math.min(Math.max(newGPA, 0), 4.2);

    const resultBox = document.getElementById('whatifResultBox');
    const beforeScore = document.getElementById('beforeScore');
    const afterScore = document.getElementById('afterScore');
    const impactText = document.getElementById('impactText');

    beforeScore.textContent = currentGPA.toFixed(2);
    afterScore.textContent = clampedGPA.toFixed(2);

    const diff = clampedGPA - currentGPA;

    if (diff > 0.001) {
        impactText.innerHTML = `📈 هذا السيناريو بيرفع معدلك بمقدار <strong style="color:#10b981">+${diff.toFixed(2)}</strong> نقطة تقريباً.`;
    } else if (diff < -0.001) {
        impactText.innerHTML = `📉 هذا السيناريو بينزّل معدلك بمقدار <strong style="color:#ef4444">${diff.toFixed(2)}</strong> نقطة تقريباً.`;
    } else {
        impactText.innerHTML = `➖ هذا السيناريو ما رح يأثر بشكل ملحوظ على معدلك التراكمي.`;
    }

    resultBox.classList.add('visible');
    resultBox.scrollIntoView({ behavior: 'smooth' });
}