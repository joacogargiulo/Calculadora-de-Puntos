const matchesContainer = document.getElementById("matches-container");
const referenciasContainer = document.getElementById("referencias-container");
const ligasContainer = document.getElementById("ligas-container")
const tbody = document.getElementById("tabla-puntos");
const loadingScreen = document.getElementById("loading-screen");
const loadingP = document.getElementById("loading-p");
const h2LigaSeleccionada = document.getElementById("h2-liga-seleccionada");
const indicadorFecha = document.getElementById("indicador-fecha");

const selectorFechasContainer = document.getElementById("selector-fechas-container")
const fechaAnterior = document.getElementById("fecha-anterior")
const fechaSelect = document.getElementById("fecha-select")
const fechaSiguiente = document.getElementById("fecha-siguiente")

const urlAPI = "https://api-promiedos.onrender.com" // URL de producción
// const urlAPI = "http://localhost:5000" // URL de desarrollo

let cache = []
let tablaPuntos = []
let partidosRestantes = []
let currentFecha = null;
let partidoInvalido = false
let partidoEnJuego = false
let resultado1
let resultado2
let partidosEnJuego = []
let fechaSeleccionada = null

class Liga {
    constructor(nombre, url, imagen, copa1nombre, copa1cantidad, copa2nombre, copa2cantidad, copa3nombre, copa3cantidad, descensoCantidad, promocionCantidad) {
        this.nombre = nombre
        this.url = "https://www.promiedos.com.ar/" + url
        this.partidos = []
        this.imagen = "https://www.promiedos.com.ar/images/paises/" + imagen
        this.copa1nombre = copa1nombre
        this.copa1cantidad = copa1cantidad
        this.copa2nombre = copa2nombre
        this.copa2cantidad = copa2cantidad
        this.copa3nombre = copa3nombre
        this.copa3cantidad = copa3cantidad
        this.descensoCantidad = descensoCantidad
        this.promocionCantidad = promocionCantidad
    }
}


const ligas = [
    champions = new Liga ("Champions League", "championsleague", "mu.png", "Octavos de Final", 8, "Ronda Preliminar", 16, "", 0, 0, 0),
    laLiga = new Liga ("La Liga", "espana", "es.png", "Champions League", 4, "Europa League", 2, "Conference League", 1, 3, 0),
    premierLeague = new Liga ("Premier League", "inglaterra", "in.png", "Champions League", 4, "Europa League", 1, "Conference League", 1, 3, 0),
    bundesliga = new Liga ("Bundesliga", "alemania", "de.png", "Champions League", 5, "Europa League", 1, "Conference League", 1, 2, 1),
    ligue1 = new Liga("Ligue 1", "francia", "fr.png", "Champions League", 3, "Europa League", 1, "Conference League", 1, 2, 1),
    serieA = new Liga("Serie A", "italia", "it.png", "Champions League", 5, "Europa League", 1, "Conference League", 1, 3, 0),
    eredivise = new Liga("Eredivise", "paisesbajos", "nl.png", "Champions League", 2, "Conference League", 1, "playoff de clasificacion a copas", 5, 1, 2),
]


let ligaSeleccionada = serieA

ligas.forEach((liga) => {
    const boton = document.createElement('button')
    boton.innerText = liga.nombre
    const imagen = document.createElement('img')
    imagen.src = liga.imagen
    boton.appendChild(imagen)
    boton.addEventListener("click", async () => {
        ligaSeleccionada = liga
        await inicializar()
        actualizarPuntos()
    })
    ligasContainer.appendChild(boton)
})


