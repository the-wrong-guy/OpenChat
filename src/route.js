import { Route } from "react-router-dom";
import LoginPage from "./components/Login Page/login";
import MainPage from "./components/Main Page/main";

export default function Routes() {
  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <>
      <Route exact path="/login" component={<LoginPage />} />
      <Route exact path="/" component={<MainPage />} />
    </>
  );
}
