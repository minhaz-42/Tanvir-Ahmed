// Function to download resume as PDF
function downloadResume() {
    const resumeWindow = window.open('resume.html', '_blank');
    setTimeout(() => {
        resumeWindow.print();
    }, 1000);
}

// Export for use in HTML
window.downloadResume = downloadResume;
