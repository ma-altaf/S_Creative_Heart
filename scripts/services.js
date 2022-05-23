const screenWidth = window.screen.width;
const isMobile = screenWidth < 768;

// plugin setup
gsap.registerPlugin(ScrollTrigger);
let bodyScrollBar;

function activateScrollBar() {
    if (!isMobile) {
        bodyScrollBar = Scrollbar.init(document.querySelector("main"), {
            damping: 0.07,
            delegateTo: document,
            syncCallbacks: true,
        });

        bodyScrollBar.setPosition(0, 0);
        bodyScrollBar.track.xAxis.element.remove();

        ScrollTrigger.scrollerProxy(document.body, {
            scrollTop(value) {
                if (arguments.length) {
                    bodyScrollBar.scrollTop = value;
                }
                return bodyScrollBar.scrollTop;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
        });

        bodyScrollBar.addListener(ScrollTrigger.update);
    }
}

activateScrollBar();
let scrollLockYOffset = 0;
let isScrollLock = false;

function scrollLockToggle() {
    scrollLockYOffset = isMobile ? window.scrollY : bodyScrollBar.offset.y;
    if (isScrollLock) {
        if (isMobile) {
            window.removeEventListener("scroll", scrollLock);
        } else {
            bodyScrollBar.removeListener(scrollLock);
        }
    } else {
        isMobile
            ? window.addEventListener("scroll", scrollLock)
            : bodyScrollBar.addListener(scrollLock);
    }
    isScrollLock = !isScrollLock;
}

// lock the screen initially for the preloader
scrollLockToggle();

function scrollLock() {
    isMobile
        ? scrollTo(0, scrollLockYOffset)
        : bodyScrollBar.scrollTo(0, scrollLockYOffset, 0);
}

function breakWord(textCont) {
    return textCont.textContent.replace(
        /\S/g,
        "<span class='letter'><p>$&</p></span>"
    );
}

function breakIntoLetter(textCont) {
    let result = "";
    let words = textCont.textContent.match(/\w+\W+/g);

    words.forEach((word) => {
        let letters = word.replace(
            /\S/g,
            "<span class='letter'><p>$&</p></span>"
        );
        result += `<span class='word'>${letters}&nbsp;</span>`;
    });

    return result;
}
