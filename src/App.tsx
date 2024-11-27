import { HashRouter, Route, Routes } from 'react-router-dom'

import { Products } from './screens/Products'
import { Categories } from './screens/Categories'
import { Suppliers } from './screens/Suppliers'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Products />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/suppliers' element={<Suppliers />} />
      </Routes>
    </HashRouter>
  )
}

export default App
