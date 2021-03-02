import { useQuery, useMutation, gql } from "@apollo/client"
import { isValidElement, useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { UserType } from "../../schema"
import Card from "../art/card"
import "../../styles/arts.css"
import "../../styles/user.css"
import { FaTimesCircle } from "react-icons/fa"
const GET_USER = gql`
  query User($id: Int) {
    user(id: $id) {
      id
      name
      password
      photo
      arts {
        id
        name
        pic
        owner {
          name
        }
      }
    }
  }
`
const DELETE_ART = gql`
  mutation DeleteArt($id: Int) {
    deleteArt(id: $id) {
      id
      name
    }
  }
`
const UPDATE_PHOTO = gql`
  mutation UpdatePhoto($photo: Upload) {
    updatePhoto(photo: $photo) {
      photo
    }
  }
`
function Profile() {
  let [user, setUser] = useState()
  let [arts, setArts] = useState()
  let { id } = useParams()

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: Number(id) },
  })

  const [updatePhoto, { photoData }] = useMutation(UPDATE_PHOTO)
  const [deleteArt, { data: deletedArtdata }] = useMutation(DELETE_ART)

  useEffect(() => {
    if (!data) return
    if (!data.user) return

    setUser(data.user)
  }, [data])

  useEffect(() => {
    if (!deletedArtdata) return
    if (!deletedArtdata.deleteArt) return

    let arts = user.arts.filter((a) => a.id != deletedArtdata.deleteArt.id)
    let u = JSON.parse(JSON.stringify(user))
    u.arts = arts
    setUser(u)
  }, [deletedArtdata])

  function handleUpload({
    target: {
      validity,
      files: [photo],
    },
  }) {
    validity.valid && updatePhoto({ variables: { photo } })
  }

  function handleClick() {
    document.getElementById("upload").click()
  }

  function handleDelete(id) {
    deleteArt({ variables: { id: Number(id) } })
  }

  if (loading) return <h1>loading...</h1>
  if (error) return <h1>error!</h1>

  return (
    <div>
      {user ? (
        <div id="user">
          <div className="photo-wrapper">
            <img
              src={`${process.env.REACT_APP_URL}/${user.photo}`}
              alt=""
              onClick={handleClick}
            />
          </div>
          <input
            style={{ display: "none" }}
            id="upload"
            type="file"
            onChange={handleUpload}
          />
          <h4>
            <span style={{ color: "white" }}>{user.name}</span>'s paintings :
          </h4>
          <div className="arts">
            {user.arts.map((a) => (
              <div key={a.id} className="card">
                <span id="name">{a.name}</span>

                <div className="wrapper">
                  <Link to={`/paintings/${a.id}`}>
                    <img
                      src={`${process.env.REACT_APP_URL}/${a.pic}.png`}
                      alt=""
                    />
                  </Link>
                </div>
                <div>
                  <FaTimesCircle
                    id="delete"
                    onClick={() => {
                      handleDelete(a.id)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default Profile
