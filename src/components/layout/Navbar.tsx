import { Link } from 'react-router-dom'
import { Cpu, BookOpen, Eye, Code, Library, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useProgress } from '../../contexts/ProgressContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { getOverallProgress } = useProgress()
  const progress = getOverallProgress()

  const navItems = [
    { name: 'Modules', path: '/#modules', icon: BookOpen },
    { name: 'Visualizations', path: '/visualizations', icon: Eye },
    { name: 'Exercises', path: '/exercises', icon: Code },
    { name: 'Resources', path: '/resources', icon: Library },
  ]

  return (
    <nav className="bg-nvidia-dark text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Cpu className="h-8 w-8 text-nvidia-green" />
            <div>
              <div className="text-lg font-bold">GPU Architecture Mastery</div>
              <div className="text-xs text-nvidia-accent">Interactive Learning Platform</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 hover:text-nvidia-green transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* Progress Indicator */}
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-300">Progress:</div>
              <div className="w-24 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-nvidia-green to-nvidia-accent h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-nvidia-accent font-semibold">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center space-x-2 py-2 hover:text-nvidia-green transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="text-sm text-gray-300 mb-2">Course Progress</div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-nvidia-green to-nvidia-accent h-2 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-right text-sm text-nvidia-accent font-semibold mt-1">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
