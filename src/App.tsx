import { BrowserRouter, Route, Routes } from "react-router-dom"
import Hub from "./pages/Hub"
import Home from "./pages/Home"

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="hub" element={<Hub />} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default App