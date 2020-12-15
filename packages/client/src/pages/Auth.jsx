import { useState, useContext } from "react";
import {
  Typography,
  TextField,
  FormControlLabel,
  Button,
  Checkbox,
  Container,
  CssBaseline,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

import Footer from "../components/Navigation/Footer";
import AuthContext from "../context/auth-context";

function Auth() {
  const [header, setHeader] = useState("Sign In");
  const [checked, setChecked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });

  const context = useContext(AuthContext);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleCheck = (event) => {
    setChecked(event.target.checked);
    setHeader(event.target.checked ? "Sign Up" : "Sign In");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredential((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  };

  const handleSuccess = async () => {
    setSuccess(true);
    await delay(5000);
    setSuccess(false);
  };

  const handleFail = async () => {
    setFail(true);
    await delay(5000);
    setFail(false);
  };

  const handleClick = (event) => {
    event.preventDefault();

    const userEmail = credential.email;
    const userPass = credential.password;

    if (userEmail.trim().length === 0 || userPass.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${userEmail}", password: "${userPass}") {
            userId
            token
            tokenExpiration
          }
        }
      `,
    };

    if (checked) {
      requestBody = {
        query: `
        mutation {
          createUser(userInput: {email: "${userEmail}", password: "${userPass}"}) {
            _id
            email
          }
        } 
      `,
      };
    }

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login === null || resData.data.createUser === null) {
          handleFail();
        } else {
          handleSuccess();
          if (resData.data.login.token) {
            context.login(
              resData.data.login.token,
              resData.data.login.userId,
              resData.data.login.tokenExpiration
            );
          }
        }
      })
      .catch((err) => {
        handleFail();
        console.log(err);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="paper">
        <Typography component="h1" variant="h5">
          {header}
        </Typography>
        {success && <Alert severity="success">Success</Alert>}
        {fail && <Alert severity="error">Fail</Alert>}
        <form className="form">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="password"
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={handleCheck}
                value="register"
                color="primary"
              />
            }
            label="Don't have an account?"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleClick}
            size="large"
          >
            Submit
          </Button>
        </form>
        <Footer />
      </div>
    </Container>
  );
}

export default Auth;
