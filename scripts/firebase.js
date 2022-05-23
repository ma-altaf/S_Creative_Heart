import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import {
    initializeAppCheck,
    ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-check.js";
// get all the environment variables
import * as env from "./env.js";

const firebaseConfig = {
    apiKey: env.APIKEY,
    authDomain: env.AUTHDOMAIN,
    projectId: env.PROJECTID,
    storageBucket: env.STORAGEBUCKET,
    messagingSenderId: env.MESSAGINGSENDERID,
    appId: env.APPID,
};

const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(env.APP_CHECK_KEY),
    isTokenAutoRefreshEnabled: true,
});

const db = getFirestore(app);
let imagesLinksArray = [];

async function getDoc() {
    const ref = await collection(db, "imagesLinks");
    const snapshots = await getDocs(query(ref, orderBy("order")));
    snapshots.forEach((imageLinksDoc) => {
        const imageLinks = imageLinksDoc.data().links;
        imagesLinksArray.push(...imageLinks);
    });
    initialLoad(3);
}

getDoc();

const imageLink = (i) =>
    `${imagesLinksArray[imagesLinksArray.length - 1 - i]},dpr-auto,tr=w-${
        (isMobile ? 0.62 : 0.4) * (screenWidth + 100)
    }`;

// landing animation
const creativeText = document.getElementById("creativeText");
const heartText = document.getElementById("heartText");
const sLogo = document.getElementById("Slogo");
const scrollIndicator = document.getElementById("scrollIndicator");
const landingTimeLine = gsap.timeline();
const cover = document.getElementById("cover");
const coverLogo = cover.querySelector("#logo");

creativeText.innerHTML = breakWord(creativeText);
heartText.innerHTML = breakWord(heartText);

function landingAnimation() {
    landingTimeLine
        .to(cover, {
            height: "0%",
            ease: Expo.easeInOut,
            duration: 2.3,
        })
        .to(
            coverLogo,
            {
                duration: 2.3,
                scale: 2.3,
                ease: Expo.easeInOut,
            },
            "-=100%"
        )
        .call(scrollLockToggle)
        .from(
            sLogo,
            {
                scale: isMobile ? 0 : 1,
                rotateZ: "50%",
                y: "100vh",
                duration: 2.84,
                ease: Expo.easeOut,
            },
            "-=40%"
        )
        .fromTo(
            creativeText.querySelectorAll("p"),
            {
                y: "100%",
            },
            {
                y: 0,
                duration: 2,
                ease: Expo.easeOut,
                stagger: 0.12,
                delay: 0.25,
            },
            "-=100%"
        )
        .fromTo(
            heartText.querySelectorAll("p"),
            {
                y: "100%",
            },
            {
                y: 0,
                duration: 2.06,
                ease: Expo.easeOut,
                stagger: 0.12,
            },
            "-=90%"
        );

    gsap.timeline({ delay: 3, repeatDelay: 0.1, repeat: Infinity })
        .from(scrollIndicator, {
            height: 0,
            duration: 2,
            ease: Circ.easeOut,
        })
        .to(
            scrollIndicator,
            {
                y: "9vh",
                duration: 1.5,
                ease: Circ.easeOut,
            },
            "-=80%"
        )
        .to(
            scrollIndicator,
            {
                height: 0,
                duration: 1.5,
                ease: Circ.easeOut,
            },
            "-=100%"
        )
        .set(scrollIndicator, {
            y: 0,
        });

    gsap.to(heartText, {
        y: "-50%",
        scrollTrigger: {
            trigger: heartText,
            scrub: true,
        },
    });
}

const prevWorksSect = document.getElementById("prevWorks");
const progressBar = cover.querySelector("#progressBar");
let wasLast = false;
let fetchImgIndex = 0;
let imageIndex = 0;

