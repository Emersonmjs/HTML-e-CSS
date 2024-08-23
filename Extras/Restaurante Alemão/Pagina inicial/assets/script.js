const slideList = document.querySelector("#slide-list")
const slideItems = document.querySelectorAll(".slide-item")
const previousSlideButton = document.querySelector("#previous-slide")
const nextSlideButton = document.querySelector("#next-slide")


const state = {
    inicialPoint: 0,
    currentPosition: 0,
    savedPosition: 0,
    isMouseDown: false,
    posicaoPagina: 0,
    indexAtual: 0,
    moviment: 0
}


function translateSlide(position){
    state.savedPosition = position
    slideList.style.transform = `translateX(${position}px)`
}


function setVisibleSlide(index, animate){
    const position = centerVisibleSlide(index = index)
    state.indexAtual = index
    slideList.style.transition = animate === true ? "transition: .5s" : "none"
    translateSlide(position)
}

function centerVisibleSlide(index){
    const slideItem = slideItems[index]
    const slideTamanho = slideItem.clientWidth
    const windowWidth = document.body.offsetWidth
    const margin = (windowWidth - slideTamanho) / 2
    const position = margin - (index * slideTamanho)
    return position
}

// function createClonedSlides(){
//     const slideItem = slideItems[0].cloneNode()

// }

function nextSlide(){
    setVisibleSlide(state.indexAtual + 1, true)
}

function previousSlide(){
    setVisibleSlide(state.indexAtual - 1, true)
}

function mouseDown(event, index){
    const item =  event.currentTarget
    state.inicialPoint = event.clientX
    state.currentPosition = state.inicialPoint - state.savedPosition
    state.indexAtual = index
    item.addEventListener("mouseout", (parte)=>{
        if(parte.buttons === 1){
            console.log("Botão saiu pressionado")
            state.inicialPoint = parte.clientX
            window.addEventListener("mousemove", (event)=>{
                if(event.buttons === 1){
                    mouseMove(event)
                    state.isMouseDown = true
                }else{
                    console.log("soltei")
                    item.removeEventListener("mousemove", mouseMove)
                    state.isMouseDown = false
                }
            })
        }
    })
    slideList.style.transition = "none"
    item.addEventListener("mousemove", mouseMove)

    console.log(state.inicialPoint)
}


function mouseMove(event){
    const position = event.clientX - state.currentPosition
    state.moviment = event.clientX - state.inicialPoint
    translateSlide(position)
}

function mouseUp(event){
    const slideItem = event.currentTarget
    const slideWidth = slideItem.clientWidth
    if(state.moviment < - 150){
        nextSlide()
    }
    if(state.moviment > 150){
        previousSlide()
    }else{
        setVisibleSlide(state.indexAtual, true)
    }
    
    slideItem.removeEventListener("mousemove", mouseMove)
}

function onSlideListTransitionEnd(){
    
    if(state.indexAtual === slideItems.length - 2){
        console.log(state.indexAtual)
        setVisibleSlide(2, false)
    }
    if(state.indexAtual ===  1){
        console.log(state.indexAtual)
        setVisibleSlide(slideItems.length - 3, false)
    }
}

slideItems.forEach((item, index)=>{
    item.addEventListener("dragstart", (event)=>{
        event.preventDefault()
    })

    item.addEventListener("mouseup", mouseUp)

    item.addEventListener("mousedown", (event)=>{
        mouseDown(event, index)
    })
    
})

nextSlideButton.addEventListener("click", nextSlide)
previousSlideButton.addEventListener("click", previousSlide)

slideList.addEventListener("transitionend", onSlideListTransitionEnd)


setVisibleSlide(index = 2, true)