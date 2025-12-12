// Enhanced Resume Download Functionality
class ResumeDownloader {
    constructor() {
        this.resumeUrl = 'resume.html';
        this.pdfFileName = 'Tanvir-Ahmed-Resume.pdf';
    }

    // Method to download resume as PDF
    async downloadResume() {
        try {
            // Show loading state
            this.showLoading();
            
            // Open resume in new tab
            const resumeWindow = window.open(this.resumeUrl, '_blank');
            
            // Wait for window to load
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Trigger print dialog
            resumeWindow.print();
            
            // Close loading state
            this.hideLoading();
            
        } catch (error) {
            console.error('Error downloading resume:', error);
            this.hideLoading();
            this.showError('Failed to download resume. Please try again.');
        }
    }

    // Method to show loading state
    showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'resume-loading';
        loadingDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            ">
                <div style="
                    background: white;
                    padding: 2rem;
                    border-radius: 10px;
                    text-align: center;
                ">
                    <div class="spinner" style="
                        width: 40px;
                        height: 40px;
                        border: 3px solid #f3f3f3;
                        border-top: 3px solid #3b82f6;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 1rem;
                    "></div>
                    <p>Preparing resume for download...</p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loadingDiv);
    }

    // Method to hide loading state
    hideLoading() {
        const loadingDiv = document.getElementById('resume-loading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    // Method to show error message
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                animation: slideIn 0.3s ease;
            ">
                ${message}
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(errorDiv);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Method to show success message
    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                z-index: 9999;
                animation: slideIn 0.3s ease;
            ">
                ${message}
            </div>
            <style>
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        document.body.appendChild(successDiv);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }
}

// Create global instance
const resumeDownloader = new ResumeDownloader();

// Export for global use
window.downloadResume = () => resumeDownloader.downloadResume();

// Auto-initialize if script is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Find all resume download buttons and attach click handler
        document.querySelectorAll('[data-download-resume]').forEach(button => {
            button.addEventListener('click', () => resumeDownloader.downloadResume());
        });
    });
}