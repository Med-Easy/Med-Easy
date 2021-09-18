import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './Screens/Login/Login';
import Signup from './Screens/Signup/Signup';
import Home from './Screens/Home/Home';
import { AuthProvider } from "../src/Context/AuthContext";
import PrivateRoute from './Screens/PrivateRoute';
import MedicineForm from './Screens/MedicineForm/MedicineForm';
import RegisterSeller from './Screens/RegisterSeller/RegisterSeller';
import Navbar from './Components/Navbar/Navbar';
import CustomerDashboard from './Screens/CustomerDashboard/CustomerDashboard';
import SellerDashboard from './Screens/SellerDashboard/SellerDashboard';
import ToVerifySeller from './Screens/SellerDashboard/ToVerifySeller';
import VerifyFailed from './Screens/SellerDashboard/VerifyFailed';
import Drugs from './Screens/Drugs/Drugs';
import Requests from './Screens/Requests/Requests';

function App() {
  return (
    <div className="App">

      <Router>

        <AuthProvider>

        <Switch>

          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute exact path="/register/seller" component={RegisterSeller}/>
          <PrivateRoute exact path="/medicine-form" component={ MedicineForm }/>
          <PrivateRoute exact path='/seller/dashboard' component={SellerDashboard}/>
          <PrivateRoute exact path='/seller/verify' component={ToVerifySeller}/>
          <PrivateRoute exact path='/seller/verify/failed' component={VerifyFailed}/>
          <PrivateRoute exact path='/customer/dashboard' component={CustomerDashboard}/>
          <PrivateRoute exact path='/seller/medicines' component={Drugs}/>
          <PrivateRoute exact path='/seller/medicines/requests' component={Requests}/>

          <Route exact path="/signup">
            <Signup/>
          </Route>

          <Route exact path="/login">
            <Login/>
          </Route>

          {/* <Route exact path="/login">
            <MedicineForm/>
          </Route> */}




        </Switch>

        </AuthProvider>

      </Router>

    </div>
  );
}

export default App;
