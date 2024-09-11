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

