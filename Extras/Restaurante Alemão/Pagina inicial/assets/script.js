const slidesTamanho = document.querySelector("#slide-wrapper")
const slideTamanhoPopular = document.querySelector("#slide-wrapper-popular")
let slideItems = document.querySelectorAll('.slide-item')
let slideItemsPopular = document.querySelectorAll('.slide-item-popular')
const slideLista = document.querySelector('#slide-list')
const slideListaPopular = document.querySelector('#slide-list-popular')
const nextButton = document.querySelector('#next-slide')
const prevButton = document.querySelector('#previous-slide')
let slideInterval



const statePrincipal = {
    startingPoint: 0,
    savedPosition: 0,
    currentPoint: 0,
    moviment: 0,
    currentSlideIndex: 0,
    autoPlay: true,
    timeInterval: 0
}

const statePopular = {
    startingPoint: 0,
    savedPosition: 0,
    currentPoint: 0,
    moviment: 0,
    currentSlideIndex: 0,
    autoPlay: true,
    timeInterval: 0
}

function translateSlide({position, state, lista}){
    state.savedPosition = position; // Mudei para usar o `state` passado por parâmetro
    lista.style.transform = `translateX(${position}px)`; // Mudei para usar o `lista` passado por parâmetro
}


function getCenterPosition({ index, slideItemsArray }){
    const slideItem = slideItemsArray[index]; // Agora, usando o `slideItemsArray` passado como parâmetro
    const slideWidth = slideItem.clientWidth;
    const windowWidth = window.innerWidth;
    const margin = (windowWidth - slideWidth) / 2;
    const position = (index * slideWidth) - margin;
    return position;
}


function setVisibleSlide({index, animate, slideItemsArray, state, slideListaArray}){
    if(index === 0 || index === slideItemsArray.length - 1){
        index = state.currentSlideIndex;
    }
    const position = getCenterPosition({index, slideItemsArray}); // Passe `slideItemsArray` aqui
    state.currentSlideIndex = index;
    slideListaArray.style.transition = animate ? "transform .5s" : "none";
    translateSlide({position: -position, state, lista: slideListaArray}); // Atualize o translateSlide para usar o `state` e `lista` corretos
}


function nextSlide(state, slideItemsArray, slideListaArray){
    setVisibleSlide({index: state.currentSlideIndex + 1, animate: true, slideItemsArray, state, slideListaArray});
}

function previousSlide(state, slideItemsArray, slideListaArray){
    setVisibleSlide({index: state.currentSlideIndex - 1, animate: true, slideItemsArray, state, slideListaArray});
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
    statePrincipal.startingPoint = event.clientX
    statePrincipal.currentPoint = event.clientX - statePrincipal.savedPosition
    slideItem.addEventListener('mousemove', onMouseMove)
    statePrincipal.currentSlideIndex = index
    slideLista.style.transition = "none" // A cada píxel que você arrasta o transition é chamado. Por isso coloque em none quando arrastar.
    
}

function onMouseMove(event){
    statePrincipal.moviment = event.clientX - statePrincipal.startingPoint
    const position = event.clientX - statePrincipal.currentPoint
    translateSlide({position: position})
}

function onMouseUp(event){
    const pointsToMove = event.type.includes("touch") ? 30: 150
    //console.log(event.type)
    const slideItem = event.currentTarget
    const slideWidth = slideItem.clientWidth
    //console.log(slideWidth)
    if(statePrincipal.moviment < -pointsToMove){
        nextSlide(statePrincipal, slideItems, slideLista)
    } else if(statePrincipal.moviment > pointsToMove){
        previousSlide(statePrincipal, slideItems, slideLista)
    } else{
        setVisibleSlide({index: statePrincipal.currentSlideIndex, animate: true, slideItemsArray: slideItems, state: statePrincipal, slideListaArray: slideLista})
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
    const slideItem = slideItems[statePrincipal.currentSlideIndex]
    if(slideItem.classList.contains("slide-cloned") && statePrincipal.currentSlideIndex === slideItems.length - 2){
        setVisibleSlide({index: 2, animate: false, slideItemsArray: slideItems, state: statePrincipal, slideListaArray: slideLista})
    }
    if(slideItem.classList.contains("slide-cloned") && statePrincipal.currentSlideIndex === 1){
        setVisibleSlide({index: slideItems.length - 3, animate: false, slideItemsArray: slideItems, state: statePrincipal, slideListaArray: slideLista})
    }
}

function setAutoPlay(){
    if(statePrincipal.autoPlay){
        slideInterval = setInterval(function(){
            setVisibleSlide({index: statePrincipal.currentSlideIndex + 1, animate: true, slideItemsArray: slideItems, state: statePrincipal, slideListaArray: slideLista})
        }, statePrincipal.timeInterval)
    }
}


function setListeners(){
    slideItems.forEach(function(slideItem, index){
        slideItem.addEventListener("dragstart", function(event){
            event.preventDefault()
        })
        slideItem.addEventListener('mousedown', function(event){
            console.log(slideItem[0])
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
            setVisibleSlide({index: statePrincipal.currentSlideIndex, animate: true, slideItemsArray: slideItems, state: statePrincipal, slideListaArray: slideLista})
        },1000)
        
    })
}

function initSlider({startAtIndex = 0, autoPlay = true, timeInterval = 3000}){
    statePrincipal.autoPlay = autoPlay
    statePrincipal.timeInterval = timeInterval
    createSlideClones()
    setListeners()
    setVisibleSlide({ index: startAtIndex + 2, animate: true, slideItemsArray: slideItems, state: statePrincipal, slideListaArray: slideLista})
    setAutoPlay()
}


