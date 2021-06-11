const communityName_node = document.querySelector("#community-name")

let communityName = null

document.addEventListener("DOMContentLoaded", () => {
    communityName = sessionStorage.getItem("community-name")

    if (!communityName) {
        communityName_node.focus()
        window.getSelection().selectAllChildren(communityName_node)
    }
    else {
        communityName_node.removeAttribute("contenteditable")
        communityName_node.innerText = communityName
        communityButton_node.querySelector(".communitie-button-label").innerText = communityName
        communityButton_node.querySelector(".communitie-button-image").setAttribute("alt", communityName)
    }
})

communityName_node.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      communityName_node.blur()
      postText_node.focus()
      communityName_node.removeAttribute("contenteditable")
    }
})
communityName_node.addEventListener("blur", (event) => {
    communityName_node.removeAttribute("contenteditable")
})

const communityButton_node = document.querySelector("#new_community-button")

communityName_node.addEventListener("input", () => {
    communityName = communityName_node.innerText

    sessionStorage.setItem("community-name", communityName)

    communityButton_node.querySelector(".communitie-button-label").innerText = communityName
    communityButton_node.querySelector(".communitie-button-image").setAttribute("alt", communityName)
})

const postText_node = document.querySelector("#comunity-post-text")

postText_node.addEventListener("focus", ({target}) => {
    if (postText_node.classList.contains("placeholder")) {
        postText_node.classList.remove("placeholder")
        postText_node.innerText = ""
    }
})
postText_node.addEventListener("blur", () => {
    if (postText_node.innerText === "") {
        postText_node.classList.add("placeholder")
        postText_node.innerText = "O que está acontecendo?"
    }
})


const publishButton_node = document.querySelector("#publish-button")

let communityPosts = []

document.addEventListener("DOMContentLoaded", () => {
    const sessionPosts = sessionStorage.getItem("community-posts")

    if (sessionPosts)
        communityPosts = sessionPosts.split("☻")
    else
        sessionStorage.setItem("community-posts", communityPosts)

    if (communityPosts.length)
        for (let post of communityPosts)
            createPost(post)
})

publishButton_node.addEventListener("click", () => {
    const text = postText_node.innerText

    if (text) {
        createPost(text)
        communityPosts.push(text)
        sessionStorage.setItem("community-posts", communityPosts.join("☻"))
        
        postText_node.innerText = ""
    }
})


const postTemplate_node = document.querySelector("#community-posts-template")

function createPost (text) {
    const post_node = postTemplate_node.content.cloneNode(true)
    const text_node = document.createTextNode(text)

    post_node.querySelector(".comunity-post-article p").appendChild(text_node)
    post_node.querySelector(".comunity-post-article .community-post-name").innerText = communityName

    postTemplate_node.parentNode.insertBefore(post_node, postTemplate_node.nextElementSibling)
}


const invitePeople_node = document.querySelector("#invite-people")

invitePeople_node.addEventListener("click", (event) => {
    event.preventDefault()

    navigator.share({
        url: "https://pcliquet.github.io/Tik_Tv/comunidades/nova-comunidade/",
        title: "Convite para fazer parte da tik.tv",
        text: "Venha conhecer essa comunidade incível no tik.tv!\nhttps://pcliquet.github.io/Tik_Tv/comunidades/nova-comunidade/"
    })
})
