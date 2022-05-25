import { useState } from "react";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import swal from "sweetalert";
import axios from "axios";
import { Button } from "@mui/material";
import { required, length, email } from "../../utils/validators";
import ReactLoading from "react-loading";

export default function Login(props) {
  // useStates that saves the information of the user and word validation.
  const [values, setValues] = useState({
    loginForm: {
      email: {
        value: "",
        valid: false,
        validators: [required, email],
      },
      password: {
        value: "",
        valid: false,
        validators: [required, length({ min: 5 })],
      },
      formIsValid: false,
    },
  });

  //Change Handler that is called when ever a value changes and save the data in the useSate variable.
  const handleChange = (e) => {
    const value = e.target.value;
    const input = e.target.name;
    const checkValidators = values.loginForm[input].validators;

    let isValid = true;
    for (const validator of checkValidators) {
      isValid = isValid && validator(value);
    }

    values.loginForm[input] = {
      ...values.loginForm[input],
      valid: isValid,
      value: value,
    };

    setValues({
      ...values,
    });
  };

  //This functions toggles between show or hide the password
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#121C62",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            width: "380px",
            height: "400px",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0px 0px 10px 8px rgba(0,0,0,0.2)",
            borderRadius: "10px",
            background: "white",
          }}
        >
          <p style={{ marginTop: 50, fontSize: "20px", fontWeight: 600 }}>
            Welcome
          </p>
          <form
            noValidate
            autoComplete="off"
            style={{
              display: "flex",
              flexDirection: "column",
              height: 100,
              justifyContent: "space-between",
            }}
          >
            <FormControl
              size="small"
              style={{ width: "40ch", margin: "1rem!important" }}
              variant="outlined"
            >
              <InputLabel>Email</InputLabel>
              <OutlinedInput
                label="Email"
                name="email"
                autoComplete="email"
                onChange={handleChange}
              />
            </FormControl>
            <FormControl
              size="small"
              style={{ width: "40ch", margin: "1rem!important" }}
              variant="outlined"
            >
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                label="Password"
                type={values.showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </form>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Button
              style={{
                height: "2.5rem",
                width: "300px",
                backgroundColor: "#121C62",
                color: "white",
                fontWeight: 600,
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
              }}
              onClick={(e) => props.onLogin(e, values)}
            >
              {props.loading ? (
                <div style={{ marginTop: 35 }}>
                  <ReactLoading type="bars" color="#fff" width={30} />
                </div>
              ) : (
                "sign in"
              )}
            </Button>
            <Button
              sx={{
                marginTop: "10px",
                fontSize: "11px",
                backgroundColor: "none",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                  backgroundColor: "none",
                },
              }}
            >
              <Link to="/signup" style={{ textDecoration: "none" }}>
                Sign Up!
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
