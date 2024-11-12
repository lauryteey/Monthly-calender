let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const day = document.querySelector(".calendar-dates");

const currdate = document.querySelector(".calendar-current-date");

const prenexIcons = document.querySelectorAll(".calendar-navigation span");

// Array med månedsnavn
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

// Funksjon for å lage et datoelement
const createDateElement = (dayNumber, isActive = false, isInactive = false) => {
    const activeClass = isActive ? "active" : "";
    const inactiveClass = isInactive ? "inactive" : "";
    return `<li class="${activeClass} ${inactiveClass}">${dayNumber}</li>`;
};

// Funksjon for å legge til de siste datoene fra forrige måned
const addPreviousMonthDays = (dayone, monthlastdate) => {
    let result = "";
    for (let i = dayone; i > 0; i--) {
        result += createDateElement(monthlastdate - i + 1, false, true);
    }
    return result;
};

// Funksjon for å legge til datoene for den nåværende måneden
const addCurrentMonthDays = (lastdate, currentDate, month, year) => {
    let result = "";
    for (let i = 1; i <= lastdate; i++) {
        const isToday = i === currentDate.getDate() && month === currentDate.getMonth() && year === currentDate.getFullYear();
        result += createDateElement(i, isToday);
    }
    return result;
};

// Funksjon for å legge til de første datoene for neste måned
const addNextMonthDays = (dayend) => {
    let result = "";
    for (let i = dayend; i < 6; i++) {
        result += createDateElement(i - dayend + 1, false, true);
    }
    return result;
};

// Hovedfunksjon for å generere hele kalenderen
const manipulate = () => {
    const currentDate = new Date();
    const dayone = new Date(year, month, 1).getDay();
    const lastdate = new Date(year, month + 1, 0).getDate();
    const dayend = new Date(year, month, lastdate).getDay();
    const monthlastdate = new Date(year, month, 0).getDate();

    // Generer HTML-strengen for kalenderen
    let lit = "";
    lit += addPreviousMonthDays(dayone, monthlastdate);  // Legg til forrige måned
    lit += addCurrentMonthDays(lastdate, currentDate, month, year);  // Legg til nåværende måned
    lit += addNextMonthDays(dayend);  // Legg til neste måned

    // Oppdater teksten til det nåværende dato-elementet
    currdate.innerText = `${months[month]} ${year}`;

    // Oppdater HTML-en til dato-elementet med den genererte kalenderen
    day.innerHTML = lit;
};

manipulate();


// Fest en klikkhendelse til hvert ikon
prenexIcons.forEach(icon => {

    // Når et ikon blir klikket
    icon.addEventListener("click", () => {

        // Sjekk om ikonet er "calendar-prev" eller "calendar-next"
        month = icon.id === "calendar-prev" ? month - 1 : month + 1;

        // Sjekk om måneden er utenfor rekkevidde
        if (month < 0 || month > 11) {

            // Sett datoen til den første dagen i måneden med det nye året
            date = new Date(year, month, new Date().getDate());

            // Sett året til det nye året
            year = date.getFullYear();

            // Sett måneden til den nye måneden
            month = date.getMonth();
        } else {

            // Sett datoen til den nåværende datoen
            date = new Date();
        }

        // Kall manipulate-funksjonen for å oppdatere kalendervisningen
        manipulate();
    });
});
