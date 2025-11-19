import { Link } from 'react-router-dom'
import { ArrowRight, Brain, TrendingUp, Code, Zap, BookOpen, CheckCircle } from 'lucide-react'
import { modules } from '../data/modules'
import { useProgress } from '../contexts/ProgressContext'
import GPUHeroAnimation from '../visualizations/GPUHeroAnimation'

export default function HomePage() {
  const { moduleProgress } = useProgress()

  const features = [
    {
      icon: Brain,
      title: 'Deep Theory',
      description: 'Comprehensive coverage from transistors to tensor cores'
    },
    {
      icon: TrendingUp,
      title: 'Interactive Visualizations',
      description: 'Dynamic 3D visualizations and animations'
    },
    {
      icon: Code,
      title: 'Python & CUDA',
      description: 'Hands-on with PyTorch, TensorFlow, and CUDA'
    },
    {
      icon: Zap,
      title: 'ML/DL Applications',
      description: 'Optimize deep learning models and training'
    }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-nvidia-dark via-gray-900 to-nvidia-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Master GPU
                <span className="block text-gradient bg-gradient-to-r from-nvidia-green to-nvidia-accent bg-clip-text text-transparent">
                  Architecture
                </span>
              </h1>
              <p className="text-xl text-gray-300">
                A comprehensive course for ML/DL researchers with interactive visualizations,
                hands-on Python examples, and real-world applications.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/#modules" className="btn-primary inline-flex items-center">
                  Start Learning <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/visualizations" className="btn-secondary">
                  Explore Visualizations
                </Link>
              </div>
              <div className="flex items-center space-x-8 text-sm">
                <div>
                  <div className="text-nvidia-accent font-bold text-2xl">8</div>
                  <div className="text-gray-400">Modules</div>
                </div>
                <div>
                  <div className="text-nvidia-accent font-bold text-2xl">74</div>
                  <div className="text-gray-400">Visualizations</div>
                </div>
                <div>
                  <div className="text-nvidia-accent font-bold text-2xl">50+</div>
                  <div className="text-gray-400">Code Examples</div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <GPUHeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to become a GPU architecture expert
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card text-center hover:-translate-y-2 transition-transform duration-300"
              >
                <feature.icon className="h-12 w-12 text-nvidia-green mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section id="modules" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Course Modules
            </h2>
            <p className="text-xl text-gray-600">
              A structured curriculum from fundamentals to advanced optimization
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modules.map((module) => {
              const progress = moduleProgress[module.id]
              const isCompleted = progress?.completed
              const sectionProgress = progress?.sectionsCompleted?.length || 0
              const totalSections = module.sections.length

              return (
                <div
                  key={module.id}
                  className="module-card card border-l-4 border-nvidia-green"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-nvidia-green font-bold text-lg mb-1">
                        Module {module.number}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{module.subtitle}</p>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="h-8 w-8 text-nvidia-green flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-gray-700 mb-4">{module.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {module.duration}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm capitalize">
                      {module.difficulty}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {module.visualizations.length} Visualizations
                    </span>
                  </div>

                  {progress && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{sectionProgress}/{totalSections} sections</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="progress-bar h-2"
                          style={{ width: `${(sectionProgress / totalSections) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <Link
                    to={`/module/${module.id}`}
                    className="inline-flex items-center text-nvidia-green hover:text-green-700 font-semibold"
                  >
                    {isCompleted ? 'Review Module' : 'Start Module'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-nvidia-green to-nvidia-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Master GPU Architecture?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey to becoming a GPU expert today
          </p>
          <Link
            to="/module/module1"
            className="inline-flex items-center bg-white text-nvidia-green px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            <BookOpen className="mr-2 h-6 w-6" />
            Begin with Module 1
          </Link>
        </div>
      </section>
    </div>
  )
}
