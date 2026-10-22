
/* =================================
   1. SELECT HTML ELEMENTS
================================= */

const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const formMessage = document.getElementById("formMessage");

const introScreen = document.getElementById("introScreen");
const introLoaderBar = document.getElementById("introLoaderBar");
const skipIntro = document.getElementById("skipIntro");


/* =================================
   2. OPENING ANIMATION
================================= */

let introTimer;

function closeIntro() {
    if (!introScreen || introScreen.classList.contains("intro-hidden")) {
        return;
    }

    clearTimeout(introTimer);

    introScreen.classList.add("intro-hidden");

    // Remove the intro after its fade-out animation.
    setTimeout(function () {
        introScreen.remove();
    }, 850);
}

function startIntro() {
    if (!introScreen) {
        return;
    }

    // Start the loading bar animation.
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            if (introLoaderBar) {
                introLoaderBar.style.width = "100%";
            }
        });
    });

    // Automatically show the login page.
    introTimer = setTimeout(closeIntro, 3000);
}

// Start the intro when the page loads.
startIntro();

// Allow visitors to skip the animation.
if (skipIntro) {
    skipIntro.addEventListener("click", closeIntro);
}


/* =================================
   3. SHOW / HIDE PASSWORD
================================= */

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
        const isPasswordHidden = passwordInput.type === "password";

        passwordInput.type = isPasswordHidden ? "text" : "password";

        togglePassword.textContent = isPasswordHidden ? "Hide" : "Show";

        togglePassword.setAttribute(
            "aria-label",
            isPasswordHidden ? "Hide password" : "Show password"
        );

        togglePassword.setAttribute(
            "aria-pressed",
            String(isPasswordHidden)
        );
    });
}


/* =================================
   4. LOGIN FORM
================================= */

if (loginForm && formMessage) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const universityDomain = "@rguktong.ac.in";
        const normalizedEmail = email.toLowerCase();

        if (
            !normalizedEmail.endsWith(universityDomain) ||
            normalizedEmail.indexOf("@") !==
                normalizedEmail.lastIndexOf("@")
        ) {
            formMessage.textContent =
                "Please use your official university email.";
            return;
        }
        const password = passwordInput.value;

        formMessage.style.color = "#b42318";
        formMessage.textContent = "";

        if (!email || !password) {
            formMessage.textContent =
                "Please enter your email and password.";
            return;
        }

        formMessage.style.color = "#147d83";
        formMessage.textContent =
            "Frontend validation passed. Django authentication will be connected next.";
    });
}


/* =================================
   5. FORGOT PASSWORD
================================= */

const forgotPassword = document.getElementById("forgotPassword");

if (forgotPassword && formMessage) {
    forgotPassword.addEventListener("click", function (event) {
        event.preventDefault();

        formMessage.style.color = "#147d83";
        formMessage.textContent =
            "Password recovery will be available when we connect Django.";
    });
}


/* =================================
   6. REGISTRATION LINK
================================= */

const registerLink = document.getElementById("registerLink");

if (registerLink && formMessage) {
    registerLink.addEventListener("click", function (event) {
        event.preventDefault();

        formMessage.style.color = "#147d83";
        formMessage.textContent =
            "The student and faculty registration page is coming next.";
    });
}
