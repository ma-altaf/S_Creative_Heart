const aboutSect = document.querySelector("#about");
const aboutText = aboutSect.querySelector("#paragraph");
const previousText = document.querySelector("#prevWorkText #previous");
const workText = document.querySelector("#prevWorkText #work");
const notice = document.getElementById("notice");
const agreementLocalStorage = localStorage.getItem("noticeAgreement");

if (agreementLocalStorage == "agree") {
    notice.style.display = "none";
}

function agreeNotice() {
    localStorage.setItem("noticeAgreement", "agree");
    gsap.timeline()
        .to(notice, {
            opacity: 0,
            duration: 0.3,
        })
        .set(notice, {
            display: "none",
        });
}

aboutText.innerHTML = breakIntoLetter(aboutText);
gsap.from(aboutText.querySelectorAll("p"), {
    y: "100%",
    stagger: 0.01,
    duration: 0.435,
    ease: Circ.easeOut,
    scrollTrigger: {
        trigger: aboutText,
        start: `top ${isMobile ? 90 : 80}%`,
    },
});

// previous work text animation
previousText.innerHTML = breakWord(previousText);
workText.innerHTML = breakWord(workText);
gsap.from(previousText.querySelectorAll("p"), {
    y: "100%",
    stagger: 0.1,
    duration: 1.5,
    ease: Expo.easeOut,
    scrollTrigger: {
        trigger: previousText,
        start: `top ${isMobile ? 90 : 70}%`,
    },
});
gsap.from(workText.querySelectorAll("p"), {
    y: "100%",
    stagger: 0.1,
    duration: 1.7,
    ease: Expo.easeOut,
    scrollTrigger: {
        trigger: previousText,
        start: `top ${isMobile ? 90 : 70}%`,
    },
    delay: 0.1,
});

gsap.fromTo(
    workText,
    { y: "35%" },
    {
        y: "-5%",
        scrollTrigger: {
            trigger: previousText,
            start: "top bottom",
            scrub: true,
        },
    }
);
