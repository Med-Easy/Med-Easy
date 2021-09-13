import './App.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from './Screens/Login/Login';
import Signup from './Screens/Signup/Signup';
import Home from './Screens/Home/Home';
import { AuthProvider } from "../src/Context/AuthContext";
import PrivateRoute from './Screens/PrivateRoute';
import MedicineForm from './Screens/MedicineForm/MedicineForm';
import RegisterSeller from './Screens/RegisterSeller/RegisterSeller';

function App() {
  return (
    <div className="App">

      <Router>

        <AuthProvider>

        <Switch>

          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute exact path="/register/seller" component={RegisterSeller}/>
          <Route exact path="/signup">
            <Signup/>
          </Route>

          <Route exact path="/login">
            <Login/>
          </Route>

          {/* <Route exact path="/login">
            <MedicineForm/>
          </Route> */}



          <PrivateRoute exact path="/medicine-form" component={ MedicineForm }/>

        </Switch>

        </AuthProvider>

      </Router>

    </div>
  );
}

export default App;
