
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Catalog from "./pages/Catalog"

export default function App() {
  return (
    <BrowserRouter basename="/showcase/euro-koshyk">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
      </Routes>
    </BrowserRouter>
  )
}
