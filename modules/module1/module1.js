// Module 1: Interactive functionality

// Quiz questions data
const quizQuestions = [
    {
        question: "What was the primary breakthrough that made CUDA significant for GPU computing?",
        options: [
            "It increased the number of cores in GPUs",
            "It provided a C-like programming interface for general-purpose computing on GPUs",
            "It improved graphics rendering performance",
            "It reduced power consumption of GPUs"
        ],
        correct: 1,
        explanation: "CUDA's significance was providing an accessible C-like programming interface that allowed scientists and engineers to use GPUs for general-purpose computing without needing graphics programming expertise."
    },
    {
        question: "According to Amdahl's Law, if 90% of a program can be parallelized and you have 100 processors, what is the theoretical maximum speedup?",
        options: [
            "90x",
            "100x",
            "Approximately 9.2x",
            "Approximately 52x"
        ],
        correct: 2,
        explanation: "Using Amdahl's Law: Speedup = 1/((1-0.9) + 0.9/100) = 1/(0.1 + 0.009) = 1/0.109 ≈ 9.2x. The 10% sequential portion significantly limits the speedup."
    },
    {
        question: "Which type of parallelism is the primary strength of GPU architecture?",
        options: [
            "Task Parallelism",
            "Data Parallelism",
            "Pipeline Parallelism",
            "Instruction-level Parallelism"
        ],
        correct: 1,
        explanation: "GPUs excel at data parallelism (SIMD), where the same operation is applied to different data elements simultaneously, which is perfect for matrix operations in deep learning."
    },
    {
        question: "In Flynn's Taxonomy, how are GPUs primarily classified?",
        options: [
            "SISD (Single Instruction, Single Data)",
            "SIMD (Single Instruction, Multiple Data)",
            "MISD (Multiple Instruction, Single Data)",
            "MIMD (Multiple Instruction, Multiple Data)"
        ],
        correct: 1,
        explanation: "GPUs are primarily SIMD architectures, executing the same instruction on multiple data elements simultaneously, though modern GPUs also support some MIMD capabilities."
    },
    {
        question: "Compared to CPUs, how do GPUs allocate their silicon die area?",
        options: [
            "More area to cache and control logic",
            "More area to arithmetic logic units (ALUs)",
            "Equal distribution between cache, control, and ALUs",
            "More area to memory controllers"
        ],
        correct: 1,
        explanation: "GPUs dedicate the majority of their die area to ALUs (arithmetic units) to maximize parallel computation capability, while CPUs dedicate more area to cache and control logic."
    },
    {
        question: "What is the typical memory bandwidth advantage of modern GPUs over CPUs?",
        options: [
            "2-5x",
            "10-15x",
            "20-30x",
            "100-200x"
        ],
        correct: 2,
        explanation: "Modern GPUs typically have 20-30x higher memory bandwidth than CPUs (1,000-3,000 GB/s vs 50-100 GB/s), which is crucial for feeding thousands of cores with data."
    },
    {
        question: "Which of the following tasks is BEST suited for GPU acceleration?",
        options: [
            "Sequential file I/O operations",
            "Complex branching with many conditional statements",
            "Matrix multiplication on large datasets",
            "Single-threaded database queries"
        ],
        correct: 2,
        explanation: "Matrix multiplication on large datasets is ideal for GPUs because it involves massive data parallelism with the same operations applied to many elements, minimal branching, and high computational intensity."
    },
    {
        question: "What specialized hardware was introduced in NVIDIA's Volta architecture (2017)?",
        options: [
            "RT Cores for ray tracing",
            "Tensor Cores for AI workloads",
            "CUDA Cores for general computing",
            "Stream Processors for graphics"
        ],
        correct: 1,
        explanation: "NVIDIA's Volta architecture introduced Tensor Cores, specialized units designed specifically for accelerating mixed-precision matrix multiply-accumulate operations common in AI workloads."
    },
    {
        question: "Why are mini-batch operations in deep learning well-suited for GPUs?",
        options: [
            "They reduce memory usage",
            "They allow identical operations on multiple samples simultaneously",
            "They simplify the neural network architecture",
            "They eliminate the need for backpropagation"
        ],
        correct: 1,
        explanation: "Mini-batch operations process multiple samples (32, 64, 256+) with identical operations simultaneously, which perfectly matches the GPU's SIMD architecture and data parallelism strengths."
    },
    {
        question: "What was the significance of AlexNet's ImageNet victory in 2012 for GPU computing?",
        options: [
            "It proved GPUs could render graphics faster",
            "It demonstrated GPUs' value for deep learning, sparking the AI revolution",
            "It showed CPUs were obsolete",
            "It introduced the first GPU architecture"
        ],
        correct: 1,
        explanation: "AlexNet's victory using GPUs proved that GPU acceleration could make deep learning practical for complex tasks, directly leading to the modern AI revolution and widespread GPU adoption for ML/DL."
    }
];

