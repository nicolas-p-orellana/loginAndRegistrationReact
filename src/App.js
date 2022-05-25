import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import theme from "./ThemeProvider";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SignUp from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import { useEffect, useState } from "react";
import swal from "sweetalert";

function App() {
  const [state, setState] = useState({
    isAuth: false,
    token: null,
    userId: null,
    authLoading: false,
    error: null,
    status: "",
  });

  // This useEffect sets the Autthentication process
  // saves the token generated when the user logs in and sets the user's id, also changes the stae of isAuth to true.
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    // Checks if there is a token or an expiryDate if not the useEffect ends
    if (!token || !expiryDate) {
      return;
    }
    // Checks if the expiryDate is lower or the same as the current date. If true logs the user out.
    if (new Date(expiryDate) <= new Date()) {
      logoutHandler();
      return;
    }

    // If a user logs in, saves he user's id and token in the useState variable and calls the setAutoLogout function passing the remainingMilliseconds
    const userId = localStorage.getItem("userId");
    const remainingMilliseconds =
      new Date(expiryDate).getTime() - new Date().getTime();
    setState({ ...state, isAuth: true, token: token, userId: userId });
    setAutoLogout(remainingMilliseconds);
  }, []);

  //This function cleans the memory and returns everything to the way it was before a user logged in when the user logouts.
  const logoutHandler = () => {
    setState({ ...state, isAuth: false, token: null });
    localStorage.removeItem("token");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("userId");
    window.location = "/";
  };

  //This function sends a request to the server with the email and password of the user.
  const loginHandler = (event, authData) => {
    event.preventDefault();
    //Query to log the user in the server.
    const graphqlQuery = {
      query: `
      query UserLogin($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          userId
        }
      }
    `,
      variables: {
        email: authData.loginForm.email.value,
        password: authData.loginForm.password.value,
      },
    };

    setState({ ...state, authLoading: true });
    //The call to the server using the query with the email and password.
    fetch("http://localhost:9000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.errors && resData.errors[0].status === 422) {
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          throw new Error("User login failed!");
        }
        //Sets the corresponding data.
        setState({
          ...state,
          isAuth: true,
          token: resData.data.login.token,
          authLoading: false,
          userId: resData.data.login.userId,
        });
        localStorage.setItem("token", resData.data.login.token);
        localStorage.setItem("userId", resData.data.login.userId);
        const remainingMilliseconds = 60 * 60 * 1000;
        const expiryDate = new Date(
          new Date().getTime() + remainingMilliseconds
        );
        localStorage.setItem("expiryDate", expiryDate.toISOString());
        setAutoLogout(remainingMilliseconds);
        swal({
          closeOnClickOutside: false,
          title: "Logged in successfully!",
          icon: "success",
        });
      })
      .catch((err) => {
        console.log(err);
        setState({ ...state, isAuth: false, authLoading: false, error: err });
        swal({
          closeOnClickOutside: false,
          title: `Error`,
          text: "User login failed! Try again",
          icon: "warning",
        });
      });
  };

  //A function to signup.
  const signupHandler = (event, authData) => {
    event.preventDefault();
    setState({ ...state, authLoading: true });

    //The query with the user information.
    const graphqlQuery = {
      query: `
        mutation CreateNewUser($email: String!, $name: String!, $password: String!) {
          createUser(userInput: {email: $email, name: $name, password: $password}) {
            _id
            email
          }
        }
      `,
      variables: {
        email: authData.signupForm.email.value,
        name: authData.signupForm.name.value,
        password: authData.signupForm.password.value,
      },
    };
    //The call to the server with the query with the information of the user.
    fetch("http://localhost:9000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graphqlQuery),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (
          resData.errors &&
          resData.errors[0].message === "User exists already!"
        ) {
          swal({
            closeOnClickOutside: false,
            title: `Error`,
            text: "Validation failed. Make sure the email address isn't used yet!",
            icon: "warning",
          });
          throw new Error(
            "Validation failed. Make sure the email address isn't used yet!"
          );
        }
        if (resData.errors) {
          swal({
            closeOnClickOutside: false,
            title: `Error`,
            text: "User creation failed!",
            icon: "warning",
          });
          throw new Error("User creation failed!");
        }
        setState({ ...state, isAuth: false, authLoading: false });
        swal({
          closeOnClickOutside: false,
          text: "User created succesfully.",
          icon: "success",
        }).then(() => {
          window.location = "/";
        });
      })
      .catch((err) => {
        console.log(err);
        setState({ ...state, isAuth: false, authLoading: false, error: err });
      });
  };

  //This function logs the user out when the time in milliseconds previously designated ends.
  const setAutoLogout = (milliseconds) => {
    setTimeout(() => {
      logoutHandler();
    }, milliseconds);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Login onLogin={loginHandler} loading={state.authLoading} />
            }
          />
          <Route
            path="/signup"
            element={
              <SignUp onSignup={signupHandler} loading={state.authLoading} />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
