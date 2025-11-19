// Main JavaScript for GPU Architecture Learning Platform

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Module card interactions
const moduleCards = document.querySelectorAll('.module-card');
moduleCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.borderLeft = '5px solid var(--primary-color)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.borderLeft = 'none';
    });
});

// Progress tracking
class ProgressTracker {
    constructor() {
        this.progress = this.loadProgress();
    }

    loadProgress() {
        const saved = localStorage.getItem('gpu-course-progress');
        return saved ? JSON.parse(saved) : {
            modules: {},
            exercises: {},
            quizzes: {}
        };
    }

    saveProgress() {
        localStorage.setItem('gpu-course-progress', JSON.stringify(this.progress));
    }

    markModuleComplete(moduleId) {
        this.progress.modules[moduleId] = {
            completed: true,
            completedAt: new Date().toISOString()
        };
        this.saveProgress();
        this.updateUI();
    }

    markExerciseComplete(exerciseId) {
        this.progress.exercises[exerciseId] = {
            completed: true,
            completedAt: new Date().toISOString()
        };
        this.saveProgress();
    }

    updateUI() {
        // Update progress indicators in the UI
        Object.keys(this.progress.modules).forEach(moduleId => {
            const moduleCard = document.querySelector(`[data-module="${moduleId}"]`);
            if (moduleCard && this.progress.modules[moduleId].completed) {
                const badge = document.createElement('span');
                badge.className = 'badge badge-success';
                badge.innerHTML = '<i class="fas fa-check"></i> Completed';
                if (!moduleCard.querySelector('.badge-success')) {
                    moduleCard.querySelector('.module-features').appendChild(badge);
                }
            }
        });
    }

    getCompletionPercentage() {
        const totalModules = 8;
        const completedModules = Object.keys(this.progress.modules).length;
        return (completedModules / totalModules) * 100;
    }
}

const progressTracker = new ProgressTracker();
progressTracker.updateUI();

// Search functionality (for future implementation)
class CourseSearch {
    constructor() {
        this.searchIndex = [];
        this.buildIndex();
    }

    buildIndex() {
        // Build search index from course content
        // This would be populated with all course materials
        this.searchIndex = [
            { type: 'module', id: 1, title: 'Introduction to GPU Computing', keywords: ['gpu', 'parallel', 'cuda'] },
            { type: 'module', id: 2, title: 'GPU Hardware Architecture', keywords: ['sm', 'cores', 'hardware'] },
            // ... more content
        ];
    }

    search(query) {
        query = query.toLowerCase();
        return this.searchIndex.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.keywords.some(keyword => keyword.includes(query))
        );
    }
}

// Code syntax highlighting setup
function highlightCode() {
    document.querySelectorAll('pre code').forEach((block) => {
        // Syntax highlighting would be applied here
        // Using a library like Prism.js or Highlight.js
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    highlightCode();

    // Add intersection observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    document.querySelectorAll('.feature-card, .module-card, .viz-card').forEach(el => {
        observer.observe(el);
    });
});

// Utility functions
const utils = {
    // Format time duration
    formatDuration(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    },

    // Calculate reading time
    calculateReadingTime(text) {
        const wordsPerMinute = 200;
        const words = text.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    },

    // Copy code to clipboard
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('Code copied to clipboard');
        });
    }
};

// Export for use in other modules
window.GPUCourse = {
    progressTracker,
    utils
};
