import { HashRouter as Router , Route} from 'react-router-dom'
import { Component } from 'react'
import Home from './pages/Home'
import CityList from './pages/CityList'

export default class App extends Component{
    render(){
      return(
          <Router>
              <Route path="/home" component={Home} />
              <Route path="/citylist" component={CityList} />
          </Router>
      )
    }
  }