import { useState, useEffect } from "react"

export default function Canvas(props) {
  let [p, setP] = useState()
  let [ctx, setCtx] = useState()
  let [canvas, setCanvas] = useState()
  let [mouse, setMouse] = useState("up")

  useEffect(() => {
    let canvas = document.getElementById("canvas")
    setCanvas(canvas)
    let ctx = canvas.getContext("2d")
    setCtx(ctx)
  }, [])

  useEffect(() => {
    if (!ctx) return

    if (mouse === "up") {
      ctx.beginPath()
      return
    }

    ctx.lineWidth = props.lineWidth
    ctx.lineCap = "round"
    ctx.lineTo(p?.x, p?.y)
    ctx.strokeStyle = props.color
    ctx.stroke()
  }, [p])

  function handleMouseMove(e) {
    console.log("moviing")
    var rect = canvas.getBoundingClientRect()
    setP({
      x: ((e.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
      y: ((e.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
    })
  }

  function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(",")[1])
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]
    var ab = new ArrayBuffer(byteString.length)
    var ia = new Uint8Array(ab)
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    var blob = new Blob([ab], { type: mimeString })
    return blob
  }

  function handleMouseUp() {
    setMouse("up")
    let data = canvas.toDataURL()
    let file = dataURItoBlob(data)
    props.setFile(file)
  }

  return (
    <div>
      <canvas
        onMouseDown={() => setMouse("down")}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseUp={() => handleMouseUp()}
        onMouseLeave={() => setMouse("up")}
        onTouchStart={() => setMouse("down")}
        onTouchMove={(e) => handleMouseMove(e)}
        onTouchEnd={() => handleMouseUp()}
        id="canvas"
        width="600px"
        height="400px"
        style={{
          border: "1px solid black",
          display: "block",
          margin: "auto",
          backgroundColor: "#eee",
          cursor: "cell",
        }}
      ></canvas>
    </div>
  )
}
