
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registerForm");

    if (!form) {
        console.error("Registration form not found.");
        return;
    }

    const role = document.getElementById("role");
    const studentField = document.getElementById("studentField");
    const facultyField = document.getElementById("facultyField");
    const yearField = document.getElementById("yearField");

    const studentId = document.getElementById("studentId");
    const facultyId = document.getElementById("facultyId");
    const academicYear = document.getElementById("academicYear");

    const email = document.getElementById("email");
    const password = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    const passwordStrength = document.getElementById("passwordStrength");
    const message = document.getElementById("registerMessage");

    function showMessage(text, success = false) {
        if (!message) return;

        message.textContent = text;
        message.style.color = success ? "#5de7c8" : "#ff8d9a";
    }

    // Display fields for the selected account type.
    function updateRoleFields() {
        const selectedRole = role.value;

        if (studentField) {
            studentField.hidden = selectedRole !== "student";
        }

        if (facultyField) {
            facultyField.hidden = selectedRole !== "faculty";
        }

        if (yearField) {
            yearField.hidden = selectedRole !== "student";
        }

        if (studentId) {
            studentId.required = selectedRole === "student";
        }

        if (facultyId) {
            facultyId.required = selectedRole === "faculty";
        }

        if (academicYear) {
            academicYear.required = selectedRole === "student";
        }

        showMessage("");
    }

    if (role) {
        role.addEventListener("change", updateRoleFields);
        updateRoleFields();
    }

    // Password-strength feedback.
    function checkPasswordStrength() {
        const value = password.value;

        const requirements = [
            {
                test: value.length >= 8,
                label: "at least 8 characters"
            },
            {
                test: /[A-Z]/.test(value),
                label: "an uppercase letter"
            },
            {
                test: /[a-z]/.test(value),
                label: "a lowercase letter"
            },
            {
                test: /[0-9]/.test(value),
                label: "a number"
            },
            {
                test: /[^A-Za-z0-9]/.test(value),
                label: "a special character"
            }
        ];

        const missing = requirements.filter(item => !item.test);

        if (passwordStrength) {
            if (value.length === 0) {
                passwordStrength.textContent =
                    "Use 8+ characters, uppercase, lowercase, a number and a special character.";
                passwordStrength.style.color = "";
            } else if (missing.length === 0) {
                passwordStrength.textContent = "Strong password ✓";
                passwordStrength.style.color = "#5de7c8";
            } else {
                passwordStrength.textContent =
                    "Still needed: " +
                    missing.map(item => item.label).join(", ");
                passwordStrength.style.color = "#ffb1a8";
            }
        }

        return missing.length === 0;
    }

    if (password) {
        password.addEventListener("input", checkPasswordStrength);
    }

    // Validate the form before any future backend submission.
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        showMessage("");

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (!role || !["student", "faculty"].includes(role.value)) {
            showMessage("Please select Student or Faculty.");
            role.focus();
            return;
        }

        const normalizedEmail = email.value.trim().toLowerCase();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@rguktong\.ac\.in$/;

        if (!emailPattern.test(normalizedEmail)) {
            showMessage(
                "Please use your official @rguktong.ac.in university email."
            );
            email.focus();
            return;
        }

        if (!checkPasswordStrength()) {
            showMessage("Please meet all password requirements.");
            password.focus();
            return;
        }

        if (password.value !== confirmPassword.value) {
            showMessage("Your passwords do not match.");
            confirmPassword.focus();
            return;
        }

        showMessage(
            "Form validation successful! Backend account creation is our next step.",
            true
        );

        console.log("UniOrbit registration validation passed.");
    });
});
