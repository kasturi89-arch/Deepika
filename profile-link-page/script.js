(() => {
    "use strict";

    const profiles = [
        {
            image: "assets/profiles/profile1.jpg",
            name: "Pavithra",
            bio: "Living, Laughing & Loving Life ✨",
            place: "Kerala",
            age: 27,
            status: "Single"
        },

        {
            image: "assets/profiles/profile2.jpg",
            name: "Kasturi",
            bio: "I'm Hotter than your ex 💋",
            place: "Ooty",
            age: 31,
            status: "Married"
        },

        {
            image: "assets/profiles/profile3.jpg",
            name: "Keerthana",
            bio: "Making Every Moment Beautiful 🌸",
            place: "Pondy",
            age: 27,
            status: "Single"
        },

        {
            image: "assets/profiles/profile4.jpg",
            name: "Mohana",
            bio: "Life Is Better With A Smile 💫",
            place: "Goa",
            age: 30,
            status: "Married"
        },

        {
            image: "assets/profiles/profile5.jpg",
            name: "Preethi",
            bio: "Sweet but savage ✨",
            place: "Delhi",
            age: 29,
            status: "Single"
        }
    ];

    const TRANSITION_DURATION = 320;
    const SWIPE_THRESHOLD = 50;

    let currentIndex = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchStartY = 0;


    /* =========================================================
       INITIALIZE
       ========================================================= */

    function initializeProfilePage() {

        const profileImage =
            document.getElementById("profileImage");

        const profileName =
            document.getElementById("profileName");

        const profileBio =
            document.getElementById("profileBio");

        const profilePlace =
            document.getElementById("profilePlace");

        const profileAge =
            document.getElementById("profileAge");

        const profileStatus =
            document.getElementById("profileStatus");

        const profileContent =
            document.querySelector(".profile-content");

        const previousButton =
            document.getElementById("previousProfile");

        const nextButton =
            document.getElementById("nextProfile");

        const backgroundVideo =
            document.getElementById("backgroundVideo");


        if (
            !profileImage ||
            !profileName ||
            !profileBio ||
            !profilePlace ||
            !profileAge ||
            !profileStatus ||
            !profileContent ||
            !previousButton ||
            !nextButton
        ) {
            return;
        }


        preloadProfileImages();


        setupProfileNavigation(
            previousButton,
            nextButton,
            profileImage,
            profileName,
            profileBio,
            profilePlace,
            profileAge,
            profileStatus,
            profileContent
        );


        setupProfileSwipe(
            profileContent,
            profileImage,
            profileName,
            profileBio,
            profilePlace,
            profileAge,
            profileStatus,
            profileContent
        );


        setupKeyboardNavigation(
            profileImage,
            profileName,
            profileBio,
            profilePlace,
            profileAge,
            profileStatus,
            profileContent
        );


        setupBackgroundVideo(backgroundVideo);
    }


    /* =========================================================
       PRELOAD PROFILE IMAGES
       ========================================================= */

    function preloadProfileImages() {

        profiles.forEach((profile) => {

            const image = new Image();

            image.src = profile.image;

        });
    }


    /* =========================================================
       NEXT / PREVIOUS BUTTONS
       ========================================================= */

    function setupProfileNavigation(
        previousButton,
        nextButton,
        profileImage,
        profileName,
        profileBio,
        profilePlace,
        profileAge,
        profileStatus,
        profileContent
    ) {

        previousButton.addEventListener("click", () => {

            changeProfile(
                -1,
                profileImage,
                profileName,
                profileBio,
                profilePlace,
                profileAge,
                profileStatus,
                profileContent
            );

        });


        nextButton.addEventListener("click", () => {

            changeProfile(
                1,
                profileImage,
                profileName,
                profileBio,
                profilePlace,
                profileAge,
                profileStatus,
                profileContent
            );

        });

    }


    /* =========================================================
       KEYBOARD NAVIGATION
       ========================================================= */

    function setupKeyboardNavigation(
        profileImage,
        profileName,
        profileBio,
        profilePlace,
        profileAge,
        profileStatus,
        profileContent
    ) {

        document.addEventListener("keydown", (event) => {

            if (event.key === "ArrowRight") {

                event.preventDefault();

                changeProfile(
                    1,
                    profileImage,
                    profileName,
                    profileBio,
                    profilePlace,
                    profileAge,
                    profileStatus,
                    profileContent
                );

            }


            if (event.key === "ArrowLeft") {

                event.preventDefault();

                changeProfile(
                    -1,
                    profileImage,
                    profileName,
                    profileBio,
                    profilePlace,
                    profileAge,
                    profileStatus,
                    profileContent
                );

            }

        });

    }


    /* =========================================================
       SWIPE NAVIGATION
       ========================================================= */

    function setupProfileSwipe(
        profileArea,
        profileImage,
        profileName,
        profileBio,
        profilePlace,
        profileAge,
        profileStatus,
        profileContent
    ) {

        profileArea.addEventListener(
            "touchstart",
            (event) => {

                if (
                    !event.touches ||
                    event.touches.length !== 1
                ) {
                    return;
                }


                touchStartX =
                    event.touches[0].clientX;

                touchStartY =
                    event.touches[0].clientY;

            },
            { passive: true }
        );


        profileArea.addEventListener(
            "touchend",
            (event) => {

                if (
                    !event.changedTouches ||
                    event.changedTouches.length !== 1
                ) {
                    return;
                }


                const touchEndX =
                    event.changedTouches[0].clientX;

                const touchEndY =
                    event.changedTouches[0].clientY;


                const deltaX =
                    touchEndX - touchStartX;

                const deltaY =
                    touchEndY - touchStartY;


                if (
                    Math.abs(deltaX) < SWIPE_THRESHOLD ||
                    Math.abs(deltaX) <= Math.abs(deltaY)
                ) {
                    return;
                }


                if (deltaX < 0) {

                    changeProfile(
                        1,
                        profileImage,
                        profileName,
                        profileBio,
                        profilePlace,
                        profileAge,
                        profileStatus,
                        profileContent
                    );

                } else {

                    changeProfile(
                        -1,
                        profileImage,
                        profileName,
                        profileBio,
                        profilePlace,
                        profileAge,
                        profileStatus,
                        profileContent
                    );

                }


                touchStartX = 0;
                touchStartY = 0;

            },
            { passive: true }
        );

    }


    /* =========================================================
       CHANGE PROFILE
       ========================================================= */

    function changeProfile(
        direction,
        profileImage,
        profileName,
        profileBio,
        profilePlace,
        profileAge,
        profileStatus,
        profileContent
    ) {

        if (
            isAnimating ||
            profiles.length <= 1
        ) {
            return;
        }


        isAnimating = true;


        const nextIndex =
            getNextIndex(direction);


        profileContent.classList.remove(
            "profile-transition-in"
        );

        profileContent.classList.add(
            "profile-transition-out"
        );


        window.setTimeout(() => {

            updateProfileContent(
                nextIndex,
                profileImage,
                profileName,
                profileBio,
                profilePlace,
                profileAge,
                profileStatus
            );


            currentIndex = nextIndex;


            profileContent.classList.remove(
                "profile-transition-out"
            );

            profileContent.classList.add(
                "profile-transition-in"
            );


            window.setTimeout(() => {

                profileContent.classList.remove(
                    "profile-transition-in"
                );

                isAnimating = false;

            }, TRANSITION_DURATION);

        }, TRANSITION_DURATION);

    }


    /* =========================================================
       GET NEXT PROFILE INDEX
       ========================================================= */

    function getNextIndex(direction) {

        return (
            (currentIndex + direction + profiles.length) %
            profiles.length
        );

    }


    /* =========================================================
       UPDATE ALL PROFILE CONTENT
       ========================================================= */

    function updateProfileContent(
        index,
        profileImage,
        profileName,
        profileBio,
        profilePlace,
        profileAge,
        profileStatus
    ) {

        const profile = profiles[index];


        /* Profile image */

        profileImage.src =
            profile.image;

        profileImage.alt =
            `${profile.name} profile photo`;


        /* Name */

        profileName.textContent =
            profile.name;


        /* Bio */

        profileBio.textContent =
            profile.bio;


        /* Place */

        profilePlace.textContent =
            profile.place;


        /* Age */

        profileAge.textContent =
            profile.age;


        /* Status */

        profileStatus.textContent =
            profile.status;

    }


    /* =========================================================
       BACKGROUND VIDEO
       ========================================================= */

    function setupBackgroundVideo(video) {

        if (!video) {
            return;
        }


        const playVideo = () => {

            const playPromise =
                video.play();


            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {

                playPromise.catch(() => {});

            }

        };


        playVideo();

    }


    /* =========================================================
       START
       ========================================================= */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeProfilePage,
            {
                once: true
            }
        );

    } else {

        initializeProfilePage();

    }

})();