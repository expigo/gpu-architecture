import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface ModuleProgress {
  moduleId: string
  completed: boolean
  completedAt?: string
  sectionsCompleted: string[]
  quizScore?: number
  quizAttempts: number
  timeSpent: number // in minutes
}

export interface ExerciseProgress {
  exerciseId: string
  completed: boolean
  score?: number
  attempts: number
}

interface ProgressContextType {
  moduleProgress: Record<string, ModuleProgress>
  exerciseProgress: Record<string, ExerciseProgress>
  markModuleComplete: (moduleId: string, quizScore?: number) => void
  markSectionComplete: (moduleId: string, sectionId: string) => void
  updateQuizAttempt: (moduleId: string, score: number) => void
  markExerciseComplete: (exerciseId: string, score?: number) => void
  addTimeSpent: (moduleId: string, minutes: number) => void
  getOverallProgress: () => number
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

const STORAGE_KEY = 'gpu-architecture-progress'

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved).modules : {}
  })

  const [exerciseProgress, setExerciseProgress] = useState<Record<string, ExerciseProgress>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved).exercises : {}
  })

  // Save to localStorage whenever progress changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      modules: moduleProgress,
      exercises: exerciseProgress
    }))
  }, [moduleProgress, exerciseProgress])

  const markModuleComplete = (moduleId: string, quizScore?: number) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        moduleId,
        completed: true,
        completedAt: new Date().toISOString(),
        quizScore: quizScore ?? prev[moduleId]?.quizScore,
        quizAttempts: (prev[moduleId]?.quizAttempts ?? 0) + 1,
        sectionsCompleted: prev[moduleId]?.sectionsCompleted ?? [],
        timeSpent: prev[moduleId]?.timeSpent ?? 0,
      }
    }))
  }

  const markSectionComplete = (moduleId: string, sectionId: string) => {
    setModuleProgress(prev => {
      const current = prev[moduleId] ?? {
        moduleId,
        completed: false,
        sectionsCompleted: [],
        quizAttempts: 0,
        timeSpent: 0
      }

      if (!current.sectionsCompleted.includes(sectionId)) {
        return {
          ...prev,
          [moduleId]: {
            ...current,
            sectionsCompleted: [...current.sectionsCompleted, sectionId]
          }
        }
      }
      return prev
    })
  }

  const updateQuizAttempt = (moduleId: string, score: number) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        moduleId,
        quizScore: Math.max(score, prev[moduleId]?.quizScore ?? 0),
        quizAttempts: (prev[moduleId]?.quizAttempts ?? 0) + 1,
        completed: score >= 80 ? true : prev[moduleId]?.completed ?? false,
        completedAt: score >= 80 ? new Date().toISOString() : prev[moduleId]?.completedAt,
        sectionsCompleted: prev[moduleId]?.sectionsCompleted ?? [],
        timeSpent: prev[moduleId]?.timeSpent ?? 0,
      }
    }))
  }

  const markExerciseComplete = (exerciseId: string, score?: number) => {
    setExerciseProgress(prev => ({
      ...prev,
      [exerciseId]: {
        exerciseId,
        completed: true,
        score,
        attempts: (prev[exerciseId]?.attempts ?? 0) + 1
      }
    }))
  }

  const addTimeSpent = (moduleId: string, minutes: number) => {
    setModuleProgress(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        moduleId,
        completed: prev[moduleId]?.completed ?? false,
        sectionsCompleted: prev[moduleId]?.sectionsCompleted ?? [],
        quizAttempts: prev[moduleId]?.quizAttempts ?? 0,
        timeSpent: (prev[moduleId]?.timeSpent ?? 0) + minutes,
      }
    }))
  }

  const getOverallProgress = () => {
    const totalModules = 8
    const completedModules = Object.values(moduleProgress).filter(m => m.completed).length
    return (completedModules / totalModules) * 100
  }

  const resetProgress = () => {
    setModuleProgress({})
    setExerciseProgress({})
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <ProgressContext.Provider value={{
      moduleProgress,
      exerciseProgress,
      markModuleComplete,
      markSectionComplete,
      updateQuizAttempt,
      markExerciseComplete,
      addTimeSpent,
      getOverallProgress,
      resetProgress
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider')
  }
  return context
}
