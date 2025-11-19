# GPU Architecture Mastery - React Edition

> **Production-grade interactive learning platform built with React, TypeScript, and Vite**

A comprehensive, modern web application for learning GPU architecture with real-time visualizations, interactive quizzes, and hands-on Python examples. Perfect for ML/DL researchers and engineers.

## 🚀 Features

### Frontend (React + TypeScript)
- ⚡ **Blazing Fast** - Built with Vite for instant HMR and optimized builds
- 🎨 **Modern UI** - Tailwind CSS with custom NVIDIA-themed design system
- 📊 **Interactive Visualizations** - Canvas-based GPU simulations with Three.js integration
- 📱 **Fully Responsive** - Mobile-first design that works on all devices
- 💾 **Progress Tracking** - LocalStorage-based progress persistence
- 🎯 **Smart Routing** - React Router for seamless navigation
- 🌙 **Theme Support** - Light/dark mode toggle (extendable)

### Backend/Examples (Python + uv)
- 🐍 **Modern Python** - Using `uv` for blazing-fast package management
- 🔬 **Comprehensive Examples** - 50+ Python scripts and Jupyter notebooks
- 🧮 **GPU Benchmarking** - Real performance comparisons
- 📓 **Interactive Notebooks** - Learn by doing with Jupyter

## 📦 Quick Start

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will open at `http://localhost:3000`

### Python Environment Setup (using uv)

```bash
# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install project dependencies
uv pip install -e .

# Run examples
cd python/examples
python gpu_check.py
python benchmark_matmul.py
```

## 📁 Project Structure

```
gpu-architecture/
├── src/                          # React source code
│   ├── components/               # Reusable React components
│   │   ├── layout/              # Layout components (Navbar, Footer)
│   │   ├── common/              # Common UI components
│   │   ├── modules/             # Module-specific components
│   │   └── quiz/                # Quiz components
│   ├── pages/                   # Page components
│   │   ├── HomePage.tsx
│   │   ├── ModulePage.tsx
│   │   ├── VisualizationsPage.tsx
│   │   ├── ExercisesPage.tsx
│   │   └── ResourcesPage.tsx
│   ├── contexts/                # React Context providers
│   │   ├── ProgressContext.tsx  # Progress tracking
│   │   └── ThemeContext.tsx     # Theme management
│   ├── visualizations/          # Interactive visualizations
│   │   ├── GPUHeroAnimation.tsx
│   │   └── [more viz components]
│   ├── data/                    # Course content data
│   │   └── modules.ts           # All 8 modules' content
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   ├── App.tsx                  # Main App component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── python/                      # Python examples
│   ├── examples/                # Standalone scripts
│   │   ├── gpu_check.py
│   │   ├── benchmark_matmul.py
│   │   └── parallel_demo.py
│   └── notebooks/               # Jupyter notebooks
├── public/                      # Static assets
├── index-react.html             # HTML entry point
├── package.json                 # NPM dependencies
├── pyproject.toml               # Python dependencies (uv)
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind CSS config
└── tsconfig.json                # TypeScript config
```

## 🎓 Course Modules

### Module 1: Introduction to GPU Computing ✅
**Status**: Fully implemented with comprehensive content
- Evolution of GPU Architecture (detailed timeline)
- Parallelism Fundamentals (Flynn's Taxonomy, Amdahl's Law)
- CPU vs GPU Architecture (in-depth comparison)
- GPUs in Modern AI/ML (real-world applications)

### Modules 2-8: Coming Soon
- Module 2: GPU Hardware Architecture
- Module 3: Memory Hierarchy & Management
- Module 4: CUDA Programming Model
- Module 5: Performance Optimization
- Module 6: Deep Learning on GPUs
- Module 7: Multi-GPU & Distributed Computing
- Module 8: Advanced Topics & Future Trends

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Routing**: React Router 7
- **Visualizations**:
  - Canvas API (custom animations)
  - Three.js (3D graphics)
  - D3.js (data visualization)
  - React Three Fiber
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Code Highlighting**: Prism.js / React Syntax Highlighter

### Python/Backend
- **Package Manager**: uv (ultra-fast Python package installer)
- **Core Libraries**: PyTorch, NumPy, Matplotlib
- **Notebooks**: Jupyter
- **Optional**: TensorFlow

## 🎨 Design System

### Colors
- **Primary (NVIDIA Green)**: `#76b900`
- **Accent (Cyan)**: `#00d4aa`
- **Dark**: `#1a1a1a`
- **Background**: `#f5f5f5`

### Components
All UI components follow a consistent design language:
- Cards with hover effects
- Gradient buttons with smooth transitions
- Progress bars with animated fills
- Responsive navigation with mobile menu

## 📊 Features Breakdown

### Progress Tracking
- LocalStorage-based persistence
- Per-module progress
- Section completion tracking
- Quiz scores and attempts
- Time spent tracking

### Interactive Elements
- Real-time GPU core simulations
- Amdahl's Law calculator
- CPU vs GPU comparison animations
- Matrix multiplication visualizations
- Parallel execution demos

### Quiz System
- Multiple choice questions
- Instant feedback
- Detailed explanations
- Score tracking
- Retry functionality

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# The dist/ folder contains the production build
```

### Environment Variables
Create a `.env` file:
```env
VITE_API_URL=your_api_url_here
```

## 📝 Development

### Adding New Modules
1. Update `src/data/modules.ts` with new module content
2. Create visualization components in `src/visualizations/`
3. Add Python examples in `python/examples/`
4. Update navigation in `src/components/layout/Navbar.tsx`

### Creating Visualizations
```typescript
// Example: New visualization component
import { useEffect, useRef } from 'react'

export default function MyVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    // Your visualization logic
  }, [])

  return <canvas ref={canvasRef} />
}
```

### Adding Python Examples
```python
# python/examples/new_example.py
"""
Description of what this example demonstrates
Module X: Topic Name
"""

import torch

def main():
    # Your example code
    pass

if __name__ == "__main__":
    main()
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use for education and research

## 🙏 Acknowledgments

- NVIDIA for GPU architecture documentation
- PyTorch and TensorFlow teams
- The open-source community

## 📧 Contact

Questions or feedback? Open an issue on GitHub!

---

**Built with ❤️ for ML/DL researchers and engineers**
