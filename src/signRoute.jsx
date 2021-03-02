import { Route, Redirect } from "react-router-dom"
import UserContext from "./userContext"
import { useContext } from "react"

function SignRoute({ path, component }) {
  let userContext = useContext(UserContext)

  return !userContext.token ? (
    <Route path={path} component={component}></Route>
  ) : (
    <Redirect to="/"></Redirect>
  )
}

export default SignRoute
