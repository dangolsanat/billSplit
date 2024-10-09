//dark/light mode 

const themeToggleButton = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme on page load
window.onload = function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateToggleButtonText(savedTheme);
    }
};

// Toggle theme and save to localStorage
themeToggleButton.addEventListener('click', function() {
    if (body.classList.contains('light-theme')) {
        body.classList.remove('light-theme');
        localStorage.setItem('theme', ''); // Save dark mode (no theme class means dark)
        themeToggleButton.textContent = 'i';
    } else {
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light-theme'); // Save light mode
        themeToggleButton.textContent = 'o';
    }
});

// Update button text based on the current theme
function updateToggleButtonText(theme) {
    if (theme === 'light-theme') {
        themeToggleButton.textContent = 'o';
    } else {
        themeToggleButton.textContent = 'i';
    }
}