const partidosChampions = [
    // Fecha 6
    { fecha: 6, equipo1: "Dinamo Zagreb", equipo2: "Celtic", resultado1, resultado2 },
    { fecha: 6, equipo1: "Girona", equipo2: "Liverpool", resultado1, resultado2 },
    { fecha: 6, equipo1: "Atalanta", equipo2: "Real Madrid", resultado1, resultado2 },
    { fecha: 6, equipo1: "B. Leverkusen", equipo2: "Inter", resultado1, resultado2 },
    { fecha: 6, equipo1: "Brest", equipo2: "PSV", resultado1, resultado2 },
    { fecha: 6, equipo1: "Brugge", equipo2: "Sporting Lisboa", resultado1, resultado2 },
    { fecha: 6, equipo1: "Salzburgo", equipo2: "PSG", resultado1, resultado2 },
    { fecha: 6, equipo1: "RB Leipzig", equipo2: "Aston Villa", resultado1, resultado2 },
    { fecha: 6, equipo1: "Shakhtar", equipo2: "Bayern Munich", resultado1, resultado2 },
    { fecha: 6, equipo1: "Atletico Madrid", equipo2: "Bratislava", resultado1, resultado2 },
    { fecha: 6, equipo1: "Lille", equipo2: "Sturm Graz", resultado1, resultado2 },
    { fecha: 6, equipo1: "Arsenal FC", equipo2: "Monaco", resultado1, resultado2 },
    { fecha: 6, equipo1: "Benfica", equipo2: "Bologna", resultado1, resultado2 },
    { fecha: 6, equipo1: "B. Dortmund", equipo2: "Barcelona", resultado1, resultado2 },
    { fecha: 6, equipo1: "Feyenoord", equipo2: "Sparta Praga", resultado1, resultado2 },
    { fecha: 6, equipo1: "Juventus", equipo2: "Manchester City", resultado1, resultado2 },
    { fecha: 6, equipo1: "Milan", equipo2: "Estrella Roja", resultado1, resultado2 },
    { fecha: 6, equipo1: "Stuttgart", equipo2: "Young Boys", resultado1, resultado2 },
    // FECHA 7
    { fecha: 7, equipo1: "Atalanta", equipo2: "Sturm Graz", resultado1, resultado2 },
    { fecha: 7, equipo1: "Monaco", equipo2: "Aston Villa", resultado1, resultado2 },
    { fecha: 7, equipo1: "Atletico Madrid", equipo2: "B. Leverkusen", resultado1, resultado2 },
    { fecha: 7, equipo1: "Benfica", equipo2: "Barcelona", resultado1, resultado2 },
    { fecha: 7, equipo1: "Bologna", equipo2: "B. Dortmund", resultado1, resultado2 },
    { fecha: 7, equipo1: "Brugge", equipo2: "Juventus", resultado1, resultado2 },
    { fecha: 7, equipo1: "Estrella Roja", equipo2: "PSV", resultado1, resultado2 },
    { fecha: 7, equipo1: "Liverpool", equipo2: "Lille", resultado1, resultado2 },
    { fecha: 7, equipo1: "Bratislava", equipo2: "Stuttgart", resultado1, resultado2 },
    { fecha: 7, equipo1: "RB Leipzig", equipo2: "Sporting Lisboa", resultado1, resultado2 },
    { fecha: 7, equipo1: "Shakhtar", equipo2: "Brest", resultado1, resultado2 },
    { fecha: 7, equipo1: "Arsenal FC", equipo2: "Dinamo Zagreb", resultado1, resultado2 },
    { fecha: 7, equipo1: "Celtic", equipo2: "Young Boys", resultado1, resultado2 },
    { fecha: 7, equipo1: "Feyenoord", equipo2: "Bayern Munich", resultado1, resultado2 },
    { fecha: 7, equipo1: "Milan", equipo2: "Girona", resultado1, resultado2 },
    { fecha: 7, equipo1: "PSG", equipo2: "Manchester City", resultado1, resultado2 },
    { fecha: 7, equipo1: "Real Madrid", equipo2: "Salzburgo", resultado1, resultado2 },
    { fecha: 7, equipo1: "Sparta Praga", equipo2: "Inter", resultado1, resultado2 },
    // FECHA 8
    { fecha: 8, equipo1: "Aston Villa", equipo2: "Celtic", resultado1, resultado2 },
    { fecha: 8, equipo1: "Barcelona", equipo2: "Atalanta", resultado1, resultado2 },
    { fecha: 8, equipo1: "B. Leverkusen", equipo2: "Sparta Praga", resultado1, resultado2 },
    { fecha: 8, equipo1: "B. Dortmund", equipo2: "Shakhtar", resultado1, resultado2 },
    { fecha: 8, equipo1: "Brest", equipo2: "Real Madrid", resultado1, resultado2 },
    { fecha: 8, equipo1: "Dinamo Zagreb", equipo2: "Milan", resultado1, resultado2 },
    { fecha: 8, equipo1: "Bayern Munich", equipo2: "Bratislava", resultado1, resultado2 },
    { fecha: 8, equipo1: "Salzburgo", equipo2: "Atletico Madrid", resultado1, resultado2 },
    { fecha: 8, equipo1: "Girona", equipo2: "Arsenal FC", resultado1, resultado2 },
    { fecha: 8, equipo1: "Inter", equipo2: "Monaco", resultado1, resultado2 },
    { fecha: 8, equipo1: "Juventus", equipo2: "Benfica", resultado1, resultado2 },
    { fecha: 8, equipo1: "Lille", equipo2: "Feyenoord", resultado1, resultado2 },
    { fecha: 8, equipo1: "Manchester City", equipo2: "Brugge", resultado1, resultado2 },
    { fecha: 8, equipo1: "PSV", equipo2: "Liverpool", resultado1, resultado2 },
    { fecha: 8, equipo1: "Sturm Graz", equipo2: "RB Leipzig", resultado1, resultado2 },
    { fecha: 8, equipo1: "Sporting Lisboa", equipo2: "Bologna", resultado1, resultado2 },
    { fecha: 8, equipo1: "Stuttgart", equipo2: "PSG", resultado1, resultado2 },
    { fecha: 8, equipo1: "Young Boys", equipo2: "Estrella Roja", resultado1, resultado2 },
];

