
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const dashboardContent = document.getElementById("overview");
    const secondaryView = document.getElementById("secondaryView");
    const secondaryTitle = document.getElementById("secondaryTitle");
    const secondaryDescription = document.getElementById("secondaryDescription");
    const backToDashboard = document.getElementById("backToDashboard");
    const breadcrumbCurrent = document.getElementById("breadcrumbCurrent");

    // Demo attendance data — replace with backend data later.
    const attendanceData = [
        { subject: "Python Programming", code: "CS201", attended: 23, total: 25 },
        { subject: "Database Management Systems", code: "CS202", attended: 21, total: 25 },
        { subject: "Computer Networks", code: "CS203", attended: 18, total: 24 },
        { subject: "Communication Systems", code: "EC301", attended: 20, total: 22 },
        { subject: "Digital Signal Processing", code: "EC302", attended: 16, total: 24 },
        { subject: "Web Technologies", code: "CS204", attended: 22, total: 24 }
    ];

    // Date and footer year
    const currentDate = document.getElementById("currentDate");
    const footerYear = document.getElementById("footerYear");

    if (currentDate) {
        currentDate.textContent = new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

    // Mobile sidebar
    function closeSidebar() {
        sidebar?.classList.remove("open");
        sidebarOverlay?.classList.remove("visible");
        menuToggle?.setAttribute("aria-expanded", "false");
    }

    menuToggle?.addEventListener("click", () => {
        const isOpen = sidebar?.classList.toggle("open") ?? false;
        sidebarOverlay?.classList.toggle("visible", isOpen);
        menuToggle?.setAttribute("aria-expanded", String(isOpen));
    });

    sidebarOverlay?.addEventListener("click", closeSidebar);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeSidebar();
    });

    // Shared navigation helpers
    const navLinks = document.querySelectorAll("[data-section]");

    function setActiveLink(section) {
        navLinks.forEach((link) => {
            const active = link.dataset.section === section;
            link.classList.toggle("active", active);

            if (active) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    
    function showDashboard() {
    if (dashboardContent) dashboardContent.hidden = false;
    if (secondaryView) secondaryView.hidden = true;

    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = "Dashboard";
    }

    // Restore the saved profile photo.
    const savedPhoto = localStorage.getItem("uniorbitProfilePhoto");
    const savedName = localStorage.getItem("uniorbitProfileName") || "";

    ["headerAvatar", "profileAvatar"].forEach(id => {
        const avatar = document.getElementById(id);
        if (!avatar) return;

        if (savedPhoto) {
            avatar.textContent = "";
            avatar.style.backgroundImage = `url("${savedPhoto}")`;
            avatar.style.backgroundSize = "cover";
            avatar.style.backgroundPosition = "center";
            avatar.style.backgroundRepeat = "no-repeat";
        } else {
            avatar.style.backgroundImage = "none";
            avatar.textContent = savedName
                ? savedName.charAt(0).toUpperCase()
                : "S";
        }
    });

    if (savedName) {
        const headerName = document.getElementById("headerName");
        const welcomeName = document.getElementById("welcomeName");

        if (headerName) headerName.textContent = savedName;
        if (welcomeName) welcomeName.textContent = savedName;
    }

    setActiveLink("overview");

    window.scrollTo({ top: 0, behavior: "smooth" });

}

    // Attendance page renderer
    function renderAttendance() {
        const totalClasses = attendanceData.reduce(
            (sum, item) => sum + item.total, 0
        );

        const attendedClasses = attendanceData.reduce(
            (sum, item) => sum + item.attended, 0
        );

        const overall = totalClasses
            ? Math.round((attendedClasses / totalClasses) * 100)
            : 0;


        const belowThreshold = attendanceData.filter(
            (item) =>
                item.total > 0 &&
                (item.attended / item.total) * 100 < 75
        ).length;

        const subjectRows = attendanceData.map((item) => {
            const percentage = item.total
                ? Math.round((item.attended / item.total) * 100)
                : 0;

            const status = percentage < 75 ? "Low Attendance" : "Good Standing";
            const statusClass = percentage < 75 ? "attendance-low" : "attendance-good";

            return `
                <article class="attendance-subject">
                    <div class="attendance-subject-heading">
                        <div class="attendance-subject-name">
                            <span class="attendance-code">${item.code}</span>
                            <h3>${item.subject}</h3>
                        </div>
                        <strong class="attendance-percent">${percentage}%</strong>
                    </div>

                    <div
                        class="attendance-track"
                        role="progressbar"
                        aria-label="${item.subject} attendance"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="${percentage}"
                    >
                        <div
                            class="attendance-fill ${percentage < 75 ? "fill-low" : ""}"
                            style="width: ${percentage}%"
                        ></div>
                    </div>

                    <div class="attendance-subject-footer">
                        <span>${item.attended} attended out of ${item.total} classes</span>
                        <span class="attendance-status ${statusClass}">${status}</span>
                    </div>
                </article>
            `;
        }).join("");

        secondaryTitle.textContent = "My Attendance";
        secondaryDescription.textContent =
            "Track your subject-wise attendance and identify subjects that need attention.";

        secondaryView.innerHTML = `
            <div class="attendance-page">
                <div class="attendance-page-heading">
                    <div>
                        <p class="section-eyebrow">ACADEMIC PERFORMANCE</p>
                        <h2>Attendance Overview</h2>
                        <p class="attendance-subtitle">
                            Your attendance summary across all listed subjects.
                        </p>
                    </div>
                    <span class="attendance-demo-label">DEMO DATA</span>
                </div>
                    
                <div class="attendance-summary-grid">
                    
                <article class="attendance-summary-card">
                    <span class="attendance-summary-label">Overall Attendance</span>
                    <strong>${overall}%</strong>
                    <p>${attendedClasses} of ${totalClasses} classes attended</p>
                </article>

                <article class="attendance-summary-card">
                    <span class="attendance-summary-label">Classes Attended</span>
                    <strong>${attendedClasses}<small> / ${totalClasses}</small></strong>
                    <p>Across all listed subjects</p>
                </article>

                <article class="attendance-summary-card">
                    <span class="attendance-summary-label">Subjects Below 75%</span>
                    <strong class="${belowThreshold ? "attendance-warning-number" : ""}">
                        ${belowThreshold}
                    </strong>
                    <p>${belowThreshold
                        ? "Review these subjects carefully."
                        : "All subjects meet the threshold."}</p>
                </article>

                </div>

                <section class="attendance-list-card">
                    <div class="attendance-list-heading">
                        <div>
                            <p class="section-eyebrow">SUBJECT BREAKDOWN</p>
                            <h2>Subject-wise Attendance</h2>
                        </div>
                        <span class="attendance-threshold">Target: 75%</span>
                    </div>

                    <div class="attendance-filters">
                    <input
                        type="search"
                        id="attendanceSearch"
                        placeholder="Search by subject name or code..."
                        aria-label="Search subjects"
                    />

                    <select id="attendanceFilter" aria-label="Filter attendance">
                        <option value="all">All subjects</option>
                        <option value="good">75% and above</option>
                        <option value="low">Below 75%</option>
                    </select>
                </div>

                <div id="attendanceSubjectList">
                    ${subjectRows}
                </div>

                <p id="attendanceNoResults" hidden>
                    No subjects match your search.
                </p>

                    <p class="attendance-note">
                        These are illustrative figures only. Official attendance
                        must come from your university records.
                    </p>
                </section>

                <button type="button" class="primary-button" id="attendanceBackButton">
                    ← Back to Dashboard
                </button>
                
                </div>

            </div>
        `;

        secondaryView.hidden = false;
        dashboardContent.hidden = true;

        document.getElementById("attendanceBackButton")
            ?.addEventListener("click", showDashboard);

        const attendanceSearch =
            document.getElementById("attendanceSearch");

        const attendanceFilter =
            document.getElementById("attendanceFilter");

        const attendanceSubjectList =
            document.getElementById("attendanceSubjectList");

        const attendanceNoResults =
            document.getElementById("attendanceNoResults");

        function filterAttendanceSubjects() {
    if (
        !attendanceSearch ||
        !attendanceFilter ||
        !attendanceSubjectList ||
        !attendanceNoResults
    ) {
        return;
    }

    const searchText = attendanceSearch.value
        .trim()
        .toLowerCase();

    const selectedFilter = attendanceFilter.value;

    const subjectCards = attendanceSubjectList.querySelectorAll(
        ".attendance-subject"
    );

            let visibleCount = 0;

            subjectCards.forEach((card) => {
                const subjectText = card.textContent.toLowerCase();

                const matchesSearch = subjectText.includes(searchText);

                const isLowAttendance =
                    card.querySelector(".attendance-status")
                        ?.classList.contains("attendance-low");

                const matchesFilter =
                    selectedFilter === "all" ||
                    (selectedFilter === "low" && isLowAttendance) ||
                    (selectedFilter === "good" && !isLowAttendance);

                const shouldShow = matchesSearch && matchesFilter;

                card.hidden = !shouldShow;

                if (shouldShow) {
                    visibleCount++;
                }
            });

            attendanceNoResults.hidden = visibleCount !== 0;
        }

        attendanceSearch.addEventListener(
            "input",
            filterAttendanceSubjects
        );

        attendanceFilter.addEventListener(
            "change",
            filterAttendanceSubjects
        );

        window.scrollTo({ top: 0, behavior: "smooth" });

    }  


function renderTimetable() {
    const week = [
        { day: "Monday", subjects: ["ES", "AI", "NPTEL 1", "—", "NPTEL 1"] },
        { day: "Tuesday", subjects: ["NPTEL 1", "IC", "IC", "ES", "NPTEL 1"] },
        { day: "Wednesday", subjects: ["AI", "LIB", "LIB", "—", "NPTEL 2"] },
        { day: "Thursday", subjects: ["—", "CDC", "AI", "—", "MINI PROJ-2"] },
        { day: "Friday", subjects: ["NPTEL 1", "ES", "CDC", "—", "MINI PROJECT-2"] },
        { day: "Saturday", subjects: ["AI", "ES", "NPTEL 1", "—", "ELCS 3 LAB"] }
    ];

    const todayName = new Date().toLocaleDateString("en-US", {
        weekday: "long"
    });

    let selectedView = "today";

    const periodNames = [
        "Period 1", "Period 2", "Period 3",
        "Period 4", "Period 5", "Period 6"
    ];

const periodTimes = [
    "9:30 AM - 10:30 AM",
    "10:30 AM - 11:30 AM",
    "11:40 AM - 12:40 PM",
    "1:40 PM - 2:40 PM",
    "2:40 PM - 3:40 PM",
    "3:50 PM - 4:50 PM"
];


function updateSmartTimetable() {
    const currentStatus = document.getElementById("currentClassStatus");
    const currentTime = document.getElementById("currentClassTime");
    const nextName = document.getElementById("nextClassName");
    const nextTime = document.getElementById("nextClassTime");

    // Stop if the Smart Timetable cards are not on the page.
    if (!currentStatus || !currentTime || !nextName || !nextTime) {
        return;
    }

    const now = new Date();

    const todayName = now.toLocaleDateString("en-US", {
        weekday: "long"
    });

    const today = week.find(item => item.day === todayName);

    // Sunday or a day without a listed timetable.
    if (!today) {
        currentStatus.textContent = "No classes today";
        currentTime.textContent = "Enjoy your day!";
        nextName.textContent = "No upcoming classes";
        nextTime.textContent = "Check your weekly timetable";
        return;
    }

    // Convert a time such as "9:30 AM" into minutes after midnight.
    function toMinutes(timeText) {
        const match = timeText.match(
            /(\d{1,2}):(\d{2})\s*(AM|PM)/i
        );


        if (!match) {
            return null;
        }

        let hour = Number(match[1]);
        const minute = Number(match[2]);
        const meridiem = match[3].toUpperCase();

        if (meridiem === "AM" && hour === 12) {
            hour = 0;
        } else if (meridiem === "PM" && hour !== 12) {
            hour += 12;
        }

        return hour * 60 + minute;
    }

    // Format minutes as a readable 12-hour time.
    function formatMinutes(minutes) {
        let hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        const meridiem = hour >= 12 ? "PM" : "AM";

        hour = hour % 12 || 12;

        return `${hour}:${String(minute).padStart(2, "0")} ${meridiem}`;
    }

    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    // Build the day's schedule from the existing timetable data.
    const schedule = periodTimes.map((timeText, index) => {
        const parts = timeText.split(/\s*-\s*/);

        if (parts.length !== 2) {
            return null;
        }

        const start = toMinutes(parts[0]);
        const end = toMinutes(parts[1]);

        if (start === null || end === null) {
            return null;
        }

        // The fifth subject is also displayed in Period 6
        // in the existing weekly timetable.
        const subjectIndex = index < 4 ? index : 4;
        const subject = today.subjects[subjectIndex] ?? "—";

        return {
            subject,
            period: periodNames[index],
            start,
            end,
            timeText
        };
    }).filter(Boolean);

    const currentClass = schedule.find(
        item =>
            item.subject !== "—" &&
            nowMinutes >= item.start &&
            nowMinutes < item.end
    );

    const upcomingClass = schedule.find(
        item =>
            item.subject !== "—" &&
            item.start > nowMinutes
    );

    // A class is currently in progress.
    if (currentClass) {
        currentStatus.textContent = currentClass.subject;
        currentTime.textContent =
            `${currentClass.period} · Ends at ${formatMinutes(currentClass.end)}`;
    } else {
        const nextScheduledPeriod = schedule.find(
            item =>
                item.subject !== "—" &&
                item.start > nowMinutes
        );

        if (nextScheduledPeriod) {
            currentStatus.textContent = "No class right now";
            currentTime.textContent = "You are between classes or on a break";
        } else {
            currentStatus.textContent = "Classes finished";
            currentTime.textContent = "There are no more listed classes today";
        }
    }

    // Show the next class, if one remains today.
    if (upcomingClass) {
        nextName.textContent = upcomingClass.subject;
        nextTime.textContent =
            `${upcomingClass.period} · ${upcomingClass.timeText}`;
    } else {
        nextName.textContent = "No upcoming classes";
        nextTime.textContent = "You have reached the end of today's schedule";
    }
}

    function subjectCell(subject, period, colspan = 1) {
        return `
            <td class="${subject === "—" ? "empty-period" : ""}">
                <span class="weekly-period-label">${period}</span>
                <strong>${subject === "—" ? "—" : subject}</strong>
            </td>
        `;
    }

function renderToday(item) {
    const schedule = [
        { type: "class", index: 0, period: "Period 1", time: "9:30 – 10:30 AM" },
        { type: "class", index: 1, period: "Period 2", time: "10:30 – 11:30 AM" },
        { type: "break", title: "Morning Break", time: "11:30 – 11:40 AM", icon: "☕" },
        { type: "class", index: 2, period: "Period 3", time: "11:40 AM – 12:40 PM" },
        { type: "lunch", title: "Lunch Break", time: "12:40 – 1:40 PM", icon: "🍽️" },
        { type: "class", index: 3, period: "Period 4", time: "1:40 – 2:40 PM" },
        { type: "class", index: 4, period: "Period 5", time: "2:40 – 3:40 PM" },
        { type: "break", title: "Afternoon Break", time: "3:40 – 3:50 PM", icon: "☕" },
        { type: "class", index: 5, period: "Period 6", time: "3:50 – 4:50 PM" }
    ];

    const items = schedule.map(entry => {
        if (entry.type !== "class") {
            return `
                <div class="today-schedule-pause ${entry.type}">
                    <div class="today-pause-line"></div>
                    <div class="today-pause-content">
                        <span class="today-pause-icon">${entry.icon}</span>
                        <div>
                            <strong>${entry.title}</strong>
                            <span>${entry.time}</span>
                        </div>
                        <span class="today-pause-tag">
                            ${entry.type === "lunch" ? "LUNCH" : "BREAK"}
                        </span>
                    </div>
                    <div class="today-pause-line"></div>
                </div>
            `;
        }

        const subject = item.subjects[entry.index] ?? "—";

        return `
            <article
                class="timetable-class timetable-clickable today-class-card"
                role="button"
                tabindex="0"
                data-day="${item.day}"
                data-period="${entry.index}"
            >
                <div class="today-class-time">
                    <span>${entry.period}</span>
                    <small>${entry.time}</small>
                </div>

                <div class="today-class-indicator"></div>

                <div class="timetable-class-info">
                    <strong>${subject}</strong>
                    <span>${subject === "—" ? "No class scheduled" : "View class details →"}</span>
                </div>

                <span class="today-class-arrow">›</span>
            </article>
        `;
    }).join("");

    return `
        <section class="timetable-day timetable-today">
            <div class="timetable-day-heading">
                <div>
                    <span class="timetable-day-short">
                        ${item.day.slice(0, 3).toUpperCase()}
                    </span>
                    <h3>${item.day}</h3>
                    <p class="today-schedule-subtitle">
                        Your classes and breaks for today
                    </p>
                </div>

                <span class="timetable-today-badge">TODAY</span>
            </div>

            <div class="timetable-classes today-schedule-timeline">
                ${items}
            </div>
        </section>
    `;
}

    function renderWeek() {
        const rows = week.map(item => {
            const cells = item.subjects.map((subject, index) => {
                if (index === 4) {
                    const period5Cell = subjectCell(
                        subject,
                        "Period 5"
                    );

                    const period6Cell = subjectCell(
                        subject,
                        "Period 6"
                    );

                    return period5Cell + period6Cell;
                }

                return subjectCell(subject, periodNames[index]);
            }).join("");

            return `
                <tr class="${item.day === todayName ? "weekly-today-row" : ""}">
                    <th scope="row">
                        ${item.day}
                        ${item.day === todayName ? '<span class="weekly-today-label">TODAY</span>' : ""}
                    </th>
                    ${cells}
                </tr>
            `;
        }).join("");

        return `
            <div class="weekly-table-wrapper">
                <table class="weekly-timetable-table">
                    <thead>
                        <tr>
                            <th>Day</th>
                            ${periodNames.map((name, index) => `
                                    <th>
                                        <span class="weekly-period-label">${name}</span>
                                        <small class="weekly-period-time">${periodTimes[index]}</small>
                                    </th>
                                `).join("")}
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
            <p class="timetable-disclaimer">
                Each period is displayed in its own cell for a clearer weekly schedule.
            </p>
        `;
    }

    secondaryView.innerHTML = `
        <div class="timetable-page">
            <div class="timetable-page-heading">
                <div>
                    <p class="section-eyebrow">ECE • SECTION 3</p>
                    <h1>Class Timetable</h1>
                    <p class="timetable-subtitle">
                        Your daily plan and complete weekly schedule.
                    </p>
                </div>
                <span class="timetable-demo-label">ECE SECTION 3</span>
            </div>

            <div class="timetable-info-banner">
                <span class="timetable-info-icon">◷</span>
                <div>
                    <strong>College Hours: 9:30 AM – 4:50 PM</strong>
                    <p>Short break: 10 minutes between Periods 2 and 3</p>
                    <p>Lunch: 12:40 PM – 1:40 PM</p>
                    <p>Afternoon break: 10 minutes from 3:40 PM</p>
                </div>
            </div>

            <div class="timetable-view-switch">
                <button type="button" class="primary-button" id="todayViewButton">
                    Today's Schedule
                </button>
                <button type="button" class="primary-button" id="weekViewButton">
                    View Full Week
                </button>
            </div>

            

        <div id="timetableViewContent"></div>
            <div id="classDetailsPanel" class="class-details-panel" hidden></div>

            <button type="button" class="primary-button" id="timetableBackButton">
                ← Back to Dashboard
            </button>
        </div>
    `;

    const viewContent = document.getElementById("timetableViewContent");
    const todayButton = document.getElementById("todayViewButton");
    const weekButton = document.getElementById("weekViewButton");
function showClassDetails(day, periodIndex) {
    const weekData = week.find(item => item.day === day);
    if (!weekData) return;

    const subject = weekData.subjects[periodIndex] ?? "—";

    if (subject === "—") return;

    const period = periodNames[periodIndex];
    const time = periodTimes[periodIndex];

    let modal = document.getElementById("classDetailsModal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "classDetailsModal";
        modal.className = "class-modal-overlay";

        modal.innerHTML = `
            <section
                class="class-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="classModalTitle"
            >
                <div class="class-modal-top">
                    <span class="class-modal-eyebrow">
                        TIMETABLE DETAILS
                    </span>
                    <button
                        type="button"
                        class="class-modal-close"
                        aria-label="Close popup"
                    >×</button>
                </div>

                <div class="class-modal-icon">📚</div>

                <h2 id="classModalTitle"></h2>
                <p class="class-modal-subtitle">
                    Your scheduled class information
                </p>

                <div class="class-modal-details">
                    <div class="class-modal-detail">
                        <span>DAY</span>
                        <strong id="modalClassDay"></strong>
                    </div>

                    <div class="class-modal-detail">
                        <span>PERIOD</span>
                        <strong id="modalClassPeriod"></strong>
                    </div>

                    <div class="class-modal-detail class-modal-time">
                        <span> SCHEDULED TIME </span>
                        <strong id="modalClassTime"></strong>
                    </div>
                </div>

                <button
                    type="button"
                    class="class-modal-done"
                >Got it</button>
            </section>
        `;

        document.body.appendChild(modal);

        const closeModal = () => {
            modal.classList.remove("is-visible");
            document.body.classList.remove("modal-open");
        };

        modal.querySelector(".class-modal-close")
            .addEventListener("click", closeModal);

        modal.querySelector(".class-modal-done")
            .addEventListener("click", closeModal);

        modal.addEventListener("click", event => {
            if (event.target === modal) closeModal();
        });

        modal.addEventListener("keydown", event => {
            if (event.key === "Escape") closeModal();
        });
    }

    modal.querySelector("#classModalTitle").textContent = subject;
    modal.querySelector("#modalClassDay").textContent = day;
    modal.querySelector("#modalClassPeriod").textContent = period;
    modal.querySelector("#modalClassTime").textContent = time;

    modal.classList.add("is-visible");
    document.body.classList.add("modal-open");

    modal.querySelector(".class-modal-close").focus();
}

function handleTimetableClassClick(event) {
    const classCard = event.target.closest(".timetable-clickable");
    if (!classCard) return;

    showClassDetails(
        classCard.dataset.day,
        Number(classCard.dataset.period)
    );
}

viewContent.addEventListener("click", handleTimetableClassClick);

viewContent.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const classCard = event.target.closest(".timetable-clickable");
    if (!classCard) return;

    event.preventDefault();
    showClassDetails(
        classCard.dataset.day,
        Number(classCard.dataset.period)
    );
});

    function updateView(view) {
        selectedView = view;

        todayButton.classList.toggle("active", view === "today");
        weekButton.classList.toggle("active", view === "week");

        if (view === "week") {
            viewContent.innerHTML = renderWeek();
            return;
        }

        const today = week.find(item => item.day === todayName);

        viewContent.innerHTML = today
            ? renderToday(today)
            : `
                <div class="timetable-day">
                    <h3>Sunday</h3>
                    <p>No weekday classes are listed for today.</p>
                </div>
            `;
    }

    todayButton.addEventListener("click", () => updateView("today"));
    weekButton.addEventListener("click", () => updateView("week"));

    document.getElementById("timetableBackButton")
        .addEventListener("click", showDashboard);

    secondaryView.hidden = false;
    dashboardContent.hidden = true;

    updateView("today");

// Update the smart timetable immediately.
updateSmartTimetable();

// Prevent duplicate timers when reopening the timetable.
if (window.uniOrbitSmartTimer) {
    clearInterval(window.uniOrbitSmartTimer);
}

window.uniOrbitSmartTimer = setInterval(
    updateSmartTimetable,
    30000
);

window.scrollTo({ top: 0, behavior: "smooth" });
}

    // Demo profile data — connect to the backend later.
    // =========================================
