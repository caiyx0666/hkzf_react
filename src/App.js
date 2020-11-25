import { HashRouter as Router , Route ,Redirect ,Switch} from 'react-router-dom'
import { Component } from 'react'
import Home from './pages/Home'
import CityList from './pages/CityList'
import NotFound from './pages/NotFound'

export default class App extends Component{
    render(){
      return(
          <Router>
            <Switch>
              <Route path="/" exact render={()=><Redirect to='/home' />} />
              <Route path="/home" component={Home} />
              <Route path="/citylist" component={CityList} />
              <Route path="*" component={NotFound} />
            </Switch>
          </Router>
      )
    }
  }