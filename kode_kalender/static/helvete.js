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


// Funksjon for å håndtere opprettelse av hendelser
function handleEventCreation() {
    // Henter verdier fra inputfeltene
    const eventDate = document.getElementById('event-date').value; // Henter dato og klokkeslett fra inputfeltet
    const eventName = document.getElementById('event-name').value; // Henter navnet på hendelsen
    const eventPlace = document.getElementById('event-place').value; // Henter plasseringen av hendelsen

    // Sjekker om nødvendige felter er fylt ut
    if (!eventDate || !eventName || !eventPlace) {
        alert("Vennligst fyll ut alle nødvendige felter."); // Viser en melding hvis noen felter mangler
        return; // Stopper funksjonen hvis felter ikke er fylt ut
    }

    // Oppretter et JSON-objekt med dataen som skal sendes til backend
    const eventData = {
        dato: eventDate.split('T')[0], // Trekker ut datoen fra input (før "T")
        klokkeslett: eventDate.split('T')[1], // Trekker ut klokkeslettet fra input (etter "T")
        beskrivelse: eventName, // Setter hendelsesbeskrivelse
        navn_prosjektet: eventPlace, // Setter navnet på prosjektet/stedet
    };

    console.log("Sender hendelsesdata:", eventData); // Debug-melding for å vise hva som sendes til backend (Hvis det sendes noen engang LOL)

    // Sender data til serveren ved hjelp av fetch API
    fetch('/add_event', {
        method: 'POST', // Bruker POST-metoden for å sende data
        headers: { 'Content-Type': 'application/json' }, // Setter innholdstypen til JSON
        body: JSON.stringify(eventData), // Konverterer eventData til en JSON-streng
    })
        .then(async response => {
            // Sjekker om serveren svarte med en rikitg kode
            if (!response.ok) {
                // Hvis det oppstod en feil, prøver å hente feilmelding fra serveren
                const err = await response.json();
                throw new Error(err.error || 'Kunne ikke lagre hendelsen womp womp.');
            }
            return response.json(); // Returnerer serverens svar som et JSON-objekt
        })
        .then(result => {
            console.log('Hendelsen ble lagt til:', result.message); // Viser drømmenmeldingen om suksess i konsollen
            alert('Hendelsen ble lagret!'); // Viser en melding til brukeren om at hendelsen ble lagret (BIGGEST DREAM)
        })
        .catch(error => {
            console.error('Feil under lagring av hendelsen:', error); // Logger feilen i konsollen :(
            alert(error.message || 'En feil oppsto under lagring av hendelsen.'); // Viser en feilmelding til brukeren
        });
}

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
