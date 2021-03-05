import { Route, Redirect } from "react-router-dom"
import UserContext from "../userContext"
import { useContext } from "react"

function PrivateRoute({ path, component }) {
  let userContext = useContext(UserContext)

  return userContext.token ? (
    <Route path={path} component={component}></Route>
  ) : (
    <Redirect to="/login"></Redirect>
  )
}

export default PrivateRoute
