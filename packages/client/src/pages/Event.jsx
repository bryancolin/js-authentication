import { useContext } from "react";
import { Box, Button, Container, CssBaseline } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AuthContext from "../context/auth-context";

function Event() {
  const context = useContext(AuthContext);

  const handleClick = () => {
    context.logout();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className="paper">
        <Button type="submit" onClick={handleClick}>
          <ExitToAppIcon />
        </Button>
      </div>
    </Container>
  );
}

export default Event;
