import ResponsivePointer from "https://lucianofelix.com.br/tri/js/components/Responsive_pointer.mjs"


const fileChooserCover_node = document.querySelector("#choose_file-cover")

fileChooserCover_node.addEventListener("click", async () => {
  const input_node = document.createElement("input")
  input_node.type = "file"
  input_node.accept = ".mp4, .avi, .webm"

  input_node.dispatchEvent(new MouseEvent('click'))
  input_node.addEventListener('change', event => {
    const file = event.target.files[0]
    const blob = URL.createObjectURL(file)

    videoPlayer_node.src = blob

    localStorage.setItem("clip-file", blob)
    localStorage.setItem("clip-title", "TÍTULO")
    localStorage.setItem("clip-start", 0)
    localStorage.setItem("clip-end", 1)

    fileChooserCover_node.remove()
    title_node.focus()
  })
})

const title_node = document.querySelector("#clip-title")
const selectText = ({ target }) => window.getSelection().selectAllChildren(target)

title_node.addEventListener("focus", selectText)
title_node.addEventListener("input", function () {
    localStorage.setItem("clip-title", title_node.innerText)
})
title_node.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault()
      title_node.blur()
      range_startHandle_node.focus()
    }
})



const videoPlayer_node = document.querySelector("#video_player")

let videoDuration = null
const minTime = 100 / 1000 // (100 ms)

videoPlayer_node.addEventListener("loadeddata", () => {
  videoDuration = videoPlayer_node.duration
  endTime_indicator_node.innerText = msToTime(videoDuration)
})



const range_node = document.querySelector("#clip-range")
const range_startHandle_node = document.querySelector("#clip-range-start_handle")
const range_endHandle_node = document.querySelector("#clip-range-end_handle")

let range_rect = null
let value_start = null
let offset_start = null
let loop_start = 0
let loop_end = 1

const rangePointer = new ResponsivePointer()
  .on("pointerdown", (event) => {
    range_rect = range_node.getBoundingClientRect()
    const handlePos = event.pageX - range_rect.left - range_startHandle_node.offsetWidth
    const rangeWidth = range_rect.width - range_startHandle_node.offsetWidth - range_endHandle_node.offsetWidth
    value_start = handlePos / rangeWidth

    if (event.target === range_startHandle_node) {
      offset_start = loop_start
      range_node.classList.add("hide-value")
      videoPlayer_node.pause()
    }
    else if (event.target === range_endHandle_node) {
      offset_start = loop_end
      range_node.classList.add("hide-value")
      videoPlayer_node.pause()
    }
    else {
      const value_clamp = Math.min(Math.max(value_start, 0), 1)

      range_node.classList.remove("hide-value")
      range_node.style.setProperty("--value", value_clamp)
      startTime_indicator_node.innerText = msToTime(value_clamp * videoDuration)
      videoPlayer_node.currentTime = value_clamp * videoDuration
    }
  })
  .on("pointermove", (event, origin) => {
    const handlePos = event.pageX - range_rect.left - range_startHandle_node.offsetWidth
    const rangeWidth = range_rect.width - range_startHandle_node.offsetWidth - range_endHandle_node.offsetWidth
    const value_end = handlePos / rangeWidth
    const offset = value_end - value_start

    videoPlayer_node.currentTime = value_end * videoDuration

    if (origin.target === range_startHandle_node) {
      loop_start = Math.min(Math.max(offset_start + offset, 0), (loop_end - minTime / videoDuration))
      range_node.style.setProperty("--start", loop_start)
      startTime_indicator_node.innerHTML = msToTime(Math.max(loop_start, 0) * videoDuration)
    }
    else if (origin.target === range_endHandle_node) {
      loop_end = Math.max(Math.min(offset_start + offset, 1), (loop_start + minTime / videoDuration))
      range_node.style.setProperty("--end", loop_end)
      endTime_indicator_node.innerText = msToTime(Math.min(loop_end, 1) * videoDuration)
    }
    else {
      const value_clamp = Math.min(Math.max(value_end, 0), 1)

      if (!videoPlayer_node.paused)
        videoPlayer_node.pause()

      range_node.classList.remove("hide-value")
      range_node.style.setProperty("--value", value_clamp)
      startTime_indicator_node.innerText = msToTime(value_clamp * videoDuration)
    }
  })
  .on("pointerup", () => {
    localStorage.setItem("clip-start", loop_start)
    localStorage.setItem("clip-end", loop_end)
  })

function msToTime (duration) {
  let seconds = Math.floor(duration % 60)
  let minutes = Math.floor(duration / 60)

  return minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0")
}

range_node.addEventListener("pointerdown", rangePointer.dispatch)



const playButton_node = document.querySelector("#play-button")
const startTime_indicator_node = document.querySelector("#start_time-indicator")
const endTime_indicator_node = document.querySelector("#end_time-indicator")

playButton_node.addEventListener("click", () => {
  if (videoPlayer_node.paused) {
    if (videoPlayer_node.currentTime / videoDuration < loop_start)
      videoPlayer_node.currentTime = loop_start * videoDuration

    videoPlayer_node.play()
  }
  else videoPlayer_node.pause()
})

function updateTime() {
  const currentTime = videoPlayer_node.currentTime

  range_node.style.setProperty("--value", currentTime / videoDuration)
  startTime_indicator_node.innerText = msToTime(currentTime)
  range_node.style.setProperty("--value", videoPlayer_node.currentTime / videoDuration)

  if (currentTime / videoDuration >= loop_end)
    videoPlayer_node.currentTime = loop_start * videoDuration
}

let playUpdate_interval = null

videoPlayer_node.addEventListener("play", () => {
  const tickSize = Math.min(1000, videoDuration)

  updateTime()
  playUpdate_interval = setInterval(updateTime, tickSize)

  playButton_node.classList.remove("play-state")
  playButton_node.classList.add("pause-state")
  range_node.classList.remove("hide-value")
})

videoPlayer_node.addEventListener("pause", () => {
  clearInterval(playUpdate_interval)

  playButton_node.classList.add("play-state")
  playButton_node.classList.remove("pause-state")
})


const playbackRate_node = document.querySelector("#playback_rate-button")

playbackRate_node.addEventListener("click", () => {
  videoPlayer_node.playbackRate += .5
  
  if (videoPlayer_node.playbackRate > 2)
    videoPlayer_node.playbackRate = .5

  playbackRate_node.innerText = `${videoPlayer_node.playbackRate}x`
})


const cancelButton_node = document.querySelector("#cancel-button")

cancelButton_node.addEventListener("click", () => {
  window.localStorage.removeItem("clip-file")
  location.href = "../"
})