// STUDENT PROFILE DATA & PERSISTENCE
// =========================================

const profileStorageKey = "uniorbitStudentProfile";

const studentProfile = {
    name: localStorage.getItem("uniorbitProfileName") || "",
    idNumber: "",
    rollNumber: "",
    email: "",
    phone: "",
    department: "Electronics and Communication Engineering",
    year: "4th Year",
    section: "Section 3",
    university: "RGUKT Ongole"
};

// Restore previously saved profile details.
try {
    const savedProfile = JSON.parse(
        localStorage.getItem(profileStorageKey) || "null"
    );

    if (
        savedProfile &&
        typeof savedProfile === "object" &&
        !Array.isArray(savedProfile)
    ) {
        Object.assign(studentProfile, savedProfile);
    }
} catch (error) {
    console.error("Could not load saved profile:", error);
}
// Update the Student Account card using the saved profile.
function updateStudentAccountBanner() {
    const savedName =
        studentProfile.name.trim() ||
        localStorage.getItem("uniorbitProfileName") ||
        "";

    const profileName = document.getElementById("profileName");
    const profileIdNumber = document.getElementById("profileIdNumber");
    const profileDepartment = document.getElementById("profileDepartment");
    const profileYear = document.getElementById("profileYear");
    const profileAvatar = document.getElementById("profileAvatar");

    if (profileName) {
        profileName.textContent = savedName || "Student Name";
    }

    if (profileIdNumber) {
        profileIdNumber.textContent =
            studentProfile.idNumber.trim() || "Student ID";
    }

    if (profileDepartment) {
        profileDepartment.textContent =
            studentProfile.department || "Department";
    }

    if (profileYear) {
        profileYear.textContent =
            studentProfile.year || "Academic Year";
    }

    // Restore the student's saved profile photo.
    const savedPhoto = localStorage.getItem("uniorbitProfilePhoto");

    if (profileAvatar && savedPhoto) {
        profileAvatar.textContent = "";
        profileAvatar.style.backgroundImage =
            `url("${savedPhoto}")`;
        profileAvatar.style.backgroundSize = "cover";
        profileAvatar.style.backgroundPosition = "center";
    } else if (profileAvatar) {
        profileAvatar.style.backgroundImage = "none";
        profileAvatar.textContent =
            savedName ? savedName.charAt(0).toUpperCase() : "S";
    }
}
    

