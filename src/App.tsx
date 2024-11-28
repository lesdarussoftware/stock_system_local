import { HashRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './providers/AuthProvider'
import { MessageProvider } from './providers/MessageProvider'

import { Products } from './screens/Products'
import { Clients } from './screens/Clients'
import { Categories } from './screens/Categories'
import { Suppliers } from './screens/Suppliers'
import { Stores } from './screens/Stores'
import { Users } from './screens/Users'

function App() {
  return (
    <AuthProvider>
      <MessageProvider>
        <HashRouter>
          <Routes>
            <Route path='/' element={<Products />} />
            <Route path='/clients' element={<Clients />} />
            <Route path='/categories' element={<Categories />} />
            <Route path='/suppliers' element={<Suppliers />} />
            <Route path='/stores' element={<Stores />} />
            <Route path='/users' element={<Users />} />
          </Routes>
        </HashRouter>
      </MessageProvider>
    </AuthProvider>
  )
}

export default App