const partidosLaLiga = [
    // Fecha 16
    { fecha: 16, equipo1: "Getafe", equipo2: "Espanyol", resultado1, resultado2 },
    // Fecha 17
    { fecha: 17, equipo1: "Valladolid", equipo2: "Valencia", resultado1, resultado2 },
    { fecha: 17, equipo1: "Espanyol", equipo2: "Osasuna", resultado1, resultado2 },
    { fecha: 17, equipo1: "Mallorca", equipo2: "Girona", resultado1, resultado2 },
    { fecha: 17, equipo1: "Sevilla", equipo2: "Celta de Vigo", resultado1, resultado2 },
    { fecha: 17, equipo1: "Rayo Vallecano", equipo2: "Real Madrid", resultado1, resultado2 },
    { fecha: 17, equipo1: "Atletico Madrid", equipo2: "Getafe", resultado1, resultado2 },
    { fecha: 17, equipo1: "Alaves", equipo2: "Athletic Bilbao", resultado1, resultado2 },
    { fecha: 17, equipo1: "Real Sociedad", equipo2: "Las Palmas", resultado1, resultado2 },
    { fecha: 17, equipo1: "Villarreal", equipo2: "Betis", resultado1, resultado2 },
    { fecha: 17, equipo1: "Barcelona", equipo2: "Leganes", resultado1, resultado2 },

    // Fecha 18
    { fecha: 18, equipo1: "Girona", equipo2: "Valladolid", resultado1, resultado2 },
    { fecha: 18, equipo1: "Getafe", equipo2: "Mallorca", resultado1, resultado2 },
    { fecha: 18, equipo1: "Celta de Vigo", equipo2: "Real Sociedad", resultado1, resultado2 },
    { fecha: 18, equipo1: "Osasuna", equipo2: "Athletic Bilbao", resultado1, resultado2 },
    { fecha: 18, equipo1: "Barcelona", equipo2: "Atletico Madrid", resultado1, resultado2 },
    { fecha: 18, equipo1: "Valencia", equipo2: "Alaves", resultado1, resultado2 },
    { fecha: 18, equipo1: "Real Madrid", equipo2: "Sevilla", resultado1, resultado2 },
    { fecha: 18, equipo1: "Las Palmas", equipo2: "Espanyol", resultado1, resultado2 },
    { fecha: 18, equipo1: "Leganes", equipo2: "Villarreal", resultado1, resultado2 },
    { fecha: 18, equipo1: "Betis", equipo2: "Rayo Vallecano", resultado1, resultado2 },

    // Fecha 19
    { fecha: 19, equipo1: "Rayo Vallecano", equipo2: "Celta de Vigo", resultado1, resultado2 },
    { fecha: 19, equipo1: "Alaves", equipo2: "Girona", resultado1, resultado2 },
    { fecha: 19, equipo1: "Valladolid", equipo2: "Betis", resultado1, resultado2 },
    { fecha: 19, equipo1: "Espanyol", equipo2: "Leganes", resultado1, resultado2 },
    { fecha: 19, equipo1: "Sevilla", equipo2: "Valencia", resultado1, resultado2 },
    { fecha: 19, equipo1: "Las Palmas", equipo2: "Getafe", resultado1, resultado2 },
    { fecha: 19, equipo1: "Atletico Madrid", equipo2: "Osasuna", resultado1, resultado2 },
    { fecha: 19, equipo1: "Real Sociedad", equipo2: "Villarreal", resultado1, resultado2 },

    // Fecha 20
    { fecha: 20, equipo1: "Celta de Vigo", equipo2: "Athletic Bilbao", resultado1, resultado2 },
    { fecha: 20, equipo1: "Espanyol", equipo2: "Valladolid", resultado1, resultado2 },
    { fecha: 20, equipo1: "Getafe", equipo2: "Barcelona", resultado1, resultado2 },
    { fecha: 20, equipo1: "Girona", equipo2: "Sevilla", resultado1, resultado2 },
    { fecha: 20, equipo1: "Leganes", equipo2: "Atletico Madrid", resultado1, resultado2 },
    { fecha: 20, equipo1: "Osasuna", equipo2: "Rayo Vallecano", resultado1, resultado2 },
    { fecha: 20, equipo1: "Betis", equipo2: "Alaves", resultado1, resultado2 },
    { fecha: 20, equipo1: "Real Madrid", equipo2: "Las Palmas", resultado1, resultado2 },
    { fecha: 20, equipo1: "Valencia", equipo2: "Real Sociedad", resultado1, resultado2 },
    { fecha: 20, equipo1: "Villarreal", equipo2: "Mallorca", resultado1, resultado2 },
];

