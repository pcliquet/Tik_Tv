import ResponsivePointer from "https://lucianofelix.com.br/tri/js/components/Responsive_pointer.mjs"

const fileChooserCover_node = document.querySelector("#choose_file-cover")

fileChooserCover_node.addEventListener("click", async () => {
  const input_node = document.createElement("input")
  input_node.type = "file"
  input_node.accept = ".mp4"

  input_node.dispatchEvent(new MouseEvent('click'))
  input_node.addEventListener('change', event => {
    const file = event.target.files[0]
    const blob = URL.createObjectURL(file)

    videoPlayer_node.src = blob
    window.localStorage.setItem("video_file", blob)
    window.localStorage.setItem("loop_start", 0)
    window.localStorage.setItem("loop_end", 1)

    fileChooserCover_node.remove()
  })
})


const range_node = document.querySelector("#video_interval-range")
const range_startHandle_node = document.querySelector("#video_interval-range-start_handle")
const range_endHandle_node = document.querySelector("#video_interval-range-end_handle")
const startTime_indicator_node = document.querySelector("#start_time-indicator")
const endTime_indicator_node = document.querySelector("#end_time-indicator")

let range_rect = null
let value_start = null
let offset_start = null
let loop_start = 0
let loop_end = 1

const rangePointer = new ResponsivePointer()
  .on("pointerdown", (event) => {
    range_rect = range_node.getBoundingClientRect()
    value_start = (event.pageX - range_rect.left) / range_rect.width

    if (event.target === range_startHandle_node)
      offset_start = loop_start
    else if (event.target === range_endHandle_node)
      offset_start = loop_end

    videoPlayer_node.pause()
    playButton_node.classList.add("play-state")
    playButton_node.classList.remove("pause-state")
    clearInterval(playUpdate_interval)
  })
  .on("pointermove", (event, origin) => {
    const value_end = (event.pageX - range_rect.left) / range_rect.width
    const offset = value_end - value_start

    videoPlayer_node.currentTime = value_end * videoDuration

    if (origin.target === range_startHandle_node) {
      loop_start = Math.min(Math.max(offset_start + offset, 0), loop_end)
      range_node.style.setProperty("--start", loop_start)
      startTime_indicator_node.innerHTML = msToTime(Math.max(loop_start, 0) * videoDuration)
    }
    else if (origin.target === range_endHandle_node) {
      loop_end = Math.max(Math.min(offset_start + offset, 1), loop_start)
      range_node.style.setProperty("--end", loop_end)
      endTime_indicator_node.innerText = msToTime(Math.min(loop_end, 1) * videoDuration)
    }
  })
  .on("pointerup", () => {
    window.localStorage.setItem("loop_start", loop_start)
    window.localStorage.setItem("loop_end", loop_end)
  })

function msToTime (duration) {
  let seconds = Math.floor(duration % 60)
  let minutes = Math.floor(duration / 60)

  return minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0")
}

range_node.addEventListener("pointerdown", rangePointer.dispatch)

const videoPlayer_node = document.querySelector("#video_player")
let videoDuration = null

videoPlayer_node.addEventListener("loadeddata", () => {
  videoDuration = videoPlayer_node.duration
  endTime_indicator_node.innerText = msToTime(videoDuration)
})


const playButton_node = document.querySelector("#play-button")
let playUpdate_interval = null

playButton_node.addEventListener("click", () => {
  if (videoPlayer_node.paused) {
    videoPlayer_node.play()
    playButton_node.classList.remove("play-state")
    playButton_node.classList.add("pause-state")

    playUpdate_interval = setInterval(() => {
      startTime_indicator_node.innerText = msToTime(videoPlayer_node.currentTime)

      if (videoPlayer_node.currentTime / videoDuration < loop_start)
        videoPlayer_node.currentTime = loop_start * videoDuration
      else if (videoPlayer_node.currentTime / videoDuration >= loop_end)
        videoPlayer_node.currentTime = loop_start * videoDuration
    }, 100)
  }
  else {
    videoPlayer_node.pause()
    playButton_node.classList.add("play-state")
    playButton_node.classList.remove("pause-state")
    clearInterval(playUpdate_interval)
  }
})