function renderProfile() {
    const fields = [
        {
            key: "name",
            label: "Full Name",
            placeholder: "Enter your full name",
            required: true,
            section: "personal"
        },
        {
            key: "idNumber",
            label: "ID Number",
            placeholder: "Enter your ID number",
            required: true,
            section: "personal"
        },
        {
            key: "email",
            label: "University Email",
            placeholder: "Enter your university email",
            required: true,
            type: "email",
            section: "personal"
        },
        {
            key: "phone",
            label: "Phone Number",
            placeholder: "Enter your phone number",
            type: "tel",
            section: "personal"
        },
        {
            key: "rollNumber",
            label: "Roll Number",
            section: "academic"
        },
        {
            key: "department",
            label: "Department",
            section: "academic"
        },
        {
            key: "year",
            label: "Academic Year",
            section: "academic"
        },
        {
            key: "section",
            label: "Section",
            section: "academic"
        },
        {
            key: "university",
            label: "University",
            section: "academic"
        }
    ];

    const personalFields = fields.filter(
        field => field.section === "personal"
    );

    const academicFields = fields.filter(
        field => field.section === "academic"
    );

    function createField(field) {
        return `
            <div class="profile-field">
                <span class="profile-field-label">
                    ${field.label}
                </span>

                <p
                    class="profile-field-value"
                    data-value="${field.key}"
                ></p>

                ${field.section === "personal" ? `
                    <input
                        class="profile-field-input"
                        data-input="${field.key}"
                        name="${field.key}"
                        type="${field.type || "text"}"
                        placeholder="${field.placeholder}"
                        ${field.required ? "required" : ""}
                        ${field.key === "idNumber" ? 'maxlength="50"' : ""}
                        ${field.key === "phone" ? 'maxlength="20"' : ""}
                        hidden
                    >
                ` : ""}
            </div>
        `;
    }

    secondaryView.innerHTML = `
        <div class="profile-page">

            <div class="profile-page-heading">
                <div>
                    <p class="section-eyebrow">STUDENT PORTAL</p>
                    <h1>My Profile</h1>
                    <p>Manage your personal and academic information.</p>
                </div>

                <span class="profile-status">STUDENT PROFILE</span>
            </div>

            <section class="profile-hero">
                <div class="profile-avatar-wrapper">
                <img
                    id="profilePageAvatar"
                    class="profile-avatar-large profile-photo"
                    src=""
                    alt="Student profile photo"
                    hidden
                >

                <div
                    class="profile-avatar-large"
                    id="profilePageAvatarFallback"
                >
                    S
                </div>

                <label
                    for="profilePhotoInput"
                    class="profile-photo-edit"
                    title="Change profile photo"
                    hidden
                >📷</label>

                <input
                    type="file"
                    id="profilePhotoInput"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                >
            </div>

                <div class="profile-hero-info">
                    <span class="profile-kicker">STUDENT PROFILE</span>
                    <h2 id="profilePageName">Student Name</h2>
                    <p id="profilePageSummary">
                        Complete your profile details
                    </p>
                </div>

                <button
                    type="button"
                    class="primary-button"
                    id="editProfileButton"
                >
                    ✎ Edit Profile
                </button>
            </section>

            <form id="profileForm" novalidate>

                <section class="profile-section-card">
                    <div class="profile-section-heading">
                        <div class="profile-section-icon">♙</div>
                        <div>
                            <h2>Personal Information</h2>
                            <p>Your contact and identification details</p>
                        </div>
                    </div>

                    <div class="profile-fields">
                        ${personalFields.map(createField).join("")}
                    </div>
                </section>

                <section class="profile-section-card">
                    <div class="profile-section-heading">
                        <div class="profile-section-icon">⌂</div>
                        <div>
                            <h2>Academic Information</h2>
                            <p>Your university and course details</p>
                        </div>
                    </div>

                    <div class="profile-fields">
                        ${academicFields.map(createField).join("")}
                    </div>

                    <p class="profile-academic-note">
                        Academic information is read-only in this demo.
                        Official details will come from the university
                        database when the backend is connected.
                    </p>
                </section>

                <div class="profile-edit-actions" id="profileEditActions" hidden>
                    <button type="submit" class="primary-button">
                        Save Changes
                    </button>

                    <button
                        type="button"
                        class="profile-cancel-button"
                        id="cancelProfileEdit"
                    >
                        Cancel
                    </button>
                </div>

                <p
                    class="profile-message"
                    id="profileMessage"
                    role="status"
                    aria-live="polite"
                ></p>
            </form>

            <button
                type="button"
                class="profile-back-button"
                id="profileBackButton"
            >
                ← Back to Dashboard
            </button>
        </div>
    `;

    const form = secondaryView.querySelector("#profileForm");
    const editButton = secondaryView.querySelector("#editProfileButton");
    const actions = secondaryView.querySelector("#profileEditActions");
    const message = secondaryView.querySelector("#profileMessage");
    const photoInput = secondaryView.querySelector("#profilePhotoInput");
    const photoEditButton = secondaryView.querySelector(".profile-photo-edit");
    const photoImage = secondaryView.querySelector("#profilePageAvatar");
    const photoFallback = secondaryView.querySelector("#profilePageAvatarFallback");

    let profilePhotoUrl = "";

        try {
            profilePhotoUrl =
                localStorage.getItem("uniorbitProfilePhoto") || "";
        } catch (error) {
            console.warn("Could not load the saved profile photo.", error);
        }

    photoInput.addEventListener("change", () => {
        const file = photoInput.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            message.textContent = "Choose a JPG, PNG, or WebP image.";
            photoInput.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            message.textContent = "Photo must be 5 MB or smaller.";
            photoInput.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
    profilePhotoUrl = reader.result;

    try {
        // Save the photo immediately in this browser
        localStorage.setItem(
            "uniorbitProfilePhoto",
            profilePhotoUrl
        );

        // Display the selected photo
        photoImage.src = profilePhotoUrl;
        photoImage.hidden = false;
        photoFallback.hidden = true;

        message.textContent = "Profile photo saved successfully!";
    } catch (error) {
        console.error("Photo saving failed:", error);

        message.textContent =
            "Could not save photo. Please choose a smaller image.";
    }
};

        reader.onerror = () => {
            message.textContent = "Unable to load the selected photo.";
        };

        reader.readAsDataURL(file);
    });


    let originalValues = { ...studentProfile };

    function refreshProfile() {
        const name = studentProfile.name.trim() || "Student Name";
        const roll = studentProfile.rollNumber.trim();
        const idNumber = studentProfile.idNumber.trim();

        secondaryView.querySelector("#profilePageName").textContent = name;

        secondaryView.querySelector("#profilePageSummary").textContent =
            roll
                ? `Roll Number: ${roll}`
                : idNumber
                    ? `ID Number: ${idNumber}`
                    : "Complete your profile details";

        const avatar = studentProfile.name.trim()
        ? name.charAt(0).toUpperCase()
        : "S";

    photoFallback.textContent = avatar;

    if (profilePhotoUrl) {
        photoImage.src = profilePhotoUrl;
        photoImage.hidden = false;
        photoFallback.hidden = true;
    } else {
        photoImage.hidden = true;
        photoFallback.hidden = false;
    }

        fields.forEach(field => {
            const value = form.querySelector(
                `[data-value="${field.key}"]`
            );

            if (value) {
                value.textContent =
                    String(studentProfile[field.key] || "").trim()
                    || "Not provided";
            }

            const input = form.querySelector(
                `[data-input="${field.key}"]`
            );

            if (input) {
                input.value = studentProfile[field.key] || "";
            }
        });

        if (studentProfile.name.trim()) {
            const savedPhoto = localStorage.getItem("uniorbitProfilePhoto");

        ["headerAvatar", "profileAvatar"].forEach(id => {
            const element = document.getElementById(id);
            if (!element) return;

            if (savedPhoto) {
                element.textContent = "";
                element.style.backgroundImage = `url("${savedPhoto}")`;
                element.style.backgroundSize = "cover";
                element.style.backgroundPosition = "center";
                element.style.backgroundRepeat = "no-repeat";
            } else {
                element.style.backgroundImage = "none";
                element.textContent = studentProfile.name.trim()
                    ? studentProfile.name.trim().charAt(0).toUpperCase()
                    : "S";
            }
        });

                }
            }

    function setEditMode(enabled) {
        editButton.hidden = enabled;
        actions.hidden = !enabled;
        if (photoEditButton) {
            photoEditButton.hidden = !enabled;
        }

        if (photoInput) {
            photoInput.disabled = !enabled;
        }

        personalFields.forEach(field => {
            const value = form.querySelector(
                `[data-value="${field.key}"]`
            );

            const input = form.querySelector(
                `[data-input="${field.key}"]`
            );

            if (value) value.hidden = enabled;
            if (input) input.hidden = !enabled;
        });

        if (enabled) {
            message.textContent = "Edit your personal details, then save or cancel.";

            form.querySelector('[data-input="name"]').focus();
        }
    }

    editButton.addEventListener("click", () => {
        originalValues = { ...studentProfile };

        refreshProfile();
        message.textContent = "";
        setEditMode(true);
    });

    secondaryView.querySelector("#cancelProfileEdit")
        .addEventListener("click", () => {
            Object.assign(studentProfile, originalValues);

            refreshProfile();
            setEditMode(false);

            message.textContent = "Changes discarded.";
        });

    form.addEventListener("submit", event => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const email = form.elements.namedItem("email").value.trim();

        if (!/^[^\s@]+@rguktong\.ac\.in$/i.test(email)) {
            message.textContent =
                "Please enter your valid RGUKT Ongole university email.";

            form.elements.namedItem("email").focus();
            return;
        }

        const phone = form.elements.namedItem("phone").value.trim();

        if (phone && !/^[+\d][\d\s()-]{7,19}$/.test(phone)) {
            message.textContent =
                "Please enter a valid phone number.";

            form.elements.namedItem("phone").focus();
            return;
        }

        // Collect updated personal details.
        personalFields.forEach(field => {
            studentProfile[field.key] =
                form.elements.namedItem(field.key).value.trim();
        });

        // Save the complete profile.
        try {
            localStorage.setItem(
                profileStorageKey,
                JSON.stringify(studentProfile)
            );

            // Keep the existing name key for dashboard compatibility.
            localStorage.setItem(
                "uniorbitProfileName",
                studentProfile.name
            );
        } catch (error) {
            console.error("Profile saving failed:", error);

            message.textContent =
                "Unable to save your profile. Please try again.";

            return;
        }
// Save the selected photo
if (profilePhotoUrl) {
    try {
        localStorage.setItem("uniorbitProfilePhoto", profilePhotoUrl);
    } catch (error) {
        console.error("Photo saving failed:", error);
        message.textContent =
            "Photo could not be saved. Try a smaller image.";
        return;
    }
}

// Refresh the profile page.
refreshProfile();

// Refresh the dashboard account details.
updateStudentAccountBanner();
const savedName = studentProfile.name.trim() || "Student Name";

const headerName = document.getElementById("headerName");
const welcomeName = document.getElementById("welcomeName");

if (headerName) {
    headerName.textContent = savedName;
}

if (welcomeName) {
    welcomeName.textContent = savedName;
}

// Refresh the account avatars.
const savedPhoto = localStorage.getItem("uniorbitProfilePhoto");

["headerAvatar", "profileAvatar"].forEach(id => {
    const avatar = document.getElementById(id);

    if (!avatar) return;

    if (savedPhoto) {
        avatar.textContent = "";
        avatar.style.backgroundImage = `url("${savedPhoto}")`;
        avatar.style.backgroundSize = "cover";
        avatar.style.backgroundPosition = "center";
        avatar.style.backgroundRepeat = "no-repeat";
    } else {
        avatar.style.backgroundImage = "none";
        avatar.textContent = savedName.charAt(0).toUpperCase();
    }
});

setEditMode(false);
originalValues = { ...studentProfile };

message.textContent = "Profile updated successfully!";
});

    secondaryView.querySelector("#profileBackButton")
        .addEventListener("click", showDashboard);

    refreshProfile();
    // Update the Student Account banner
    document.getElementById("profileName").textContent =
        studentProfile.name.trim() || "Student Name";

    document.getElementById("profileDepartment").textContent =
        studentProfile.department || "Department";

    document.getElementById("profileYear").textContent =
        studentProfile.year || "Academic Year";

