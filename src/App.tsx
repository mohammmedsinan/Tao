import { Routes, Route, Navigate } from 'react-router-dom'
import { useProjectStore } from '@/stores/projectStore'
import Welcome from '@/pages/Welcome'
import Dashboard from '@/pages/Dashboard'
import { TalksPage } from '@/features/talks'
import TaoMotions from '@/pages/TaoMotions'
import CRTOverlay from '@/components/layout/CRTOverlay'

function App() {
    const projectPath = useProjectStore((state) => state.projectPath)
    const isProjectLoaded = !!projectPath

    return (
        <div className="min-h-screen bg-void text-holo">
            {/* CRT Scanline Effect Overlay */}
            <CRTOverlay />

            <Routes>
                {/* Welcome/Onboarding - The Gatekeeper */}
                <Route
                    path="/"
                    element={
                        isProjectLoaded ? <Navigate to="/dashboard" replace /> : <Welcome />
                    }
                />

                {/* Protected Routes - Require Project */}
                <Route
                    path="/dashboard"
                    element={
                        isProjectLoaded ? <Dashboard /> : <Navigate to="/" replace />
                    }
                />
                <Route
                    path="/talks"
                    element={
                        isProjectLoaded ? <TalksPage /> : <Navigate to="/" replace />
                    }
                />
                <Route
                    path="/motions"
                    element={
                        isProjectLoaded ? <TaoMotions /> : <Navigate to="/" replace />
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App