const partidosPremierLeague = [
    // Fecha 15
    { fecha: 15, equipo1: 'Everton', equipo2: 'Liverpool', resultado1, resultado2 },

    // Fecha 16
    { fecha: 16, equipo1: "Arsenal FC", equipo2: "Everton", resultado1, resultado2 },
    { fecha: 16, equipo1: "Liverpool", equipo2: "Fulham", resultado1, resultado2 },
    { fecha: 16, equipo1: "Newcastle", equipo2: "Leicester City", resultado1, resultado2 },
    { fecha: 16, equipo1: "Wolverhampton", equipo2: "Ipswich Town", resultado1, resultado2 },
    { fecha: 16, equipo1: "Nottingham Forest", equipo2: "Aston Villa", resultado1, resultado2 },
    { fecha: 16, equipo1: "Brighton And Hove", equipo2: "Crystal Palace", resultado1, resultado2 },
    { fecha: 16, equipo1: "Manchester City", equipo2: "Manchester United", resultado1, resultado2 },
    { fecha: 16, equipo1: "Chelsea", equipo2: "Brentford", resultado1, resultado2 },
    { fecha: 16, equipo1: "Southampton", equipo2: "Tottenham", resultado1, resultado2 },
    { fecha: 16, equipo1: "Bournemouth", equipo2: "West Ham", resultado1, resultado2 },

    // Fecha 17
    { fecha: 17, equipo1: "Aston Villa", equipo2: "Manchester City", resultado1, resultado2 },
    { fecha: 17, equipo1: "Brentford", equipo2: "Nottingham Forest", resultado1, resultado2 },
    { fecha: 17, equipo1: "Crystal Palace", equipo2: "Arsenal FC", resultado1, resultado2 },
    { fecha: 17, equipo1: "Ipswich Town", equipo2: "Newcastle", resultado1, resultado2 },
    { fecha: 17, equipo1: "West Ham", equipo2: "Brighton And Hove", resultado1, resultado2 },
    { fecha: 17, equipo1: "Everton", equipo2: "Chelsea", resultado1, resultado2 },
    { fecha: 17, equipo1: "Fulham", equipo2: "Southampton", resultado1, resultado2 },
    { fecha: 17, equipo1: "Leicester City", equipo2: "Wolverhampton", resultado1, resultado2 },
    { fecha: 17, equipo1: "Manchester United", equipo2: "Bournemouth", resultado1, resultado2 },
    { fecha: 17, equipo1: "Tottenham", equipo2: "Liverpool", resultado1, resultado2 },

    // Fecha 18
    { fecha: 18, equipo1: "Manchester City", equipo2: "Everton", resultado1, resultado2 },
    { fecha: 18, equipo1: "Bournemouth", equipo2: "Crystal Palace", resultado1, resultado2 },
    { fecha: 18, equipo1: "Newcastle", equipo2: "Aston Villa", resultado1, resultado2 },
    { fecha: 18, equipo1: "Southampton", equipo2: "West Ham", resultado1, resultado2 },
    { fecha: 18, equipo1: "Chelsea", equipo2: "Fulham", resultado1, resultado2 },
    { fecha: 18, equipo1: "Nottingham Forest", equipo2: "Tottenham", resultado1, resultado2 },
    { fecha: 18, equipo1: "Wolverhampton", equipo2: "Manchester United", resultado1, resultado2 },
    { fecha: 18, equipo1: "Liverpool", equipo2: "Leicester City", resultado1, resultado2 },
    { fecha: 18, equipo1: "Brighton And Hove", equipo2: "Brentford", resultado1, resultado2 },
    { fecha: 18, equipo1: "Arsenal FC", equipo2: "Ipswich Town", resultado1, resultado2 },

    // Fecha 19
    { fecha: 19, equipo1: "Leicester City", equipo2: "Manchester City", resultado1, resultado2 },
    { fecha: 19, equipo1: "Crystal Palace", equipo2: "Southampton", resultado1, resultado2 },
    { fecha: 19, equipo1: "Fulham", equipo2: "Bournemouth", resultado1, resultado2 },
    { fecha: 19, equipo1: "Tottenham", equipo2: "Wolverhampton", resultado1, resultado2 },
    { fecha: 19, equipo1: "Everton", equipo2: "Nottingham Forest", resultado1, resultado2 },
    { fecha: 19, equipo1: "West Ham", equipo2: "Liverpool", resultado1, resultado2 },
    { fecha: 19, equipo1: "Aston Villa", equipo2: "Brighton And Hove", resultado1, resultado2 },
    { fecha: 19, equipo1: "Ipswich Town", equipo2: "Chelsea", resultado1, resultado2 },
    { fecha: 19, equipo1: "Manchester United", equipo2: "Newcastle", resultado1, resultado2 },
    { fecha: 19, equipo1: "Brentford", equipo2: "Arsenal FC", resultado1, resultado2 },

    // Fecha 20
    { fecha: 20, equipo1: "Tottenham", equipo2: "Newcastle", resultado1, resultado2 },
    { fecha: 20, equipo1: "Bournemouth", equipo2: "Everton", resultado1, resultado2 },
    { fecha: 20, equipo1: "Manchester City", equipo2: "West Ham", resultado1, resultado2 },
    { fecha: 20, equipo1: "Aston Villa", equipo2: "Leicester City", resultado1, resultado2 },
    { fecha: 20, equipo1: "Crystal Palace", equipo2: "Chelsea", resultado1, resultado2 },
    { fecha: 20, equipo1: "Southampton", equipo2: "Brentford", resultado1, resultado2 },
    { fecha: 20, equipo1: "Brighton And Hove", equipo2: "Arsenal FC", resultado1, resultado2 },
    { fecha: 20, equipo1: "Fulham", equipo2: "Ipswich Town", resultado1, resultado2 },
    { fecha: 20, equipo1: "Liverpool", equipo2: "Manchester United", resultado1, resultado2 },
    { fecha: 20, equipo1: "Wolverhampton", equipo2: "Nottingham Forest", resultado1, resultado2 },

    // Fecha 21
    { fecha: 21, equipo1: "West Ham", equipo2: "Fulham", resultado1, resultado2 },
    { fecha: 21, equipo1: "Brentford", equipo2: "Manchester City", resultado1, resultado2 },
    { fecha: 21, equipo1: "Chelsea", equipo2: "Bournemouth", resultado1, resultado2 },
    { fecha: 21, equipo1: "Nottingham Forest", equipo2: "Liverpool", resultado1, resultado2 },
    { fecha: 21, equipo1: "Newcastle", equipo2: "Wolverhampton", resultado1, resultado2 },
    { fecha: 21, equipo1: "Everton", equipo2: "Aston Villa", resultado1, resultado2 },
    { fecha: 21, equipo1: "Leicester City", equipo2: "Crystal Palace", resultado1, resultado2 },
    { fecha: 21, equipo1: "Arsenal FC", equipo2: "Tottenham", resultado1, resultado2 },
    { fecha: 21, equipo1: "Ipswich Town", equipo2: "Brighton And Hove", resultado1, resultado2 },
    { fecha: 21, equipo1: "Manchester United", equipo2: "Southampton", resultado1, resultado2 },
]

