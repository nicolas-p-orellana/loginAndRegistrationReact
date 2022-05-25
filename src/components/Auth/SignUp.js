import { useState } from "react";
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
import { Link } from "react-router-dom";
import ReactLoading from "react-loading";

export default function SignUp(props) {
  // useStates that saves the information of the user and word validation.
  const [values, setValues] = useState({
    signupForm: {
      email: {
        value: "",
        valid: false,
        validators: [required, email],
      },
      password: {
        showPassword: false,
        value: "",
        valid: false,
        validators: [required, length({ min: 5 })],
      },
      name: {
        value: "",
        valid: false,
        validators: [required],
      },
    },
  });

  //Change Handler that is called when ever a value changes and save the data in the useSate variable.
  const handleChange = (e) => {
    const value = e.target.value;
    const input = e.target.name;
    const checkValidators = values.signupForm[input].validators;

    let isValid = true;
    for (const validator of checkValidators) {
      isValid = isValid && validator(value);
    }

    values.signupForm[input] = {
      ...values.signupForm[input],
      valid: isValid,
      value: value,
    };

    setValues({
      ...values,
    });
  };

  //This functions toggles between show or hide the password
  const handleClickShowPassword = () => {
    values.signupForm.password = {
      ...values.signupForm.password,
      showPassword: !values.signupForm.password.showPassword,
    };

    setValues({ ...values });
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
          <form
            noValidate
            autoComplete="off"
            style={{
              display: "flex",
              flexDirection: "column",
              height: 200,
              justifyContent: "space-between",
              marginTop: 50,
            }}
          >
            <FormControl
              size="small"
              style={{ width: "40ch", margin: "1rem!important" }}
              variant="outlined"
            >
              <InputLabel>Name</InputLabel>
              <OutlinedInput
                label="Name"
                name="name"
                autoComplete="off"
                onChange={handleChange}
              />
            </FormControl>
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
                sx={{
                  background:
                    !values.signupForm.email.valid &&
                    values.signupForm.email.value.length !== 0 &&
                    "pink",
                }}
                onChange={handleChange}
              />
            </FormControl>
            {!values.signupForm.email.valid &&
              values.signupForm.email.value.length !== 0 && (
                <p
                  style={{
                    fontSize: 10,
                    marginLeft: 5,
                    marginTop: "124px",
                    position: "absolute",
                  }}
                >
                  Enter a valid email
                </p>
              )}

            <FormControl
              size="small"
              style={{ width: "40ch", margin: "1rem!important" }}
              variant="outlined"
            >
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                label="Password"
                type={
                  values.signupForm.password.showPassword ? "text" : "password"
                }
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
                      {values.signupForm.password.showPassword ? (
                        <Visibility />
                      ) : (
                        <VisibilityOff />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  background:
                    !values.signupForm.password.valid &&
                    values.signupForm.password.value.length !== 0 &&
                    "pink",
                }}
              />
            </FormControl>
            {!values.signupForm.password.valid &&
              values.signupForm.password.value.length !== 0 && (
                <p
                  style={{
                    fontSize: 10,
                    marginLeft: 5,
                    marginTop: "204px",
                    position: "absolute",
                  }}
                >
                  Enter a valid password
                </p>
              )}
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
                backgroundColor:
                  !values.signupForm.name.valid ||
                  !values.signupForm.email.valid ||
                  !values.signupForm.password.valid
                    ? "gray"
                    : "#121C62",
                color: "white",
                fontWeight: 600,
                border: "none",
                borderRadius: "20px",
                fontSize: "12px",
              }}
              disabled={
                !values.signupForm.name.valid ||
                !values.signupForm.email.valid ||
                !values.signupForm.password.valid
              }
              onClick={(e) => props.onSignup(e, values)}
            >
              {props.loading ? (
                <div style={{ marginTop: 35 }}>
                  <ReactLoading type="bars" color="#fff" width={30} />
                </div>
              ) : (
                "Sign Up!"
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
              <Link to="/" style={{ textDecoration: "none" }}>
                go back to login page
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
