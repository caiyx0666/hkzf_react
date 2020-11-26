import React from 'react'
import ReactDom from 'react-dom'
import App from './App'

import './index.css'
import './assets/fonts/iconfont.css'

import 'react-virtualized/styles.css'; // only needs to be imported once


ReactDom.render(<App />,document.getElementById('root'))