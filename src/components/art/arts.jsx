import { useQuery, gql } from "@apollo/client"
import { useState, useEffect } from "react"
import Card from "./card"
import "../../styles/arts.css"

const GET_ARTS = gql`
  query {
    arts {
      id
      rid
      name
      pic
      owner {
        id
        name
        photo
      }
    }
  }
`

function Arts() {
  let [arts, setArts] = useState()
  const { loading, error, data } = useQuery(GET_ARTS)

  useEffect(() => {
    if (!data?.arts) return
    setArts(data.arts)
  }, [data])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div className="arts">
      {arts?.map((j) => (
        <Card key={j.id} j={j}></Card>
      ))}
    </div>
  )
}

export default Arts
