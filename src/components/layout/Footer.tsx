import { Github, Twitter, Mail, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-nvidia-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-nvidia-green">GPU Architecture Mastery</h3>
            <p className="text-gray-400 text-sm">
              A comprehensive, interactive learning platform for understanding GPU architecture
              with applications in Machine Learning and Deep Learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-nvidia-accent">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-nvidia-green transition-colors">Home</Link></li>
              <li><Link to="/#modules" className="text-gray-400 hover:text-nvidia-green transition-colors">Modules</Link></li>
              <li><Link to="/visualizations" className="text-gray-400 hover:text-nvidia-green transition-colors">Visualizations</Link></li>
              <li><Link to="/exercises" className="text-gray-400 hover:text-nvidia-green transition-colors">Exercises</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-nvidia-accent">Learning Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://docs.nvidia.com/cuda/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-nvidia-green transition-colors">CUDA Documentation</a></li>
              <li><a href="https://pytorch.org/docs/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-nvidia-green transition-colors">PyTorch Docs</a></li>
              <li><a href="https://developer.nvidia.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-nvidia-green transition-colors">NVIDIA Developer</a></li>
              <li><Link to="/resources" className="text-gray-400 hover:text-nvidia-green transition-colors">More Resources</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 text-nvidia-accent">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-nvidia-green transition-colors">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-nvidia-green transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-nvidia-green transition-colors">
                <Mail className="h-6 w-6" />
              </a>
            </div>
            <div className="mt-6 text-sm text-gray-400">
              <p>Educational resource for</p>
              <p>ML/DL researchers</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} GPU Architecture Mastery. Built for education and research.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0 flex items-center">
              Made with <Heart className="h-4 w-4 text-nvidia-green mx-1" /> for ML/DL learners
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
