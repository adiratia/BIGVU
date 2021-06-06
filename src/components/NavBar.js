import {Component} from 'react'
import { Navbar, Nav} from 'react-bootstrap';


class NavBar extends Component {

    render(){
        return(
            <div >
                <Navbar className="nav-color" collapseOnSelect expand="lg" variant="dark">

                    <Navbar.Brand href="/"><b>BIGVU - Assignment 2</b></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto ">
                        <Nav.Link style={{color:'white', fontSize:'20px'}} href="/blue">Blue</Nav.Link>
                        <Nav.Link style={{color:'white' ,fontSize:'20px'}}href="/white">White</Nav.Link>
                        
                    </Nav> 
                    </Navbar.Collapse>
                    </Navbar>

        </div>
        )
    }

}

export default NavBar;
