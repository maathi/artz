import { useQuery, gql } from "@apollo/client"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"
import "../styles/art.css"
const GET_ART = gql`
  query Art($id: Int) {
    art(id: $id) {
      id
      name
      pic
      description
      owner {
        id
        name
      }
    }
  }
`

function ArtScreen() {
  let [art, setArt] = useState()
  let { id } = useParams()

  const { loading, error, data } = useQuery(GET_ART, {
    variables: { id: Number(id) },
  })

  useEffect(() => {
    if (!data?.art) return

    setArt(data.art)
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div id="art">
      <p>{art?.name}</p>

      <img
        src={`${process.env.REACT_APP_FBS}/paintings%2F${art?.pic}.png?alt=media`}
        style={{
          backgroundColor: "rgb(209, 209, 209)",
          border: "3px solid black",
        }}
        alt=""
      />

      <p style={{ fontSize: "18px" }}>
        <span>Created by : </span>
        <Link to={`/@${art?.owner.name}`} style={{ color: "orange" }}>
          {art?.owner.name}
        </Link>
      </p>
      <p style={{ fontSize: "18px" }}>
        <span>Description :</span>
        <span style={{ color: "white" }}> {art?.description}</span>
      </p>
    </div>
  )
}

export default ArtScreen
