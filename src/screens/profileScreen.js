import { useQuery, useMutation, gql } from "@apollo/client"
import { useEffect, useState, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { FaTimesCircle, FaSave } from "react-icons/fa"
import UserContext from "../userContext"
import jwt from "jsonwebtoken"
import "../styles/user.css"
import storage from "../config/firebase"
import shortid from "shortid"

const GET_USER = gql`
  query UserByName($name: String) {
    userByName(name: $name) {
      id
      name
      password
      photo
      intro
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
  mutation UpdatePhoto($photo: String) {
    updatePhoto(photo: $photo)
  }
`

const UPDATE_INTRO = gql`
  mutation UpdateIntro($intro: String) {
    updateIntro(intro: $intro) {
      intro
    }
  }
`
function ProfileScreen() {
  let [user, setUser] = useState()
  let [intro, setIntro] = useState("")
  let [isProfile, setIsProfile] = useState(false)
  let { name } = useParams()
  const userContext = useContext(UserContext)

  const { loading, error, data } = useQuery(GET_USER, {
    variables: { name },
  })

  const [updatePhoto, { data: updatePhotoData }] = useMutation(UPDATE_PHOTO)
  const [updateIntro] = useMutation(UPDATE_INTRO)
  const [deleteArt, { data: deletedArtdata }] = useMutation(DELETE_ART)

  useEffect(() => {
    if (!data) return
    if (!data.userByName) return

    setUser(data.userByName)
    setIntro(data.userByName.intro || "")

    if (data.userByName.id.toString() === userContext?.id?.toString())
      setIsProfile(true)
  }, [data])

  useEffect(() => {
    if (!updatePhotoData) return
    if (!updatePhotoData.updatePhoto) return

    async function decode() {
      let user = await jwt.decode(updatePhotoData.updatePhoto)
      userContext.setPhoto(user.photo)
    }
    decode()
    localStorage.setItem("token", updatePhotoData.updatePhoto)
  }, [updatePhotoData])

  useEffect(() => {
    if (!deletedArtdata?.deleteArt) return

    let arts = user.arts.filter((a) => a.id !== deletedArtdata.deleteArt.id)
    let u = JSON.parse(JSON.stringify(user))
    u.arts = arts
    setUser(u)
  }, [deletedArtdata])

  async function handleUpload({
    target: {
      validity,
      files: [photo],
    },
  }) {
    if (!validity.valid) return
    let storageRef = storage.ref()
    let fileName = shortid.generate()
    let imageRef = storageRef.child(`avatars/${fileName}`)
    let snapshot = await imageRef.put(photo)
    if (!snapshot) return
    updatePhoto({ variables: { photo: fileName } })
  }

  function handleClick() {
    document.getElementById("upload").click()
  }

  function handleDelete(id) {
    deleteArt({ variables: { id: Number(id) } })
  }

  function profileInfo() {
    return (
      <div id="infos">
        <div className="photo-wrapper">
          <img
            src={`${process.env.REACT_APP_FBS}/avatars%2F${userContext.photo}?alt=media`}
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
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          name=""
          id=""
          placeholder="what's up?"
        ></textarea>
        {/* <span contentEditable="true" onChange={(e) => console.log("sss")}>
          {intro}
        </span> */}
        {intro ? (
          <div>
            <button onClick={() => updateIntro({ variables: { intro } })}>
              <FaSave id="save" />
              save
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    )
  }

  function notProfileInfo() {
    return (
      <div id="infos">
        <div className="photo-wrapper">
          <img
            src={`${process.env.REACT_APP_FBS}/avatars%2F${user?.photo}?alt=media`}
            alt=""
          />
        </div>
        <p>{intro}</p>
      </div>
    )
  }

  function card(a) {
    return (
      <div key={a.id} className="card">
        <span id="name">{a.name}</span>

        <div className="wrapper">
          <Link to={`/${a.id}`}>
            <img
              src={`${process.env.REACT_APP_FBS}/paintings%2F${a.pic}.png?alt=media`}
              alt=""
            />
          </Link>
        </div>
        {isProfile ? (
          <div id="bottom">
            <FaTimesCircle
              id="delete"
              onClick={() => {
                handleDelete(a.id)
              }}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    )
  }

  if (loading) return <h1>loading...</h1>
  if (error) return <h1>error!</h1>

  return (
    <div id="user">
      {isProfile ? profileInfo() : notProfileInfo()}
      <div>
        {user?.arts[0] ? (
          <div>
            <h4>
              <span className="username">{user?.name}</span>'s paintings :
            </h4>
            <div className="arts">{user?.arts.map((a) => card(a))}</div>
          </div>
        ) : (
          <h4>
            <span className="username">{user?.name}</span> has no paintings yet
            :/
          </h4>
        )}
      </div>
    </div>
  )
}

export default ProfileScreen
