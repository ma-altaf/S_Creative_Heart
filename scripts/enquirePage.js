const enquirePage = document.getElementById("enquirePage");
const socialLinksSect = enquirePage.querySelector("#socialLinksSect");
const enquireCloseBtn = enquirePage.querySelector("#enquireCloseBtn");
const socialLinks = enquirePage.querySelectorAll("a");

socialLinks.forEach((link) => {
    link.innerHTML = breakWord(link);
    const linkLetters = link.querySelectorAll("p");
    link.addEventListener("mouseenter", () => {
        gsap.timeline()
            .to(linkLetters, {
                x: "100%",
                duration: 0.4,
                ease: Circ.easeIn,
            })
            .set(linkLetters, {
                x: "-100%",
            })
            .to(linkLetters, {
                x: 0,
                duration: 0.3,
                ease: Circ.easeOut,
            });
    });
});

let isEnquireOpen = false;

gsap.set(socialLinksSect, {
    x: "-100%",
});

gsap.set(enquireCloseBtn, {
    x: "150%",
});

// TODO
function enquireClose() {
    history.back();
    enquireView();
}

function enquireView() {
    // TODO
    if (!isEnquireOpen) {
        history.pushState({}, "", "");
    }

    scrollLockToggle();
    gsap.timeline()
        .to(enquirePage, {
            width: isEnquireOpen ? "0vw" : "100vw",
            duration: 1.7,
            ease: Expo.easeInOut,
        })
        .to(
            socialLinksSect,
            {
                x: isEnquireOpen ? "-100%" : 0,
                duration: 1.7,
                ease: Expo.easeInOut,
            },
            "-=100%"
        )
        .to(
            enquireCloseBtn,
            {
                x: isEnquireOpen ? "-150%" : 0,
                duration: 2,
                ease: Expo.easeInOut,
            },
            `-=80%`
        )
        .set(enquireCloseBtn, {
            x: isEnquireOpen ? "150%" : 0,
        });

    isEnquireOpen = !isEnquireOpen;
}
