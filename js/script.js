const mainSection_node = document.querySelector("#main-section")

mainSection_node.addEventListener("scroll", (event) => {
  const child_nodes = event.target.children
  
  for (let child_node of child_nodes) {
    const children_rect = child_node.getBoundingClientRect()

    if (child_node.classList.contains("wrap-video-content")) {
      const videoPlayer_node = child_node.querySelector(".video-post-player")

      if (children_rect.top >= -100 && children_rect.bottom < mainSection_node.offsetHeight) {
        child_node.classList.add("is-active")

        if (videoPlayer_node.paused)
          videoPlayer_node.play()
      }
      else {
        child_node.classList.remove("is-active")

        if (!videoPlayer_node.paused) {
          videoPlayer_node.currentTime = 0
          videoPlayer_node.pause()
        }
      }
    }
  }
})


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
      window.localStorage.removeItem("clip-file")
      videoContainer_node.remove()

      secondaryContainer_node.classList.add("is-active")
    }
    else {
      secondaryContainer_node.querySelector(".video-post-player").pause()
    }
  }, 500)
})


document.addEventListener("DOMContentLoaded", () => {
  const communityButton_node = document.querySelector("#new_community-button")
  const communityName = sessionStorage.getItem("community-name")

  if (communityName) {
    communityButton_node.querySelector(".communitie-button-label").innerText = communityName
    communityButton_node.querySelector(".communitie-button-image").setAttribute("alt", communityName)
  }
  else {
    communityButton_node.remove()
  }
})