const accountIdNumber = document.getElementById("profileIdNumber");

if (accountIdNumber) {
    accountIdNumber.textContent =
        studentProfile.idNumber.trim() || "Student ID";
}

    setEditMode(false);

    secondaryView.hidden = false;
    dashboardContent.hidden = true;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderCampusEvents() {
    const events = [
        {
            title: "Tech Symposium",
            category: "TECHNOLOGY",
            date: "2026-11-05",
            time: "10:00 AM",
            venue: "Main Auditorium",
            description:
                "Explore technology, project demonstrations and technical activities."
        },
        {
            title: "Web Development Workshop",
            category: "WORKSHOP",
            date: "2026-11-10",
            time: "11:00 AM",
            venue: "Computer Lab",
            description:
                "Learn practical web development through hands-on activities."
        },
        {
            title: "Campus Cultural Fest",
            category: "CULTURAL",
            date: "2026-11-18",
            time: "4:00 PM",
            venue: "College Campus",
            description:
                "Enjoy student performances, cultural activities and celebrations."
        }
    ];

    secondaryTitle.textContent = "Campus Events";
    secondaryDescription.textContent =
        "Discover upcoming fests, workshops and campus activities.";

    secondaryView.innerHTML = `
        <div class="content-card secondary-view-card campus-events-page">
            <p class="section-eyebrow">CAMPUS LIFE</p>
            <h1>Campus Events</h1>
            <p class="events-intro">
                Find activities, workshops and celebrations happening on campus.
            </p>

            <div class="campus-events-list">
                ${events.map(event => `
                    <article
    class="campus-event-card"
    data-event-index="${events.indexOf(event)}"
    role="button"
    tabindex="0"
    aria-label="View details for ${event.title}">

    <span class="event-category">${event.category}</span>

    <h2>${event.title}</h2>

    <p>${event.description}</p>

    <div class="event-details">
        <span>
            📅 ${new Date(event.date + "T00:00:00")
                .toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}
        </span>

        <span>◷ ${event.time}</span>
        <span>📍 ${event.venue}</span>
    </div>

    <span class="event-view-more">View event details ↗</span>
</article>
                `).join("")}
            </div>
            <div class="event-modal" id="eventModal" hidden>
    <div
        class="event-modal-backdrop"
        data-close-event-modal>
    </div>

    <div
        class="event-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="eventModalTitle">

        <button
            type="button"
            class="event-modal-close"
            id="closeEventModal"
            aria-label="Close event details">
            &times;
        </button>

        <span class="event-category" id="eventModalCategory"></span>

        <h2 id="eventModalTitle"></h2>

        <p id="eventModalDescription"></p>

        <div class="event-modal-details">
            <p>📅 <strong>Date:</strong> <span id="eventModalDate"></span></p>
            <p>◷ <strong>Time:</strong> <span id="eventModalTime"></span></p>
            <p>📍 <strong>Venue:</strong> <span id="eventModalVenue"></span></p>
        </div>

        <button
            type="button"
            class="primary-button"
            id="eventInterestButton">
            Register Interest
        </button>
    </div>
</div>
            <p class="events-demo-note">
                Demo events only. Dates and registration must be confirmed
                before these are used as official college events.
            </p>

            <button
                type="button"
                class="primary-button"
                id="eventsBackButton">
                ← Back to Dashboard
            </button>
        </div>
    `;

    secondaryView.hidden = false;
    dashboardContent.hidden = true;

    setActiveLink("campus-events");

    if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = "Campus Events";
    }

    secondaryView
        .querySelector("#eventsBackButton")
        .addEventListener("click", showDashboard);

    const eventModal = secondaryView.querySelector("#eventModal");
