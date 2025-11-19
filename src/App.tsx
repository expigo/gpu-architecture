import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProgressProvider } from './contexts/ProgressContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import ModulePage from './pages/ModulePage'
import VisualizationsPage from './pages/VisualizationsPage'
import ExercisesPage from './pages/ExercisesPage'
import ResourcesPage from './pages/ResourcesPage'

function App() {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/module/:moduleId" element={<ModulePage />} />
              <Route path="/visualizations" element={<VisualizationsPage />} />
              <Route path="/visualizations/:vizId" element={<VisualizationsPage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
            </Routes>
          </Layout>
        </Router>
      </ProgressProvider>
    </ThemeProvider>
  )
}

export default App
