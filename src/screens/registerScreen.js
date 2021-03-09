import { useMutation, gql, useLazyQuery } from "@apollo/client"
import { useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import UserContext from "../userContext"
import "../styles/sign.css"

const ADD_USER = gql`
  mutation AddUser($name: String, $password: String) {
    addUser(name: $name, password: $password)
  }
`

const CHECK_NAME = gql`
  query CheckName($name: String) {
    checkName(name: $name) {
      name
    }
  }
`

function RegisterScreen({ history }) {
  const [addUser, { data }] = useMutation(ADD_USER)
  const [checkName, { data: checkNameData }] = useLazyQuery(CHECK_NAME)

  let userContext = useContext(UserContext)
  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(15, "username must be 15 characters or less")
        .min(3, "username must be at least 3 characters long")
        .matches(
          /^[a-z0-9_]+$/i,
          "Username can only contain alphanumeric characters and underscores"
        )
        .matches(
          /^[a-z].*/,
          "Username has to start with an alphabetic character"
        )
        .required("A username is required")
        .test("check username", "username already exists!", async (value) => {
          await checkName({ variables: { name: value } })
          return !checkNameData?.checkName
        }),
      password: Yup.string()
        .max(30, "Password must be 30 characters or less")
        .min(4, "Password must be at least 4 characters long")
        .required("A password is Required"),
    }),
    onSubmit: (values) => {
      addUser({
        variables: { name: values.name, password: values.password },
      })
    },
  })

  useEffect(() => {
    if (!data?.addUser) return

    localStorage.setItem("token", data.addUser)
    userContext.setUser(data.addUser)
    history.push("/")
  }, [data])

  return (
    <section id="register">
      <h1>Register</h1>
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <input
          type="text"
          name="name"
          placeholder="pick a username"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div className="error">
          {formik.errors.name ? formik.errors.name : null}
        </div>
        <input
          id="password"
          name="password"
          placeholder="password"
          type="text"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div className="error">
          {formik.touched.password && formik.errors.password
            ? formik.errors.password
            : null}
        </div>
        <button type="submit">Register</button>
        <div className="error"></div>
      </form>
      <span id="redirect">
        already have an account? <Link to="/login">login</Link>
      </span>
    </section>
  )
}
export default RegisterScreen