const partidosBundesliga = [
    { fecha: 13, equipo1: 'Hoffenheim', equipo2: 'Friburgo', resultado1, resultado2 },

    // Fecha 14
    { fecha: 14, equipo1: "Friburgo", equipo2: "Wolfsburgo", resultado1, resultado2 },
    { fecha: 14, equipo1: "Union Berlin", equipo2: "Bochum", resultado1, resultado2 },
    { fecha: 14, equipo1: "Mainz 05", equipo2: "Bayern Munich", resultado1, resultado2 },
    { fecha: 14, equipo1: "Monchengladbach", equipo2: "Holstein Kiel", resultado1, resultado2 },
    { fecha: 14, equipo1: "Augsburgo", equipo2: "B. Leverkusen", resultado1, resultado2 },
    { fecha: 14, equipo1: "St. Pauli", equipo2: "Werder Bremen", resultado1, resultado2 },
    { fecha: 14, equipo1: "Heidenheim", equipo2: "Stuttgart", resultado1, resultado2 },
    { fecha: 14, equipo1: "B. Dortmund", equipo2: "Hoffenheim", resultado1, resultado2 },
    { fecha: 14, equipo1: "RB Leipzig", equipo2: "Frankfurt", resultado1, resultado2 },

        // Fecha 15
    { fecha: 15, equipo1: "Bayern Munich", equipo2: "RB Leipzig", resultado1, resultado2 },
    { fecha: 15, equipo1: "Frankfurt", equipo2: "Mainz 05", resultado1, resultado2 },
    { fecha: 15, equipo1: "Holstein Kiel", equipo2: "Augsburgo", resultado1, resultado2 },
    { fecha: 15, equipo1: "Werder Bremen", equipo2: "Union Berlin", resultado1, resultado2 },
    { fecha: 15, equipo1: "Hoffenheim", equipo2: "Monchengladbach", resultado1, resultado2 },
    { fecha: 15, equipo1: "Stuttgart", equipo2: "St. Pauli", resultado1, resultado2 },
    { fecha: 15, equipo1: "B. Leverkusen", equipo2: "Friburgo", resultado1, resultado2 },
    { fecha: 15, equipo1: "Bochum", equipo2: "Heidenheim", resultado1, resultado2 },
    { fecha: 15, equipo1: "Wolfsburgo", equipo2: "B. Dortmund", resultado1, resultado2 },

    // Fecha 16
    { fecha: 16, equipo1: "B. Dortmund", equipo2: "B. Leverkusen", resultado1, resultado2 },
    { fecha: 16, equipo1: "Heidenheim", equipo2: "Union Berlin", resultado1, resultado2 },
    { fecha: 16, equipo1: "Mainz 05", equipo2: "Bochum", resultado1, resultado2 },
    { fecha: 16, equipo1: "St. Pauli", equipo2: "Frankfurt", resultado1, resultado2 },
    { fecha: 16, equipo1: "Friburgo", equipo2: "Holstein Kiel", resultado1, resultado2 },
    { fecha: 16, equipo1: "Hoffenheim", equipo2: "Wolfsburgo", resultado1, resultado2 },
    { fecha: 16, equipo1: "Monchengladbach", equipo2: "Bayern Munich", resultado1, resultado2 },
    { fecha: 16, equipo1: "RB Leipzig", equipo2: "Werder Bremen", resultado1, resultado2 },
    { fecha: 16, equipo1: "Augsburgo", equipo2: "Stuttgart", resultado1, resultado2 },

    // Fecha 17
    { fecha: 17, equipo1: "Holstein Kiel", equipo2: "B. Dortmund", resultado1, resultado2 },
    { fecha: 17, equipo1: "B. Leverkusen", equipo2: "Mainz 05", resultado1, resultado2 },
    { fecha: 17, equipo1: "Frankfurt", equipo2: "Friburgo", resultado1, resultado2 },
    { fecha: 17, equipo1: "Wolfsburgo", equipo2: "Monchengladbach", resultado1, resultado2 },
    { fecha: 17, equipo1: "Bochum", equipo2: "St. Pauli", resultado1, resultado2 },
    { fecha: 17, equipo1: "Union Berlin", equipo2: "Augsburgo", resultado1, resultado2 },
    { fecha: 17, equipo1: "Bayern Munich", equipo2: "Hoffenheim", resultado1, resultado2 },
    { fecha: 17, equipo1: "Werder Bremen", equipo2: "Heidenheim", resultado1, resultado2 },
    { fecha: 17, equipo1: "Stuttgart", equipo2: "RB Leipzig", resultado1, resultado2 },

    // Fecha 18
    { fecha: 18, equipo1: "Frankfurt", equipo2: "B. Dortmund", resultado1, resultado2 },
    { fecha: 18, equipo1: "Heidenheim", equipo2: "St. Pauli", resultado1, resultado2 },
    { fecha: 18, equipo1: "Bayern Munich", equipo2: "Wolfsburgo", resultado1, resultado2 },
    { fecha: 18, equipo1: "Holstein Kiel", equipo2: "Hoffenheim", resultado1, resultado2 },
    { fecha: 18, equipo1: "Stuttgart", equipo2: "Friburgo", resultado1, resultado2 },
    { fecha: 18, equipo1: "Bochum", equipo2: "RB Leipzig", resultado1, resultado2 },
    { fecha: 18, equipo1: "B. Leverkusen", equipo2: "Monchengladbach", resultado1, resultado2 },
    { fecha: 18, equipo1: "Union Berlin", equipo2: "Mainz 05", resultado1, resultado2 },
    { fecha: 18, equipo1: "Werder Bremen", equipo2: "Augsburgo", resultado1, resultado2 },
]