const closeEventModal = secondaryView.querySelector("#closeEventModal");
const eventInterestButton = secondaryView.querySelector("#eventInterestButton");

let selectedEvent = null;

function openEventModal(index) {
    selectedEvent = events[index];

    if (!selectedEvent) return;

    secondaryView.querySelector("#eventModalCategory").textContent =
        selectedEvent.category;

    secondaryView.querySelector("#eventModalTitle").textContent =
        selectedEvent.title;

    secondaryView.querySelector("#eventModalDescription").textContent =
        selectedEvent.description;

    secondaryView.querySelector("#eventModalDate").textContent =
        new Date(selectedEvent.date + "T00:00:00").toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    secondaryView.querySelector("#eventModalTime").textContent =
        selectedEvent.time;

    secondaryView.querySelector("#eventModalVenue").textContent =
        selectedEvent.venue;

    eventModal.hidden = false;
    closeEventModal.focus();
}

function hideEventModal() {
    eventModal.hidden = true;
}

secondaryView.querySelectorAll(".campus-event-card").forEach(card => {
    card.addEventListener("click", () => {
        openEventModal(Number(card.dataset.eventIndex));
    });

    card.addEventListener("keydown", event => {
        if (event.target !== card) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openEventModal(Number(card.dataset.eventIndex));
        }
    });
});

