import { Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from './layout/RootLayout'
import { HomePage } from '../pages/HomePage'
import { AboutPage } from '../pages/AboutPage'
import { ProjectsPage } from '../pages/ProjectsPage'
import { ExperiencePage } from '../pages/ExperiencePage'
import { ContactPage } from '../pages/ContactPage'
import { ArcadePage } from '../pages/ArcadePage'
import { NotFoundPage } from '../pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/arcade" element={<ArcadePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