const partidosLigue1 = [
    // Fecha 14
    { fecha: 14, equipo1: "Saint Etienne", equipo2: "Marsella", resultado1, resultado2 },

    // Fecha 15
    { fecha: 15, equipo1: "Toulouse", equipo2: "Saint Etienne", resultado1, resultado2 },
    { fecha: 15, equipo1: "Marsella", equipo2: "Lille", resultado1, resultado2 },
    { fecha: 15, equipo1: "Auxerre", equipo2: "Lens", resultado1, resultado2 },
    { fecha: 15, equipo1: "Reims", equipo2: "Monaco", resultado1, resultado2 },
    { fecha: 15, equipo1: "Montpellier", equipo2: "Niza", resultado1, resultado2 },
    { fecha: 15, equipo1: "Brest", equipo2: "Nantes", resultado1, resultado2 },
    { fecha: 15, equipo1: "Le Havre", equipo2: "RC Strasbourg", resultado1, resultado2 },
    { fecha: 15, equipo1: "Rennes", equipo2: "Angers", resultado1, resultado2 },
    { fecha: 15, equipo1: "PSG", equipo2: "Lyon", resultado1, resultado2 },

    // Fecha 16
    { fecha: 16, equipo1: "Monaco", equipo2: "PSG", resultado1, resultado2 },
    { fecha: 16, equipo1: "Niza", equipo2: "Rennes", resultado1, resultado2 },
    { fecha: 16, equipo1: "Saint Etienne", equipo2: "Reims", resultado1, resultado2 },
    { fecha: 16, equipo1: "Lille", equipo2: "Nantes", resultado1, resultado2 },
    { fecha: 16, equipo1: "Lyon", equipo2: "Montpellier", resultado1, resultado2 },
    { fecha: 16, equipo1: "Angers", equipo2: "Brest", resultado1, resultado2 },
    { fecha: 16, equipo1: "Lens", equipo2: "Toulouse", resultado1, resultado2 },
    { fecha: 16, equipo1: "RC Strasbourg", equipo2: "Auxerre", resultado1, resultado2 },
    { fecha: 16, equipo1: "Marsella", equipo2: "Le Havre", resultado1, resultado2 },

    // Fecha 17
    { fecha: 17, equipo1: "Auxerre", equipo2: "Lille", resultado1, resultado2 },
    { fecha: 17, equipo1: "Brest", equipo2: "Lyon", resultado1, resultado2 },
    { fecha: 17, equipo1: "Le Havre", equipo2: "Lens", resultado1, resultado2 },
    { fecha: 17, equipo1: "Montpellier", equipo2: "Angers", resultado1, resultado2 },
    { fecha: 17, equipo1: "Nantes", equipo2: "Monaco", resultado1, resultado2 },
    { fecha: 17, equipo1: "PSG", equipo2: "Saint Etienne", resultado1, resultado2 },
    { fecha: 17, equipo1: "Reims", equipo2: "Niza", resultado1, resultado2 },
    { fecha: 17, equipo1: "Rennes", equipo2: "Marsella", resultado1, resultado2 },
    { fecha: 17, equipo1: "Toulouse", equipo2: "RC Strasbourg", resultado1, resultado2 },

]

const partidosSerieA = [
    // Fecha 16
    { fecha: 16, equipo1: "Empoli", equipo2: "Torino", resultado1, resultado2 },
    { fecha: 16, equipo1: "Cagliari", equipo2: "Atalanta", resultado1, resultado2 },
    { fecha: 16, equipo1: "Udinese", equipo2: "Napoli", resultado1, resultado2 },
    { fecha: 16, equipo1: "Juventus", equipo2: "Venezia", resultado1, resultado2 },
    { fecha: 16, equipo1: "Lecce", equipo2: "Monza", resultado1, resultado2 },
    { fecha: 16, equipo1: "Bologna", equipo2: "Fiorentina", resultado1, resultado2 },
    { fecha: 16, equipo1: "Parma", equipo2: "Hellas Verona", resultado1, resultado2 },
    { fecha: 16, equipo1: "Como", equipo2: "Roma", resultado1, resultado2 },
    { fecha: 16, equipo1: "Milan", equipo2: "Genoa", resultado1, resultado2 },
    { fecha: 16, equipo1: "Lazio", equipo2: "Inter", resultado1, resultado2 },

    // Fecha 17
    { fecha: 17, equipo1: "Hellas Verona", equipo2: "Milan", resultado1, resultado2 },
    { fecha: 17, equipo1: "Torino", equipo2: "Bologna", resultado1, resultado2 },
    { fecha: 17, equipo1: "Genoa", equipo2: "Napoli", resultado1, resultado2 },
    { fecha: 17, equipo1: "Lecce", equipo2: "Lazio", resultado1, resultado2 },
    { fecha: 17, equipo1: "Roma", equipo2: "Parma", resultado1, resultado2 },
    { fecha: 17, equipo1: "Venezia", equipo2: "Cagliari", resultado1, resultado2 },
    { fecha: 17, equipo1: "Atalanta", equipo2: "Empoli", resultado1, resultado2 },
    { fecha: 17, equipo1: "Monza", equipo2: "Juventus", resultado1, resultado2 },
    { fecha: 17, equipo1: "Fiorentina", equipo2: "Udinese", resultado1, resultado2 },
    { fecha: 17, equipo1: "Inter", equipo2: "Como", resultado1, resultado2 },

]

const partidosEredivise = [
    // Fecha 16
    { fecha: 16, equipo1: "NAC Breda", equipo2: "AZ Alkmaar", resultado1, resultado2 },

    // Fecha 17
    { fecha: 17, equipo1: "RKC Waalwijk", equipo2: "PEC Zwolle", resultado1, resultado2 },
    { fecha: 17, equipo1: "Go Ahead", equipo2: "NAC Breda", resultado1, resultado2 },

]

champions.partidos = partidosChampions
laLiga.partidos = partidosLaLiga
premierLeague.partidos = partidosPremierLeague
bundesliga.partidos = partidosBundesliga
ligue1.partidos = partidosLigue1
serieA.partidos = partidosSerieA
eredivise.partidos = partidosEredivise


function manejarError(mensaje, error) {
    console.error(`${mensaje}`, error);
    showNotification(mensaje, 'error')
}




async function fetchDatos(url) {
    try {
        const response = await fetch(url)
        if (response.status === 201) {
            partidoEnJuego = true
            partidoInvalido = false
        } else if (response.status === 202) {
            partidoInvalido = true
            partidoEnJuego = false
        } else {
            partidoInvalido = false
            partidoEnJuego = false
        }

        return response.json()

    } catch (error) {
        manejarError(`Error al obtener los datos de ${url}`, error)
    }
}

async function obtenerDatosTablas() {
    try {
        const data = await fetchDatos(urlAPI+'/posiciones')
        // Asignar las tablas recibidas a las variables locales
        tablaPuntos = data
        cache = JSON.parse(JSON.stringify(tablaPuntos));
    } catch (error) {
        manejarError('Error al obtener las tablas ', error);
    } finally {
        hideLoading()
    }
}


