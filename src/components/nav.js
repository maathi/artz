import { Link, withRouter } from "react-router-dom"
import { FaPaintBrush } from "react-icons/fa"
import "../styles/navbar.css"
import React, { useContext, useState } from "react"
import UserContext from "../userContext"
import { BiLogOutCircle } from "react-icons/bi"

function Nav({ history }) {
  const userContext = useContext(UserContext)

  function logout() {
    localStorage.clear()
    userContext.clearUser()
    history.push("/login")
  }

  function userNav() {
    return (
      <ul id="links">
        <li>
          <Link to="/new" className="item">
            <FaPaintBrush id="brush" />
            <span className="togo">paint</span>
          </Link>
        </li>
        <li>
          <Link to={"/@" + userContext.name} className="item">
            <img
              id="nav-pic"
              src={`${process.env.REACT_APP_FBS}/avatars%2F${userContext.photo}?alt=media`}
              alt=""
            />
            <span className="togo"> {userContext.name}</span>
          </Link>
        </li>
        <li>
          <span style={{ cursor: "pointer" }} onClick={logout} className="item">
            <BiLogOutCircle />
            <span className="togo">logout</span>
          </span>
        </li>
      </ul>
    )
  }

  return (
    <ul id="nav">
      <li>
        <Link to="/">
          <img id="logo" src="artz.png" alt="" />
        </Link>
      </li>
      {userContext.token ? (
        userNav()
      ) : (
        <li
          style={{
            float: "right",
            lineHeight: "2.5rem",
          }}
        >
          <Link to="/login" style={{ color: "white" }}>
            login
          </Link>
        </li>
      )}
    </ul>
  )
}

export default withRouter(Nav)
