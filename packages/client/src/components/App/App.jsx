import { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { createMuiTheme, ThemeProvider, CssBaseline } from "@material-ui/core";

import AuthPage from "../../pages/Auth";
import EventPage from "../../pages/Event";
import AuthContext from "../../context/auth-context";
import { light, dark } from "../Theme/Theme";

function App() {
  const [theme, setTheme] = useState(true);
  const [loginCredential, setLoginCredential] = useState({
    token: null,
    userId: null,
  });

  const appliedTheme = createMuiTheme(theme ? light : dark);

  const userLogin = (token, userId, tokenExpiration) => {
    setLoginCredential({ token: token, userId: userId });
  };

  const userLogout = () => {
    setLoginCredential({ token: null, userId: null });
  };

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <AuthContext.Provider
        value={{
          token: loginCredential.token,
          userId: loginCredential.userId,
          login: userLogin,
          logout: userLogout,
        }}
      >
        <BrowserRouter>
          <Switch>
            {loginCredential.token && <Redirect from="/" to="/events" exact />}
            {loginCredential.token && (
              <Redirect from="/auth" to="/events" exact />
            )}

            {!loginCredential.token && (
              <Route path="/auth" component={AuthPage} />
            )}
            {loginCredential.token && (
              <Route path="/events" component={EventPage} />
            )}
            {!loginCredential.token && <Redirect to="/auth" exact />}
          </Switch>
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