closeEventModal.addEventListener("click", hideEventModal);

eventModal.querySelector("[data-close-event-modal]")
    .addEventListener("click", hideEventModal);

eventModal.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        hideEventModal();
    }
});

eventInterestButton.addEventListener("click", () => {
    if (!selectedEvent) return;

    alert(
        `Demo only: interest noted for ${selectedEvent.title}. ` +
        "Online registration is not connected yet."
    );
});

    window.scrollTo({ top: 0, behavior: "smooth" });
}


    function showSecondaryPage(section) {
        if (section === "attendance") {
            renderAttendance();
            return;
        }

        if (section === "timetable") {
            renderTimetable();
            return;
        }

        if (section === "profile") {
            renderProfile();
            return;
        }

        if (section === "campus-events") {
    renderCampusEvents();
    return;
}
    }

    // Navigation
    navLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            const section = link.dataset.section;
            closeSidebar();

            if (section === "overview") {
                showDashboard();
                return;
            }

            if (
    section === "profile" ||
    section === "attendance" ||
    section === "timetable" ||
    section === "campus-events"
) {
    setActiveLink(section);

    if (breadcrumbCurrent) {
        const breadcrumbNames = {
            profile: "My Profile",
            attendance: "Attendance",
            timetable: "Timetable",
            "campus-events": "Campus Events"
        };

        breadcrumbCurrent.textContent = breadcrumbNames[section];
    }

    showSecondaryPage(section);
    return;
}

            if (section === "announcements") {
                showDashboard();
                setActiveLink(section);

                if (breadcrumbCurrent) {
                    breadcrumbCurrent.textContent = "Announcements";
                }

                document.getElementById("announcements")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    backToDashboard?.addEventListener("click", showDashboard);

    // Demo notifications
    // Announcements: search, category filter and details popup
const announcementSearch =
    document.getElementById("announcementSearch");

const announcementFilter =
    document.getElementById("announcementFilter");

const announcementList =
    document.getElementById("announcementList");

const announcementCount =
    document.getElementById("announcementCount");

const announcementEmpty =
    document.getElementById("announcementEmpty");

const announcementModal =
    document.getElementById("announcementModal");

const closeAnnouncementModal =
    document.getElementById("closeAnnouncementModal");

const announcementModalDone =
    document.getElementById("announcementModalDone");

const announcementModalBackdrop =
    document.getElementById("announcementModalBackdrop");

let previouslyFocusedAnnouncement = null;

function filterAnnouncements() {
    if (!announcementList) return;

    const searchText =
        announcementSearch.value.trim().toLowerCase();

    const selectedCategory = announcementFilter.value;

    const cards = announcementList.querySelectorAll(
        ".announcement-clickable"
    );

    let visibleCount = 0;

    cards.forEach(card => {
        const matchesSearch =
            card.textContent.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            card.dataset.category === selectedCategory;

        const visible = matchesSearch && matchesCategory;

        card.hidden = !visible;

        if (visible) visibleCount++;
    });

    announcementCount.textContent =
        String(visibleCount).padStart(2, "0");

    announcementEmpty.hidden = visibleCount !== 0;
}

function openAnnouncement(card) {
    previouslyFocusedAnnouncement = card;

    document.getElementById("announcementModalCategory").textContent =
        card.dataset.category.toUpperCase();

    document.getElementById("announcementModalTitle").textContent =
        card.dataset.title;

    document.getElementById("announcementModalMessage").textContent =
        card.dataset.message;

    document.getElementById("announcementModalPublisher").textContent =
        card.dataset.publisher;

    document.getElementById("announcementModalDate").textContent =
        card.dataset.date;

    document.getElementById("announcementModalPriority").textContent =
        card.dataset.priority;

    announcementModal.hidden = false;
    closeAnnouncementModal.focus();
}

function closeAnnouncement() {
    announcementModal.hidden = true;

    if (previouslyFocusedAnnouncement) {
        previouslyFocusedAnnouncement.focus();
    }
}

if (announcementSearch && announcementFilter && announcementList) {
    announcementSearch.addEventListener(
        "input",
        filterAnnouncements
    );

    announcementFilter.addEventListener(
        "change",
        filterAnnouncements
    );

    announcementList
        .querySelectorAll(".announcement-clickable")
        .forEach(card => {
            card.addEventListener("click", () => {
                openAnnouncement(card);
            });

            card.addEventListener("keydown", event => {
                if (event.target !== card) return;

                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openAnnouncement(card);
                }
            });
        });
}

