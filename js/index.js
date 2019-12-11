const KEY_ARROW_UP = 38;
const KEY_ARROW_DOWN = 40;
const KEY_ARROW_LEFT = 37;
const KEY_ARROW_RIGHT = 39;
const KEY_TAB = 9;
const arrowLeft = document.getElementById("arrow-left");
const arrowRight = document.getElementById("arrow-right");
const slideLinks = document.getElementsByClassName("slideLink");
const slides = document.getElementsByClassName("slides");
const topicContainer = document.getElementById("topic-container");
const slideShowContainer = document.getElementById("slide-show-container");
const sidebar = document.getElementById("sidebar");
const pageCounter = document.getElementById("page-counter");
const IMAGE_PATH = "./assets/slides/";

const SLIDE_TYPE = {
  Left: "left",
  Right: "right"
};

var slideIndex = 0;

(function() {
  init();
})();

function init() {
  loadDataAndBuildTemplate();
  showSlide(slideIndex);
  arrowLeft.onclick = leftArrowClick;
  arrowRight.onclick = rightArrowClick;
  document.onkeydown = keyDetection;
  initTopicTitlesClick();
  initSlideLinks();
}

function loadDataAndBuildTemplate() {
  buildTopicHTML();
}

function buildTopicHTML() {
  var template = document.getElementById("template-topic");
  var templateTopicHtml = template.innerHTML;
  if (data.length > 0) {
    for (let i = 0; i < data.length; ++i) {
      let topicHtml = templateTopicHtml.replace(
        /{{topicTitle}}/g,
        data[i].topic
      );
      topicContainer.innerHTML += buildSubTopicsHTML(data[i].slides, topicHtml);
    }
  }
}

function buildSubTopicsHTML(slides, topicHtml) {
  var template = document.getElementById("template-link");
  var templateLinkHtml = template.innerHTML;
  var linksHtml = "";
  for (let i = 0; i < slides.length; ++i) {
    linksHtml += templateLinkHtml.replace(/{{name}}/g, slides[i].name);
  }

  buildSlideImageHTML(slides);
  return topicHtml.replace(/{{links}}/g, linksHtml);
}

function buildSlideImageHTML(slides) {
  var template = document.getElementById("template-slide");
  var templateSlideImageHtml = template.innerHTML;
  var imagesHtml = "";
  var imageUrl = "";
  for (let i = 0; i < slides.length; ++i) {
    imageUrl = slides[i].image == "" ? "" : IMAGE_PATH + slides[i].image;

    var stepsHtml = buildStepsHTML(slides[i].steps);

    imagesHtml += templateSlideImageHtml
      .replace(/{{image}}/g, imageUrl)
      .replace(/{{steps}}/g, stepsHtml);
  }

  slideShowContainer.innerHTML += imagesHtml;
}

function buildStepsHTML(stepsArr) {
  var stepsHtml = "";
  if (stepsArr.length > 0) {
    for (let i = 0; i < stepsArr.length; ++i) {
      stepsHtml += "<li>" + stepsArr[i];
      ("</li>");
    }
  }
  return stepsHtml;
}

function leftArrowClick(e) {
  showSlide(--slideIndex, SLIDE_TYPE.Left);
}

function rightArrowClick(e) {
  showSlide(++slideIndex, SLIDE_TYPE.Right);
}

function keyDetection(e) {
  e = e || window.event;
  if (e.keyCode === KEY_ARROW_UP || e.keyCode === KEY_ARROW_LEFT) {
    arrowLeft.style.animation = "scaleDownLeft 0.3s";
    setTimeout(resetArrowsAnimation, 300);
    showSlide(--slideIndex, SLIDE_TYPE.Left);
  }

  if (e.keyCode === KEY_ARROW_DOWN || e.keyCode === KEY_ARROW_RIGHT) {
    arrowRight.style.animation = "scaleDownRight 0.3s";
    setTimeout(resetArrowsAnimation, 300);
    showSlide(++slideIndex, SLIDE_TYPE.Right);
  }

  if (e.keyCode === KEY_TAB) {
    e.preventDefault();
    sidebar.classList.toggle("sidebar-close");
  }
}

function showSlide(index, slideType = SLIDE_TYPE.Right) {
  boundCheck(index, 0, slides.length - 1);
  updateSlideIndicator(slideIndex);
  updateSlideAnimation(slideType);
  hide(slides);
  show(slides, slideIndex);
  updatePageCounter();
}

function hide(slides) {
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
}

function show(slides, index) {
  if (slides.length > 0) {
    slides[index].style.display = "block";
    slides[index].style.position = "absolute";
  }
}

function updatePageCounter() {
  pageCounter.innerHTML =
    "<p>" + (slideIndex + 1) + "/" + slides.length + "</p>";
}

function boundCheck(index, lowBound, highBound) {
  if (index > highBound) {
    slideIndex = lowBound;
  }
  if (index < lowBound) {
    slideIndex = highBound;
  }
  return slideIndex;
}

function updateSlideIndicator(index) {
  var slideLinks = document.getElementsByClassName("slideLink");
  if (slideLinks.length > 0) {
    for (let i = 0; i < slideLinks.length; ++i) {
      slideLinks[i].classList.remove("active-slide-indicator");
    }
    slideLinks[index].classList.add("active-slide-indicator");
  }
}

function resetArrowsAnimation() {
  (arrowLeft.style.animation = ""), (arrowRight.style.animation = "");
}

function updateSlideAnimation(slideType) {
  var slideImages = document.getElementsByClassName("slide-image");
  if (slideImages.length > 0) {
    if (slideType === SLIDE_TYPE.Right) {
      slideImages[slideIndex].classList.remove("slide-image-right");
      slideImages[slideIndex].classList.add("slide-image-left");
    } else {
      slideImages[slideIndex].classList.remove("slide-image-left");
      slideImages[slideIndex].classList.add("slide-image-right");
    }
  }
}

function initTopicTitlesClick() {
  var topicTitles = document.getElementsByClassName("topic-title");
  if (topicTitles.length > 0) {
    for (let i = 0; i < topicTitles.length; ++i) {
      topicTitles[i].onclick = debounce(handleTopicTitlesClick, 250, true);
    }
  }
}

function handleTopicTitlesClick(e) {
  e.target.classList.toggle("open");
  var subTopics = e.target.nextElementSibling;
  if (subTopics.style.maxHeight) {
    subTopics.style.maxHeight = null;
  } else {
    subTopics.style.maxHeight = subTopics.scrollHeight + "px";
  }
}

function initSlideLinks() {
  for (let i = 0; i < slideLinks.length; ++i) {
    slideLinks[i].index = i;
    slideLinks[i].onclick = handleSlideLinkClick;
  }
}

function handleSlideLinkClick(e) {
  for (let i = 0; i < slideLinks.length; ++i) {
    slideLinks[i].classList.remove("active-slide-indicator");
  }
  e.target.classList.add("active-slide-indicator");
  var beforeIndex = slideIndex;
  slideIndex = e.target.index;

  if (beforeIndex < slideIndex) {
    showSlide(slideIndex);
  } else {
    showSlide(slideIndex, SLIDE_TYPE.Right);
  }
}

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
