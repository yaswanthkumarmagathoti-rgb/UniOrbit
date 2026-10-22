
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const role = document.getElementById("role");

    const studentField = document.getElementById("studentField");
    const facultyField = document.getElementById("facultyField");
    const yearField = document.getElementById("yearField");

    const studentId = document.getElementById("studentId");
    const facultyId = document.getElementById("facultyId");
    const department = document.getElementById("department");
    const academicYear = document.getElementById("academicYear");

    const fullName = document.getElementById("fullName");
    const email = document.getElementById("email");
    const password = document.getElementById("newPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    const passwordStrength = document.getElementById("passwordStrength");
    const registerMessage = document.getElementById("registerMessage");

    // Show fields based on the selected account type.
    function updateRoleFields() {
        const isStudent = role.value === "student";
        const isFaculty = role.value === "faculty";

        studentField.hidden = !isStudent;
        facultyField.hidden = !isFaculty;
        yearField.hidden = !isStudent;

        studentId.required = isStudent;
        facultyId.required = isFaculty;
        academicYear.required = isStudent;

        if (!isStudent) {
            studentId.value = "";
            academicYear.value = "";
        }

        if (!isFaculty) {
            facultyId.value = "";
        }
    }

    role.addEventListener("change", updateRoleFields);
    updateRoleFields();

    // Check password strength as the user types.
    function checkPasswordStrength() {
        const value = password.value;
        const rules = [
            value.length >= 8,
            /[A-Z]/.test(value),
            /[a-z]/.test(value),
            /[0-9]/.test(value),
            /[^A-Za-z0-9]/.test(value)
        ];

        if (!value) {
            passwordStrength.textContent =
                "Use 8+ characters with uppercase, lowercase, number, and special character.";
            passwordStrength.style.color = "";
            return false;
        }

        const passed = rules.filter(Boolean).length;

        if (passed <= 2) {
            passwordStrength.textContent = "Weak password — add the missing requirements.";
            passwordStrength.style.color = "#c0392b";
        } else if (passed <= 4) {
            passwordStrength.textContent = "Almost there — meet all password requirements.";
            passwordStrength.style.color = "#b7791f";
        } else {
            passwordStrength.textContent = "Strong password ✓";
            passwordStrength.style.color = "#147f84";
        }

        return rules.every(Boolean);
    }

    password.addEventListener("input", checkPasswordStrength);

    // Validate the university email address.
    function isUniversityEmail(value) {
        return /^[^\s@]+@rguktong\.ac\.in$/i.test(value.trim());
    }

    function showMessage(message, isError = true) {
        registerMessage.textContent = message;
        registerMessage.style.color = isError ? "#c0392b" : "#147f84";
    }

    // Validate the form.
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        registerMessage.textContent = "";

        if (!form.checkValidity()) {
            form.reportValidity();
            showMessage("Please complete all required fields.");
            return;
        }

        if (!isUniversityEmail(email.value)) {
            showMessage("Please use your @rguktong.ac.in university email.");
            email.focus();
            return;
        }

        if (!checkPasswordStrength()) {
            showMessage(
                "Your password must have at least 8 characters, uppercase and lowercase letters, a number, and a special character."
            );
            password.focus();
            return;
        }

        if (password.value !== confirmPassword.value) {
            showMessage("Passwords do not match. Please try again.");
            confirmPassword.focus();
            return;
        }

        if (role.value === "student" && !studentId.value.trim()) {
            showMessage("Please enter your student ID.");
            studentId.focus();
            return;
        }

        if (role.value === "faculty" && !facultyId.value.trim()) {
            showMessage("Please enter your faculty ID.");
            facultyId.focus();
            return;
        }

        showMessage(
            "Validation successful! Account creation will be available after we connect the backend.",
            false
        );
    });
});