closeAnnouncementModal.addEventListener(
    "click",
    closeAnnouncement
);

announcementModalDone.addEventListener(
    "click",
    closeAnnouncement
);

announcementModalBackdrop.addEventListener(
    "click",
    closeAnnouncement
);

document.addEventListener("keydown", event => {
    if (
        event.key === "Escape" &&
        announcementModal &&
        !announcementModal.hidden
    ) {
        closeAnnouncement();
    }
});
    // =========================================
// NOTIFICATION SYSTEM
// =========================================

const notificationButton = document.getElementById("notificationButton");
const notificationPanel = document.getElementById("notificationPanel");
const notificationBadge = document.getElementById("notificationBadge");
const notificationList = document.getElementById("notificationList");
const notificationCount = document.getElementById("notificationCount");
const markAllNotificationsRead = document.getElementById(
    "markAllNotificationsRead"
);

// Sample notifications for frontend testing.
// These will later be replaced with Django backend data.
const notificationData = [
    {
        id: 1,
        title: "Attendance Reminder",
        message: "Check your attendance records and make sure they are up to date.",
        time: "Today",
        icon: "📚",
        target: "attendance"
    },
    {
        id: 2,
        title: "Campus Announcement",
        message: "Visit the announcements section to check the latest campus updates.",
        time: "Today",
        icon: "📢",
        target: "announcements"
    },
    {
        id: 3,
        title: "Campus Events",
        message: "Explore upcoming campus events and activities.",
        time: "Today",
        icon: "🎓",
        target: "campus-events"
    }
];

