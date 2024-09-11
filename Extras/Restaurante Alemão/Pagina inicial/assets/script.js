const slidesTamanho = document.querySelector("#slide-wrapper")
const slideTamanhoPopular = document.querySelector("#slide-wrapper-popular")
let slideItems = document.querySelectorAll('.slide-item')
let slideItemsPopular = document.querySelectorAll('.slide-item-popular')
const slideLista = document.querySelector('#slide-list')
const slideListaPopular = document.querySelector('#slide-list-popular')
const nextButton = document.querySelector('#next-slide')
const prevButton = document.querySelector('#previous-slide')
let slideInterval


<<<<<<< HEAD

const statePrincipal = {
=======
const state = {
>>>>>>> parent of 14008e8 (Arrumaçao da mais populares)
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
    console.log(state.savedPosition)
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
    console.log(index)
    slideListaArray.style.transition = animate ? "transform .5s" : "none";
    translateSlide({position: -position, state, lista: slideListaArray}); // Atualize o translateSlide para usar o `state` e `lista` corretos
}


function nextSlide(state, slideItemsArray, slideListaArray){
    setVisibleSlide({index: state.currentSlideIndex + 1, animate: true, slideItemsArray, state, slideListaArray});
}

function previousSlide(state, slideItemsArray, slideListaArray){
    setVisibleSlide({index: state.currentSlideIndex - 1, animate: true, slideItemsArray, state, slideListaArray});
}

function createSlideClones({slideItemsArray, slideListaArray}){
    const firstSlide = slideItemsArray[0].cloneNode(true)
    firstSlide.classList.add("slide-cloned")
    const secondSlide = slideItemsArray[1].cloneNode(true)
    secondSlide.classList.add("slide-cloned")
    const lastSlide = slideItemsArray[slideItemsArray.length - 1].cloneNode(true)
    lastSlide.classList.add("slide-cloned")
    const penultimateSlide = slideItemsArray[slideItemsArray.length - 2].cloneNode(true)
    penultimateSlide.classList.add("slide-cloned")
    slideListaArray.appendChild(firstSlide)
    slideListaArray.appendChild(secondSlide)
    slideListaArray.prepend(lastSlide)
    slideListaArray.prepend(penultimateSlide)

    slideItemsArray = document.querySelectorAll('.slide-item')
}

function onMouseDown(event, index, state, slideListaArray){
    const slideItem = event.currentTarget
    state.startingPoint = event.clientX
    state.currentPoint = event.clientX - state.savedPosition
    slideItem.addEventListener('mousemove', function(event){
        onMouseMove(event, state)
    })
    state.currentSlideIndex = index
    slideListaArray.style.transition = "none" // A cada píxel que você arrasta o transition é chamado. Por isso coloque em none quando arrastar.
    
}

function onMouseMove(event, state, slideListaArray){
    state.moviment = event.clientX - state.startingPoint
    const position = event.clientX - state.currentPoint
    translateSlide({position: position, lista: slideListaArray})
}

<<<<<<< HEAD
function onMouseUp(event, state, slideItemsArray, slideListaArray){
    const pointsToMove = event.type.includes("touch") ? 30: 150
=======
function onMouseUp(event){
    const pointsToMove = event.type.includes("touch") ? 50: 150
>>>>>>> parent of 14008e8 (Arrumaçao da mais populares)
    //console.log(event.type)
    const slideItem = event.currentTarget
    const slideWidth = slideItem.clientWidth
    //console.log(slideWidth)
    if(state.moviment < -pointsToMove){
        nextSlide(state, slideItemsArray, slideListaArray)
    } else if(state.moviment > pointsToMove){
        previousSlide(state, slideItemsArray, slideListaArray)
    } else{
        setVisibleSlide({index: state.currentSlideIndex, animate: true, slideItemsArray, state, slideListaArray})
    }
    
    slideItem.removeEventListener('mousemove', onMouseMove)
    console.log('Soltei o botão do mouse')
}

function onTouchStart(event, index, state, slideItemsArray, slideListaArray){
    event.clientX = event.touches[0].clientX
    onMouseDown(event, index, state, slideItemsArray)
    const slideItem = event.currentTarget
    slideItem.addEventListener('touchmove', function(){
        onTouchMove(event, state, slideListaArray)
    })
}

function onTouchMove(event, state, slideListaArray){
    event.clientX = event.touches[0].clientX
    onMouseMove(event, state, slideListaArray)
}

function onTouchEnd(event, state, slideItemsArray, slideListaArray){
    onMouseUp(event, state, slideItemsArray, slideListaArray) //Continuar a partir daqui.
    const slideItem = event.currentTarget
    slideItem.removeEventListener('touchmove', onTouchMove)
}

function onSlideListTransitionEnd(state, slideItemsArray, slideListaArray){
    const slideItem = slideItemsArray[state.currentSlideIndex];
    if(slideItem.classList.contains("slide-cloned") && state.currentSlideIndex === slideItemsArray.length - 2){
        setVisibleSlide({index: 2, animate: false, slideItemsArray, state, slideListaArray});
    }
    if(slideItem.classList.contains("slide-cloned") && state.currentSlideIndex === 1){
        setVisibleSlide({index: slideItemsArray.length - 3, animate: false, slideItemsArray, state, slideListaArray});
    }
}


function setAutoPlay(){
    if(statePrincipal.autoPlay){
        slideInterval = setInterval(function(){
            setVisibleSlide({index: statePrincipal.currentSlideIndex + 1, animate: true, slideItemsArray: slideItems, state: statePrincipal, slideListaArray: slideLista})
        }, statePrincipal.timeInterval)
    }
}


function setListeners({slideItemsArray, slideListaArray, slideTamanhoGeral, state, nextBtn, prevBtn}){
    slideItemsArray.forEach(function(slideItem, index){
        slideItem.addEventListener("dragstart", function(event){
            event.preventDefault();
        });
        slideItem.addEventListener('mousedown', function(event){
            onMouseDown(event, index, state, slideListaArray);
        });
        slideItem.addEventListener('mouseup', function(event){
            onMouseUp(event, state, slideItemsArray, slideListaArray);
        });
        slideItem.addEventListener('touchstart', function(event){
            onTouchStart(event, index, state, slideListaArray);
        });
        slideItem.addEventListener('touchend', function(event){
            onTouchEnd(event, state, slideItemsArray, slideListaArray);
        });
    });

    // Adicione os listeners para os botões de navegação específicos de cada slider
    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", function(){
            nextSlide(state, slideItemsArray, slideListaArray);
        });
        prevBtn.addEventListener("click", function(){
            previousSlide(state, slideItemsArray, slideListaArray);
        });
    }

    slideListaArray.addEventListener("transitionend", function(){
        onSlideListTransitionEnd(state, slideItemsArray, slideListaArray);
    });

    slideTamanhoGeral.addEventListener("mouseenter", function(){
        clearInterval(slideInterval);
    });
    slideTamanhoGeral.addEventListener("mouseleave", function(){
        setAutoPlay(state, slideItemsArray, slideListaArray);
    });

    let resizeTimeout;
    window.addEventListener("resize", function(){
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function(){
            setVisibleSlide({index: state.currentSlideIndex, animate: true, slideItemsArray, state, slideListaArray});
        }, 1000);
    });
}


