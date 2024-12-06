let date = new Date(); // Oppretter en ny dato
let year = date.getFullYear(); // Henter år
let month = date.getMonth(); // Henter måned

const day = document.querySelector(".calendar-dates"); // Henter elementet for datoer
const currentdate = document.querySelector(".calendar-current-date"); // Henter elementet for dagens dato
const prenexIcons = document.querySelectorAll(".calendar-navigation span"); // ikonene for å navigere

// Array med navn på månedene
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

// Lager en HTML-representasjon av en dato
const createDateElement = (dayNumber, isActive = false, isInactive = false) => {
    const activeClass = isActive ? "active" : ""; // Setter aktiv klasse hvis aktiv
    const inactiveClass = isInactive ? "inactive" : ""; // Setter inaktiv klasse hvis inaktiv
    return `<li class="${activeClass} ${inactiveClass}">${dayNumber}</li>`; // Returnerer HTML for datoen
};

// Legger til datoer fra forrige måned
const addPreviousMonthDays = (dayone, monthlastdate) => {
    let result = "";
    for (let i = dayone; i > 0; i--) {
        result += createDateElement(monthlastdate - i + 1, false, true); // Legger til datoer som inaktive
    }
    return result;
};

// Legger til datoer for måned
const addCurrentMonthDays = (lastdate, currentdate, month, year) => {
    let result = "";
    for (let i = 1; i <= lastdate; i++) {
        const isToday = i === currentdate.getDate() && month === currentdate.getMonth() && year === currentdate.getFullYear();
        result += createDateElement(i, isToday); // Marker dagens dato
    }
    return result;
};

// Legger til datoer for neste måned
const addNextMonthDays = (dayend) => {
    let result = "";
    for (let i = dayend; i < 6; i++) {
        result += createDateElement(i - dayend + 1, false, true); // Legger til datoer som inaktive
    }
    return result;
};

// Hovedfunksjon som oppdaterer kalenderen
const manipulate = () => {
    const currentdate = new Date(); // Henter dagens dato
    const dayone = new Date(year, month, 1).getDay(); // Første dag i måneden
    const lastdate = new Date(year, month + 1, 0).getDate(); // Siste dato i måneden
    const dayend = new Date(year, month, lastdate).getDay(); // Siste ukedag
    const monthlastdate = new Date(year, month, 0).getDate(); // Forrige måneds siste dag

    let lit = ""; // Starter med tomt HTML-innhold
    for (let i = dayone; i > 0; i--) {
        lit += createDateElement(monthlastdate - i + 1, false, true); // Legger til forrige måneds datoer
    }
    for (let i = 1; i <= lastdate; i++) {
        const isToday = i === date.getDate() && month === date.getMonth() && year === date.getFullYear();
        lit += createDateElement(i, isToday); // Legger til dagens dato
    }
    for (let i = dayend; i < 6; i++) {
        lit += createDateElement(i - dayend + 1, false, true); // Legger til neste måneds datoer
    }

    // Sikrer at elementet finnes og oppdaterer teksten for nåværende dato
    if (!currentdate) {
        console.error("Element med klassen 'calendar-current-date' finnes ikke i HTML-en."); // Feilmelding hvis element mangler
        return; // Stopper hele koden fra å kjøre hvis elementet ikke finnes. JEG HATER JS, JEG SKAL DØ
    } else {
        currentdate.innerText = `${months[month]} ${year}`; // Oppdaterer måned og år
        console.log(currentdate)
    }

    if (day) {
        day.innerHTML = lit; // Oppdaterer HTML for datoene
    }
};

manipulate(); // Kaller funksjonen for å oppdatere kalenderen

// Legger til hendelse på navigasjonsknapper
prenexIcons.forEach(icon => {
    icon.addEventListener("click", () => {
        month = icon.id === "calendar-prev" ? month - 1 : month + 1; // Endrer måned

        if (month < 0 || month > 11) { // Håndterer grenseverdier for måned
            date = new Date(year, month, 1);
            year = date.getFullYear();
            month = date.getMonth();
        }

        manipulate(); // Oppdaterer kalenderen
    });
});


function handleEventCreation() {
    const eventDate = document.getElementById('event-date').value;
    const eventName = document.getElementById('event-name').value;
    const eventPlace = document.getElementById('event-place').value;
    const notification = document.getElementById('notification').value;

    if (!eventDate || !eventName || !eventPlace) {
        alert("Vennligst fyll ut alle nødvendige felter.");
        return;
    }

    const eventData = {
        dato: eventDate.split('T')[0],
        klokkeslett: eventDate.split('T')[1],
        beskrivelse: eventName,
        navn_prosjektet: eventPlace,
        notification: notification,
    };

    fetch('/add_event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
    })
        .then(response => {
            if (response.ok) return response.json();
            throw new Error('Kunne ikke lagre hendelsen.');
        })
        .then(result => {
            console.log('Hendelsen ble lagt til:', result.message);
            alert('Hendelsen ble lagret!');
        })
        .catch(error => {
            console.error('Feil under lagring av hendelsen:', error);
            alert('En feil oppsto under lagring av hendelsen.');
        });
}


document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const loginMessage = document.getElementById("login-message");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ e_post: email, passord: password }),
                });

                if (!response.ok) throw new Error("Innlogging mislyktes.");

                const result = await response.json();
                console.log("Innlogging vellykket, yay!:", result.message);
                window.location.href = result.redirect || "/calendar";
            } catch (error) {
                console.error("En feil oppsto under innlogging:", error);
                loginMessage.textContent = "Feil e-post eller passord.";
                loginMessage.style.color = "red";
            }
        });
    }
});
