const imageViewPage = document.getElementById("imageViewPage");
const imgViewContainer = document.getElementById("imgViewContainer");
const imageViewImg = imgViewContainer.querySelector("img");
const loadingText = document.getElementById("loadingText");
const imgViewCloseBtn = document.getElementById("imgViewCloseBtn");

let isImgViewOpen = false;

if (isMobile) {
    imgViewCloseBtn.classList.remove("material-icons");
    imgViewCloseBtn.classList.add("mobileClose");
    imgViewCloseBtn.innerText = "tap anywhere to close";
}

gsap.set(imgViewCloseBtn, {
    x: "150%",
});

// TODO
window.onpopstate = () => {
    isEnquireOpen && enquireView();
    isImgViewOpen && toggleImgView();
};
// TODO
function imgClose() {
    history.back();
    toggleImgView();
}

function toggleImgView(source) {
    // TODO
    if (!isImgViewOpen) {
        history.pushState({}, "", "");
    }

    scrollLockToggle();
    gsap.timeline()
        .set(loadingText, {
            opacity: 0,
        })
        .to(imageViewPage, {
            width: isImgViewOpen ? "0vw" : "100vw",
            duration: 1.5,
            ease: Expo.easeInOut,
        })
        .call(() => {
            getImgViewer(source);
        })
        .to(
            imgViewCloseBtn,
            {
                x: isImgViewOpen ? "150%" : "0",
                duration: 1.5,
                ease: Expo.easeInOut,
            },
            "-=80%"
        )
        .from(loadingText, {
            opacity: 1,
            duration: 0.5,
            delay: 0.3,
        });

    isImgViewOpen = !isImgViewOpen;
}

if (!isMobile) {
    imageViewPage.addEventListener("mousemove", (e) => {
        gsap.set(imgViewCloseBtn, {
            x: "-50%",
            y: "-50%",
            top: e.clientY,
            left: e.clientX,
        });
    });
}

function getImgViewer(source) {
    if (isImgViewOpen) {
        source = source.substr(0, source.lastIndexOf(","));
        imageViewImg.src = source;

        imageViewImg.onload = () => {
            gsap.from(imgViewContainer, {
                width: 0,
                ease: Circ.easeOut,
                duration: 1,
                delay: 0.2,
            });
            !isMobile && imgViewHover();
        };
    } else {
        imageViewImg.src = "";
        imgViewContainer.style.height = "auto";
        imgViewContainer.style.width = "auto";
    }
}

function imgViewHover() {
    const rect = imgViewContainer.getBoundingClientRect();
    const rectX = rect.left + rect.width / 2;
    const rectY = rect.top + rect.height / 2;

    imgViewContainer.addEventListener("mouseenter", () => {
        gsap.to(imageViewImg, {
            scale: 2,
            duration: 0.5,
        });
        gsap.to(imgViewCloseBtn, {
            scale: 0.7,
            duration: 0.3,
        });
    });
    imgViewContainer.addEventListener("mouseleave", () => {
        gsap.to(imageViewImg, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.5,
        });
        gsap.to(imgViewCloseBtn, {
            scale: 1.5,
            duration: 0.3,
        });
    });
    imgViewContainer.addEventListener("mousemove", (e) => {
        var x = e.clientX - rectX;
        var y = e.clientY - rectY;
        gsap.to(imageViewImg, {
            x: -x,
            y: -y,
        });
    });
}