async function obtenerPartidos() {
    try {
        partidosEnJuego = []
        const data = await fetchDatos(urlAPI+'/partido')
        if (partidoEnJuego) {
            data.forEach(partido => {
                partidosEnJuego.push(partido)
            });
        }

        filtrarPartidos(data)
    } catch (error) {
        manejarError('Error al obtener los partidos ', error);
    }
}

function actualizarTablas() {
    reiniciarTabla()
    actualizarPuntos()
    renderTabla()
}


function filtrarPartidos(proxPartido) {

    let indice = ligaSeleccionada.partidos.findIndex((p) => {
        if (partidoEnJuego) {
            return p.equipo1 === partidosEnJuego[0].equipo1 && p.equipo2 === partidosEnJuego[0].equipo2
        } else {
            return p.equipo1 === proxPartido.equipo1 && p.equipo2 === proxPartido.equipo2
        }
    });
    if (indice === -1){
        manejarError('Error filtrando los partidos', proxPartido)
        // return
    }

    if (partidoInvalido) {
        indice++
    }

    // Retorna los elementos desde el índice encontrado
    partidosRestantes =  ligaSeleccionada.partidos.slice(indice);
}

function reiniciarTabla() {
    if (cache) {
        tablaPuntos = JSON.parse(JSON.stringify(cache));
    } else {
        obtenerDatosTablas()
    }
}


function renderTabla() {
    tbody.innerHTML = ""; // Limpiar la tabla antes de actualizar.
    // Ordenar la tabla por puntos y diferencia de goles.
    ordenarTabla()

    tablaPuntos.forEach((equipo, index) => {
        const row = document.createElement("tr");
        const cells = [
            index + 1,
            equipo.equipo,
            equipo.pts,
            equipo.pj,
            equipo.pg,
            equipo.pe,
            equipo.pp,
            equipo.gf,
            equipo.gc,
            equipo.dif > 0 ? `+${equipo.dif}` : `${equipo.dif}`,
        ];

        cells.forEach((cellData, cellIndex) => {
            const cell = document.createElement("td");
            cell.textContent = cellData;
            row.appendChild(cell);

            if (cellIndex === 1) {
                const imagen = document.createElement("img")
                imagen.src = `https://promiedos.com.ar/${equipo.escudo}`
                cell.prepend(imagen)
            }

            // Aplicar colores según la clasificación.
                if (cellIndex === 0) {
                    if (
                        index < ligaSeleccionada.copa1cantidad
                    ) {
                        cell.classList.add("copa1");
                    } else if (
                        index < (ligaSeleccionada.copa1cantidad+ligaSeleccionada.copa2cantidad)
                    ) {
                        cell.classList.add("copa2");
                    } else if (index < (ligaSeleccionada.copa1cantidad+ligaSeleccionada.copa2cantidad+ligaSeleccionada.copa3cantidad)) {
                        cell.classList.add("copa3");
                    } else if(index > tablaPuntos.length - ligaSeleccionada.descensoCantidad - 1) {
                        cell.classList.add("descenso")
                    } else if(index > tablaPuntos.length - ligaSeleccionada.descensoCantidad - ligaSeleccionada.promocionCantidad - 1 && index < tablaPuntos.length - ligaSeleccionada.descensoCantidad ) {
                        cell.classList.add("promocion")
                    }
                }
        });
        tbody.appendChild(row);
    });

    referenciasContainer.innerHTML= ""

    agregarReferencia(ligaSeleccionada.copa1nombre, "copa1", ligaSeleccionada.copa1nombre)
    agregarReferencia(ligaSeleccionada.copa2nombre, "copa2", ligaSeleccionada.copa2nombre)
    agregarReferencia(ligaSeleccionada.copa3nombre, "copa3", ligaSeleccionada.copa3nombre)
    agregarReferencia(ligaSeleccionada.promocionCantidad, "promocion", "promocion para el descenso")
    agregarReferencia(ligaSeleccionada.descensoCantidad, "descenso", "descenso")
}

function agregarReferencia(copa, clase, texto) {
    if (copa) {
        const pCopa = document.createElement('p')
        pCopa.textContent = "Puestos de " + texto
        pCopa.classList.add(clase)
        referenciasContainer.appendChild(pCopa)
    }

}

function ordenarTabla() {
    tablaPuntos.sort((a, b) => b.pts - a.pts || b.dif - a.dif || b.gf - a.gf)
}


function actualizarPuntos() {
    partidosRestantes.forEach((partido, index) => {
        if (partidoEnJuego && index < partidosEnJuego.length ) {
            return
        }

        if (partido.resultado1 && partido.resultado2) {
            const equipo1 = tablaPuntos.find(e => e.equipo === partido.equipo1);
            const equipo2 = tablaPuntos.find(e => e.equipo === partido.equipo2);

            calcularPuntos(equipo1, parseInt(partido.resultado1), parseInt(partido.resultado2))
            calcularPuntos(equipo2, parseInt(partido.resultado2), parseInt(partido.resultado1))
        }
    });
}

function calcularPuntos(equipo, golesFavor, golesContra) {
    equipo.pj ++
    equipo.gf += golesFavor
    equipo.gc += golesContra

    if (golesFavor > golesContra) {
        equipo.pts += 3
        equipo.pg ++
    } else if (golesFavor < golesContra) {
        equipo.pp ++
    } else {
        equipo.pts ++
        equipo.pe ++
    }

    equipo.dif = equipo.gf - equipo.gc
}

