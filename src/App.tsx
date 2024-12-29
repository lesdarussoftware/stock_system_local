import { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'

import { AuthProvider } from './providers/AuthProvider'
import { MessageProvider } from './providers/MessageProvider'
import { BarcodeReaderProvider } from './providers/BarcodeReaderProvider'

import { LoginScreen } from './screens/LoginScreen'
import { Products } from './screens/Products'
import { Clients } from './screens/Clients'
import { Sales } from './screens/Sales'
import { Purchases } from './screens/Purchases'
import { Categories } from './screens/Categories'
import { Suppliers } from './screens/Suppliers'
import { Stores } from './screens/Stores'
import { Users } from './screens/Users'
import { db } from './utils/db'

function App() {

  useEffect(() => {
    (async () => {
      await db.users.add({ id: 1, username: 'admin', password: '123456789' });
    })()
  }, []);

  return (
    <AuthProvider>
      <MessageProvider>
        <BarcodeReaderProvider>
          <HashRouter>
            <Routes>
              <Route path='/' element={<LoginScreen />} />
              <Route path='/products' element={<Products />} />
              <Route path='/clients' element={<Clients />} />
              <Route path='/sales' element={<Sales />} />
              <Route path='/purchases' element={<Purchases />} />
              <Route path='/categories' element={<Categories />} />
              <Route path='/suppliers' element={<Suppliers />} />
              <Route path='/stores' element={<Stores />} />
              <Route path='/users' element={<Users />} />
            </Routes>
          </HashRouter>
        </BarcodeReaderProvider>
      </MessageProvider>
    </AuthProvider>
  )
}

export default App
