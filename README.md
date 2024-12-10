# **Brukerveiledning for Kalenderapplikasjon (Beta version)** 

## **Introduksjon**
Denne brukerveiledningen gjelder for **beta-versjonen** av kalenderapplikasjonen. Applikasjonen er under utvikling, og nye funksjoner vil bli lagt til i fremtidige versjoner. I denne versjonen kan brukeren:

- Opprette hendelser med detaljer som dato, tid, beskrivelse og sted.
- Navigere gjennom en oversiktlig kalender som viser alle hendelsene som bruker legger til.

**Merk: Funksjonen for å opprette nye brukere er ikke tilgjengelig i denne versjonen, men den vil bli lagt til snart.**

--- 
Hensikten med applikasjonen er å gi brukeren en enkel måte å organisere sitt daglige liv og arbeidsoppgaver. Alt lagres trygt i en MariaDB/MySQL-database, slik at informasjonen til brukeren er tilgjengelig når brukeren trenger det. Enten det brukes til personlige oppgaver eller profesjonelle arrangementer, er denne kalenderapplikasjonen laget for å være fleksibel og intuitiv.

---

## **Hva trenger du?**

For å bruke applikasjonen, må du ha følgende:
- Tilgang til en MariaDB/MySQL-database med riktig oppsett.

### **Installasjon**
1. **Last ned applikasjonen:**
   - Applikasjonen ligger på GitHub, klon den til datamaskinen din med:

     ```bash
     git clone https://github.com/lauryteey/Monthly-calender
     ```
   - Eller last ned ZIP-filen og pakk den ut.

2. **Installer nødvendige avhengigheter:**
   - Sørg for at Python er installert.
   - Installer avhengigheter med:

     ```bash
     pip install flask mysql-connector-python
     ```

3. **Start applikasjonen:**
   - Gå til mappen der filene ligger.
   - Start applikasjonen:

     ```bash
     python app.py
     ```
   - Åpne nettleseren og gå til: `http://localhost:5000`.

---

## **Hvordan bruke applikasjonen**

### **1. Logge inn**
For å teste applikasjonen, bruk følgende eksisterende konto i databasen:

- Gå til innloggingssiden.
- **E-post:** `testbruker@example.com`
- **Passord:** `test1234`
- Klikk på **Logg inn**.
- Hvis du har skrevet riktig informasjon, vil du bli sendt til kalendersiden. Hvis ikke, vil en feilmelding vises.

---
### **3. Vise kalenderen**
- Etter at du logger inn, vil du se kalenderen.
- Hendelser vises på datoene de er planlagt.
- Klikk på en dato for å se detaljer om hendelser.

---

### **2. Opprette en ny hendelse**
1. Klikk på knappen **Legg til hendelse**.
2. Fyll ut skjemaet:

   - **Dato og tid**: Velg dato og tid for hendelsen.
   - **Navn på hendelsen**: Beskriv hva hendelsen handler om.
   - **Sted**: Skriv inn hvor hendelsen finner sted.
   - **Påminnelse (valgfritt)**: Velg om du vil ha en påminnelse før hendelsen.

3. Klikk **Lagre** for å lagre hendelsen.

---

## **Funksjoner forklart**

### **a. Logg inn**
- Bruker e-post og passord for å bekrefte hvem du er.
- Hvis brukeren finnes i databasen og passordet er riktig, får du tilgang til kalenderen.

### **b. Opprette hendelser**
- Lagrer informasjon om hendelser i databasen.
- Brukes for å holde oversikt over hva som skjer og når.

### **c. Kalender**
- Viser hendelsene dine på en oversiktlig måte.
- Gir deg tilgang til å navigere mellom datoer.

### **d. Påminnelser**
- **(Kommende funksjon)**: Sender e-postpåminnelser 1 time eller 10 minutter før hendelsen starter.


---

## **Kommende funksjoner**
- **Opprette bruker:** I neste versjon vil brukerne kunne registrere seg og opprette sine egne kontoer.
- **Påminnelser:** E-postpåminnelser vil bli sendt 1 time eller 10 minutter før en hendelse.
- **Redigere og slette hendelser:** Brukere vil kunne oppdatere eller fjerne eksisterende hendelser.

---

## **Vanlige problemer og løsninger**

### Problem: Får ikke logget inn.
- **Løsning**: Sørg for at e-postadressen og passordet er riktig. Hvis problemet vedvarer, kontakt administrator.

### Problem: Hendelser lagres ikke.
- **Løsning**: Sjekk at databasen er riktig konfigurert og aktiv.

### Problem: Feil under tilkobling til databasen.
- **Løsning**: Forsikre deg om at MariaDB/MySQL-serveren kjører, og at brukerrettighetene er satt opp korrekt.

---

## **Kontaktinformasjon**
Hvis du trenger hjelp eller du vil gi meg din mening om aplikasjonen, vennligst kontakt meg på **laurafabiola.s.a@gmail.com**.

