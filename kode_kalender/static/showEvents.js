// Funksjon for å hente hendelser fra serveren og vise dem i HTML
async function fetchEvents() {
    try {
        // Forespørsel for å hente data fra endepunktet "/get_events"
        const response = await fetch("/get_events");
        if (!response.ok) {
            throw new Error("Kunne ikke hente hendelser"); // Feilmelding hvis forespørselen feiler
        }

        const events = await response.json(); // Konverterer JSON-respons til JavaScript-objekt

        const eventsList = document.getElementById("event-list"); // Henter elementet for å vise eventer
        if (!eventsList) {
            console.error("Element med id 'event-list' ble ikke funnet!"); // Logger feil hvis elementet mangler
            return;
        }

        // Genererer en boks for hver hendelse
        eventsList.innerHTML = events.map(event => {
            // Formatterer datoen for å vise kun dato-delen (YYYY-MM-DD)
            const formattedDate = event.dato.split("T")[0]; // Deler opp dato-strengen og tar første del (datoen)

            return `
                <div class="event-box"> <!-- En boks for hver hendelse -->
                    <p><strong>Dato:</strong> ${formattedDate}</p> <!-- Viser kun datoen -->
                    <p><strong>Klokkeslett:</strong> ${event.klokkeslett}</p> <!-- Viser klokkeslett -->
                    <p><strong>Navn:</strong> ${event.navn_prosjektet}</p> <!-- Viser navnet på hendelsen -->
                    <p><strong>Varsling:</strong> ${event.notification}</p> <!-- Viser varslingstype -->
                </div>
            `;
        }).join(""); // Kombinerer alle boksene til én string og legger dem i containeren
    } catch (error) {
        console.error("Feil under lasting av hendelser:", error); // Logger feil hvis noe går galt
    }
}


// Validate the element before fetching events
const validateElement = () => {
    const eventsList = document.getElementById("event-list");
    if (!eventsList) {
        console.error("Element med id 'event-list' ble ikke funnet!");
        return false;
    }
    return true;
};

// Run the script when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    if (validateElement()) {
        fetchEvents();
    }

    // Redirect to the calendar when "Add Event" is clicked
    const addEventBtn = document.getElementById("add-event-btn");
    if (addEventBtn) {
        addEventBtn.addEventListener("click", () => {
            window.location.href = "/calenderen"; // Redirect to the calendar page
        });
    }
});

// Omdirigerer "Legg til arrangement"-knappen til kalenderens side
document.getElementById('add-event-btn').addEventListener('click', () => {
    window.location.href = '/calenderen'; // Går til kalenderens URL
});