// Generar los inputs para los partidosRestantes y dividir por fecha.
function renderizarPartidos() {
    matchesContainer.innerHTML = ""
    partidosRestantes.forEach((partido, index) => {
        let partidoEnVivo


        indicadorFecha.innerHTML = `Fecha ${fechaSeleccionada}`

            // Crear el input para cada partido.
            const matchDiv = document.createElement("div");
            matchDiv.classList.add("match");
            if (index < partidosEnJuego.length) {
                if (partido.equipo1 == partidosEnJuego[index].equipo1 && partido.equipo2 === partidosEnJuego[index].equipo2) {
                    partidoEnVivo = partido
                }
            }            
            matchDiv.innerHTML = `
            <div class="match-team">
            <img src="https://promiedos.com.ar/${tablaPuntos.find((e) => e.equipo === partido.equipo1).escudo}" class="team-logo">
            <span>${partido.equipo1}</span>
            </div>
            <div class="match-score">
            <input type="number" id="score-${index}-team1" min=0 ${partido === partidoEnVivo ? 'disabled' : ''} value=${inputValue(partido, partidoEnVivo, index, 1)}>
            <span> - </span>
            <input type="number" id="score-${index}-team2" min="0" ${partido === partidoEnVivo ? 'disabled' : ''} value=${inputValue(partido, partidoEnVivo, index, 2)} >
            </div>
            <div class="match-team">
            <span>${partido.equipo2}</span>
            <img src="https://promiedos.com.ar/${tablaPuntos.find((e) => e.equipo === partido.equipo2).escudo}" class="team-logo">
            </div>
            `
            if (partido.fecha === fechaSeleccionada) {
            } else {
                matchDiv.style.display = "none"
            }
            matchesContainer.appendChild(matchDiv);
    });

}

function inputValue(partido, partidoEnVivo, index, team) {
    if (team === 1) {
        if (partido === partidoEnVivo) {
            return partidosEnJuego[index].resultado1
        } else if (partido.resultado1) {
            return partido.resultado1
        } else {
            return ""
        }
    } else {
        if (partido === partidoEnVivo) {
            return partidosEnJuego[index].resultado2
        } else if (partido.resultado2) {
            return partido.resultado2
        } else {
            return ""
        }
    }
}

function renderizarSelectorFecha() {
    fechaSeleccionada = partidosRestantes[0].fecha
    fechaSelect.innerHTML = `
    ${Array.from(new Set(partidosRestantes.map(match => match.fecha))).map(
        fecha => `<option value="${fecha}">Fecha ${fecha}</option>`
      ).join("")}
`
    // renderizarPartidos()
}

// Función para generar resultados aleatorios entre 0 y 3 para cada input
function resultadosRandom() {
    partidosRestantes.forEach((partido, index) => {
        if (partidoEnJuego && index < partidosEnJuego.length) {
            return
        }

        partido.resultado1 = Math.floor(Math.random() * 4).toString()
        partido.resultado2 = Math.floor(Math.random() * 4).toString()
    });
    renderizarPartidos()
    actualizarTablas()
}


function hideLoading() {
    loadingScreen.style.display = "none";
}


matchesContainer.addEventListener("input", (e) => {
    const indice = e.target.id.match(/score-(\d+)-team/)[1]

    partidosRestantes[indice].resultado1 = (document.getElementById(`score-${indice}-team1`).value)
    partidosRestantes[indice].resultado2 = (document.getElementById(`score-${indice}-team2`).value)
    
    actualizarTablas()
})

async function inicializar() {
    try {
        cuentaAtras()
        // Espera que se completen las tablas antes de proceder con los partidos

        h2LigaSeleccionada.innerHTML = ligaSeleccionada.nombre
        await fetchPOST()
        await obtenerDatosTablas();
        await obtenerPartidos();
        actualizarPuntos()
        renderTabla()
        renderizarSelectorFecha()
        renderizarPartidos()
    } catch (error) {
        manejarError('Error al inicializar los datos:', error);
    }
}

function restablecerResultados() {
    ligas.forEach((liga) => {
        liga.partidos.forEach((partido) => {
            partido.resultado1 = undefined
            partido.resultado2 = undefined
        })
    })

    inicializar()
}

async function fetchPOST() {
    try {
        await fetch(`http://localhost:5000/set-liga`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liga: ligaSeleccionada.url })
    })
    } catch (error) {
        manejarError('Error al cambiar de liga', error)
    }
}

function cuentaAtras() {
    let tiempoRestante = 30
    const intervalo = setInterval(() => {
        loadingP.innerHTML = "Tiempo restante " + tiempoRestante + " segundos"
        tiempoRestante--

        if (tiempoRestante < 0) {
            loadingP.innerHTML = "Ya casi..."
            clearInterval(intervalo)
        }

    }, 1000)
}

// Mostrar una notificación
function showNotification(message, type = 'error') {
    const notification = document.getElementById('notification');
    const messageContainer = document.getElementById('notification-message');

    // Establecer el mensaje
    messageContainer.textContent = message;

    // Cambiar el color según el tipo (error, éxito, etc.)
    notification.style.backgroundColor = type === 'error' ? '#f44336' : '#4CAF50';

    // Mostrar la notificación
    notification.classList.remove('hidden');

    // Ocultar automáticamente después de 5 segundos
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}


fechaSelect.addEventListener("change", (e) => {
    fechaSeleccionada = parseInt(e.target.value)
    renderizarPartidos()
})




fechaAnterior.addEventListener("click", () => {
    if (fechaSeleccionada === partidosRestantes[0].fecha) {
        console.log("Fecha minima");

        return
    }
    fechaSeleccionada--
    fechaSelect.value--
    renderizarPartidos ()
})

fechaSiguiente.addEventListener("click", () => {
    if (fechaSeleccionada === partidosRestantes[partidosRestantes.length-1].fecha) {
        console.log("Fecha maxima");
        return
    }
    fechaSeleccionada++
    fechaSelect.value++
    renderizarPartidos ()
})


// Ejecutar la inicialización
inicializar();
