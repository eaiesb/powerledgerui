import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PowerLedger from '../src/Components/powerledger';
import PostalCodes from './Components/postalcodes';
import React from 'react';
import Aggression from './Components/aggression';

export default function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path = '/' element = {<PowerLedger />} />
      <Route path = '/powerLedger' element = {<PowerLedger />} />
      <Route path = '/postalcodes' element = {<PostalCodes />} />
      <Route path = '/aggression' element = {<Aggression />} />
    </Routes>
    </BrowserRouter>
  )
}