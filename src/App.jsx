import { BrowserRouter, Routes, Route } from 'react-router-dom'

import PinGate from './PinGate'
import { AppProvider } from './context/AppContext'

import Layout from './components/layout'

import Dashboard from './pages/dashboard'
import Platos from './pages/Platos'
import Ventas from './pages/Ventas'
import Gastos from './pages/Gastos'
import Pendientes from './pages/Pendientes'
import Reportes from './pages/Reportes'
import DetalleCaja from './pages/DetalleCaja'

function App() {
  return (
    <PinGate>
      <AppProvider>
        <BrowserRouter>
          <Routes>

            <Route element={<Layout />}>
                <Route
                    path="/caja/:tipo"
                    element={<DetalleCaja />}
                  />

              <Route
                path="/"
                element={<Dashboard />}
              />

              <Route
                path="/ventas"
                element={<Ventas />}
              />

              <Route
                path="/gastos"
                element={<Gastos />}
              />

              <Route
                path="/platos"
                element={<Platos />}
              />

              <Route
                path="/pendientes"
                element={<Pendientes />}
              />

              <Route
                path="/reportes"
                element={<Reportes />}
              />

            </Route>

          </Routes>
        </BrowserRouter>
      </AppProvider>
    </PinGate>
  )
}

export default App