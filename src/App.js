import React, { useState, useEffect } from "react"
import "./App.css"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import jwt from "jsonwebtoken"

import UserContext from "./userContext"
import Nav from "./components/nav"
import HomeScreen from "./screens/homeScreen"
import ArtScreen from "./screens/artScreen"
import PaintScreen from "./screens/paintScreen"
import LoginScreen from "./screens/loginScreen"
import RegisterScreen from "./screens/registerScreen"
import ProfileScreen from "./screens/profileScreen"
import PrivateRoute from "./routes/privateRoute"
import SignRoute from "./routes/signRoute"

function App() {
  let [id, setId] = useState(null)
  let [name, setName] = useState(null)
  let [photo, setPhoto] = useState(null)
  let [token, setToken] = useState(null)

  function clearUser() {
    setId(null)
    setName(null)
    setPhoto(null)
    setToken(null)
  }

  async function setUser(token) {
    setToken(token)

    let user = await jwt.decode(token)
    if (!user) return
    setId(user.id)
    setName(user.name)
    setPhoto(user.photo)
  }

  useEffect(() => {
    let token = localStorage.getItem("token")
    if (token) setUser(token)
  }, [])

  return (
    <Router>
      <UserContext.Provider
        value={{
          id,
          setId,
          name,
          setName,
          photo,
          setPhoto,
          token,
          setToken,
          clearUser,
          setUser,
        }}
      >
        <div className="App">
          <Nav></Nav>
          <Switch>
            <Route path="/@:name" component={ProfileScreen}></Route>
            <PrivateRoute path="/new" component={PaintScreen}></PrivateRoute>
            <SignRoute path="/login" component={LoginScreen}></SignRoute>
            <SignRoute path="/register" component={RegisterScreen}></SignRoute>
            <Route path="/:id">
              <ArtScreen></ArtScreen>
            </Route>
            <Route path="/">
              <HomeScreen></HomeScreen>
            </Route>
          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  )
}

export default App
