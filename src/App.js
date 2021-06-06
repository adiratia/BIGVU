import {Component} from 'react';
import {Redirect,Switch ,Route,BrowserRouter} from 'react-router-dom';

import NavBar from './components/NavBar';
import Canvas from './components/Pages/Canvas';

import 'bootstrap/dist/css/bootstrap.min.css';
/*
<Router>

<Route path ='/'>
  <NavBar/>

</Route>
<Route  path ='/white'>
<Canvas backgroundColor="#ffffff " textColor="black"/>
</Route>

<Route path ='/blue'>
    <Canvas backgroundColor="#0284cf" textColor="white"/>
</Route>
</Router>*/


class App extends Component {

  render(){
    return(

            <BrowserRouter>
            <div>
                <NavBar/>
                <Switch>
                    <Route exact path="/" component={Canvas}/>
                    <Route  path ='/white'>
                    <Canvas backgroundColor="#ffffff " textColor="black"/>
                    </Route>

                    <Route path ='/blue'>
                        <Canvas backgroundColor="#0284cf" textColor="white"/>
                    </Route>                        
                    <Route path="*" render={() => <Redirect to="/" />} />
                </Switch>
            </div>
        </BrowserRouter>


    )

  }

  }


export default App;
