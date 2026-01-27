import { Routes, Route, Navigate } from 'react-router-dom'
import { useProjectStore } from '@/stores/projectStore'
import { WelcomePage } from '@/features/welcome'
import { DashboardPage } from '@/features/dashboard'
import { TalksPage } from '@/features/talks'
import { MotionsPage } from '@/features/motions'
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
                        isProjectLoaded ? <Navigate to="/dashboard" replace /> : <WelcomePage />
                    }
                />

                {/* Protected Routes - Require Project */}
                <Route
                    path="/dashboard"
                    element={
                        isProjectLoaded ? <DashboardPage /> : <Navigate to="/" replace />
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
                        isProjectLoaded ? <MotionsPage /> : <Navigate to="/" replace />
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App
