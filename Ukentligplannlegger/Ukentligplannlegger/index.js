import { isHelg, fåDagsNavn } from "./date-helpers.js";

const kalender = document.querySelector("#app-kalender");

console.log(kalender)

// Så lenge dagen er mindre eller lik 31 fortsett å iterere og deretter vil hver iterasjon legge til en til dagen 



for (let dag = 1; dag < 31; dag += 1) {
    //console.log(dag)
    const date = new Date(Date.UTC(2024, 8, dag));
    //console.log(fåDagsNavn(dag))

    const helg = isHelg(dag)

    let navn = "";
    if (dag <= 7) { //sjekker om datoen er likt 7 
        const dayName = fåDagsNavn(dag);
        navn = `<div class="navn">${dayName}</div>`; //Grunnen til at dette er en variabel er fordi vi vil gjøre dette betinget
        console.log(dayName)
    }



    kalender.insertAdjacentHTML("beforeend", `<div class= "dag ${helg ? "helg" : ""}">${navn}${dag}</div>`);

}