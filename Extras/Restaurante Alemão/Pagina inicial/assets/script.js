const slidesTamanho = document.querySelector("#slide-wrapper")
let slideItems = document.querySelectorAll('.slide-item')
const slideLista = document.querySelector('#slide-list')
const nextButton = document.querySelector('#next-slide')
const prevButton = document.querySelector('#previous-slide')
let slideInterval


const state = {
    startingPoint: 0,
    savedPosition: 0,
    currentPoint: 0,
    moviment: 0,
    currentSlideIndex: 0,
    autoPlay: true,
    timeInterval: 0
}

function translateSlide({position}){
    state.savedPosition = position
    slideLista.style.transform = `translateX(${position}px)`
}

function getCenterPosition({ index }){
    const slideItem = slideItems[index]
    const slideWidth = slideItem.clientWidth
    const windowWidth = window.innerWidth
    const margin = (windowWidth - slideWidth) / 2
    const position = (index * slideWidth) - margin
    return position
}

function setVisibleSlide({index, animate}){
    if(index === 0 || index === slideItems.length - 1){
        index = state.currentSlideIndex
    }
    const position = getCenterPosition({index}) //Quando o valor da propriedade da função é o mesmo da outra, coloque um só que funciona para os dois. Ex: se tiver ({index: index}) substitua por ({index})
    state.currentSlideIndex = index
    slideLista.style.transition = animate ? "transform .5s" : "none"
    translateSlide({position: -position})
          
}

function nextSlide(){
    setVisibleSlide({index: state.currentSlideIndex + 1, animate: true})
}

function previousSlide(){
    setVisibleSlide({index: state.currentSlideIndex - 1, animate: true})
}

function createSlideClones(){
    const firstSlide = slideItems[0].cloneNode(true)
    firstSlide.classList.add("slide-cloned")
    const secondSlide = slideItems[1].cloneNode(true)
    secondSlide.classList.add("slide-cloned")
    const lastSlide = slideItems[slideItems.length - 1].cloneNode(true)
    lastSlide.classList.add("slide-cloned")
    const penultimateSlide = slideItems[slideItems.length - 2].cloneNode(true)
    penultimateSlide.classList.add("slide-cloned")
    slideLista.appendChild(firstSlide)
    slideLista.appendChild(secondSlide)
    slideLista.prepend(lastSlide)
    slideLista.prepend(penultimateSlide)

    slideItems = document.querySelectorAll('.slide-item')
}

function onMouseDown(event, index){
    const slideItem = event.currentTarget
    state.startingPoint = event.clientX
    state.currentPoint = event.clientX - state.savedPosition
    slideItem.addEventListener('mousemove', onMouseMove)
    state.currentSlideIndex = index
    slideLista.style.transition = "none" // A cada píxel que você arrasta o transition é chamado. Por isso coloque em none quando arrastar.
    
}

function onMouseMove(event){
    state.moviment = event.clientX - state.startingPoint
    const position = event.clientX - state.currentPoint
    translateSlide({position: position})
}

function onMouseUp(event){
    const pointsToMove = event.type.includes("touch") ? 50: 150
    //console.log(event.type)
    const slideItem = event.currentTarget
    const slideWidth = slideItem.clientWidth
    //console.log(slideWidth)
    if(state.moviment < -pointsToMove){
        nextSlide()
    } else if(state.moviment > pointsToMove){
        previousSlide()
    } else{
        setVisibleSlide({index: state.currentSlideIndex, animate: true})
    }
    
    slideItem.removeEventListener('mousemove', onMouseMove)
    console.log('Soltei o botão do mouse')
}

function onTouchStart(event, index){
    event.clientX = event.touches[0].clientX
    onMouseDown(event, index)
    const slideItem = event.currentTarget
    slideItem.addEventListener('touchmove', onTouchMove)
}

function onTouchMove(event){
    event.clientX = event.touches[0].clientX
    onMouseMove(event)
}

function onTouchEnd(event){
    onMouseUp(event)
    const slideItem = event.currentTarget
    slideItem.removeEventListener('touchmove', onTouchMove)
}

function onSlideListTransitionEnd(){
    const slideItem = slideItems[state.currentSlideIndex]
    if(slideItem.classList.contains("slide-cloned") && state.currentSlideIndex === slideItems.length - 2){
        setVisibleSlide({index: 2, animate: false})
    }
    if(slideItem.classList.contains("slide-cloned") && state.currentSlideIndex === 1){
        setVisibleSlide({index: slideItems.length - 3, animate: false})
    }
}

function setAutoPlay(){
    if(state.autoPlay){
        slideInterval = setInterval(function(){
            setVisibleSlide({index: state.currentSlideIndex + 1, animate: true})
        }, state.timeInterval)
    }
}


function setListeners(){
    slideItems.forEach(function(slideItem, index){
        slideItem.addEventListener("dragstart", function(event){
            event.preventDefault()
        })
        slideItem.addEventListener('mousedown', function(event){
            onMouseDown(event, index)
        })
        slideItem.addEventListener('mouseup', onMouseUp)
        slideItem.addEventListener('touchstart', function(event){
            onTouchStart(event, index)
        })
        slideItem.addEventListener('touchend', onTouchEnd)
        
    })

    nextButton.addEventListener("click", nextSlide)
    prevButton.addEventListener("click", previousSlide)
    slideLista.addEventListener("transitionend", onSlideListTransitionEnd)
    slidesTamanho.addEventListener("mouseenter", function(){
        clearInterval(slideInterval)
    })
    slidesTamanho.addEventListener("mouseleave", function(){
        setAutoPlay()
    })
    let resizeTimeout
    window.addEventListener("resize", function(){
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(function(){
            setVisibleSlide({index: state.currentSlideIndex, animate: true})
        },1000)
        
    })
}

function initSlider({startAtIndex = 0, autoPlay = true, timeInterval = 3000}){
    state.autoPlay = autoPlay
    state.timeInterval = timeInterval
    createSlideClones()
    setListeners()
    setVisibleSlide({ index: startAtIndex + 2, animate: true})
    setAutoPlay()
}


