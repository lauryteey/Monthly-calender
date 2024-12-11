
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


// Redirect to sign-up page on button click
document.getElementById('signup-btn').addEventListener('click', () => {
    window.location.href = '/sign_up'; // Redirects to the sign-up route
});