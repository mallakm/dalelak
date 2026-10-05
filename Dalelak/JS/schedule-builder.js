// أوقات الجدول الثابتة لرسم الشبكة (كل نصف ساعة)
const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu"];
let mySchedule = [];

document.addEventListener('DOMContentLoaded', () => {
    buildTimetableGrid();
});

// 1. بناء شبكة الجدول
function buildTimetableGrid() {
    const tbody = document.getElementById('timetableBody');
    tbody.innerHTML = '';

    timeSlots.forEach(slot => {
        const tr = document.createElement('tr');
        const formattedSlot = slot.replace(':', '');
        tr.innerHTML = `<td>${slot}</td>` +
            days.map(day => `<td id="cell-${day}-${formattedSlot}"></td>`).join('');
        tbody.appendChild(tr);
    });
}

// 2. إضافة المادة (الإدخال اليدوي)
function addCustomCourse() {
    const courseName = document.getElementById('courseName').value.trim();
    const startTimeInput = document.getElementById('startTime').value;
    const endTimeInput = document.getElementById('endTime').value;
    const color = document.getElementById('courseColor').value;

    // جلب الأيام المختارة
    const selectedDays = [];
    document.querySelectorAll('.day-cb:checked').forEach(cb => selectedDays.push(cb.value));

    // التحقق من المدخلات
    if (!courseName) { alert("⚠️ يرجى كتابة اسم المادة!"); return; }
    if (selectedDays.length === 0) { alert("⚠️ يرجى اختيار يوم واحد على الأقل!"); return; }
    if (!startTimeInput || !endTimeInput) { alert("⚠️ يرجى تحديد وقت البداية والنهاية!"); return; }

    if (startTimeInput >= endTimeInput) {
        alert("⚠️ وقت النهاية يجب أن يكون بعد وقت البداية!");
        return;
    }

    // دالة رياضية لتحويل الوقت لمكان الخلية الدقيق في الجدول
    function getSlotIndex(timeStr, isEnd) {
        let parts = timeStr.split(':');
        let hh = parseInt(parts[0]);
        let mm = parseInt(parts[1]);
        let totalMinutes = (hh * 60) + mm;
        
        // أوقات الجدول من 8 صباحاً (480 دقيقة) إلى 5 مساءً (1020 دقيقة)
        if (totalMinutes < 480 || totalMinutes > 1020) return -1;
        
        let index = (totalMinutes - 480) / 30;
        // نقرب وقت البداية للأسفل والنهاية للأعلى لتغطي المادة مساحتها كاملة
        return isEnd ? Math.ceil(index) : Math.floor(index);
    }

    let startIdx = getSlotIndex(startTimeInput, false);
    let endIdx = getSlotIndex(endTimeInput, true);

    if (startIdx === -1 || endIdx === -1) {
        alert("⚠ تأكد من وقت المادة! (يجب أن يكون بين 8:00 صباحاً و 5:00 مساءً).");
        return;
    }

    // 3. فحص التعارض الزمني
    let hasConflict = false;
    selectedDays.forEach(day => {
        for (let i = startIdx; i < endIdx; i++) {
            const cellId = `cell-${day}-${timeSlots[i].replace(':', '')}`;
            const cell = document.getElementById(cellId);
            if (cell && (cell.style.display === 'none' || cell.innerHTML.trim() !== '')) {
                hasConflict = true;
            }
        }
    });

    if (hasConflict) {
        alert("⚠️ يوجد تعارض في الوقت مع نشاط آخر في جدولك!");
        return;
    }

    // 4. الدمج ورسم المادة في الجدول
    const rowSpanCount = endIdx - startIdx;

    selectedDays.forEach(day => {
        const startCellId = `cell-${day}-${timeSlots[startIdx].replace(':', '')}`;
        const startCell = document.getElementById(startCellId);

        if (startCell) {
          startCell.rowSpan = rowSpanCount;
            // إضافة dir="ltr" لعكس الأرقام بشكل صحيح، وتصفير الفراغات
            startCell.style.padding = '0'; 
            startCell.innerHTML = `
                <div class="course-card" style="background-color: ${color}">
                    <div class="title">${courseName}</div>
                    <div class="details" dir="ltr">${startTimeInput} - ${endTimeInput}</div>
                </div>
            `;

            // إخفاء الخلايا تحتها
            for (let i = startIdx + 1; i < endIdx; i++) {
                const hideCellId = `cell-${day}-${timeSlots[i].replace(':', '')}`;
                const hideCell = document.getElementById(hideCellId);
                if (hideCell) hideCell.style.display = 'none';
            }
        }
    });

    // 5. الحفظ في القائمة وتحديث الواجهة
    mySchedule.push({ 
        name: courseName, 
        days: selectedDays, 
        start: startTimeInput, 
        end: endTimeInput, 
        color: color,
        startIdx: startIdx,
        endIdx: endIdx
    });
    
    updateScheduleList();
    
    // تصفير الحقول بعد الإضافة
    document.getElementById('courseName').value = '';
    document.querySelectorAll('.day-cb').forEach(cb => cb.checked = false);
}

// تحديث قائمة المواد المضافة جانبياً
function updateScheduleList() {
    const list = document.getElementById('coursesList');
    document.getElementById('coursesCount').innerText = mySchedule.length;
    list.innerHTML = '';

    mySchedule.forEach((item, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span><strong style="color:${item.color}">■</strong> ${item.name}</span>
            <button onclick="removeFromSchedule(${idx})" style="background:none; border:none; color:#ef4444; cursor:pointer;">❌</button>
        `;
        list.appendChild(li);
    });
}

// حذف مادة وإعادة تحديث الجدول
function removeFromSchedule(idx) {
    mySchedule.splice(idx, 1);
    redrawSchedule();
}

// إعادة رسم الجدول من جديد
function redrawSchedule() {
    buildTimetableGrid();
    const tempSchedule = [...mySchedule];
    mySchedule = [];

    tempSchedule.forEach(item => {
        document.getElementById('courseName').value = item.name;
        document.getElementById('startTime').value = item.start;
        document.getElementById('endTime').value = item.end;
        document.getElementById('courseColor').value = item.color;
        
        document.querySelectorAll('.day-cb').forEach(cb => {
            cb.checked = item.days.includes(cb.value);
        });

        addCustomCourse();
    });
}