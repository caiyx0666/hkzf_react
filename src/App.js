import { HashRouter as Router , Route} from 'react-router-dom'
import { Component } from 'react'
import Index from './pages/Home'
import CityList from './pages/CityList'

export default class App extends Component{
    render(){
      return(
          <Router>
              <Route exact path="/" component={Index} />
              <Route path="/home" component={Index} />
              <Route path="/citylist" component={CityList} />
          </Router>
      )
    }
  }