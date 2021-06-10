const videoContainer_node = document.querySelector("#feature-content-container")
const secondaryContainer_node = document.querySelector("#secondary-content-container")
const videoPlayer_node = document.querySelector("#feature-content-player")

const videoFile = window.localStorage.getItem("clip-file")

if (videoFile) {
  const title_node = document.querySelector("#feature-content-title")
  const loop_start = window.localStorage.getItem("clip-start")
  const loop_end = window.localStorage.getItem("clip-end")
  const title = window.localStorage.getItem("clip-title")

  videoPlayer_node.src = videoFile

  let videoDuration = null
  let playUpdate_interval = null

  title_node.innerText = title

  videoPlayer_node.addEventListener("loadeddata", () => {
    videoDuration = videoPlayer_node.duration
  })

  videoPlayer_node.addEventListener("play", () => {
    const tickSize = Math.min(1000, videoDuration)

    videoPlayer_node.currentTime = loop_start * videoDuration

    playUpdate_interval = setInterval(() => {
      if (videoPlayer_node.currentTime / videoDuration >= loop_end)
        videoPlayer_node.currentTime = loop_start * videoDuration
    }, tickSize)
  })

  videoPlayer_node.addEventListener("pause", () => {
    clearInterval(playUpdate_interval)
  })
}


document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    if (videoPlayer_node.paused) {
      console.log("paused")
      window.localStorage.removeItem("clip-file")
      videoContainer_node.remove()
      secondaryContainer_node.classList.add("is-active")
    }
  }, 500)
})