// Track read notifications in this browser.
const notificationStorageKey = "uniOrbitReadNotifications";

let readNotificationIds = [];

try {
    const storedReadIds = JSON.parse(
        localStorage.getItem(notificationStorageKey) || "[]"
    );

    if (Array.isArray(storedReadIds)) {
        readNotificationIds = storedReadIds;
    }
} catch (error) {
    readNotificationIds = [];
}

function saveReadNotifications() {
    try {
        localStorage.setItem(
            notificationStorageKey,
            JSON.stringify(readNotificationIds)
        );
    } catch (error) {
        console.warn("Could not save notification status.", error);
    }
}

function renderNotifications() {
    if (!notificationList) return;

    const unreadNotifications = notificationData.filter(
        notification => !readNotificationIds.includes(notification.id)
    );

    // Update unread badge.
    if (notificationBadge) {
        notificationBadge.textContent = unreadNotifications.length;
        notificationBadge.hidden = unreadNotifications.length === 0;
    }

    // Update notification count.
    if (notificationCount) {
        notificationCount.textContent =
            unreadNotifications.length === 0
                ? "You're all caught up!"
                : `${unreadNotifications.length} unread notification${
                    unreadNotifications.length === 1 ? "" : "s"
                }`;
    }

    // Show empty state if no notifications exist.
    if (notificationData.length === 0) {
        notificationList.innerHTML = `
            <div class="notification-empty">
                No notifications yet.
            </div>
        `;
        return;
    }

    notificationList.innerHTML = notificationData.map(notification => {
        const isUnread = !readNotificationIds.includes(notification.id);

        return `
            <button
                type="button"
                class="notification-item ${isUnread ? "unread" : ""}"
                data-notification-id="${notification.id}"
                data-notification-target="${notification.target}"
            >
                <span class="notification-icon">
                    ${notification.icon}
                </span>

                <span class="notification-content">
                    <span class="notification-title">
                        ${notification.title}
                    </span>

                    <span class="notification-message">
                        ${notification.message}
                    </span>

                    <span class="notification-time">
                        ${notification.time}
                    </span>
                </span>
            </button>
        `;
    }).join("");
}

// Open and close the notification panel.
notificationButton?.addEventListener("click", event => {
    event.stopPropagation();

    if (!notificationPanel) return;

    const isCurrentlyOpen = !notificationPanel.hidden;

    notificationPanel.hidden = isCurrentlyOpen;
    notificationButton.setAttribute(
        "aria-expanded",
        String(!isCurrentlyOpen)
    );
});

// Keep clicks inside the panel from closing it.
notificationPanel?.addEventListener("click", event => {
    event.stopPropagation();
});

// Close the panel when clicking outside.
document.addEventListener("click", () => {
    if (!notificationPanel || !notificationButton) return;

    notificationPanel.hidden = true;
    notificationButton.setAttribute("aria-expanded", "false");
});

// Mark all notifications as read.
markAllNotificationsRead?.addEventListener("click", () => {
    readNotificationIds = notificationData.map(
        notification => notification.id
    );

    saveReadNotifications();
    renderNotifications();
});

// Mark an individual notification as read and navigate to its section.
notificationList?.addEventListener("click", event => {
    const notificationItem = event.target.closest(
        "[data-notification-id]"
    );

    if (!notificationItem) return;

    const notificationId = Number(
        notificationItem.dataset.notificationId
    );

    const targetSection = notificationItem.dataset.notificationTarget;

    if (!readNotificationIds.includes(notificationId)) {
        readNotificationIds.push(notificationId);
        saveReadNotifications();
    }

    renderNotifications();

    if (notificationPanel) {
        notificationPanel.hidden = true;
    }

    if (notificationButton) {
        notificationButton.setAttribute("aria-expanded", "false");
    }

    // Use the dashboard's existing navigation.
    const targetLink = document.querySelector(
        `.nav-link[data-section="${targetSection}"]`
    );

    targetLink?.click();
});

// Initial render.
renderNotifications();

// Load the saved student information into the dashboard.
updateStudentAccountBanner();

    showDashboard();
});
