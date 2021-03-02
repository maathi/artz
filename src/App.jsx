import React, { useState, useEffect } from "react"
import "./App.css"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom"
import Arts from "./components/art/arts"
import Art from "./components/art/art"
import New from "./components/art/new"
import User from "./components/user/user"
import Register from "./components/user/register"
import Login from "./components/user/login"
import Nav from "./components/nav.jsx"
import UserContext from "./userContext"
import jwt from "jsonwebtoken"
import PrivateRoute from "./privateRoute"
import SignRoute from "./signRoute"

function App() {
  let [id, setId] = useState(null)
  let [name, setName] = useState("")
  let [photo, setPhoto] = useState("")
  let token = localStorage.getItem("token")
  useEffect(() => {
    async function decode() {
      let user = await jwt.decode(token)
      if (!user) return
      setId(user.id)
      setName(user.name)
      setPhoto(user.photo)
    }
    decode()
  }, [])

  return (
    <Router>
      <UserContext.Provider
        value={{ id, setId, name, setName, photo, setPhoto, token }}
      >
        <div className="App">
          <Nav></Nav>
          <Switch>
            <Route path="/@:name" component={User}></Route>
            <PrivateRoute path="/new" component={New}></PrivateRoute>

            <SignRoute path="/login" component={Login}></SignRoute>
            <SignRoute path="/register" component={Register}></SignRoute>
            <Route path="/:id">
              <Art></Art>
            </Route>
            <Route path="/">
              <Arts></Arts>
            </Route>
          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  )
}

export default App