// Quiz state
let currentQuizState = {
    started: false,
    answers: new Array(quizQuestions.length).fill(null),
    submitted: false
};

// Start quiz
function startQuiz() {
    currentQuizState = {
        started: true,
        answers: new Array(quizQuestions.length).fill(null),
        submitted: false
    };

    renderQuiz();
    document.getElementById('start-quiz-btn').style.display = 'none';
    document.getElementById('submit-quiz-btn').style.display = 'inline-block';
    document.getElementById('quiz-status').textContent = 'In Progress';
}

// Render quiz questions
function renderQuiz() {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';

    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.innerHTML = `
            <div class="question-header">
                <span class="question-number">Question ${index + 1}</span>
            </div>
            <div class="question-text">${q.question}</div>
            <div class="quiz-options">
                ${q.options.map((option, optIndex) => `
                    <div class="quiz-option" onclick="selectAnswer(${index}, ${optIndex})">
                        ${option}
                    </div>
                `).join('')}
            </div>
            <div class="question-explanation" id="explanation-${index}" style="display:none; margin-top:15px; padding:15px; background:#e8f5e9; border-radius:6px;">
                <strong>Explanation:</strong> ${q.explanation}
            </div>
        `;
        container.appendChild(questionDiv);
    });
}

// Select answer
function selectAnswer(questionIndex, optionIndex) {
    if (currentQuizState.submitted) return;

    currentQuizState.answers[questionIndex] = optionIndex;

    const questionDiv = document.querySelectorAll('.quiz-question')[questionIndex];
    const options = questionDiv.querySelectorAll('.quiz-option');

    options.forEach((opt, idx) => {
        opt.classList.remove('selected');
        if (idx === optionIndex) {
            opt.classList.add('selected');
        }
    });

    updateQuizProgress();
}

// Update quiz progress
function updateQuizProgress() {
    const answered = currentQuizState.answers.filter(a => a !== null).length;
    document.getElementById('quiz-score').textContent = `Answered: ${answered}/${quizQuestions.length}`;
}

// Submit quiz
function submitQuiz() {
    const answered = currentQuizState.answers.filter(a => a !== null).length;

    if (answered < quizQuestions.length) {
        if (!confirm(`You've only answered ${answered} out of ${quizQuestions.length} questions. Submit anyway?`)) {
            return;
        }
    }

    currentQuizState.submitted = true;
    gradeQuiz();
}

// Grade quiz
function gradeQuiz() {
    let correct = 0;

    quizQuestions.forEach((q, index) => {
        const questionDiv = document.querySelectorAll('.quiz-question')[index];
        const options = questionDiv.querySelectorAll('.quiz-option');
        const userAnswer = currentQuizState.answers[index];

        options.forEach((opt, optIndex) => {
            opt.style.pointerEvents = 'none';

            if (optIndex === q.correct) {
                opt.classList.add('correct');
            } else if (optIndex === userAnswer && userAnswer !== q.correct) {
                opt.classList.add('incorrect');
            }
        });

        // Show explanation
        document.getElementById(`explanation-${index}`).style.display = 'block';

        if (userAnswer === q.correct) {
            correct++;
        }
    });

    const percentage = (correct / quizQuestions.length) * 100;
    const passed = correct >= 8;

    // Show results
    const resultsDiv = document.getElementById('quiz-results');
    resultsDiv.style.display = 'block';
    resultsDiv.innerHTML = `
        <h3>${passed ? 'Congratulations! 🎉' : 'Keep Trying! 📚'}</h3>
        <div class="result-score">${correct}/${quizQuestions.length}</div>
        <p style="font-size:1.2rem; margin:20px 0;">${percentage.toFixed(0)}% Correct</p>
        <p>${passed
            ? 'You\'ve passed the quiz! You have a solid understanding of the fundamentals. Ready to move to Module 2?'
            : 'You need 8/10 to pass. Review the material and try again. The explanations above will help you understand the correct answers.'
        }</p>
    `;

    document.getElementById('submit-quiz-btn').style.display = 'none';
    document.getElementById('retry-quiz-btn').style.display = 'inline-block';
    document.getElementById('quiz-status').textContent = passed ? 'Passed ✓' : 'Not Passed';
    document.getElementById('quiz-score').textContent = `Score: ${correct}/${quizQuestions.length}`;

    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Update progress if passed
    if (passed && window.GPUCourse && window.GPUCourse.progressTracker) {
        window.GPUCourse.progressTracker.markModuleComplete('1');
    }
}

