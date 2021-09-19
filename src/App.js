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
import SellerDashboard from './Screens/SellerDashboard/SellerDashboard';
import ToVerifySeller from './Screens/SellerDashboard/ToVerifySeller';
import VerifyFailed from './Screens/SellerDashboard/VerifyFailed';
import Drugs from './Screens/Drugs/Drugs';
import Requests from './Screens/Requests/Requests';
import CustomerDashboard from './Screens/Customer/Dashboard/CustomerDashboard';
import FindMed from './Screens/Customer/FindMed/FindMed';
import RegisterNgo from './Screens/RegisterNgo/RegisterNgo';
import NgoPortal from './Screens/NgoPortal/NgoPortal';
import NgoList from './Screens/NgoList/NgoList';
import NgoDetails from './Screens/NgoDetails/NgoDetails';
import EditNgoDetails from './Screens/EditNgoDetails/EditNgoDetails';
import OrganisationChat from './Screens/OrganisationChat/OrganisationChat';
import AdminDashboard from './Screens/AdminDashboard/AdminDashboard';

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
          <PrivateRoute exact path='/seller/medicines' component={Drugs}/>
          <PrivateRoute exact path='/seller/medicines/requests' component={Requests}/>

          <PrivateRoute exact path='/customer/dashboard' component={CustomerDashboard}/>
          <PrivateRoute exact path='/customer/find-medicines' component={FindMed}/>
          <PrivateRoute exact path="/medicine/details/form/:id" component={ MedicineForm }/>
          <PrivateRoute exact path="/register/organisation" component={ RegisterNgo }/>
          <PrivateRoute exact path="/organisation/dashboard" component={ NgoPortal }/>
          <PrivateRoute exact path="/organisation/details/:id" component={ NgoDetails }/>
          <PrivateRoute exact path="/edit/organisation/details/:id" component={ EditNgoDetails }/>
          <PrivateRoute exact path="/organisation/chat" component={ OrganisationChat }/>

          <Route exact path="/admin/dashboard">
            <AdminDashboard/>
          </Route>

          <Route exact path="/all/organisations">
            <NgoList/>
          </Route>

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
