import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {React,lazy,Suspense} from 'react'
import { Route,Routes } from 'react-router-dom'
const Form = lazy(()=>import('./pages/Form'))
const Qr= lazy(()=>import('./pages/Qr'))


function App() {
  

  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path='/' element={<Form />} />
      <Route path='/qrcode' element={<Qr/>} />
    </Routes>
    </Suspense>
    </>
  )
  
}

export default App
