import { Link, withRouter } from "react-router-dom"
import { FaPaintBrush } from "react-icons/fa"
import "../styles/navbar.css"
import React, { useContext, useState } from "react"
import UserContext from "../userContext"
import { BiMenu } from "react-icons/bi"

function Nav({ history }) {
  const userContext = useContext(UserContext)
  let [classes] = useState("nav")
  let [style, setStyle] = useState({
    justifyContent: "flex-end",
    columnGap: "3rem",
    height: "2.6rem",
  })

  function logout() {
    localStorage.clear()
    userContext.clearUser()
    history.push("/login")
  }

  function showMenu() {
    setStyle({ rowGap: "1rem", flexDirection: "column" })
  }

  function userNav() {
    return (
      <React.Fragment>
        <li>
          <Link to="/new">
            <FaPaintBrush id="brush" />
          </Link>
        </li>
        <li>
          <img
            id="nav-pic"
            src={`${process.env.REACT_APP_FBS}/avatars%2F${userContext.photo}?alt=media`}
            alt=""
          />
          <Link to={"/@" + userContext.name}>{userContext.name}</Link>
        </li>
        <li>
          <span style={{ cursor: "pointer" }} onClick={logout}>
            logout
          </span>
        </li>
      </React.Fragment>
    )
  }

  return (
    <ul className={classes} style={style}>
      <li>
        <Link to="/">
          <img id="logo" src="artz.png" alt="" />
        </Link>
      </li>
      {userContext.token ? (
        userNav()
      ) : (
        <li>
          <Link to="/login">login</Link>
        </li>
      )}
      <li id="menu" onClick={showMenu}>
        <span style={{ cursor: "pointer" }}>
          <BiMenu />
        </span>
      </li>
    </ul>
  )
}

export default withRouter(Nav)