// Retry quiz
function retryQuiz() {
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('retry-quiz-btn').style.display = 'none';
    startQuiz();
}

// Copy code to clipboard
function copyCode(button) {
    const codeBlock = button.closest('.code-example').querySelector('code');
    const text = codeBlock.textContent;

    navigator.clipboard.writeText(text).then(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> Copy';
        }, 2000);
    });
}

// Speedup calculator
function updateSpeedup() {
    const p = document.getElementById('parallel-portion').value / 100;
    const n = parseInt(document.getElementById('num-cores').value);

    document.getElementById('p-value').textContent = (p * 100).toFixed(0);
    document.getElementById('n-value').textContent = n;

    // Calculate speedup using Amdahl's Law
    const speedup = 1 / ((1 - p) + p / n);
    document.getElementById('speedup-result').textContent = speedup.toFixed(2) + 'x';

    // Update chart
    updateSpeedupChart(p, n);
}

// Update speedup chart
function updateSpeedupChart(p, n) {
    const canvas = document.getElementById('speedup-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = 200;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw speedup vs cores graph
    ctx.strokeStyle = '#76b900';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const maxCores = 10000;
    const step = maxCores / width;

    for (let i = 0; i < width; i++) {
        const cores = i * step + 1;
        const speedup = 1 / ((1 - p) + p / cores);
        const y = height - (speedup / (1 / (1 - p)) * height * 0.9);

        if (i === 0) {
            ctx.moveTo(i, y);
        } else {
            ctx.lineTo(i, y);
        }
    }

    ctx.stroke();

    // Draw current point
    const currentX = (n / maxCores) * width;
    const currentSpeedup = 1 / ((1 - p) + p / n);
    const currentY = height - (currentSpeedup / (1 / (1 - p)) * height * 0.9);

    ctx.fillStyle = '#ff9800';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.fillText('Speedup vs Number of Cores', 10, 20);
    ctx.fillText(`Max: ${(1 / (1 - p)).toFixed(1)}x`, width - 80, 20);
}

// CPU/GPU comparison visualization
function animateCPU() {
    console.log('CPU animation triggered');
    // Animation would be implemented here
}

function animateGPU() {
    console.log('GPU animation triggered');
    // Animation would be implemented here
}

function compareBoth() {
    console.log('Comparison animation triggered');
    // Animation would be implemented here
}

// Matrix multiplication visualization
function runMatMul() {
    const size = parseInt(document.getElementById('matrix-size-slider').value);
    document.getElementById('matrix-size').textContent = `${size}x${size}`;
    // Visualization would be implemented here
    console.log(`Running matrix multiplication visualization for ${size}x${size}`);
}

// Progress tracking
function updateModuleProgress() {
    const sections = document.querySelectorAll('.content-section');
    const observed = new Set();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                observed.add(entry.target.id);
                const progress = (observed.size / sections.length) * 100;
                document.getElementById('module-progress').style.width = progress + '%';
                document.getElementById('progress-text').textContent = Math.round(progress) + '% Complete';
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
}

// Table of contents highlighting
function updateTOC() {
    const sections = document.querySelectorAll('.content-section');
    const tocLinks = document.querySelectorAll('.toc a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateModuleProgress();
    updateTOC();

    // Initialize speedup calculator if present
    if (document.getElementById('speedup-chart')) {
        updateSpeedup();
    }

    // Add matrix size slider listener
    const matrixSlider = document.getElementById('matrix-size-slider');
    if (matrixSlider) {
        matrixSlider.addEventListener('input', () => {
            const size = matrixSlider.value;
            document.getElementById('matrix-size').textContent = `${size}x${size}`;
        });
    }
});