function initSliderPrincipal({startAtIndex = 0, autoPlay = true, timeInterval = 3000}){
    statePrincipal.autoPlay = autoPlay;
    statePrincipal.timeInterval = timeInterval;
    createSlideClones({slideItemsArray: slideItems, slideListaArray: slideLista});
    setListeners({
        slideItemsArray: slideItems,
        slideListaArray: slideLista,
        slideTamanhoGeral: slidesTamanho,
        state: statePrincipal,
        nextBtn: nextButton,  // Passando botões específicos
        prevBtn: prevButton
    });
    setVisibleSlide({ index: startAtIndex + 2, animate: true, slideItemsArray: slideItems, state: statePrincipal, slideListaArray: slideLista });
    setAutoPlay();
}

function initSliderSecundario({startAtIndex = 0}){
    createSlideClones({slideItemsArray: slideItemsPopular, slideListaArray: slideListaPopular});
    setListeners({
        slideItemsArray: slideItemsPopular,
        slideListaArray: slideListaPopular,
        slideTamanhoGeral: slideTamanhoPopular,
        state: statePopular,
        nextBtn: null,  // Se não houver botões de navegação para o secundário, passe null
        prevBtn: null
    });
    setVisibleSlide({ index: startAtIndex + 2, animate: true, slideItemsArray: slideItemsPopular, state: statePopular, slideListaArray: slideListaPopular });
}