function initialLoad(numImg) {
    gsap.set(progressBar, {
        width: `100%`,
    });
    const preload = new createjs.LoadQueue();
    preload.on("progress", (event) => {
        updateProgressBar(event.progress);
    });
    preload.on("fileload", (event) => {
        addImageToDOM(event);
    });
    preload.on("error", () => {
        console.log("image not found");
    });
    for (let i = 0; i < numImg; i++) {
        let source = imageLink(i);
        preload.loadFile({ src: source, type: createjs.Types.IMAGE }, false);
    }
    preload.load();
    fetchImgIndex = numImg;
}

function updateProgressBar(progress) {
    const loadTimeline = gsap.timeline();
    loadTimeline.to(progressBar, {
        scaleX: `${Math.round(progress * 100)}%`,
        duration: 0.4,
        ease: Circ.easeOut,
    });

    if (progress == 1) {
        loadTimeline
            .to(progressBar, {
                transformOrigin: "right",
                scaleX: 0,
                duration: 0.8,
                ease: Circ.easeInOut,
            })
            .call(landingAnimation);
    }
}

function requestImages(numImg) {
    for (let i = fetchImgIndex; i < fetchImgIndex + numImg; i++) {
        if (imagesLinksArray.length > i) {
            makeImage(imageLink(i));
        } else {
            wasLast = true;
        }
    }

    fetchImgIndex += numImg;
}

function makeImage(source) {
    const image = new Image();
    image.src = source;
    image.alt = source.index;
    image.onload = () => {
        const event = {
            result: image,
            item: {
                src: source,
            },
        };
        addImageToDOM(event);
    };
    image.onerror = () => {
        wasLast = true;
    };
    wasLast &&
        console.log("%cThank you for viewing my works!", `color: #68a396;`);
}

function addImageToDOM(event) {
    const imageSect = document.createElement("section");
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("imageContainer");

    imageContainer.appendChild(event.result);
    imageSect.appendChild(imageContainer);
    prevWorksSect.appendChild(imageSect);

    addImgAnimations(imageContainer, event.result, imageIndex, event.item.src);
    imageIndex++;
}

function addImgAnimations(container, image, i, source) {
    !isMobile && bodyScrollBar.update();
    ScrollTrigger.refresh();
    gsap.fromTo(
        image,
        {
            y: "-5%",
        },
        {
            scrollTrigger: {
                trigger: container,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
            y: "5%",
        }
    );

    // TODO
    gsap.set(container, {
        clipPath:
            i % 2 == 0
                ? "polygon(4.9% 5%, 5% 5%, 5% 95%, 5% 95%)"
                : "polygon(94.9% 5%, 95% 5%, 95% 95%, 95% 95%)",
    });

    let observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                gsap.timeline()
                    .to(container, {
                        clipPath: "polygon(5% 5%, 95% 5%, 95% 95%, 5% 95%)",
                        duration: 1,
                        ease: Circ.easeInOut,
                    })
                    .fromTo(
                        image,
                        {
                            scale: 3,
                        },
                        {
                            scale: 1,
                            duration: 1,
                            ease: Circ.easeOut,
                        },
                        "-=1"
                    )
                    .call(addImgHover, [container, image, source]);

                if (!wasLast && i % 2 == 0) {
                    requestImages(2);
                }

                observer.disconnect();
            }
        });
    });
    observer.observe(container);
}

function addImgHover(container, image, source) {
    container.addEventListener("click", () => {
        toggleImgView(source);
    });
    container.addEventListener("mouseenter", () => {
        gsap.timeline()
            .to(container, {
                clipPath: "polygon(7% 7%, 93% 7%, 93% 93%, 7% 93%)",
            })
            .to(
                image,
                {
                    scale: 1.05,
                },
                "-=100%"
            );
    });
    container.addEventListener("mouseleave", () => {
        gsap.timeline()
            .to(container, {
                clipPath: "polygon(5% 5%, 95% 5%, 95% 95%, 5% 95%)",
            })
            .to(
                image,
                {
                    scale: 1,
                },
                "-=100%"
            );
    });
}
