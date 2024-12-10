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
    const currentdateObj = new Date(); // Oppretter et nytt Date-objekt for å hente dagens dato
    const dayone = new Date(year, month, 1).getDay(); // Finner ukedagen for den første dagen i måneden
    const lastdate = new Date(year, month + 1, 0).getDate(); // Finner siste dato i måneden
    const dayend = new Date(year, month, lastdate).getDay(); // Finner ukedagen for siste dato i måneden
    const monthlastdate = new Date(year, month, 0).getDate(); // Finner siste dato i forrige måned

    // Lager HTML-innholdet for datoene i kalenderen
    let lit = addPreviousMonthDays(dayone, monthlastdate); // Legger til datoene fra forrige måned
    lit += addCurrentMonthDays(lastdate, currentdateObj, month, year); // Legger til datoene for gjeldende måned
    lit += addNextMonthDays(dayend); // Legger til datoene for neste måned

    // Sjekker om elementet for nåværende dato finnes
    if (!currentdate) {
        console.error("Element med 'calendar-current-date'-klassen finnes ikke."); // Feilmelding hvis elementet mangler
        return; // Stopper funksjonen hvis elementet ikke finnes
    }

    currentdate.innerText = `${months[month]} ${year}`; // Oppdaterer teksten for nåværende måned og år
    day.innerHTML = lit; // Oppdaterer HTML-innholdet for datoene i kalenderen
    console.log(currentdate);
};


const attachDateListeners = () => {
    const dates = document.querySelectorAll(".calendar-dates li"); // Henter alle datoer i kalenderen
    dates.forEach(date => {
        date.addEventListener("click", () => {
            console.log("Dato klikket:", date.innerText); // Debug-melding
            showEventPopup(date.innerText); // Kaller funksjonen for å vise pop-up
        });
    });
};



manipulate(); // Kaller funksjonen for å oppdatere kalenderen
attachDateListeners()


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



// Legger til en submit-hendelse til skjemaet
document.getElementById('event-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Hindrer standard GET-innsending av skjemaet

    // Henter verdier fra skjemaet
    const eventName = document.getElementById('event-name').value;
    const eventDate = document.getElementById('event-date').value;
    const eventPlace = document.getElementById('event-place').value;

    // Validerer at alle nødvendige felter er fylt ut
    if (!eventName || !eventDate || !eventPlace) {
        alert("Vennligst fyll ut alle nødvendige felter."); // Viser feilmelding hvis felter mangler
        return;
    }

    // Oppretter JSON-data
    const formData = {
        dato: eventDate.split('T')[0], // Dato
        klokkeslett: eventDate.split('T')[1], // Klokkeslett
        beskrivelse: eventName,
        navn_prosjektet: eventPlace,
    };

    try {
        // Sender data via fetch API med POST-metode
        const response = await fetch('/add_event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            alert('Hendelsen ble lagret!'); // Suksessmelding
            hideEventPopup(); // Skjul popup
        } else {
            alert(result.error || 'Kunne ikke lagre hendelsen.');
        }
    } catch (error) {
        console.error('Feil under lagring:', error);
        alert('En feil oppsto. Vennligst prøv igjen.');
    }
});



// Funksjon for å vise pop-up når en dato klikkes
const showEventPopup = (selectedDate) => {
    // Henter pop-up-elementet og dato-input-feltet
    const popup = document.getElementById("event-modal");
    const eventDateInput = document.getElementById("event-date");

    // Sjekker at nødvendige elementer finnes
    if (!popup || !eventDateInput) {
        console.error("Pop-up-elementet eller dato-input mangler!");
        return; // Stopper funksjonen hvis elementer mangler
    }

    // Viser pop-up ved å fjerne "hidden"-klassen
    popup.classList.remove("hidden");

    // Henter dagens dato for å formatere valgt dato
    const today = new Date();
    const year = today.getFullYear(); // Finner år
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Finner måned og sikrer to sifre
    const day = String(selectedDate).padStart(2, "0"); // Sikrer to sifre for valgt dag

    // Kombinerer dato i ønsket format
    const formattedDate = `${year}-${month}-${day}T12:00`;

    // Setter formatert dato i input-feltet
    eventDateInput.value = formattedDate;
};




// Funksjon for å skjule pop-up etter lagring eller avbrytelse
const hideEventPopup = () => {
    const popup = document.getElementById("event-modal"); // Henter pop-up-elementet med riktig ID
    if (popup) {
        popup.classList.add("hidden"); // Legger til "hidden"-klassen for å skjule pop-up
    } else {
        console.error("Pop-up-elementet 'event-modal' finnes ikke!"); // Feilmelding hvis pop-up mangler
    }
};



// Kjøres når DOM-en (HTML-siden) er ferdig lastet
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form"); // Henter login-skjemaet fra HTML
    const loginMessage = document.getElementById("login-message"); // Henter elementet for å vise login-meldinger

    if (loginForm) {
        // Lytter etter innsending av skjemaet
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Hindrer standard innsending av skjemaet

            // Henter verdier fra inputfeltene for e-post og passord
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Sjekker om e-post og passord er fylt ut
            if (!email || !password) {
                loginMessage.textContent = "Vennligst fyll inn både e-post og passord."; // Viser feilmelding
                loginMessage.style.color = "red"; // Endrer tekstfargen til rød
                return; // Stopper funksjonen hvis felter mangler
            }

            try {
                // Sender login-data til serveren
                const response = await fetch("/login", {
                    method: "POST", // Bruker POST-metoden
                    headers: { "Content-Type": "application/json" }, // Setter innholdstypen til JSON
                    body: JSON.stringify({ e_post: email, passord: password }), // Konverterer e-post og passord til JSON
                });

                if (!response.ok) {
                    // Hvis login feilet, henter feilmeldingen fra serveren
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Innlogging mislyktes.");
                }

                const result = await response.json(); // Henter suksessdata fra serveren
                console.log("Innlogging vellykket, yay!:", result.message); // Logger suksessmeldingen
                window.location.href = result.redirect || "/calendar"; // Omadresserer brukeren til kalenderen
            } catch (error) {
                console.error("En feil oppsto under innlogging:", error); // Logger feilen i konsollen
                loginMessage.textContent = error.message || "Feil e-post eller passord."; // Viser feilmeldingen til brukeren
                loginMessage.style.color = "red"; // Endrer tekstfargen til rød
            }
        });
    }
});
