import { useParams } from 'react-router-dom'
import { modules } from '../data/modules'
import { Clock, Award, BookOpen, Eye, Code, ArrowLeft, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ModulePage() {
  const { moduleId } = useParams<{ moduleId: string }>()
  const module = modules.find(m => m.id === moduleId)

  if (!module) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Module Not Found</h1>
        <Link to="/" className="text-nvidia-green hover:underline">
          Return to home
        </Link>
      </div>
    )
  }

  const nextModule = modules[module.number]
  const prevModule = modules[module.number - 2]

  return (
    <div className="bg-white">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-nvidia-dark to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <Link to="/" className="inline-flex items-center text-nvidia-accent hover:text-nvidia-green transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Modules
            </Link>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-nvidia-green font-bold text-lg mb-2">
                Module {module.number} of 8
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{module.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{module.subtitle}</p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-nvidia-accent" />
                  <span>{module.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-nvidia-accent" />
                  <span className="capitalize">{module.difficulty}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-nvidia-accent" />
                  <span>{module.sections.length} Sections</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-nvidia-accent" />
                  <span>{module.visualizations.length} Visualizations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-nvidia-accent" />
                  <span>{module.codeExamples.length}+ Code Examples</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Table of Contents */}
              <div className="card">
                <h3 className="font-bold text-lg mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  <a href="#overview" className="block text-sm text-gray-600 hover:text-nvidia-green transition-colors">
                    Overview
                  </a>
                  {module.sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-gray-600 hover:text-nvidia-green transition-colors pl-3 border-l-2 border-gray-200 hover:border-nvidia-green"
                    >
                      {index + 1}. {section.title}
                    </a>
                  ))}
                  {module.visualizations.length > 0 && (
                    <a href="#visualizations" className="block text-sm text-gray-600 hover:text-nvidia-green transition-colors">
                      Visualizations
                    </a>
                  )}
                  <a href="#quiz" className="block text-sm text-gray-600 hover:text-nvidia-green transition-colors">
                    Knowledge Check
                  </a>
                </nav>
              </div>

              {/* Learning Objectives */}
              <div className="card bg-green-50">
                <h3 className="font-bold text-lg mb-4">Learning Objectives</h3>
                <ul className="space-y-2">
                  {module.learningObjectives.map((objective, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-nvidia-green mr-2">✓</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-12">
            {/* Overview */}
            <section id="overview" className="card">
              <h2 className="text-3xl font-bold mb-4">Module Overview</h2>
              <p className="text-lg text-gray-700 mb-6">{module.description}</p>

              {module.prerequisites.length > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <h3 className="font-semibold mb-2">Prerequisites</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {module.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Sections */}
            {module.sections.map((section, index) => (
              <section key={section.id} id={section.id} className="card">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">
                  {index + 1}. {section.title}
                </h2>
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: section.content
                      .replace(/^## /gm, '<h3 class="text-2xl font-bold mt-8 mb-4">')
                      .replace(/^### /gm, '<h4 class="text-xl font-semibold mt-6 mb-3">')
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
              </section>
            ))}

            {/* Visualizations */}
            {module.visualizations.length > 0 && (
              <section id="visualizations" className="card">
                <h2 className="text-3xl font-bold mb-6">Interactive Visualizations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {module.visualizations.map((viz) => (
                    <div key={viz.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-lg mb-2">{viz.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{viz.description}</p>
                      <span className="inline-block px-3 py-1 bg-nvidia-green/10 text-nvidia-green rounded-full text-xs mb-4">
                        {viz.type}
                      </span>
                      <Link
                        to={`/visualizations/${viz.id}`}
                        className="inline-flex items-center text-nvidia-green hover:text-green-700 font-semibold text-sm"
                      >
                        Launch Visualization <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Knowledge Check */}
            <section id="quiz" className="card bg-gradient-to-br from-nvidia-green/5 to-nvidia-accent/5">
              <h2 className="text-3xl font-bold mb-4">Knowledge Check</h2>
              <p className="text-gray-700 mb-6">
                Test your understanding with an interactive quiz covering all topics in this module.
              </p>
              <button className="btn-primary">
                Start Quiz ({module.quizQuestions.length} Questions)
              </button>
            </section>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t">
              {prevModule ? (
                <Link to={`/module/${prevModule.id}`} className="btn-secondary inline-flex items-center">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Previous: {prevModule.title}
                </Link>
              ) : (
                <div />
              )}
              {nextModule ? (
                <Link to={`/module/${nextModule.id}`} className="btn-primary inline-flex items-center">
                  Next: {nextModule.title}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
