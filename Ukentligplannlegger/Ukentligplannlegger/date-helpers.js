const isHelg = dag => {

    // 6 når det er lørdag, 0 når det er søndag
    
    return dag % 7 === 6|| dag % 7 === 0;
    
}



const fåDagsNavn = date=> {

  //Lager et datoobjekt for hver dag i gjeldende måned
    
  // 7 betyr august (månedene er 0-indeksert) 
  //Vi bruker Dtae.UTc for at den skal bli Timezone indepent
  
  date.setDate(dag);  //Justerer dagen i måneden

 //const options = { weekday: "short" };

 return new Intl.DateTimeFormat("nb-NO", { weekday: "short" })
 .format(date);
 
}
export {isHelg, fåDagsNavn}