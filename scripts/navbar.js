const navLogo = document.getElementById("navLogo");
const navEnquire = document.getElementById("enquire");

navLogo.innerHTML = breakWord(navLogo);
navEnquire.innerHTML = breakWord(navEnquire);
const underline = document.createElement("div");
underline.classList.add("underline");
navEnquire.appendChild(underline);
let navVisible = false;

if (!isMobile) {
    navLogo.onclick = () => {
        bodyScrollBar.scrollTo(0, 0, 1000);
    };
    bodyScrollBar.addListener(({ offset }) => {
        if (navVisible ? offset.y <= 350 : offset.y >= 350) {
            setNavbar();
        }
    });
} else {
    navLogo.onclick = () => {
        window.scrollTo(0, 0);
    };
    document.addEventListener("scroll", () => {
        if (navVisible ? window.scrollY <= 350 : window.scrollY >= 350) {
            setNavbar();
        }
    });
}

gsap.set(navbar, {
    display: "none",
});
gsap.set(navLogo.querySelectorAll("p"), {
    x: "-100%",
});
gsap.set(navEnquire.querySelectorAll("p"), {
    x: "-100%",
});

function setNavbar() {
    let direction = navVisible ? "-100" : 0;
    gsap.timeline()
        .set(navbar, {
            display: "flex",
        })
        .to(navLogo.querySelectorAll("p"), {
            x: direction,
            duration: 0.8,
            ease: navVisible ? Circ.easeIn : Circ.easeOut,
        })
        .to(
            navEnquire.querySelectorAll("p"),
            {
                x: direction,
                duration: 0.8,
                ease: navVisible ? Circ.easeIn : Circ.easeOut,
            },
            "-=100%"
        )
        .to(
            underline,
            {
                width: navVisible ? 0 : "108%",
                duration: 0.4,
                ease: Circ.easeOut,
            },
            "-=100%"
        )
        .set(navbar, {
            display: navVisible ? "none" : "flex",
        });
    navVisible = !navVisible;
}

navEnquire.onmouseenter = () => {
    gsap.to(underline, {
        y: "-0.9em",
        height: "0.7em",
        opacity: 0.7,
    });
};

navEnquire.onmouseleave = () => {
    gsap.to(underline, {
        y: "-0.3em",
        height: 2,
        opacity: 1,
    });
};
