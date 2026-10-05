// دالة البحث المباشر
function filterCourses() {
    const searchInput = document.getElementById('courseSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.course-card');

    cards.forEach(card => {
        const title = card.querySelector('.course-title').innerText.toLowerCase();
        const code = card.querySelector('.course-code').innerText.toLowerCase();
        const desc = card.querySelector('.course-desc').innerText.toLowerCase();

        if (title.includes(searchInput) || code.includes(searchInput) || desc.includes(searchInput)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// دالة الفلترة حسب السنة
function filterCategory(category, btnElement) {
    // تحديث الزر النشط
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');

    const cards = document.querySelectorAll('.course-card');

    cards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}