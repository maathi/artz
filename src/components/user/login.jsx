import { useLazyQuery, gql } from "@apollo/client"
import { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { useFormik } from "formik"
// import logo from "./../../img/artist.png"
import "../../styles/sign.css"
import logo from "./../../img/logo.png"
const LOG_IN = gql`
  query Login($name: String, $password: String) {
    login(name: $name, password: $password)
  }
`

function Login() {
  let history = useHistory()
  let [loginError, setLoginError] = useState("")
  const [login, { loading, data, error }] = useLazyQuery(LOG_IN)

  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
    },
    onSubmit: (values) => {
      login({
        variables: { name: values.name, password: values.password },
      })
    },
  })

  useEffect(() => {
    if (!data) return
    if (!data.login) {
      setLoginError("your username and password don't match")
      return
    }

    localStorage.setItem("token", data.login)
    window.location.href = "/"
    // history.push("/artist")
  }, [data])

  if (loading) return <p>loading...</p>
  if (error) return <p>`Error! ${error}`</p>

  return (
    <section id="login">
      {/* <div id="logo-wrapper">
        <img src={logo} alt="" />
      </div> */}

      <h1>Login</h1>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <input
          type="text"
          name="name"
          placeholder="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        <div className="error">
          {formik.touched.name && formik.errors.name
            ? formik.errors.name
            : null}
        </div>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="password"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />

        <div className="error">
          {formik.touched.password && formik.errors.password
            ? formik.errors.password
            : null}
        </div>

        <button type="submit">Login</button>
        <div className="error">{loginError ? loginError : null}</div>
      </form>
      <span id="not-a-user">
        not a user? <Link to="/register">register</Link>
      </span>
    </section>
  )
}

export default Login
