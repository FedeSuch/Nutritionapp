const SUPABASE_URL = "https://ykzmuzjyskhdimnmovjv.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_6Yvl1DZTz5-na2EceQt1_A_swbOZH5m";

function getSupabase() {
  if (window._sbClientInstance) return window._sbClientInstance;
  const s = window.supabase || (typeof supabase !== 'undefined' ? supabase : null);
  if (s && typeof s.createClient === 'function') {
    window._sbClientInstance = s.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return window._sbClientInstance;
  }
  return null;
}

const supabaseClient = new Proxy({}, {
  get: (_, prop) => {
    const client = getSupabase();
    if (!client) return undefined;
    const val = client[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  }
});

const FECHAS_SEMANAS_DEFAULT = {
  "Semana 1": "2026-10-26", "Semana 2": "2026-11-02", "Semana 3": "2026-11-09", "Semana 4": "2026-11-16",
  "Semana 5": "2026-11-23", "Semana 6": "2026-11-30", "Semana 7": "2026-12-07", "Semana 8": "2026-12-14",
  "Semana 9": "2026-12-21", "Semana 10": "2026-12-28", "Semana 11": "2027-01-04", "Semana 12": "2027-01-11",
  "Semana 13": "2027-01-18", "Semana 14": "2027-01-25"
};

const DATOS_SEMANA1_RESPALDO = {
  "Fede": { peso: "93.5", pecho: "108", cintura: "95", cadera: "100", brazo: "37", muslo: "58" },
  "Arantxa": { peso: "67", pecho: "89", cintura: "80", cadera: "84", brazo: "28", muslo: "53" }
};

/**
 * VALORES OFICIALES DE TU PESTAÑA RESUMEN_SEMANAL (FEDE Y ARANTXA)
 * En modo original ("auto"), el día muestra EXACTAMENTE estos valores de tu Excel.
 */
const RESUMEN_OFICIAL_FEDE = {
  "lunes":     { entreno: "CrossFit 17:30",                           p: 200, ch: 320, g: 75, kcal: 2755 },
  "martes":    { entreno: "Cuestas 8 km (08:30) + Gym Torso (18:30)", p: 202, ch: 430, g: 72, kcal: 3176 },
  "miercoles": { entreno: "Tempo 10 km (08:30) + CrossFit (17:30)",   p: 205, ch: 450, g: 75, kcal: 3295 },
  "jueves":    { entreno: "Carrera fácil 8 km (18:30)",               p: 198, ch: 310, g: 75, kcal: 2707 },
  "viernes":   { entreno: "CrossFit 17:30",                           p: 198, ch: 340, g: 75, kcal: 2827 },
  "sabado":    { entreno: "Descanso activo (Precarga Trail)",         p: 198, ch: 380, g: 70, kcal: 2942 },
  "domingo":   { entreno: "Trail 22 km (08:30)",                      p: 202, ch: 495, g: 68, kcal: 3400 }
};

const RESUMEN_OFICIAL_ARANTXA = {
  "lunes":     { entreno: "CrossFit 17:30",                           p: 140, ch: 220, g: 50, kcal: 1890 },
  "martes":    { entreno: "Cuestas 8 km (08:30) + Gym Torso (18:30)", p: 142, ch: 295, g: 48, kcal: 2180 },
  "miercoles": { entreno: "Tempo 10 km (08:30) + CrossFit (17:30)",   p: 145, ch: 310, g: 50, kcal: 2270 },
  "jueves":    { entreno: "Carrera fácil 8 km (18:30)",               p: 138, ch: 215, g: 50, kcal: 1862 },
  "viernes":   { entreno: "CrossFit 17:30",                           p: 138, ch: 235, g: 50, kcal: 1942 },
  "sabado":    { entreno: "Descanso activo (Precarga Trail)",         p: 138, ch: 265, g: 48, kcal: 2044 },
  "domingo":   { entreno: "Trail 22 km (08:30)",                      p: 142, ch: 345, g: 46, kcal: 2362 }
};

/**
 * ESCALA OFICIAL DE SESIONES (Basada en los escalones exactos de tu Excel)
 * Orden estricto de menor a mayor gasto energético:
 * Descanso (2345) < 1 Sesión Run Suave (2707) < 1 Sesión CF (2755) < 1 Sesión Run Intensa (2855) < Precarga (2942) < 2 Sesiones Gym (3176) < 2 Sesiones CF (3295) < Trail Largo (3400)
 */
const PERFILES_SESION = {
  fede: {
    descanso:          { nombre: "0 Sesiones · Descanso Total",            p: 195, ch: 200, g: 85, kcal: 2345 },
    unica_run_suave:   { nombre: "1 Sesión · Carrera Fácil 8 km",          p: 198, ch: 310, g: 75, kcal: 2707 },
    unica_cf:          { nombre: "1 Sesión · Solo CrossFit WOD",           p: 200, ch: 320, g: 75, kcal: 2755 },
    unica_run_intensa: { nombre: "1 Sesión · Series / Tempo 10 km",        p: 200, ch: 350, g: 73, kcal: 2855 },
    precarga_trail:    { nombre: "Descanso Activo · Precarga Trail",       p: 198, ch: 380, g: 70, kcal: 2942 },
    doble_gym:         { nombre: "2 Sesiones · Carrera + Gym Fuerza",      p: 202, ch: 430, g: 72, kcal: 3176 },
    doble_cf:          { nombre: "2 Sesiones · Tempo/Series + CrossFit",   p: 205, ch: 450, g: 75, kcal: 3295 },
    trail_largo:       { nombre: "Tirada Larga · Trail 22 km",             p: 202, ch: 495, g: 68, kcal: 3400 }
  },
  arantxa: {
    descanso:          { nombre: "0 Sesiones · Descanso Total",            p: 135, ch: 145, g: 55, kcal: 1630 },
    unica_run_suave:   { nombre: "1 Sesión · Carrera Fácil 8 km",          p: 138, ch: 215, g: 50, kcal: 1862 },
    unica_cf:          { nombre: "1 Sesión · Solo CrossFit WOD",           p: 140, ch: 220, g: 50, kcal: 1890 },
    unica_run_intensa: { nombre: "1 Sesión · Series / Tempo 10 km",        p: 140, ch: 245, g: 50, kcal: 1970 },
    precarga_trail:    { nombre: "Descanso Activo · Precarga Trail",       p: 138, ch: 265, g: 48, kcal: 2044 },
    doble_gym:         { nombre: "2 Sesiones · Carrera + Gym Fuerza",      p: 142, ch: 295, g: 48, kcal: 2180 },
    doble_cf:          { nombre: "2 Sesiones · Tempo/Series + CrossFit",   p: 145, ch: 310, g: 50, kcal: 2270 },
    trail_largo:       { nombre: "Tirada Larga · Trail 22 km",             p: 142, ch: 345, g: 46, kcal: 2362 }
  }
};

const CATALOGO_NUTRICIONAL = {
  "pechuga pollo":              { tipo: 'prot', p: 23.0, ch: 0.0,  g: 1.2 },
  "pechuga pavo":               { tipo: 'prot', p: 24.0, ch: 0.0,  g: 1.0 },
  "atún al natural":            { tipo: 'prot', p: 24.0, ch: 0.0,  g: 1.0 },
  "merluza blanca":             { tipo: 'prot', p: 18.0, ch: 0.0,  g: 1.8 },
  "merluza empanada Mercadona": { tipo: 'prot', p: 16.0, ch: 14.0, g: 6.0 },
  "solomillo ternera":          { tipo: 'prot', p: 22.0, ch: 0.0,  g: 4.5 },
  "lomo embuchado":             { tipo: 'prot', p: 32.0, ch: 0.0,  g: 8.0 },
  "jamón serrano":              { tipo: 'prot', p: 30.0, ch: 0.0,  g: 12.0 },
  "salmón fresco":              { tipo: 'prot', p: 20.0, ch: 0.0,  g: 13.0 },
  "hamburguesa ave magra":      { tipo: 'prot', p: 21.0, ch: 1.0,  g: 4.0 },
  "huevos enteros":             { tipo: 'prot', p: 13.0, ch: 1.0,  g: 11.0 },
  "arroz basmati":              { tipo: 'ch',   p: 7.5,  ch: 78.0, g: 0.9 },
  "patata":                     { tipo: 'ch',   p: 2.0,  ch: 18.0, g: 0.1 },
  "boniato":                    { tipo: 'ch',   p: 1.6,  ch: 20.0, g: 0.1 },
  "pasta blanca":               { tipo: 'ch',   p: 12.0, ch: 74.0, g: 1.5 },
  "pan masa madre":             { tipo: 'ch',   p: 9.0,  ch: 48.0, g: 1.2 },
  "copos de avena":             { tipo: 'ch',   p: 13.5, ch: 60.0, g: 7.0 },
  "tortitas de arroz":          { tipo: 'ch',   p: 7.5,  ch: 80.0, g: 2.5 },
  "claras de huevo":            { tipo: 'prot', p: 11.0, ch: 0.7,  g: 0.2 },
  "lomo de cerdo magro":        { tipo: 'prot', p: 20.0, ch: 0.0,  g: 3.0 },
  "queso fresco batido":        { tipo: 'prot', p: 8.0,  ch: 3.5,  g: 0.1 },
  "garbanzos bote":             { tipo: 'ch',   p: 7.0,  ch: 16.0, g: 2.0 },
  "lentejas bote":              { tipo: 'ch',   p: 8.0,  ch: 15.0, g: 1.0 },
  "quinoa":                     { tipo: 'ch',   p: 14.0, ch: 64.0, g: 6.0 },
  "cuscús":                     { tipo: 'ch',   p: 12.0, ch: 72.0, g: 1.5 },
  "fideos de arroz":            { tipo: 'ch',   p: 3.5,  ch: 80.0, g: 0.2 },
  "aguacate":                   { tipo: 'grasa', p: 2.0,  ch: 2.0,  g: 15.0 }
};

function appData() {
  return {
    tab: 'dieta',
    vistaAtleta: localStorage.getItem('hybrid_vista_atleta') || 'Dual',
    diasSemana: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    diaSeleccionado: 'Martes',
    panelEntrenoAbierto: false,
    cenaSocialActiva: false,
    cenasSocialesPorDia: JSON.parse(localStorage.getItem('hybrid_cenas_sociales') || '{}'),
    ajustesMetabolicos: JSON.parse(localStorage.getItem('hybrid_ajustes_metabolicos') || '{"fede":0,"arantxa":0}'),
    promptCopiado: false,
    mostrarSumaComun: true,
    mostrarGraficoMacros: localStorage.getItem('hybrid_mostrar_pie_macros') === 'true',
    plegarCompletadas: false,
    pesosCocidosOlla: {},
    cargandoDieta: false,
    errorConexion: false,
    enviando: false,
    mensajeExito: false,
    mensajeDietaActualizada: false,
    anuncioAccesible: '',
    filtroCompra: '',
    jsonNuevaDieta: '',
    geminiApiKey: localStorage.getItem('hybrid_gemini_api_key') || '',
    geminiModelo: (() => {
      const guardado = localStorage.getItem('hybrid_gemini_modelo');
      if (guardado && !guardado.includes('tts') && !guardado.includes('audio') && !guardado.includes('embed')) {
        return guardado;
      }
      return 'gemini-2.0-flash';
    })(),
    modelosDetectados: [],
    detectandoModelos: false,
    mostrarConfigIA: false,
    mostrarModoManualIA: false,
    mostrarVistaPreviaPrompt: false,
    generandoConGemini: false,
    estadoGeneracionIA: '',
    entrenosPlanificador: (() => {
      try {
        const guardado = localStorage.getItem('hybrid_planificador_entrenos');
        if (guardado) return JSON.parse(guardado);
      } catch (e) {}
      return {
        lunes:     { fede: '', arantxa: '' },
        martes:    { fede: '', arantxa: '' },
        miercoles: { fede: '', arantxa: '' },
        jueves:    { fede: '', arantxa: '' },
        viernes:   { fede: '', arantxa: '' },
        sabado:    { fede: '', arantxa: '' },
        domingo:   { fede: '', arantxa: '' }
      };
    })(),
    semanaActivaId: null,
    semanasDisponibles: [],
    historicoBiometria: [],
    resumenSemanal: JSON.parse(localStorage.getItem('hybrid_cache_resumen_supabase') || '[]'),
    dietaCompleta: JSON.parse(localStorage.getItem('hybrid_cache_dieta') || '[]'),
    swapAbiertoIdx: null,
    swapsActivos: JSON.parse(localStorage.getItem('hybrid_swaps_activos') || '{}'),
    cargasEntreno: JSON.parse(localStorage.getItem('hybrid_cargas_entreno') || '{}'),
    permutacionesDias: JSON.parse(localStorage.getItem('hybrid_permutaciones_dias') || '{}'),
    comidasCompletadas: JSON.parse(localStorage.getItem('hybrid_comidas_completadas') || '{}'),
    itemsComprados: JSON.parse(localStorage.getItem('hybrid_compra_checks') || '{}'),
    form: {
      atleta: 'Fede',
      semana: 'Semana 1',
      semana_id: null,
      fecha: '2026-10-26',
      peso: '93.5',
      pecho: '108',
      cintura: '95',
      cadera: '100',
      brazo: '37',
      muslo: '58'
    },

    init() {
      // Sanitizar modelo Gemini por si quedó en localStorage algún modelo de audio/voz no soportado
      if (!this.geminiModelo || this.geminiModelo.includes('tts') || this.geminiModelo.includes('audio') || this.geminiModelo.includes('embed')) {
        this.geminiModelo = 'gemini-2.0-flash';
        localStorage.setItem('hybrid_gemini_modelo', 'gemini-2.0-flash');
      }

      // Pre-cargar modelos válidos de la cuenta si la API Key está configurada
      if (this.geminiApiKey) {
        this.obtenerModelosValidosCuenta().catch(err => console.warn('Consulta modelos en init:', err));
      }

      this.irAHoy();
      this.cenaSocialActiva = !!this.cenasSocialesPorDia[this.diaSeleccionado];

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          const ultimoDiaAbierto = sessionStorage.getItem('hybrid_dia_sesion');
          const hoyReal = this.nombreDiaHoy();
          if (ultimoDiaAbierto !== hoyReal) {
            this.seleccionarDia(hoyReal);
            sessionStorage.setItem('hybrid_dia_sesion', hoyReal);
          }
        }
      });

      // Accesibilidad: cerrar paneles desplegables con tecla Escape
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this.swapAbiertoIdx !== null) {
            this.swapAbiertoIdx = null;
            this.anunciar('Panel de intercambio cerrado');
          } else if (this.panelEntrenoAbierto) {
            this.panelEntrenoAbierto = false;
            this.anunciar('Panel de ajuste de sesiones cerrado');
          }
        }
      });

      this.sincronizarFechaSemana();
      this.cargarDatos();
    },

    anunciar(mensaje) {
      this.anuncioAccesible = '';
      setTimeout(() => {
        this.anuncioAccesible = mensaje;
      }, 40);
    },

    nombreDiaHoy() {
      const mapa = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return mapa[new Date().getDay()] || 'Lunes';
    },

    irAHoy() {
      const hoy = this.nombreDiaHoy();
      this.seleccionarDia(hoy);
      sessionStorage.setItem('hybrid_dia_sesion', hoy);
    },

    cambiarTab(nuevaTab) {
      this.tab = nuevaTab;
      const nombres = { dieta: 'Plan Diario y Entreno', compra: 'Despensa y Compra', checkin: 'Biometría y Progreso', ia: 'Planificador Semanal IA' };
      this.anunciar(`Vista cambiada a ${nombres[nuevaTab] || nuevaTab}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    cambiarVistaAtleta(modo) {
      this.vistaAtleta = modo;
      localStorage.setItem('hybrid_vista_atleta', modo);
      this.anunciar(`Mostrando datos para ${modo === 'Dual' ? 'Fede y Arantxa' : modo}`);
    },

    seleccionarDia(d) {
      this.diaSeleccionado = d;
      this.cenaSocialActiva = !!this.cenasSocialesPorDia[d];
      this.swapAbiertoIdx = null;
      this.anunciar(`Viendo el plan del ${d}`);
    },

    toggleCenaSocial() {
      this.cenaSocialActiva = !this.cenaSocialActiva;
      if (this.cenaSocialActiva) {
        this.cenasSocialesPorDia[this.diaSeleccionado] = true;
      } else {
        delete this.cenasSocialesPorDia[this.diaSeleccionado];
      }
      this.cenasSocialesPorDia = { ...this.cenasSocialesPorDia };
      localStorage.setItem('hybrid_cenas_sociales', JSON.stringify(this.cenasSocialesPorDia));
      this.sincronizarEstadoRemoto('cenasSocialesPorDia', this.cenasSocialesPorDia);
      this.anunciar(this.cenaSocialActiva ? `Modo Cena Libre activado para el ${this.diaSeleccionado}` : `Modo Cena Libre desactivado`);
    },

    toggleVistaGraficoMacros() {
      this.mostrarGraficoMacros = !this.mostrarGraficoMacros;
      localStorage.setItem('hybrid_mostrar_pie_macros', this.mostrarGraficoMacros.toString());
    },

    abreviarDia(d) {
      const mapa = { 'Lunes': 'Lun', 'Martes': 'Mar', 'Miércoles': 'Mié', 'Jueves': 'Jue', 'Viernes': 'Vie', 'Sábado': 'Sáb', 'Domingo': 'Dom' };
      return mapa[d] || d.slice(0, 3);
    },

    normalizar(str) {
      if (!str) return '';
      return str.toString().trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    },

    esFilaSoloSuplementoOCarrera(comida) {
      const v = this.normalizar(comida.ventana);
      const p = this.normalizar(comida.plato);
      const f = this.normalizar(comida.fede);
      if (p.includes('intra-entreno') || p.includes('hidratacion en ayunas') || v.includes('intra')) return true;
      if (/^\d+\s*ml\s*agua/i.test(f) && !/pan|avena|arroz|huevo|skyr|pollo|pavo|patata|jamon|queso/i.test(f)) return true;
      if (/^\d+\s*gel/i.test(f) && !/pan|avena|arroz|huevo|skyr|pollo|pavo|patata/i.test(f)) return true;
      return false;
    },

    limpiarSuplementosDeTexto(str) {
      if (!str) return '';
      return this.dividirTextoEnIngredientes(str)
        .map(p => p.trim())
        .filter(parte => {
          const n = this.normalizar(parte);
          if (!n) return false;
          if (/\bcreatina\b|\bgel\b|\bgeles\b|\bisotonico\b|\bsales\b|\belectrolitos\b|\bevocarb\b|\bcafeina\b|\bprobiotico\b/.test(n)) return false;
          return true;
        })
        .join(' + ');
    },

    limpiarSuplementosDeTitulo(titulo) {
      if (!titulo) return '';
      return titulo.replace(/\s+y\s+creatina/gi, '').replace(/\s*\+\s*creatina/gi, '').trim();
    },

    // Lee el texto de macros en cualquier formato (ej. "P: 50g | CH: 60g | G: 80g | 1105 kcal" o "66g P | 170g CH | 49g G | 1.385 kcal")
    parsearMacrosDeColumnaExcel(txt) {
      if (!txt) return { p: 0, ch: 0, g: 0, kcal: 0 };

      // P / Proteína (soporta tanto "P: 50g" como "50g P")
      const mP = txt.match(/(?:P|Prot|Prote[íi]na)[\s:]*(\d+(?:[.,]\d+)?)\s*g?\b/i) ||
                 txt.match(/(\d+(?:[.,]\d+)?)\s*g?\s*(?:P|Prot|Prote[íi]na)\b/i);

      // CH / Carbohidratos (soporta tanto "CH: 60g" como "60g CH")
      const mCH = txt.match(/(?:CH|Carbs?|Carbohidratos?)[\s:]*(\d+(?:[.,]\d+)?)\s*g?\b/i) ||
                  txt.match(/(\d+(?:[.,]\d+)?)\s*g?\s*(?:CH|Carbs?|Carbohidratos?)\b/i);

      // G / Grasas (evitar confundir "50g" de gramos con la letra G de grasa)
      const mG = txt.match(/(?:^|[|\s,])(?:G|Grasas?|Fat)[\s:]*(\d+(?:[.,]\d+)?)\s*g?\b/i) ||
                 txt.match(/(\d+(?:[.,]\d+)?)\s*g?\s*(?:Grasas?|Fat)\b/i) ||
                 txt.match(/(\d+(?:[.,]\d+)?)\s*g\s+G\b/i) ||
                 txt.match(/(?:^|[|\s,])(\d+(?:[.,]\d+)?)\s*G\b/i);

      // Kcal / Calorías: Si se detectan macros (P, CH o G), se calcula siempre con la fórmula estricta: (P * 4) + (CH * 4) + (G * 9)
      const mKcal = txt.match(/(\d+(?:[.,]\d+)?)\s*k?cal/i) ||
                    txt.match(/(?:kcal|calor[íi]as?)[\s:]*(\d+(?:[.,]\d+)?)/i);

      const p = mP ? parseFloat(mP[1].replace(',', '.')) : 0;
      const ch = mCH ? parseFloat(mCH[1].replace(',', '.')) : 0;
      const g = mG ? parseFloat(mG[1].replace(',', '.')) : 0;
      let kcal = 0;
      if (p > 0 || ch > 0 || g > 0) {
        kcal = (p * 4) + (ch * 4) + (g * 9);
      } else if (mKcal) {
        kcal = parseFloat(mKcal[1].replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'));
      }
      return { p: Math.round(p), ch: Math.round(ch), g: Math.round(g), kcal: Math.round(kcal) };
    },

    /**
     * Mapea un texto libre de entrenamiento al perfil de gasto metabólico correspondiente
     */
    determinarPerfilEntreno(entrenoTexto) {
      const norm = this.normalizar(entrenoTexto || '');
      if (!norm || norm.includes('descanso') || norm.includes('reposo') || norm.includes('off') || norm.includes('0 sesion')) {
        return 'descanso';
      }
      if (norm.includes('trail') || norm.includes('22 km') || norm.includes('tirada larga') || norm.includes('larga')) {
        return 'trail_largo';
      }
      if (norm.includes('doble') || norm.includes('+') || (norm.includes('crossfit') && (norm.includes('correr') || norm.includes('rodaje') || norm.includes('km')))) {
        return norm.includes('gym') ? 'doble_gym' : 'doble_cf';
      }
      if (norm.includes('tempo') || norm.includes('series') || norm.includes('cuestas') || norm.includes('intensa') || norm.includes('10 km')) {
        return 'unica_run_intensa';
      }
      if (norm.includes('crossfit') || norm.includes('wod') || norm.includes('cf')) {
        return 'unica_cf';
      }
      if (norm.includes('precarga')) {
        return 'precarga_trail';
      }
      if (norm.includes('correr') || norm.includes('rodaje') || norm.includes('carrera') || norm.includes('km') || norm.includes('suave') || norm.includes('facil')) {
        return 'unica_run_suave';
      }
      return 'unica_cf';
    },

    /**
     * CÁLCULO SEPARADO Y ESTRICTO DE MACRONUTRIENTES Y CALORÍAS TOTALES
     * Separa estrictamente la variable de Grasas (G) de las Proteínas (P).
     * - Fede: 200g P fija | 75g-80g G fija (~0.85g/kg de peso corporal)
     * - Arantxa: 140g P fija | 50g-55g G fija (~0.8g/kg de peso corporal)
     * - Fórmula calórica exacta: Kcal = (Proteína * 4) + (Carbohidratos * 4) + (Grasas * 9)
     */
    calcularMacrosObjetivo(entrenoTexto, atletaKey) {
      const esFede = this.normalizar(atletaKey) === 'fede';
      const perfilKey = this.determinarPerfilEntreno(entrenoTexto);
      const perf = PERFILES_SESION[esFede ? 'fede' : 'arantxa'][perfilKey] || PERFILES_SESION[esFede ? 'fede' : 'arantxa']['unica_cf'];

      const p = esFede ? 200 : 140;
      // Grasas fijas saludables calculadas con multiplicador de peso (~0.8-0.85g/kg), NUNCA iguales a la proteína
      const g = esFede ? (perf.g || 78) : (perf.g || 52);
      let ch = perf.ch || (esFede ? 320 : 220);

      // Reajuste metabólico semanal aplicado a los carbohidratos
      const adj = (this.ajustesMetabolicos && this.ajustesMetabolicos[esFede ? 'fede' : 'arantxa']) ? this.ajustesMetabolicos[esFede ? 'fede' : 'arantxa'] : 0;
      if (adj !== 0) {
        ch = Math.max(50, ch + Math.round(adj / 4));
      }

      // Cálculo matemático estricto: (P * 4) + (CH * 4) + (G * 9)
      const kcal = Math.round((p * 4) + (ch * 4) + (g * 9));

      return {
        entreno: entrenoTexto && entrenoTexto.trim() ? entrenoTexto.trim() : perf.nombre,
        p: Math.round(p),
        ch: Math.round(ch),
        g: Math.round(g),
        kcal: kcal
      };
    },

    /**
     * Obtiene los Macros y Calorías Oficiales del Día desde RESUMEN_SEMANAL (Supabase o Fallback Oficial)
     * Sanea y protege las grasas para que NUNCA dupliquen a las proteínas.
     */
    objetivoBaseDia(diaNombre, atletaKey) {
      const diaFuente = this.diaFuenteEfectivo(diaNombre);
      const dNorm = this.normalizar(diaFuente);
      const esFede = this.normalizar(atletaKey) === 'fede';
      const maxGrasa = esFede ? 85 : 60;

      if (this.resumenSemanal && this.resumenSemanal.length > 0) {
        const fila = this.resumenSemanal.find(r => 
          this.normalizar(r.atleta) === atletaKey && 
          this.normalizar(r.dia) === dNorm
        );
        // Debe tener calorías y macros reales calculados (P > 0 o CH > 0)
        if (fila && Number(fila.kcal) > 200 && (Number(fila.p) > 0 || Number(fila.ch) > 0)) {
          let pVal = Math.round(Number(fila.p) || (esFede ? 200 : 140));
          let chVal = Math.round(Number(fila.ch) || (esFede ? 320 : 220));
          let gVal = Math.round(Number(fila.g) || (esFede ? 78 : 52));
          // Sanear si las grasas estaban infladas o duplicaban a las proteínas
          if (gVal > maxGrasa || gVal >= pVal * 0.9) {
            gVal = esFede ? 78 : 52;
          }
          const kcalVal = Math.round((pVal * 4) + (chVal * 4) + (gVal * 9));
          return {
            entreno: fila.entrenamiento || '',
            p: pVal,
            ch: chVal,
            g: gVal,
            kcal: kcalVal
          };
        }
      }

      // Si resumenSemanal no tiene macros válidos (ej. por importación anterior con 0g), sumarlos en tiempo real de dieta_diaria
      const comidasDia = this.comidasDelDiaPara(diaFuente);
      if (comidasDia && comidasDia.length > 0) {
        let sumP = 0, sumCH = 0, sumG = 0;
        const campo = atletaKey === 'fede' ? 'macrosFede' : 'macrosArantxa';
        comidasDia.forEach(c => {
          const m = this.parsearMacrosDeColumnaExcel(c[campo]);
          sumP += m.p; sumCH += m.ch; sumG += m.g;
        });

        if (sumP > 0 || sumCH > 0) {
          const filaPrev = this.resumenSemanal ? this.resumenSemanal.find(r => this.normalizar(r.atleta) === atletaKey && this.normalizar(r.dia) === dNorm) : null;
          const entreno = (filaPrev && filaPrev.entrenamiento) ? filaPrev.entrenamiento : (this.entrenosPlanificador && this.entrenosPlanificador[dNorm] ? (atletaKey === 'fede' ? this.entrenosPlanificador[dNorm].fede : this.entrenosPlanificador[dNorm].arantxa) : 'CrossFit 17:30');
          let pVal = Math.round(sumP);
          let chVal = Math.round(sumCH);
          let gVal = Math.round(sumG);
          if (gVal > maxGrasa || gVal >= pVal * 0.9) {
            gVal = esFede ? 78 : 52;
          }
          const kcalVal = Math.round((pVal * 4) + (chVal * 4) + (gVal * 9));
          return {
            entreno,
            p: pVal,
            ch: chVal,
            g: gVal,
            kcal: kcalVal
          };
        }
      }

      const dic = atletaKey === 'fede' ? RESUMEN_OFICIAL_FEDE : RESUMEN_OFICIAL_ARANTXA;
      const def = dic[dNorm] || (esFede ? { entreno: "CrossFit 17:30", p: 200, ch: 320, g: 75, kcal: 2755 } : { entreno: "CrossFit 17:30", p: 140, ch: 220, g: 50, kcal: 1890 });
      return {
        entreno: def.entreno,
        p: def.p,
        ch: def.ch,
        g: def.g,
        kcal: Math.round((def.p * 4) + (def.ch * 4) + (def.g * 9))
      };
    },

    objetivoEfectivoDia(diaNombre, atletaKey) {
      const base = this.objetivoBaseDia(diaNombre, atletaKey);
      const modoManual = this.obtenerCargaAtleta(diaNombre, atletaKey);
      let obj = { ...base };

      if (modoManual && modoManual !== 'auto' && PERFILES_SESION[atletaKey][modoManual]) {
        const perf = PERFILES_SESION[atletaKey][modoManual];
        obj = { entreno: perf.nombre, p: perf.p, ch: perf.ch, g: perf.g, kcal: perf.kcal };
      }

      // Reajuste metabólico por pesaje semanal (Regla 2: escala carbohidratos en crudo sin alterar la proteína)
      const adj = (this.ajustesMetabolicos && this.ajustesMetabolicos[atletaKey]) ? this.ajustesMetabolicos[atletaKey] : 0;
      if (adj !== 0) {
        const deltaCH = Math.round(adj / 4);
        obj.ch = Math.max(50, obj.ch + deltaCH);
      }

      // Garantizar cálculo matemático exacto: (P * 4) + (CH * 4) + (G * 9)
      obj.kcal = Math.round((obj.p * 4) + (obj.ch * 4) + (obj.g * 9));

      return obj;
    },

    diaFuenteEfectivo(diaNombre) {
      return this.permutacionesDias[diaNombre] || diaNombre;
    },

    diaPermutadoCon(diaNombre) {
      const dest = this.permutacionesDias[diaNombre];
      return (dest && dest !== diaNombre) ? dest : null;
    },

    permutarDias(diaA, diaB) {
      const anteriorB = this.permutacionesDias[diaA];
      if (anteriorB) {
        delete this.permutacionesDias[anteriorB];
        delete this.permutacionesDias[diaA];
      }
      if (diaB && diaB !== diaA) {
        const antDeB = this.permutacionesDias[diaB];
        if (antDeB) delete this.permutacionesDias[antDeB];
        this.permutacionesDias[diaA] = diaB;
        this.permutacionesDias[diaB] = diaA;
      }
      this.permutacionesDias = { ...this.permutacionesDias };
      localStorage.setItem('hybrid_permutaciones_dias', JSON.stringify(this.permutacionesDias));
      this.sincronizarEstadoRemoto('permutacionesDias', this.permutacionesDias);
      this.anunciar(diaB ? `Día ${diaA} intercambiado con ${diaB}` : `Día ${diaA} restaurado`);
    },

    obtenerCargaAtleta(diaNombre, atletaKey) {
      return (this.cargasEntreno[diaNombre] && this.cargasEntreno[diaNombre][atletaKey]) ? this.cargasEntreno[diaNombre][atletaKey] : 'auto';
    },

    fijarCargaAtleta(diaNombre, atletaKey, nuevoModo) {
      if (!this.cargasEntreno[diaNombre]) this.cargasEntreno[diaNombre] = { fede: 'auto', arantxa: 'auto' };
      this.cargasEntreno[diaNombre][atletaKey] = nuevoModo;
      this.cargasEntreno = { ...this.cargasEntreno };
      localStorage.setItem('hybrid_cargas_entreno', JSON.stringify(this.cargasEntreno));
      this.sincronizarEstadoRemoto('cargasEntreno', this.cargasEntreno);
      this.anunciar(`Sesión de entrenamiento actualizada para ${atletaKey}`);
    },

    tieneCargaAdaptada(diaNombre) {
      const c = this.cargasEntreno[diaNombre];
      return !!(c && ((c.fede && c.fede !== 'auto') || (c.arantxa && c.arantxa !== 'auto')));
    },

    tieneModificacionEntrenoDia(diaNombre) {
      return !!(this.diaPermutadoCon(diaNombre) || this.tieneCargaAdaptada(diaNombre));
    },

    restaurarEntrenoDia(diaNombre) {
      this.permutarDias(diaNombre, '');
      if (this.cargasEntreno[diaNombre]) {
        delete this.cargasEntreno[diaNombre];
        this.cargasEntreno = { ...this.cargasEntreno };
        localStorage.setItem('hybrid_cargas_entreno', JSON.stringify(this.cargasEntreno));
        this.sincronizarEstadoRemoto('cargasEntreno', this.cargasEntreno);
      }
      this.anunciar(`Plan original del ${diaNombre} restaurado`);
    },

    descripcionEntrenoEfectivo(diaNombre) {
      const objF = this.objetivoEfectivoDia(diaNombre, 'fede');
      const objA = this.objetivoEfectivoDia(diaNombre, 'arantxa');
      const cFede = this.obtenerCargaAtleta(diaNombre, 'fede');
      const cAra = this.obtenerCargaAtleta(diaNombre, 'arantxa');

      if (cFede === 'auto' && cAra === 'auto') return objF.entreno;
      if (cFede === cAra) return objF.entreno;
      return `Fede: ${objF.entreno} · Ara: ${objA.entreno}`;
    },

    resumenKcalPorCarga() {
      const tot = this.totalesDia();
      return `Objetivo oficial hoy → Fede: ${tot.fede.kcal} kcal (${tot.fede.p}g P | ${tot.fede.ch}g CH | ${tot.fede.g}g G) · Ara: ${tot.arantxa.kcal} kcal`;
    },

    comidasDelDiaPara(diaNombre) {
      const diaFuente = this.diaFuenteEfectivo(diaNombre);
      const buscado = this.normalizar(diaFuente);
      return this.dietaCompleta
        .filter(c => this.normalizar(c.dia).includes(buscado))
        .filter(c => !this.esFilaSoloSuplementoOCarrera(c));
    },

    comidasDelDia() {
      return this.comidasDelDiaPara(this.diaSeleccionado);
    },

    formatearFechaISO(raw) {
      if (!raw) return '';
      const str = raw.toString().trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
      const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`;
      const d = new Date(str);
      if (!isNaN(d.getTime())) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      }
      return '';
    },

    async cargarDatos() {
      this.cargandoDieta = true;
      this.errorConexion = false;
      try {
        if (!supabaseClient) {
          throw new Error("Cliente de Supabase no disponible");
        }

        // 1. Obtener todas las semanas registradas ordenadas cronológicamente
        const { data: semData, error: semErr } = await supabaseClient
          .from('semanas')
          .select('*')
          .order('id', { ascending: true });

        if (semErr) throw semErr;

        this.semanasDisponibles = semData || [];

        // Si no hubiera ninguna semana en la BD, auto-crear Semana 1 activa
        if (this.semanasDisponibles.length === 0) {
          const fechaDef = this.claveSemanaActual();
          const { data: creada } = await supabaseClient
            .from('semanas')
            .insert([{ nombre: 'Semana 1', fecha_inicio: fechaDef, activa: true }])
            .select()
            .single();
          if (creada) this.semanasDisponibles = [creada];
        }

        // 2. Determinar la semana activa
        const activa = this.semanasDisponibles.find(s => s.activa) || this.semanasDisponibles[this.semanasDisponibles.length - 1];
        if (activa) {
          this.semanaActivaId = activa.id;
          if (!this.form.semana_id) {
            this.form.semana = activa.nombre || `Semana ${activa.id}`;
            this.form.semana_id = activa.id;
          }
        }

        if (this.semanaActivaId) {
          // 3. Cargar en paralelo dieta_diaria, resumen_semanal y estado_app de la semana activa
          const [dietaRes, resumenRes, estadoRes] = await Promise.all([
            supabaseClient
              .from('dieta_diaria')
              .select('*')
              .eq('semana_id', this.semanaActivaId)
              .order('id', { ascending: true }),
            supabaseClient
              .from('resumen_semanal')
              .select('*')
              .eq('semana_id', this.semanaActivaId)
              .order('id', { ascending: true }),
            supabaseClient
              .from('estado_app')
              .select('*')
              .eq('semana_id', this.semanaActivaId)
          ]);

          if (dietaRes.error) throw dietaRes.error;
          if (resumenRes.error) throw resumenRes.error;
          if (estadoRes.error) throw estadoRes.error;

          // Mapear dieta_diaria (limpiar si la semana activa aún no tiene comidas)
          if (dietaRes.data && dietaRes.data.length > 0) {
            this.dietaCompleta = dietaRes.data.map(row => ({
              id: row.id,
              dia: row.dia,
              ventana: row.ventana,
              plato: row.plato,
              fede: row.fede_detalles,
              macrosFede: row.macros_fede || '',
              arantxa: row.arantxa_detalles,
              macrosArantxa: row.macros_arantxa || ''
            }));
            localStorage.setItem('hybrid_cache_dieta', JSON.stringify(this.dietaCompleta));
          } else {
            this.dietaCompleta = [];
            localStorage.setItem('hybrid_cache_dieta', '[]');
          }

          // Guardar resumen_semanal y auto-reparar si las filas tenían macros en 0, grasas duplicadas de proteína o calorías desajustadas
          this.resumenSemanal = resumenRes.data || [];
          if (this.resumenSemanal.length > 0) {
            const filasReparar = [];
            this.resumenSemanal.forEach(fila => {
              const atletaKey = this.normalizar(fila.atleta);
              const esFede = atletaKey === 'fede';
              const maxGrasa = esFede ? 85 : 60;
              const pNum = Number(fila.p) || 0;
              const chNum = Number(fila.ch) || 0;
              const gNum = Number(fila.g) || 0;
              const kcalNum = Number(fila.kcal) || 0;

              const tieneMacrosEnCero = (pNum === 0 && chNum === 0);
              const tieneGrasasInfladas = (gNum > maxGrasa) || (pNum > 0 && gNum >= pNum * 0.9);
              const kcalCalculadas = Math.round((pNum * 4) + (chNum * 4) + (gNum * 9));
              const tieneKcalDescuadradas = Math.abs(kcalNum - kcalCalculadas) > 35;

              if (tieneMacrosEnCero || tieneGrasasInfladas || tieneKcalDescuadradas) {
                const objSano = this.calcularMacrosObjetivo(fila.entrenamiento || 'CrossFit 17:30', atletaKey);
                fila.p = (pNum > 0 && pNum <= (esFede ? 220 : 160)) ? pNum : objSano.p;
                fila.ch = (chNum > 0 && chNum < 650) ? chNum : objSano.ch;
                fila.g = (!tieneGrasasInfladas && gNum > 0) ? gNum : objSano.g;
                fila.kcal = Math.round((fila.p * 4) + (fila.ch * 4) + (fila.g * 9));
                filasReparar.push(fila);
              }
            });

            if (filasReparar.length > 0) {
              filasReparar.forEach(f => {
                supabaseClient
                  .from('resumen_semanal')
                  .update({ p: f.p, ch: f.ch, g: f.g, kcal: f.kcal })
                  .eq('id', f.id)
                  .then(() => {});
              });
            }
          }
          localStorage.setItem('hybrid_cache_resumen_supabase', JSON.stringify(this.resumenSemanal));

          // Cargar estados aislados por semana activa
          this.comidasCompletadas = {};
          this.swapsActivos = {};
          this.cargasEntreno = {};
          this.permutacionesDias = {};
          this.cenasSocialesPorDia = {};
          this.ajustesMetabolicos = { fede: 0, arantxa: 0 };

          if (estadoRes.data && estadoRes.data.length > 0) {
            estadoRes.data.forEach(item => {
              const val = typeof item.valor_json === 'string' ? JSON.parse(item.valor_json) : item.valor_json;
              if (item.clave === 'comidasCompletadas') {
                this.comidasCompletadas = val || {};
                localStorage.setItem('hybrid_comidas_completadas', JSON.stringify(this.comidasCompletadas));
              } else if (item.clave === 'swapsActivos') {
                this.swapsActivos = val || {};
                localStorage.setItem('hybrid_swaps_activos', JSON.stringify(this.swapsActivos));
              } else if (item.clave === 'cargasEntreno') {
                this.cargasEntreno = val || {};
                localStorage.setItem('hybrid_cargas_entreno', JSON.stringify(this.cargasEntreno));
              } else if (item.clave === 'permutacionesDias') {
                this.permutacionesDias = val || {};
                localStorage.setItem('hybrid_permutaciones_dias', JSON.stringify(this.permutacionesDias));
              } else if (item.clave === 'cenasSocialesPorDia') {
                this.cenasSocialesPorDia = val || {};
                localStorage.setItem('hybrid_cenas_sociales', JSON.stringify(this.cenasSocialesPorDia));
              } else if (item.clave === 'ajustesMetabolicos') {
                this.ajustesMetabolicos = val || { fede: 0, arantxa: 0 };
                localStorage.setItem('hybrid_ajustes_metabolicos', JSON.stringify(this.ajustesMetabolicos));
              } else if (item.clave === 'entrenosPlanificador') {
                this.entrenosPlanificador = val || this.entrenosPlanificador;
                localStorage.setItem('hybrid_planificador_entrenos', JSON.stringify(this.entrenosPlanificador));
                if (this.semanaActivaId) {
                  localStorage.setItem(`hybrid_planificador_entrenos_${this.semanaActivaId}`, JSON.stringify(this.entrenosPlanificador));
                }
              }
            });
          }

          const tieneEntrenosRemotos = estadoRes.data && estadoRes.data.some(it => it.clave === 'entrenosPlanificador');
          if (!tieneEntrenosRemotos) {
            const guardadoSemana = this.semanaActivaId ? localStorage.getItem(`hybrid_planificador_entrenos_${this.semanaActivaId}`) : null;
            if (guardadoSemana) {
              try {
                this.entrenosPlanificador = JSON.parse(guardadoSemana);
              } catch (e) {}
            } else if (this.resumenSemanal && this.resumenSemanal.length > 0) {
              this.cargarEntrenosDesdeResumen(false);
            } else {
              this.limpiarEntrenosPlanificador(false);
            }
          }

          this.cenaSocialActiva = !!this.cenasSocialesPorDia[this.diaSeleccionado];
        }

        // 4. Cargar biometría de todas las semanas ordenadas
        const { data: bioData, error: bioErr } = await supabaseClient
          .from('biometria')
          .select('*, semanas(id, fecha_inicio, activa)')
          .order('semana_id', { ascending: true });

        if (bioErr) throw bioErr;
        this.historicoBiometria = bioData || [];

        // 5. Seleccionar por defecto la última semana que tenga peso real numérico > 0
        this.seleccionarUltimaSemanaConPeso();

        this.anunciar('Sincronizado con Supabase');
      } catch (e) {
        console.error('Error cargando datos de Supabase:', e);
        this.errorConexion = true;
        this.anunciar('Modo sin conexión: usando datos locales');
      }
      this.cargandoDieta = false;
    },

    async sincronizarEstadoRemoto(clave, objeto) {
      if (!supabaseClient || !this.semanaActivaId) return;
      try {
        await supabaseClient
          .from('estado_app')
          .upsert({
            semana_id: this.semanaActivaId,
            clave: clave,
            valor_json: objeto,
            updated_at: new Date().toISOString()
          }, { onConflict: 'semana_id,clave' });
      } catch (e) {
        console.error('Error al sincronizar estado en Supabase:', e);
      }
    },

    claveSemanaActual() {
      const hoy = new Date();
      const dia = hoy.getDay() || 7;
      const lunes = new Date(hoy);
      lunes.setDate(hoy.getDate() - dia + 1);
      return lunes.toISOString().split('T')[0];
    },

    /**
     * CHECK DE COMIDAS INDEPENDIENTE POR ATLETA (Aislado por semana activa en Supabase)
     */
    esComidaCompletadaAtleta(idx, atletaKey) {
      const kAtleta = `${this.diaSeleccionado}_${idx}_${atletaKey}`;
      const kLegacy = `${this.diaSeleccionado}_${idx}`;

      if (this.comidasCompletadas[kAtleta] !== undefined) return !!this.comidasCompletadas[kAtleta];
      return !!this.comidasCompletadas[kLegacy];
    },

    esComidaCompletada(idx) {
      if (this.vistaAtleta === 'Fede') return this.esComidaCompletadaAtleta(idx, 'fede');
      if (this.vistaAtleta === 'Arantxa') return this.esComidaCompletadaAtleta(idx, 'arantxa');
      return this.esComidaCompletadaAtleta(idx, 'fede') && this.esComidaCompletadaAtleta(idx, 'arantxa');
    },

    toggleComidaCompletadaAtleta(idx, atletaKey) {
      const kAtleta = `${this.diaSeleccionado}_${idx}_${atletaKey}`;
      const nuevo = !this.esComidaCompletadaAtleta(idx, atletaKey);

      if (nuevo) {
        this.comidasCompletadas[kAtleta] = true;
      } else {
        delete this.comidasCompletadas[kAtleta];
      }

      this.comidasCompletadas = { ...this.comidasCompletadas };
      localStorage.setItem('hybrid_comidas_completadas', JSON.stringify(this.comidasCompletadas));
      this.sincronizarEstadoRemoto('comidasCompletadas', this.comidasCompletadas);
      this.anunciar(`Toma ${nuevo ? 'completada' : 'desmarcada'} para ${atletaKey === 'fede' ? 'Fede' : 'Arantxa'}`);
    },

    toggleComidaCompletada(idx) {
      if (this.vistaAtleta === 'Fede') {
        this.toggleComidaCompletadaAtleta(idx, 'fede');
        return;
      }
      if (this.vistaAtleta === 'Arantxa') {
        this.toggleComidaCompletadaAtleta(idx, 'arantxa');
        return;
      }
      const nuevo = !this.esComidaCompletada(idx);
      ['fede', 'arantxa'].forEach(atletaKey => {
        const k = `${this.diaSeleccionado}_${idx}_${atletaKey}`;
        if (nuevo) {
          this.comidasCompletadas[k] = true;
        } else {
          delete this.comidasCompletadas[k];
        }
      });

      this.comidasCompletadas = { ...this.comidasCompletadas };
      localStorage.setItem('hybrid_comidas_completadas', JSON.stringify(this.comidasCompletadas));
      this.sincronizarEstadoRemoto('comidasCompletadas', this.comidasCompletadas);
      this.anunciar(`Toma ${nuevo ? 'completada' : 'desmarcada'} para ambos atletas`);
    },

    contarComidasCompletadas(atletaKey = null) {
      let count = 0;
      this.comidasDelDia().forEach((_, idx) => {
        if (atletaKey) {
          if (this.esComidaCompletadaAtleta(idx, atletaKey)) count++;
        } else {
          if (this.esComidaCompletada(idx)) count++;
        }
      });
      return count;
    },

    /**
     * DETECCIÓN DE PRÓXIMA TOMA Y REGLAS DIETÉTICAS (Regla 4 de rules.md)
     */
    extraerMinutosVentana(ventanaStr) {
      if (!ventanaStr) return null;
      const m = ventanaStr.match(/(\d{1,2}):(\d{2})/);
      if (!m) return null;
      return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
    },

    esProximaComida(idx) {
      if (this.esComidaCompletada(idx)) return false;
      const comidas = this.comidasDelDia();
      for (let i = 0; i < comidas.length; i++) {
        if (!this.esComidaCompletada(i)) {
          return i === idx;
        }
      }
      return false;
    },

    esDiaConCrossFit(diaNombre) {
      const desc = this.normalizar(this.descripcionEntrenoEfectivo(diaNombre));
      return desc.includes('crossfit') || desc.includes('wod');
    },

    esTomaPreCrossFit(comida) {
      if (!this.esDiaConCrossFit(this.diaSeleccionado)) return false;
      const min = this.extraerMinutosVentana(comida.ventana);
      const vNorm = this.normalizar(comida.ventana);
      if (vNorm.includes('pre-wod') || vNorm.includes('pre wod') || vNorm.includes('merienda')) return true;
      // Comida de mediodía o merienda antes del WOD de las 17:30 (entre 12:30 y 17:15)
      if (min !== null && min >= 750 && min <= 1035) return true;
      return false;
    },

    validarReglaDieteticaSwap(comida, idx) {
      const s = this.swapsActivos[this.diaSeleccionado + '_' + idx];
      if (!s) return null;
      const avisos = [];
      if (s.prot === 'salmón fresco' && this.esPlatoCalientePrincipal(comida)) {
        avisos.push('Regla Kinetix: Prohibido el salmón cocinado en platos calientes (usa atún al natural o merluza empanada Mercadona).');
      }
      if ((s.ch === 'garbanzos bote' || s.ch === 'lentejas bote') && this.esTomaPreCrossFit(comida)) {
        avisos.push('Regla Kinetix Pre-CrossFit (17:30): Evita legumbres antes del WOD. Prioriza vaciado gástrico rápido (arroz, patata, claras).');
      }
      if (s.prot === 'huevos enteros' && this.esTomaPreCrossFit(comida) && this.normalizar(comida.ventana).includes('pre')) {
        avisos.push('Consejo Pre-WOD: Prioriza claras de huevo sobre huevos enteros para aligerar grasas antes de las 17:30.');
      }
      return avisos.length > 0 ? avisos.join(' ') : null;
    },

    esPlatoCalientePrincipal(comida) {
      const v = this.normalizar(comida.ventana);
      const p = this.normalizar(comida.plato);
      if (v.includes('comida') || v.includes('cena') || v.includes('almuerzo')) {
        if (!p.includes('ensalada') && !p.includes('poke') && !p.includes('tartar') && !p.includes('tosta')) {
          return true;
        }
      }
      return false;
    },

    identificarAlimentoCatalogo(nombreRaw) {
      const n = this.normalizar(nombreRaw);
      if (n.includes('merluza') && n.includes('empanada')) return 'merluza empanada Mercadona';
      if (n.includes('merluza') || n.includes('pescado blanco')) return 'merluza blanca';
      if (n.includes('pollo')) return 'pechuga pollo';
      if (n.includes('pavo')) return 'pechuga pavo';
      if (n.includes('atun')) return 'atún al natural';
      if (n.includes('ternera') || n.includes('solomillo')) return 'solomillo ternera';
      if (n.includes('lomo') && !n.includes('cerdo')) return 'lomo embuchado';
      if (n.includes('jamon')) return 'jamón serrano';
      if (n.includes('salmon')) return 'salmón fresco';
      if (n.includes('hamburguesa')) return 'hamburguesa ave magra';
      if (n.includes('huevo') && !n.includes('clara')) return 'huevos enteros';
      if (n.includes('arroz') && !n.includes('tortita') && !n.includes('fideo')) return 'arroz basmati';
      if (n.includes('boniato')) return 'boniato';
      if (n.includes('patata')) return 'patata';
      if (n.includes('pasta')) return 'pasta blanca';
      if (n.includes('pan')) return 'pan masa madre';
      if (n.includes('avena')) return 'copos de avena';
      if (n.includes('tortita')) return 'tortitas de arroz';
      if (n.includes('clara')) return 'claras de huevo';
      if (n.includes('cerdo')) return 'lomo de cerdo magro';
      if (n.includes('batido') || n.includes('cottage')) return 'queso fresco batido';
      if (n.includes('garbanzo')) return 'garbanzos bote';
      if (n.includes('lenteja')) return 'lentejas bote';
      if (n.includes('quinoa')) return 'quinoa';
      if (n.includes('cuscus')) return 'cuscús';
      if (n.includes('fideo')) return 'fideos de arroz';
      if (n.includes('aguacate')) return 'aguacate';
      return null;
    },

    nombreBonitoAlimento(id) {
      const mapa = {
        'pechuga pollo': 'Pechuga de pollo',
        'pechuga pavo': 'Pechuga de pavo',
        'atún al natural': 'Atún al natural',
        'merluza blanca': 'Merluza blanca',
        'merluza empanada Mercadona': 'Merluza empanada Mercadona',
        'solomillo ternera': 'Solomillo de ternera',
        'lomo embuchado': 'Lomo embuchado',
        'jamón serrano': 'Jamón serrano',
        'salmón fresco': 'Salmón fresco',
        'claras de huevo': 'Claras de huevo',
        'huevos enteros': 'Huevos enteros',
        'lomo de cerdo magro': 'Lomo de cerdo magro',
        'queso fresco batido': 'Queso fresco batido',
        'arroz basmati': 'Arroz basmati',
        'patata': 'Patata',
        'boniato': 'Boniato',
        'pasta blanca': 'Pasta blanca',
        'pan masa madre': 'Pan masa madre',
        'copos de avena': 'Copos de avena',
        'tortitas de arroz': 'Tortitas de arroz',
        'garbanzos bote': 'Garbanzos de bote',
        'lentejas bote': 'Lentejas de bote',
        'quinoa': 'Quinoa',
        'cuscús': 'Cuscús',
        'fideos de arroz': 'Fideos de arroz',
        'aguacate': 'Aguacate'
      };
      return mapa[id] || id;
    },

    /**
     * MOTOR DE CÁLCULO DE CADA COMIDA:
     * 1. Parte de los macros oficiales escritos en el Excel para esa comida (`comida.macrosFede` / `comida.macrosArantxa`),
     *    normalizados para que la suma de las comidas del día dé EXACTAMENTE las Kcal de `RESUMEN_SEMANAL`.
     * 2. Si el usuario cambia el entrenamiento del día, escala los carbohidratos y las calorías de cada toma.
     * 3. Si el usuario intercambia un alimento, mantiene INTACTAS las calorías y macros de la toma
     *    y recalcula únicamente los gramos en crudo mediante sistema de ecuaciones lineales.
     */
    comidaCalculadaParaDia(diaNombre, comida, idx, atletaKey) {
      const rawTexto = atletaKey === 'fede' ? comida.fede : comida.arantxa;
      const textoOriginal = this.limpiarSuplementosDeTexto(rawTexto);
      const campoMacros = atletaKey === 'fede' ? 'macrosFede' : 'macrosArantxa';

      const macrosEscritosFila = this.parsearMacrosDeColumnaExcel(comida[campoMacros]);

      const todasComidasDia = this.comidasDelDiaPara(diaNombre);
      let sumaP_Dieta = 0, sumaCH_Dieta = 0, sumaG_Dieta = 0, sumaKcal_Dieta = 0;
      todasComidasDia.forEach(c => {
        const m = this.parsearMacrosDeColumnaExcel(c[campoMacros]);
        sumaP_Dieta += m.p; sumaCH_Dieta += m.ch; sumaG_Dieta += m.g; sumaKcal_Dieta += m.kcal;
      });

      const objDiaBase = this.objetivoBaseDia(diaNombre, atletaKey);
      const objDiaEfectivo = this.objetivoEfectivoDia(diaNombre, atletaKey);

      const numTomas = todasComidasDia.length || 4;
      const pesoP  = sumaP_Dieta > 0    ? (macrosEscritosFila.p / sumaP_Dieta)       : (1 / numTomas);
      const pesoCH = sumaCH_Dieta > 0   ? (macrosEscritosFila.ch / sumaCH_Dieta)     : (1 / numTomas);
      const pesoG  = sumaG_Dieta > 0    ? (macrosEscritosFila.g / sumaG_Dieta)       : (1 / numTomas);
      const pesoK  = sumaKcal_Dieta > 0 ? (macrosEscritosFila.kcal / sumaKcal_Dieta) : (1 / numTomas);

      const pBaseComida    = Math.round(objDiaBase.p * pesoP);
      const chBaseComida   = Math.round(objDiaBase.ch * pesoCH);
      const gBaseComida    = Math.round(objDiaBase.g * pesoG);
      const kcalBaseComida = Math.round(objDiaBase.kcal * pesoK);

      let pMetaComida    = Math.round(objDiaEfectivo.p * pesoP);
      let chMetaComida   = Math.round(objDiaEfectivo.ch * pesoCH);
      let gMetaComida    = Math.round(objDiaEfectivo.g * pesoG);
      let kcalMetaComida = Math.round(objDiaEfectivo.kcal * pesoK);

      const factorEntrenoCH = objDiaBase.ch > 0 ? (objDiaEfectivo.ch / objDiaBase.ch) : 1.0;

      const esPreCena = this.isPreCena(comida.ventana);
      const cenaLibreEsteDia = (diaNombre === this.diaSeleccionado) ? this.cenaSocialActiva : !!this.cenasSocialesPorDia[diaNombre];
      const factorCena = (cenaLibreEsteDia && esPreCena) ? 0.65 : 1.0;

      let ahorroCH = 0, ahorroKcal = 0;
      if (factorCena < 1.0) {
        ahorroCH = Math.round(chMetaComida * 0.35);
        const gAhorrado = Math.round(gMetaComida * 0.35);
        ahorroKcal = (ahorroCH * 4) + (gAhorrado * 9);
        chMetaComida = Math.max(0, chMetaComida - ahorroCH);
        gMetaComida = Math.max(0, gMetaComida - gAhorrado);
        kcalMetaComida = Math.max(0, kcalMetaComida - ahorroKcal);
      }

      const factorTotalGramosCH = factorEntrenoCH * factorCena;
      const swapConfig = this.swapsActivos[diaNombre + '_' + idx] || {};

      let partes = this.dividirTextoEnIngredientes(textoOriginal);
      let idxProt = -1, infoProtOrig = null, gramosProtOrig = 0;
      let idxCH = -1, infoCHOrig = null, gramosCHOrig = 0;
      let idxAOVE = -1, mlAOVEOrig = 0;

      partes.forEach((parte, i) => {
        const mAove = parte.match(/^(\d+(?:[.,]\d+)?)\s*ml\s+(aove|aceite)/i) || parte.match(/(aove|aceite)[^0-9]*(\d+(?:[.,]\d+)?)\s*ml/i);
        if (mAove) {
          idxAOVE = i;
          const numStr = mAove[1] && /\d/.test(mAove[1]) ? mAove[1] : mAove[2];
          mlAOVEOrig = parseFloat(numStr.replace(',', '.'));
          return;
        }
        const parsed = this.parsearIngredienteIndividual(parte);
        if (parsed && parsed.cantidad && parsed.cantidad.includes('g')) {
          const gVal = parseFloat(parsed.cantidad.replace(',', '.'));
          const idCat = this.identificarAlimentoCatalogo(parsed.nombre);
          if (idCat && CATALOGO_NUTRICIONAL[idCat]) {
            const catObj = CATALOGO_NUTRICIONAL[idCat];
            if (catObj.tipo === 'prot' && idxProt === -1) {
              idxProt = i; infoProtOrig = catObj; gramosProtOrig = gVal;
            } else if (catObj.tipo === 'ch' && idxCH === -1) {
              idxCH = i; infoCHOrig = catObj; gramosCHOrig = gVal;
            }
          }
        }
      });

      const haySwapProt = !!(swapConfig.prot && idxProt !== -1 && CATALOGO_NUTRICIONAL[swapConfig.prot]);
      const haySwapCH = !!(swapConfig.ch && idxCH !== -1 && CATALOGO_NUTRICIONAL[swapConfig.ch]);
      const hayCambioCarga = Math.abs(factorTotalGramosCH - 1.0) > 0.01 || Math.abs(factorCena - 1.0) > 0.01;

      if (Math.abs(factorTotalGramosCH - 1.0) > 0.01) {
        partes = partes.map((parte, i) => {
          if (i === idxProt || i === idxCH || i === idxAOVE) return parte;
          const n = this.normalizar(parte);
          if (/miel|datil|tortita|platano|manzana|avena/.test(n)) {
            const mInicioG = parte.match(/^(\d+(?:[.,]\d+)?)\s*g\s+(.*)$/i);
            if (mInicioG) {
              const gNuevo = Math.max(5, Math.round((parseFloat(mInicioG[1].replace(',', '.')) * factorTotalGramosCH) / 5) * 5);
              return `${gNuevo} g ${mInicioG[2]}`;
            }
            const mParenG = parte.match(/^(.*?)\((\d+(?:[.,]\d+)?)\s*g\)(.*)$/i);
            if (mParenG) {
              const gNuevo = Math.max(10, Math.round((parseFloat(mParenG[2].replace(',', '.')) * factorTotalGramosCH) / 5) * 5);
              return `${mParenG[1]}(${gNuevo} g)${mParenG[3]}`;
            }
            const mTortita = parte.match(/^(\d+(?:[.,]\d+)?)\s*(tortitas?\s+.*)$/i);
            if (mTortita) {
              const uNueva = Math.max(1, Math.round(parseFloat(mTortita[1].replace(',', '.')) * factorTotalGramosCH));
              return `${uNueva} ${mTortita[2]}`;
            }
          }
          return parte;
        });
      }

      if (haySwapProt || haySwapCH || hayCambioCarga) {
        const pDeProtOrig = infoProtOrig ? (gramosProtOrig / 100) * infoProtOrig.p : 0;
        const chDeProtOrig = infoProtOrig ? (gramosProtOrig / 100) * infoProtOrig.ch : 0;
        const gDeProtOrig = infoProtOrig ? (gramosProtOrig / 100) * infoProtOrig.g : 0;

        const pDeCHOrig = infoCHOrig ? (gramosCHOrig / 100) * infoCHOrig.p : 0;
        const chDeCHOrig = infoCHOrig ? (gramosCHOrig / 100) * infoCHOrig.ch : 0;
        const gDeCHOrig = infoCHOrig ? (gramosCHOrig / 100) * infoCHOrig.g : 0;

        const nuevaProtObj = haySwapProt ? CATALOGO_NUTRICIONAL[swapConfig.prot] : infoProtOrig;
        const nuevoCHObj = haySwapCH ? CATALOGO_NUTRICIONAL[swapConfig.ch] : infoCHOrig;

        const targetCH_Pilares = (chDeProtOrig + chDeCHOrig) * factorTotalGramosCH;
        const targetP_TotalPilares = pDeProtOrig + (pDeCHOrig * factorTotalGramosCH);

        let nuevosGramosProt = gramosProtOrig;
        let nuevosGramosCH = gramosCHOrig * factorTotalGramosCH;

        if (nuevaProtObj && nuevoCHObj) {
          if (haySwapProt || haySwapCH) {
            const Pp = nuevaProtObj.p / 100, Pc = nuevoCHObj.p / 100;
            const CHp = nuevaProtObj.ch / 100, CHc = nuevoCHObj.ch / 100;
            const det = (Pp * CHc) - (Pc * CHp);
            if (Math.abs(det) > 0.0001) {
              nuevosGramosProt = ((targetP_TotalPilares * CHc) - (Pc * targetCH_Pilares)) / det;
              nuevosGramosCH = ((Pp * targetCH_Pilares) - (targetP_TotalPilares * CHp)) / det;
            }
          } else {
            nuevosGramosProt = gramosProtOrig;
            nuevosGramosCH = gramosCHOrig * factorTotalGramosCH;
          }
        } else if (nuevaProtObj && !nuevoCHObj) {
          nuevosGramosProt = pDeProtOrig / (nuevaProtObj.p / 100);
        } else if (!nuevaProtObj && nuevoCHObj) {
          nuevosGramosCH = targetCH_Pilares / (nuevoCHObj.ch / 100);
        }

        nuevosGramosProt = Math.max(0, Math.round(nuevosGramosProt / 5) * 5);
        nuevosGramosCH = Math.max(0, Math.round(nuevosGramosCH / 5) * 5);

        const gNuevaProt = nuevaProtObj ? (nuevosGramosProt / 100) * nuevaProtObj.g : 0;
        const gNuevoCH = nuevoCHObj ? (nuevosGramosCH / 100) * nuevoCHObj.g : 0;
        const targetG_Pilares = (gDeProtOrig + gDeCHOrig + mlAOVEOrig) * factorCena;
        let nuevoMlAOVE = Math.round(targetG_Pilares - (gNuevaProt + gNuevoCH));
        if (nuevoMlAOVE < 0) nuevoMlAOVE = 0;

        if (idxProt !== -1 && nuevaProtObj) {
          const nombreMostrarProt = haySwapProt ? this.nombreBonitoAlimento(swapConfig.prot) : partes[idxProt].replace(/^\d+(?:[.,]\d+)?\s*g\s+/i, '');
          partes[idxProt] = `${nuevosGramosProt} g ${nombreMostrarProt}`;
        }
        if (idxCH !== -1 && nuevoCHObj) {
          const nombreMostrarCH = haySwapCH ? this.nombreBonitoAlimento(swapConfig.ch) : partes[idxCH].replace(/^\d+(?:[.,]\d+)?\s*g\s+/i, '');
          partes[idxCH] = `${nuevosGramosCH} g ${nombreMostrarCH}`;
        }
        if (idxAOVE !== -1) {
          partes[idxAOVE] = nuevoMlAOVE > 0 ? `${nuevoMlAOVE} ml AOVE` : '';
        } else if (nuevoMlAOVE > 0 && (haySwapProt || haySwapCH)) {
          partes.push(`${nuevoMlAOVE} ml AOVE`);
        }

        // Si hay swap activo, reflejar los macros matemáticos reales del plato intercambiado
        if (haySwapProt || haySwapCH) {
          const finalP = Math.round((nuevosGramosProt / 100) * (nuevaProtObj ? nuevaProtObj.p : 0) + (nuevosGramosCH / 100) * (nuevoCHObj ? nuevoCHObj.p : 0));
          const finalCH = Math.round((nuevosGramosProt / 100) * (nuevaProtObj ? nuevaProtObj.ch : 0) + (nuevosGramosCH / 100) * (nuevoCHObj ? nuevoCHObj.ch : 0));
          const finalG = Math.round((nuevosGramosProt / 100) * (nuevaProtObj ? nuevaProtObj.g : 0) + (nuevosGramosCH / 100) * (nuevoCHObj ? nuevoCHObj.g : 0) + nuevoMlAOVE);
          const finalKcal = (finalP * 4) + (finalCH * 4) + (finalG * 9);

          if (finalP > 0 || finalCH > 0) {
            pMetaComida = finalP;
            chMetaComida = finalCH;
            gMetaComida = finalG;
            kcalMetaComida = finalKcal;
          }
        }
      }

      // Garantizar que los macros nunca queden a 0 si la fila tenía macros escritos válidos
      if (pMetaComida === 0 && chMetaComida === 0 && (macrosEscritosFila.p > 0 || macrosEscritosFila.ch > 0)) {
        pMetaComida = macrosEscritosFila.p;
        chMetaComida = Math.round(macrosEscritosFila.ch * factorTotalGramosCH);
        gMetaComida = macrosEscritosFila.g;
        kcalMetaComida = Math.round((pMetaComida * 4) + (chMetaComida * 4) + (gMetaComida * 9));
      }

      let notaAjuste = '';
      const diffKcal = kcalMetaComida - kcalBaseComida;
      if (Math.abs(factorEntrenoCH - 1.0) > 0.01) {
        const pct = Math.round((factorEntrenoCH - 1) * 100);
        notaAjuste = `CH ${pct > 0 ? '+' + pct : pct}% (${diffKcal > 0 ? '+' + diffKcal : diffKcal} kcal)`;
      } else if (haySwapProt || haySwapCH) {
        notaAjuste = 'Isocalórico';
      }

      return {
        texto: partes.filter(Boolean).join(' + '),
        macrosObj: { p: pMetaComida, ch: chMetaComida, g: gMetaComida, kcal: kcalMetaComida, ahorroKcal, ahorroCH },
        macrosBase: { p: pBaseComida, ch: chBaseComida, g: gBaseComida, kcal: kcalBaseComida },
        macrosTexto: `${pMetaComida}g P | ${chMetaComida}g CH | ${gMetaComida}g G | ${kcalMetaComida} kcal`,
        notaAjuste
      };
    },

    comidaCalculada(comida, idx, atletaKey) {
      return this.comidaCalculadaParaDia(this.diaSeleccionado, comida, idx, atletaKey);
    },

    tituloPlatoAdaptado(comida, idx) {
      const baseLimpio = this.limpiarSuplementosDeTitulo(comida.plato);
      const s = this.swapsActivos[this.diaSeleccionado + '_' + idx];
      if (!s || (!s.prot && !s.ch)) return baseLimpio;
      const etiquetas = [];
      if (s.prot) etiquetas.push(s.prot);
      if (s.ch) etiquetas.push(s.ch);
      return `${baseLimpio} (→ ${etiquetas.join(' + ')})`;
    },

    /**
     * TOTALES DEL DÍA:
     * Devuelve exactamente el objetivo oficial del día de RESUMEN_SEMANAL (o el perfil de sesión elegido),
     * descontando el ahorro si el Modo Cena Libre está activo.
     */
    totalesDia() {
      const calcularParaAtleta = (atletaKey) => {
        const base = this.objetivoBaseDia(this.diaSeleccionado, atletaKey);
        const efectivo = this.objetivoEfectivoDia(this.diaSeleccionado, atletaKey);
        const comidas = this.comidasDelDia();

        let ahorroKcal = 0, ahorroCH = 0, ahorroG = 0;
        if (this.cenaSocialActiva) {
          comidas.forEach((c, idx) => {
            const m = this.comidaCalculada(c, idx, atletaKey).macrosObj;
            ahorroKcal += (m.ahorroKcal || 0);
            ahorroCH += (m.ahorroCH || 0);
          });
          ahorroG = Math.round((ahorroKcal - (ahorroCH * 4)) / 9);
        }

        const pFinal = efectivo.p;
        const chFinal = Math.max(0, efectivo.ch - ahorroCH);
        const gFinal = Math.max(0, efectivo.g - Math.max(0, ahorroG));
        const kcalFinal = Math.max(0, efectivo.kcal - ahorroKcal);

        return {
          p: pFinal,
          ch: chFinal,
          g: gFinal,
          kcal: kcalFinal,
          deltaKcalVsBase: kcalFinal - base.kcal,
          ahorroKcal,
          ahorroCH
        };
      };

      return {
        fede: calcularParaAtleta('fede'),
        arantxa: calcularParaAtleta('arantxa')
      };
    },

    consumidoDia(atletaKey) {
      const comidas = this.comidasDelDia();
      let p = 0, ch = 0, g = 0, kcal = 0;
      comidas.forEach((c, idx) => {
        if (this.esComidaCompletadaAtleta(idx, atletaKey)) {
          const calc = this.comidaCalculada(c, idx, atletaKey).macrosObj;
          p += calc.p; ch += calc.ch; g += calc.g; kcal += calc.kcal;
        }
      });
      return { p: Math.round(p), ch: Math.round(ch), g: Math.round(g), kcal: Math.round(kcal) };
    },

    porcentajeConsumido(atletaKey, macroKey) {
      const total = this.totalesDia()[atletaKey][macroKey] || 1;
      const hecho = this.consumidoDia(atletaKey)[macroKey] || 0;
      return Math.min(100, Math.round((hecho / total) * 100));
    },

    /**
     * DISTRIBUCIÓN DE MACROS PARA GRÁFICOS DE TARTA (Recommended vs Actual de CaloriCam)
     */
    distribucionMacrosPie(atletaKey, modo = 'meta') {
      const fuente = modo === 'actual' ? this.consumidoDia(atletaKey) : this.totalesDia()[atletaKey];
      const kcalCH = (fuente.ch || 0) * 4;
      const kcalG  = (fuente.g || 0) * 9;
      const kcalP  = (fuente.p || 0) * 4;
      const totalKcal = kcalCH + kcalG + kcalP;

      if (totalKcal <= 0) {
        return { ch: 0, g: 0, p: 0, vacio: true, gradient: 'conic-gradient(#EADFD9 0% 100%)' };
      }

      const pctCH = Math.round((kcalCH / totalKcal) * 100);
      const pctG  = Math.round((kcalG / totalKcal) * 100);
      const pctP  = Math.max(0, 100 - pctCH - pctG);

      const corte1 = pctCH;
      const corte2 = pctCH + pctG;
      const gradient = `conic-gradient(#E0909E 0% ${corte1}%, #D3A664 ${corte1}% ${corte2}%, #94A2AC ${corte2}% 100%)`;

      return { ch: pctCH, g: pctG, p: pctP, vacio: false, gradient };
    },

    rangoObjetivoKcal(atletaKey) {
      const meta = this.totalesDia()[atletaKey].kcal;
      const min = Math.round((meta * 0.94) / 10) * 10;
      return `${min} - ${meta}`;
    },

    /**
     * Divide cualquier texto de ingredientes (separado por '+', comas, saltos de línea o ';')
     * respetando comas decimales (ej. 1,5 latas) y texto entre paréntesis (ej. salmón (crudo, marinado)).
     */
    dividirTextoEnIngredientes(str) {
      if (!str) return [];
      const res = [];
      let buffer = '';
      let parenDepth = 0;

      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        if (char === '(') {
          parenDepth++;
          buffer += char;
        } else if (char === ')') {
          if (parenDepth > 0) parenDepth--;
          buffer += char;
        } else if (char === '+' || char === ';' || char === '\n') {
          if (parenDepth === 0) {
            const trimmed = buffer.trim();
            if (trimmed) res.push(trimmed);
            buffer = '';
          } else {
            buffer += char;
          }
        } else if (char === ',') {
          const prev = str[i - 1];
          const next = str[i + 1];
          const esDecimal = /\d/.test(prev) && /\d/.test(next);

          if (parenDepth === 0 && !esDecimal) {
            const trimmed = buffer.trim();
            if (trimmed) res.push(trimmed);
            buffer = '';
          } else {
            buffer += char;
          }
        } else {
          buffer += char;
        }
      }

      const resto = buffer.trim();
      if (resto) res.push(resto);
      return res;
    },

    /**
     * Extrae el nombre limpio del alimento y su cantidad/unidad exacta para mostrarla en badge.
     */
    parsearIngredienteIndividual(parteRaw) {
      if (!parteRaw) return null;
      let limpio = parteRaw.trim().replace(/^[-•*]\s*/, '').replace(/^[\s+,;]+|[\s+,;]+$/g, '').trim();
      if (!limpio) return null;

      const unidadesRegex = '(?:latas?|tortitas?|rebanadas?|tostadas?|scoops?|cacitos?|cucharadas?|vasos?|unidades|uds?|gramos|gr|g|mililitros|ml|litros?|l|kilos?|kg)\\b';

      const capitalizar = (txt) => {
        if (!txt) return '';
        return txt.charAt(0).toUpperCase() + txt.slice(1);
      };

      const normalizarUnidad = (u) => {
        if (!u) return 'ud';
        const l = u.toLowerCase().trim();
        if (l === 'gr' || l === 'gramos') return 'g';
        if (l === 'mililitros') return 'ml';
        if (l === 'litro' || l === 'litros') return 'l';
        if (l === 'kilo' || l === 'kilos') return 'kg';
        if (l === 'unidades' || l === 'uds') return 'ud';
        return l;
      };

      // 1. Patrón sufijo: "copos de avena (80g)", "arroz 90 g", "pollo 150g"
      const regexSufijo = new RegExp(`^(.*?)\\s*\\(?(\\d+(?:[.,]\\d+)?)\\s*(${unidadesRegex})\\)?$`, 'i');
      const matchSufijo = limpio.match(regexSufijo);
      if (matchSufijo && matchSufijo[1].trim()) {
        const num = matchSufijo[2];
        const unit = normalizarUnidad(matchSufijo[3]);
        return {
          nombre: capitalizar(matchSufijo[1].trim()),
          cantidad: `${num} ${unit}`.trim()
        };
      }

      // 2. Patrón prefijo con unidad: "35g proteína whey", "150g pechuga de pollo", "10ml AOVE", "1,5 latas atún", "2 tortitas de arroz"
      const regexPrefijoConUnidad = new RegExp(`^(\\d+(?:[.,]\\d+)?)\\s*(${unidadesRegex})\\s*(?:de\\s+)?(.*)$`, 'i');
      const matchConUnidad = limpio.match(regexPrefijoConUnidad);
      if (matchConUnidad) {
        const num = matchConUnidad[1];
        const rawUnit = matchConUnidad[2];
        const restoNombre = (matchConUnidad[3] || '').trim();

        // Caso especial: "2 tortitas de arroz"
        if (/tortita/i.test(rawUnit) && /arroz/i.test(restoNombre)) {
          return {
            nombre: 'Tortitas de arroz',
            cantidad: `${num} ud`
          };
        }

        const unit = normalizarUnidad(rawUnit);

        if (!restoNombre) {
          return {
            nombre: capitalizar(rawUnit),
            cantidad: `${num} ud`
          };
        }

        return {
          nombre: capitalizar(restoNombre),
          cantidad: `${num} ${unit}`.trim()
        };
      }

      // 3. Patrón prefijo numérico sin unidad explícita: "2 huevos enteros a la plancha", "1 plátano", "2 tostadas pan masa madre"
      const matchNumeroSinUnidad = limpio.match(/^(\d+(?:[.,]\d+)?)\s*(?:de\s+)?(.*)$/i);
      if (matchNumeroSinUnidad && matchNumeroSinUnidad[2].trim()) {
        const num = matchNumeroSinUnidad[1];
        const restoNombre = matchNumeroSinUnidad[2].trim();
        return {
          nombre: capitalizar(restoNombre),
          cantidad: `${num} ud`
        };
      }

      // 4. Patrón con paréntesis incrustado: "salmón fresco (120g crudo)"
      const regexParentesis = new RegExp(`^(.*?)\\s*\\((?:peso\\s+en\\s+crudo\\s+)?(\\d+(?:[.,]\d+)?)\\s*(${unidadesRegex})[^)]*\\)(.*)$`, 'i');
      const matchParentesis = limpio.match(regexParentesis);
      if (matchParentesis) {
        const num = matchParentesis[2];
        const unit = normalizarUnidad(matchParentesis[3]);
        const nombre = capitalizar((matchParentesis[1] + ' ' + matchParentesis[4]).replace(/\s+/g, ' ').trim());
        return {
          nombre,
          cantidad: `${num} ${unit}`.trim()
        };
      }

      // 5. Sin cantidad explícita (ej. "copos de avena crudos", "sal y pimienta")
      return {
        nombre: capitalizar(limpio),
        cantidad: 'Al gusto'
      };
    },

    desglosarListaIngredientes(str) {
      if (!str) return [];
      const partes = this.dividirTextoEnIngredientes(str);
      return partes.map(p => this.parsearIngredienteIndividual(p)).filter(Boolean);
    },

    seleccionarUltimaSemanaConPeso(atletaNombre = this.form.atleta) {
      const historial = this.historicoAtleta(atletaNombre);
      const conPeso = historial.filter(h => {
        const p = parseFloat(h.peso);
        return !isNaN(p) && p > 0;
      });

      if (conPeso.length > 0) {
        const target = conPeso[conPeso.length - 1];
        this.cambiarSemanaBiometria(target.semana_id);
      } else if (historial.length > 0) {
        const activa = historial.find(h => h.activa) || historial[historial.length - 1];
        this.cambiarSemanaBiometria(activa.semana_id);
      }
    },

    cambiarAtletaBiometria(atletaNombre) {
      this.form.atleta = atletaNombre;
      if (this.form.semana_id) {
        this.cambiarSemanaBiometria(this.form.semana_id);
      } else {
        this.seleccionarUltimaSemanaConPeso(atletaNombre);
      }
    },

    cambiarSemanaBiometria(nuevaSemanaId) {
      if (!nuevaSemanaId) return;
      this.form.semana_id = parseInt(nuevaSemanaId, 10);
      const historial = this.historicoAtleta(this.form.atleta);
      const fila = historial.find(h => h.semana_id === this.form.semana_id);

      if (fila) {
        this.form.semana = fila.semana;
        this.form.fecha = fila.fecha || '';
        this.form.peso = fila.peso || '';
        this.form.pecho = fila.pecho || '';
        this.form.cintura = fila.cintura || '';
        this.form.cadera = fila.cadera || '';
        this.form.brazo = fila.brazo || '';
        this.form.muslo = fila.muslo || '';
      } else {
        const sem = this.semanasDisponibles.find(s => s.id === this.form.semana_id);
        this.form.semana = sem ? (sem.nombre || `Semana ${sem.id}`) : `Semana ${this.form.semana_id}`;
        this.form.fecha = sem ? (sem.fecha_inicio || '').split('T')[0] : '';
        this.form.peso = '';
        this.form.pecho = '';
        this.form.cintura = '';
        this.form.cadera = '';
        this.form.brazo = '';
        this.form.muslo = '';
      }
    },

    async anadirNuevaSemanaControl() {
      if (!supabaseClient) {
        alert("Cliente de Supabase no disponible.");
        return;
      }
      this.enviando = true;
      try {
        const num = (this.semanasDisponibles.length || 0) + 1;
        const nombreNueva = `Semana ${num}`;
        const hoyStr = new Date().toISOString().split('T')[0];

        // Crear nueva semana en BD marcada como activa
        const { data: nueva, error } = await supabaseClient
          .from('semanas')
          .insert([{
            nombre: nombreNueva,
            fecha_inicio: hoyStr,
            activa: true
          }])
          .select()
          .single();

        if (error) throw error;

        // Desactivar las semanas anteriores
        await supabaseClient
          .from('semanas')
          .update({ activa: false })
          .neq('id', nueva.id);

        await this.cargarDatos();

        // Seleccionar la nueva semana en el formulario con campos limpios
        this.cambiarSemanaBiometria(nueva.id);
        this.anunciar(`Creada ${nombreNueva}. Puedes introducir el peso y medidas.`);
        alert(`¡${nombreNueva} creada con éxito!\n\nAhora introduce el peso y medidas del pesaje y pulsa "Guardar Medidas".`);
      } catch (e) {
        alert("Error al crear nueva semana: " + e.message);
      } finally {
        this.enviando = false;
      }
    },

    sincronizarFechaSemana() {
      if (this.form.semana_id) {
        this.cambiarSemanaBiometria(this.form.semana_id);
      }
    },

    historicoAtleta(atletaNombre = this.form.atleta) {
      const lista = [];

      // Si tenemos semanas de Supabase, generamos la lista ordenada
      if (this.semanasDisponibles && this.semanasDisponibles.length > 0) {
        this.semanasDisponibles.forEach((sem, idx) => {
          const semNombre = sem.nombre || `Semana ${idx + 1}`;
          const bio = (this.historicoBiometria || []).find(b => 
            b.semana_id === sem.id && 
            this.normalizar(b.atleta) === this.normalizar(atletaNombre)
          );

          lista.push({
            semana_id: sem.id,
            semana: semNombre,
            fecha: (sem.fecha_inicio || '').split('T')[0],
            activa: !!sem.activa,
            peso: (bio && bio.peso !== null && bio.peso !== undefined && bio.peso !== '') ? bio.peso.toString() : '',
            pecho: (bio && bio.pecho !== null && bio.pecho !== undefined && bio.pecho !== '') ? bio.pecho.toString() : '',
            cintura: (bio && bio.cintura !== null && bio.cintura !== undefined && bio.cintura !== '') ? bio.cintura.toString() : '',
            cadera: (bio && bio.cadera !== null && bio.cadera !== undefined && bio.cadera !== '') ? bio.cadera.toString() : '',
            brazo: (bio && bio.brazo !== null && bio.brazo !== undefined && bio.brazo !== '') ? bio.brazo.toString() : '',
            muslo: (bio && bio.muslo !== null && bio.muslo !== undefined && bio.muslo !== '') ? bio.muslo.toString() : ''
          });
        });
      }

      // Si aún no hay semanas en BD, dar datos iniciales de respaldo
      if (lista.length === 0) {
        const r1 = DATOS_SEMANA1_RESPALDO[atletaNombre] || DATOS_SEMANA1_RESPALDO['Fede'];
        lista.push({
          semana_id: 1,
          semana: 'Semana 1',
          fecha: '2026-10-26',
          activa: true,
          ...r1
        });
      }

      return lista;
    },

    alturaBarraPeso(pesoStr) {
      const p = parseFloat(pesoStr);
      if (!p || isNaN(p)) return 12;
      if (this.form.atleta === 'Fede') {
        // Rango visual Fede: 85 kg (20%) a 95 kg (100%)
        return Math.max(18, Math.min(100, Math.round(((p - 85) / (95 - 85)) * 80 + 20)));
      } else {
        // Rango visual Arantxa: 62 kg (20%) a 70 kg (100%)
        return Math.max(18, Math.min(100, Math.round(((p - 62) / (70 - 62)) * 80 + 20)));
      }
    },

    progresoMetaFede() {
      const pesoActual = parseFloat(this.form.peso) || 93.5;
      const pct = ((93.5 - pesoActual) / (93.5 - 87.5)) * 100;
      return Math.max(0, Math.min(100, Math.round(pct)));
    },

    deltasBase() {
      const base = DATOS_SEMANA1_RESPALDO[this.form.atleta] || { peso: 93.5, pecho: 108, cintura: 95, cadera: 100, brazo: 37, muslo: 58 };
      const p1 = parseFloat(base.peso) || 93.5;
      const pe1 = parseFloat(base.pecho) || 108;
      const c1 = parseFloat(base.cintura) || 95;
      const ca1 = parseFloat(base.cadera) || 100;
      const b1 = parseFloat(base.brazo) || 37;
      const m1 = parseFloat(base.muslo) || 58;

      const pActual = parseFloat(this.form.peso) || p1;
      const peActual = parseFloat(this.form.pecho) || pe1;
      const cActual = parseFloat(this.form.cintura) || c1;
      const caActual = parseFloat(this.form.cadera) || ca1;
      const bActual = parseFloat(this.form.brazo) || b1;
      const mActual = parseFloat(this.form.muslo) || m1;

      return {
        peso: pActual - p1,
        pecho: peActual - pe1,
        cintura: cActual - c1,
        cadera: caActual - ca1,
        brazo: bActual - b1,
        muslo: mActual - m1
      };
    },

    formatDelta(n) {
      if (!n || isNaN(n)) return '0.0';
      return n > 0 ? '+' + n.toFixed(1) : n.toFixed(1);
    },

    isPreCena(ventana) {
      return !this.normalizar(ventana).includes('cena');
    },

    tieneSwapActivo(idx) {
      const s = this.swapsActivos[this.diaSeleccionado + '_' + idx];
      return !!(s && (s.prot || s.ch));
    },

    obtenerValorSwap(idx, tipo) {
      const s = this.swapsActivos[this.diaSeleccionado + '_' + idx];
      return (s && s[tipo]) ? s[tipo] : '';
    },

    abrirSwap(idx) {
      this.swapAbiertoIdx = (this.swapAbiertoIdx === idx) ? null : idx;
      if (this.swapAbiertoIdx !== null) {
        this.anunciar('Panel de intercambio isocalórico abierto');
      }
    },

    resetSwap(idx) {
      delete this.swapsActivos[this.diaSeleccionado + '_' + idx];
      this.swapsActivos = { ...this.swapsActivos };
      localStorage.setItem('hybrid_swaps_activos', JSON.stringify(this.swapsActivos));
      this.sincronizarEstadoRemoto('swapsActivos', this.swapsActivos);
      this.anunciar('Ingredientes originales restaurados en la comida');
    },

    aplicarSwap(idx, tipo, val) {
      const key = this.diaSeleccionado + '_' + idx;
      if (!this.swapsActivos[key]) this.swapsActivos[key] = {};
      this.swapsActivos[key][tipo] = val;
      this.swapsActivos = { ...this.swapsActivos };
      localStorage.setItem('hybrid_swaps_activos', JSON.stringify(this.swapsActivos));
      this.sincronizarEstadoRemoto('swapsActivos', this.swapsActivos);
      this.anunciar(val ? `Intercambio isocalórico aplicado: ${val}` : 'Ingrediente original mantenido');
    },

    sumarIngredientes(strFede, strArantxa) {
      if (!strFede && !strArantxa) return [];
      const mapa = new Map();
      const procesar = (texto) => {
        if (!texto) return;
        this.dividirTextoEnIngredientes(texto).forEach(parte => {
          let limpio = parte.trim();
          if (!limpio) return;
          const parsed = this.parsearIngredienteIndividual(limpio);
          if (parsed && parsed.cantidad && parsed.cantidad !== 'Al gusto') {
            const m = parsed.cantidad.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
            if (m) {
              const cant = parseFloat(m[1].replace(',', '.'));
              const unidad = m[2] || '';
              const clave = unidad + '_' + this.normalizar(parsed.nombre);
              if (mapa.has(clave)) {
                mapa.get(clave).cantidad += cant;
              } else {
                mapa.set(clave, { cantidad: cant, unidad, nombre: parsed.nombre });
              }
              return;
            }
          }
          const claveTexto = this.normalizar(limpio);
          if (!mapa.has(claveTexto)) mapa.set(claveTexto, { cantidad: null, unidad: '', nombre: limpio });
        });
      };
      procesar(strFede);
      procesar(strArantxa);

      const resultado = [];
      mapa.forEach(val => {
        if (val.cantidad !== null) {
          const numRedondeado = Math.round(val.cantidad * 10) / 10;
          const esp = val.unidad ? ' ' + val.unidad + ' ' : ' ';
          resultado.push(`${numRedondeado}${esp}${val.nombre}`);
        } else {
          resultado.push(val.nombre);
        }
      });
      return resultado;
    },

    porcentajeFedeEnToma(strFede, strArantxa) {
      const sumarGramos = (str) => {
        if (!str) return 0;
        let total = 0;
        for (const m of str.matchAll(/(\d+(?:[.,]\d+)?)\s*g\b/gi)) total += parseFloat(m[1].replace(',', '.'));
        return total;
      };
      const gFede = sumarGramos(strFede), gAra = sumarGramos(strArantxa);
      if (gFede + gAra === 0) return 50;
      return Math.round((gFede / (gFede + gAra)) * 100);
    },

    calcularReparto(strFede, strArantxa) {
      const pctFede = this.porcentajeFedeEnToma(strFede, strArantxa);
      return `${pctFede}% Fede · ${100 - pctFede}% Ara`;
    },

    repartoPesoCocido(idx, strFede, strArantxa) {
      const clave = this.diaSeleccionado + '_' + idx;
      const pesoTotal = parseFloat(this.pesosCocidosOlla[clave]);
      if (!pesoTotal || isNaN(pesoTotal) || pesoTotal <= 0) return null;
      const pctFede = this.porcentajeFedeEnToma(strFede, strArantxa);
      const gFede = Math.round(pesoTotal * (pctFede / 100));
      const gAra = Math.round(pesoTotal - gFede);
      return { fede: gFede, ara: gAra, pctFede, pctAra: 100 - pctFede };
    },

    listaCompraAgrupada() {
      const acumulado = new Map();
      const esSuplementoORunning = (txt) => /agua|gel|sales|sodio|isotonico|evocarb|creatina|whey|proteina\s+en\s+polvo|cafeina|probiotico|\bna\b/.test(this.normalizar(txt));

      const clasificarCategoria = (nombre) => {
        const n = this.normalizar(nombre);
        if (/pollo|pavo|ternera|solomillo|merluza|salmon|atun|jamon|lomo|hamburguesa|cerdo|pescado|carne/.test(n)) {
          return 'Carnicería, Pescadería y Charcutería';
        }
        if (/skyr|queso|yogur|leche|huevo|clara|batido|cottage|mozzarella|parmesano/.test(n)) {
          return 'Lácteos y Huevos';
        }
        if (/arroz|pan|patata|boniato|avena|tortita|pasta|miel|aove|aceite|garbanzo|lenteja|quinoa|cuscus|fideo|harina|cereal/.test(n)) {
          return 'Despensa, Panadería y Almidones';
        }
        return 'Frutas, Verduras y Frescos';
      };

      // Normalizador de nombres de alimentos para consolidar la compra semanal
      const unificarNombreAlimento = (nombreRaw) => {
        let n = this.normalizar(nombreRaw)
          .replace(/^de\s+/, '')
          .replace(/^del\s+/, '')
          .replace(/\s+en\s+crudo.*$/, '')
          .replace(/\s+a\s+la\s+plancha.*$/, '')
          .replace(/\s+cocido.*$/, '')
          .trim();

        if (/pollo|pechuga\s+de\s+pollo|filete.*pollo/.test(n)) return { nombre: 'Pechuga de pollo', unidadStd: 'g' };
        if (/ternera|solomillo.*ternera|hamburguesa.*ternera|filete.*ternera/.test(n)) return { nombre: 'Ternera (Solomillo/Picada)', unidadStd: 'g' };
        if (/merluza.*empanada|merluza.*mercadona|merluza/.test(n)) return { nombre: 'Merluza empanada Mercadona', unidadStd: 'g' };
        if (/atun/.test(n)) return { nombre: 'Atún al natural', unidadStd: 'latas' };
        if (/salmon/.test(n)) return { nombre: 'Salmón (crudo/ahumado)', unidadStd: 'g' };
        if (/pavo|pechuga\s+de\s+pavo/.test(n)) return { nombre: 'Pechuga de pavo', unidadStd: 'g' };
        if (/jamon\s+serrano|lomo\s+embuchado|charcuteria/.test(n)) return { nombre: 'Jamón serrano / Lomo', unidadStd: 'g' };

        if (/clara.*huevo|claras/.test(n)) return { nombre: 'Claras de huevo', unidadStd: 'ml' };
        if (/huevo|huevos/.test(n)) return { nombre: 'Huevos', unidadStd: 'ud' };
        if (/skyr/.test(n)) return { nombre: 'Skyr natural', unidadStd: 'g' };
        if (/queso\s+cottage|cottage/.test(n)) return { nombre: 'Queso cottage', unidadStd: 'g' };
        if (/queso|mozzarella|parmesano/.test(n)) return { nombre: 'Queso (bajo en grasa)', unidadStd: 'g' };
        if (/leche/.test(n)) return { nombre: 'Leche (entera/desnatada)', unidadStd: 'ml' };
        if (/yogur/.test(n)) return { nombre: 'Yogur natural', unidadStd: 'g' };

        if (/arroz/.test(n)) return { nombre: 'Arroz basmati / blanco', unidadStd: 'g' };
        if (/avena|copos\s+de\s+avena/.test(n)) return { nombre: 'Copos de avena', unidadStd: 'g' };
        if (/patata/.test(n)) return { nombre: 'Patatas', unidadStd: 'g' };
        if (/boniato/.test(n)) return { nombre: 'Boniato', unidadStd: 'g' };
        if (/pasta|macarron|espagueti|fideo/.test(n)) return { nombre: 'Pasta', unidadStd: 'g' };
        if (/pan/.test(n)) return { nombre: 'Pan (blanco/integral)', unidadStd: 'g' };
        if (/tortita.*arroz|tortita/.test(n)) return { nombre: 'Tortitas de arroz', unidadStd: 'ud' };
        if (/aove|aceite.*oliva|aceite/.test(n)) return { nombre: 'AOVE (Aceite de Oliva)', unidadStd: 'ml' };
        if (/miel/.test(n)) return { nombre: 'Miel', unidadStd: 'g' };
        if (/lenteja|garbanzo|alubia|legumbre/.test(n)) return { nombre: 'Legumbres (bote/secas)', unidadStd: 'g' };

        if (/platano/.test(n)) return { nombre: 'Plátanos', unidadStd: 'ud' };
        if (/manzana/.test(n)) return { nombre: 'Manzanas', unidadStd: 'ud' };
        if (/datil/.test(n)) return { nombre: 'Dátiles', unidadStd: 'g' };
        if (/arandano|frutos\s+rojos/.test(n)) return { nombre: 'Frutos rojos / Arándanos', unidadStd: 'g' };
        if (/tomate/.test(n)) return { nombre: 'Tomates', unidadStd: 'g' };
        if (/zanahoria/.test(n)) return { nombre: 'Zanahorias', unidadStd: 'g' };
        if (/calabacin/.test(n)) return { nombre: 'Calabacín', unidadStd: 'g' };
        if (/espinaca|lechuga|ensalada|canonigos|rucula/.test(n)) return { nombre: 'Verdura / Ensalada variada', unidadStd: 'g' };

        const limpioCapital = nombreRaw.charAt(0).toUpperCase() + nombreRaw.slice(1);
        return { nombre: limpioCapital, unidadStd: null };
      };

      this.diasSemana.forEach(diaNombre => {
        const comidasDia = this.comidasDelDiaPara(diaNombre);
        comidasDia.forEach((comida, idx) => {
          const txtFede = this.comidaCalculadaParaDia(diaNombre, comida, idx, 'fede').texto;
          const txtAra = this.comidaCalculadaParaDia(diaNombre, comida, idx, 'arantxa').texto;

          [txtFede, txtAra].forEach(texto => {
            if (!texto) return;

            // Separar de forma robusta por '+', comas, saltos de línea o ';'
            const partes = this.dividirTextoEnIngredientes(texto);

            partes.forEach(parte => {
              let limpio = parte.trim();
              if (!limpio || esSuplementoORunning(limpio)) return;

              const parsed = this.parsearIngredienteIndividual(limpio);
              if (!parsed || esSuplementoORunning(parsed.nombre)) return;

              let cant = 0;
              let unidad = 'g';
              let nombreRaw = parsed.nombre;

              if (parsed.cantidad && parsed.cantidad !== 'Al gusto') {
                const mCant = parsed.cantidad.match(/^(\d+(?:[.,]\d+)?)\s*(.*)$/);
                if (mCant) {
                  cant = parseFloat(mCant[1].replace(',', '.'));
                  unidad = (mCant[2] || 'g').toLowerCase().replace(/s$/, '');
                }
              } else {
                return;
              }

              // Normalizar múltiplos
              if (unidad === 'kg') { cant *= 1000; unidad = 'g'; }
              if (unidad === 'l') { cant *= 1000; unidad = 'ml'; }
              if (unidad === 'huevo') unidad = 'ud';
              if (unidad === 'lata') unidad = 'latas';

              nombreRaw = nombreRaw.replace(/\(\d+.*?\)/g, '').replace(/[\(\)]/g, '').trim();
              if (!nombreRaw || esSuplementoORunning(nombreRaw)) return;

              if (this.filtroCompra && !this.normalizar(nombreRaw).includes(this.normalizar(this.filtroCompra))) {
                return;
              }

              const { nombre, unidadStd } = unificarNombreAlimento(nombreRaw);
              const unidadFinal = unidadStd || unidad;

              const clave = unidadFinal + '_' + this.normalizar(nombre);
              if (acumulado.has(clave)) {
                acumulado.get(clave).cantidad += cant;
              } else {
                acumulado.set(clave, {
                  clave,
                  nombre,
                  unidad: unidadFinal,
                  cantidad: cant,
                  categoria: clasificarCategoria(nombre)
                });
              }
            });
          });
        });
      });

      const grupos = {};
      acumulado.forEach(item => {
        if (item.unidad === 'g') {
          if (item.cantidad >= 1000) {
            item.totalFormateado = (item.cantidad / 1000).toFixed(2) + ' kg';
          } else {
            item.totalFormateado = Math.round(item.cantidad) + ' g';
          }
        } else if (item.unidad === 'ml') {
          if (item.cantidad >= 1000) {
            item.totalFormateado = (item.cantidad / 1000).toFixed(2) + ' L';
          } else {
            item.totalFormateado = Math.round(item.cantidad) + ' ml';
          }
        } else if (item.unidad === 'ud') {
          item.totalFormateado = Math.round(item.cantidad) + ' uds';
        } else if (item.unidad === 'latas') {
          item.totalFormateado = Math.round(item.cantidad) + ' latas';
        } else {
          item.totalFormateado = Math.round(item.cantidad) + ' ' + item.unidad;
        }

        if (!grupos[item.categoria]) grupos[item.categoria] = [];
        grupos[item.categoria].push(item);
      });

      return Object.keys(grupos).sort().map(cat => ({
        categoria: cat,
        items: grupos[cat].sort((a, b) => b.cantidad - a.cantidad)
      }));
    },

    async copiarListaCompra() {
      const grupos = this.listaCompraAgrupada();
      if (!grupos || grupos.length === 0) {
        alert("La lista de la compra está vacía actualmente.");
        return;
      }
      let texto = `🛒 LISTA DE LA COMPRA SEMANAL · KINETIX (${this.form.semana || 'Semana Activa'})\n\n`;
      grupos.forEach(g => {
        texto += `📦 ${g.categoria.toUpperCase()}:\n`;
        g.items.forEach(it => {
          texto += `  - [ ] ${it.nombre}: ${it.totalFormateado}\n`;
        });
        texto += `\n`;
      });

      try {
        await navigator.clipboard.writeText(texto);
        alert("✓ Lista de la compra copiada al portapapeles. ¡Lista para pegar en WhatsApp o Notas!");
      } catch(e) {
        alert("No se pudo copiar automáticamente. Puedes ver los alimentos en pantalla.");
      }
    },

    contarPendientesCompra() {
      let total = 0;
      this.listaCompraAgrupada().forEach(cat => {
        cat.items.forEach(it => { if (!this.itemsComprados[it.clave]) total++; });
      });
      return total;
    },

    toggleCheckCompra(clave) {
      this.itemsComprados[clave] = !this.itemsComprados[clave];
      this.itemsComprados = { ...this.itemsComprados };
      localStorage.setItem('hybrid_compra_checks', JSON.stringify(this.itemsComprados));
    },

    limpiarChecksCompra() {
      this.itemsComprados = {};
      localStorage.removeItem('hybrid_compra_checks');
      this.anunciar('Lista de la compra desmarcada');
    },

    /**
     * VALIDADOR EN TIEMPO REAL DEL JSON DE GEMINI (Pestaña Importar IA)
     */
    validarJsonDieta() {
      if (!this.jsonNuevaDieta || !this.jsonNuevaDieta.trim()) return null;
      try {
        const parsed = JSON.parse(this.jsonNuevaDieta);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          return { valido: false, error: 'El JSON debe ser un array de comidas no vacío: [{"dia":"Lunes", ...}]' };
        }
        const diasDetectados = new Set();
        const alertasReglas = [];

        parsed.forEach((item, index) => {
          if (!item.dia || !item.ventana || !item.plato || !item.fede || !item.arantxa) {
            throw new Error(`La fila #${index + 1} no tiene todos los campos obligatorios (dia, ventana, plato, fede, arantxa).`);
          }
          diasDetectados.add(this.normalizar(item.dia));

          const textoCombinado = this.normalizar(`${item.plato} ${item.fede} ${item.arantxa}`);
          const ventanaNorm = this.normalizar(item.ventana);

          // Regla 4: Prohibido salmón cocinado
          if (textoCombinado.includes('salmon') && (ventanaNorm.includes('comida') || ventanaNorm.includes('cena')) && !textoCombinado.includes('ensalada') && !textoCombinado.includes('poke') && !textoCombinado.includes('marinado')) {
            alertasReglas.push(`Fila #${index + 1} (${item.dia} - ${item.ventana}): Detectado salmón en plato caliente.`);
          }
          // Regla 4: Merluza debe ser empanada del Mercadona
          if (textoCombinado.includes('merluza') && !textoCombinado.includes('empanada') && !textoCombinado.includes('mercadona')) {
            alertasReglas.push(`Fila #${index + 1} (${item.dia} - ${item.ventana}): La merluza debería ser "empanada del Mercadona".`);
          }
        });

        return {
          valido: true,
          totalTomas: parsed.length,
          totalDias: diasDetectados.size,
          alertasReglas
        };
      } catch (e) {
        return { valido: false, error: e.message };
      }
    },

    /**
     * EVALUACIÓN METABÓLICA SEMANAL (Algoritmo independiente Fede vs Arantxa)
     */
    evaluarProgresoAtleta(atletaKey) {
      const esFede = atletaKey === 'fede';
      const nombreAtleta = esFede ? 'Fede' : 'Arantxa';
      const hist = this.historicoAtleta(nombreAtleta);
      const lista = [];

      hist.forEach(r => {
        const p = parseFloat(r.peso);
        const c = parseFloat(r.cintura);
        const b = parseFloat(r.brazo);
        if (!isNaN(p) && p > 0) {
          lista.push({
            semana: r.semana,
            semana_id: r.semana_id,
            peso: p,
            cintura: !isNaN(c) ? c : null,
            brazo: !isNaN(b) ? b : null
          });
        }
      });

      // Si el formulario actual tiene datos nuevos de pesaje para este atleta, integrarlo para feedback en tiempo real
      if (this.form.atleta === nombreAtleta && this.form.peso) {
        const pForm = parseFloat(this.form.peso);
        const cForm = this.form.cintura ? parseFloat(this.form.cintura) : null;
        const bForm = this.form.brazo ? parseFloat(this.form.brazo) : null;
        if (!isNaN(pForm) && pForm > 0) {
          const idxSem = lista.findIndex(x => x.semana === this.form.semana || (this.form.semana_id && x.semana_id === this.form.semana_id));
          if (idxSem !== -1) {
            lista[idxSem] = { semana: this.form.semana, semana_id: this.form.semana_id, peso: pForm, cintura: cForm, brazo: bForm };
          } else {
            lista.push({ semana: this.form.semana, semana_id: this.form.semana_id, peso: pForm, cintura: cForm, brazo: bForm });
          }
        }
      }

      if (lista.length === 0) {
        const resp = DATOS_SEMANA1_RESPALDO[nombreAtleta];
        lista.push({ semana: 'Semana 1', peso: parseFloat(resp.peso), cintura: parseFloat(resp.cintura), brazo: parseFloat(resp.brazo) });
      }

      if (lista.length < 2) {
        return {
          estado: 'inicial',
          semanaActual: lista[0].semana,
          semanaAnterior: null,
          deltaPeso: 0,
          deltaCintura: null,
          deltaBrazo: null,
          deltaKcalSugerido: 0,
          deltaCHSugerido: 0,
          titulo: 'Semana base inicial',
          mensaje: `Registra el control de la Semana 2 para calcular automáticamente el ajuste calórico según la evolución de ${nombreAtleta}.`,
          tipo: 'info'
        };
      }

      const anterior = lista[lista.length - 2];
      const actual = lista[lista.length - 1];

      const deltaPeso = Math.round((actual.peso - anterior.peso) * 10) / 10;
      const deltaCintura = (actual.cintura !== null && anterior.cintura !== null) ? Math.round((actual.cintura - anterior.cintura) * 10) / 10 : null;
      const deltaBrazo = (actual.brazo !== null && anterior.brazo !== null) ? Math.round((actual.brazo - anterior.brazo) * 10) / 10 : null;

      if (esFede) {
        // FEDE: Ultratrail hacia 87.5 kg preservando masa muscular (Reglas 1 y 2)
        if (deltaPeso >= 0 || (deltaPeso > -0.2 && (deltaCintura === null || deltaCintura >= 0))) {
          return {
            estado: 'estancado_o_subida',
            semanaActual: actual.semana,
            semanaAnterior: anterior.semana,
            pesoActual: actual.peso,
            deltaPeso,
            deltaCintura,
            deltaBrazo,
            deltaKcalSugerido: -180,
            deltaCHSugerido: -45,
            titulo: 'Peso mantenido o alza · Recorte recomendado',
            mensaje: `Fede ha registrado ${deltaPeso >= 0 ? '+' : ''}${deltaPeso} kg en ${actual.semana} vs ${anterior.semana}. Se recomienda un recorte de -180 kcal/día reduciendo 45g de carbohidratos en crudo sin alterar los 200g de proteína.`,
            tipo: 'alerta'
          };
        } else if (deltaPeso < -0.75 || (deltaBrazo !== null && deltaBrazo <= -0.5)) {
          return {
            estado: 'perdida_rapida',
            semanaActual: actual.semana,
            semanaAnterior: anterior.semana,
            pesoActual: actual.peso,
            deltaPeso,
            deltaCintura,
            deltaBrazo,
            deltaKcalSugerido: 100,
            deltaCHSugerido: 25,
            titulo: 'Bajada rápida · Proteger masa muscular',
            mensaje: `Pérdida rápida de ${deltaPeso} kg en ${actual.semana}. Se sugiere subir +100 kcal/día (+25g CH) para blindar el músculo y asegurar energía para Trail y WODs.`,
            tipo: 'aviso'
          };
        } else {
          return {
            estado: 'optimo',
            semanaActual: actual.semana,
            semanaAnterior: anterior.semana,
            pesoActual: actual.peso,
            deltaPeso,
            deltaCintura,
            deltaBrazo,
            deltaKcalSugerido: 0,
            deltaCHSugerido: 0,
            titulo: 'Ritmo óptimo · Mantener calorías',
            mensaje: `Progreso impecable: bajada de ${deltaPeso} kg hacia los 87.5 kg con medidas musculares protegidas. Mantener calorías y macros actuales.`,
            tipo: 'exito'
          };
        }
      } else {
        // ARANTXA: Recomposición corporal en ~65 kg y ganancia de fuerza
        if ((deltaCintura !== null && deltaCintura <= 0 && Math.abs(deltaPeso) <= 0.4) || (deltaPeso <= 0 && deltaPeso >= -0.5)) {
          return {
            estado: 'optimo',
            semanaActual: actual.semana,
            semanaAnterior: anterior.semana,
            pesoActual: actual.peso,
            deltaPeso,
            deltaCintura,
            deltaBrazo,
            deltaKcalSugerido: 0,
            deltaCHSugerido: 0,
            titulo: 'Recomposición perfecta · Mantener calorías',
            mensaje: `Cintura estable o en reducción (${deltaCintura !== null ? (deltaCintura > 0 ? '+' : '') + deltaCintura + ' cm' : 'estable'}) y peso en ~65 kg. Mantener exactamente las calorías de Arantxa intactas.`,
            tipo: 'exito'
          };
        } else if (deltaPeso > 0.3 && deltaCintura !== null && deltaCintura > 0.3) {
          return {
            estado: 'exceso_calorico',
            semanaActual: actual.semana,
            semanaAnterior: anterior.semana,
            pesoActual: actual.peso,
            deltaPeso,
            deltaCintura,
            deltaBrazo,
            deltaKcalSugerido: -100,
            deltaCHSugerido: -25,
            titulo: 'Ligero superávit · Ajuste suave',
            mensaje: `Ligero incremento de peso (+${deltaPeso} kg) y cintura (+${deltaCintura} cm). Se recomienda un recorte suave de -100 kcal/día (-25g CH) manteniendo intacta la proteína en ~140g.`,
            tipo: 'alerta'
          };
        } else if (deltaPeso < -0.6 || actual.peso < 64.5) {
          return {
            estado: 'perdida_excesiva',
            semanaActual: actual.semana,
            semanaAnterior: anterior.semana,
            pesoActual: actual.peso,
            deltaPeso,
            deltaCintura,
            deltaBrazo,
            deltaKcalSugerido: 100,
            deltaCHSugerido: 25,
            titulo: 'Peso bajo rango · Refuerzo de energía',
            mensaje: `Peso por debajo del rango de recomposición (${actual.peso} kg). Se recomienda subir +100 kcal/día (+25g CH) para asegurar fuerza en CrossFit.`,
            tipo: 'aviso'
          };
        } else {
          return {
            estado: 'optimo',
            semanaActual: actual.semana,
            semanaAnterior: anterior.semana,
            pesoActual: actual.peso,
            deltaPeso,
            deltaCintura,
            deltaBrazo,
            deltaKcalSugerido: 0,
            deltaCHSugerido: 0,
            titulo: 'Evolución estable · Mantener calorías',
            mensaje: `Métricas dentro del objetivo para Arantxa. Mantener calorías y macros actuales.`,
            tipo: 'exito'
          };
        }
      }
    },

    aplicarAjusteMetabolico(atletaKey, deltaKcal) {
      if (!this.ajustesMetabolicos) this.ajustesMetabolicos = { fede: 0, arantxa: 0 };
      this.ajustesMetabolicos[atletaKey] = deltaKcal;
      this.ajustesMetabolicos = { ...this.ajustesMetabolicos };
      localStorage.setItem('hybrid_ajustes_metabolicos', JSON.stringify(this.ajustesMetabolicos));
      this.sincronizarEstadoRemoto('ajustesMetabolicos', this.ajustesMetabolicos);
      const signo = deltaKcal > 0 ? '+' : '';
      this.anunciar(`Ajuste metabólico de ${signo}${deltaKcal} kcal aplicado a ${atletaKey === 'fede' ? 'Fede' : 'Arantxa'}`);
    },

    resetAjusteMetabolico(atletaKey) {
      this.aplicarAjusteMetabolico(atletaKey, 0);
    },

    /**
     * GENERADOR INTELIGENTE DE PROMPT PARA GEMINI
     */
    guardarApiKeyGemini(key) {
      this.geminiApiKey = (key || '').trim();
      localStorage.setItem('hybrid_gemini_api_key', this.geminiApiKey);
      this.anunciar('API Key de Gemini guardada correctamente');
    },

    cambiarModeloGemini(m) {
      this.geminiModelo = m;
      localStorage.setItem('hybrid_gemini_modelo', m);
      this.anunciar(`Modelo de IA cambiado a ${m}`);
    },

    limpiarEntrenosPlanificador(notificar = true) {
      const vacio = {};
      this.diasSemana.forEach(d => {
        vacio[this.normalizar(d)] = { fede: '', arantxa: '' };
      });
      this.entrenosPlanificador = vacio;
      localStorage.setItem('hybrid_planificador_entrenos', JSON.stringify(this.entrenosPlanificador));
      if (this.semanaActivaId) {
        localStorage.setItem(`hybrid_planificador_entrenos_${this.semanaActivaId}`, JSON.stringify(this.entrenosPlanificador));
        this.sincronizarEstadoRemoto('entrenosPlanificador', this.entrenosPlanificador);
      }
      if (notificar) this.anunciar('Planificador de entrenamientos vaciado');
    },

    cargarEntrenosDesdeResumen(notificar = true) {
      if (!this.resumenSemanal || this.resumenSemanal.length === 0) {
        if (notificar) alert("No hay entrenamientos previos registrados en la dieta de esta semana.");
        return;
      }
      const nuevo = {};
      this.diasSemana.forEach(dia => {
        const dNorm = this.normalizar(dia);
        const filaFede = this.resumenSemanal.find(r => this.normalizar(r.atleta) === 'fede' && this.normalizar(r.dia) === dNorm);
        const filaAra = this.resumenSemanal.find(r => this.normalizar(r.atleta) === 'arantxa' && this.normalizar(r.dia) === dNorm);
        nuevo[dNorm] = {
          fede: (filaFede && filaFede.entrenamiento) ? filaFede.entrenamiento : '',
          arantxa: (filaAra && filaAra.entrenamiento) ? filaAra.entrenamiento : ''
        };
      });
      this.entrenosPlanificador = nuevo;
      localStorage.setItem('hybrid_planificador_entrenos', JSON.stringify(this.entrenosPlanificador));
      if (this.semanaActivaId) {
        localStorage.setItem(`hybrid_planificador_entrenos_${this.semanaActivaId}`, JSON.stringify(this.entrenosPlanificador));
        this.sincronizarEstadoRemoto('entrenosPlanificador', this.entrenosPlanificador);
      }
      if (notificar) this.anunciar('Entrenamientos cargados desde la dieta activa');
    },

    actualizarEntrenoPlanificador(diaKey, atletaKey, val) {
      if (!this.entrenosPlanificador[diaKey]) {
        this.entrenosPlanificador[diaKey] = { fede: '', arantxa: '' };
      }
      this.entrenosPlanificador[diaKey][atletaKey] = val;
      this.entrenosPlanificador = { ...this.entrenosPlanificador };
      localStorage.setItem('hybrid_planificador_entrenos', JSON.stringify(this.entrenosPlanificador));
      if (this.semanaActivaId) {
        localStorage.setItem(`hybrid_planificador_entrenos_${this.semanaActivaId}`, JSON.stringify(this.entrenosPlanificador));
        this.sincronizarEstadoRemoto('entrenosPlanificador', this.entrenosPlanificador);
      }
    },

    /**
     * SYSTEM PROMPT OFICIAL: SKILL NUTRICIONISTA-DEPORTIVO PARA KINETIX
     */
    systemPromptNutricionista() {
      return `Actúas como "nutricionista-deportivo", un nutricionista deportivo de precisión de élite para Kinetix, especializado en dos atletas híbridos de alto rendimiento (Trail Running y CrossFit) que viven y cocinan juntos:
- Fede: Bajar de 93.5 kg a 87.5 kg conservando intacta la masa muscular para Ultratrail de 50 km.
  * Proteína fija innegociable: 200g P.
  * Grasa fija saludable: 75g a 80g G (multiplicador ~0.85g/kg de peso corporal). PROHIBIDO TERMINANTEMENTE igualar las grasas a la proteína (las grasas NUNCA deben ser 200g).
  * Carbohidratos: Modulados según entrenamiento del día (200g en descanso, 310-340g en carrera o CrossFit, 430-495g en doble sesión o trail).
  * Calorías estrictas: Kcal = (Proteína * 4) + (Carbohidratos * 4) + (Grasas * 9).
- Arantxa: Recomposición corporal en ~65.0 kg y mejora de fuerza en CrossFit.
  * Proteína fija innegociable: ~140g P.
  * Grasa fija saludable: 50g a 55g G (multiplicador ~0.8g/kg de peso corporal). PROHIBIDO TERMINANTEMENTE igualar las grasas a la proteína (las grasas NUNCA deben ser 140g).
  * Carbohidratos: Modulados según entrenamiento del día (145g en descanso, 215-235g en carrera o CrossFit, 295-345g en doble sesión o trail).
  * Calorías estrictas: Kcal = (Proteína * 4) + (Carbohidratos * 4) + (Grasas * 9).

REGLAS DE ORO INMUTABLES:
1. OLLA COMÚN: Ambos atletas comen EXACTAMENTE el mismo plato/receta en cada ventana del día (08:30 Desayuno, 14:00 Comida, 17:30 Merienda/Pre-WOD y 21:30 Cena) para poder cocinar juntos. La ÚNICA diferencia entre Fede y Arantxa son los GRAMOS EN CRUDO para clavar matemáticamente sus respectivos carbohidratos y calorías según el entrenamiento del día.
2. REGLA ESTRICTA DE GRASAS (G) Y FÓRMULA CALÓRICA MATEMÁTICA:
   - PROHIBIDO TERMINANTEMENTE copiar o igualar el valor de las grasas (G) a las proteínas (P). Las grasas son una variable independiente calculada a 0.8g - 0.85g por kg de peso corporal:
     * Fede: Grasa fija diaria entre 75g y 80g G (NUNCA poner 200g de grasa).
     * Arantxa: Grasa fija diaria entre 50g y 55g G (NUNCA poner 140g de grasa).
   - En CADA comida y en el total del día, las calorías DEBEN sumar exactamente con la fórmula:
     Kcal = (Proteína * 4) + (Carbohidratos * 4) + (Grasas * 9).
     Por ejemplo: 200g P + 320g CH + 75g G = 800 + 1280 + 675 = 2.755 kcal (cualquier total de más de 3.500 kcal en días normales es un error matemático que debe evitarse).
3. REGLAS DIETÉTICAS OBLIGATORIAS (rules.md):
   - Eliminar batidos y proteína en polvo de la pauta habitual. Priorizar fuentes limpias reales: jamón serrano, pechuga de pollo, ternera, pavo, merluza empanada, atún, huevos.
   - Desayuno: priorizar tostadas de pan de masa madre con tomate triturado, jamón serrano y aguacate.
   - Recetas sabrosas y apetecibles estilo latino/peruano fit (ej: lomo saltado fit de pollo o ternera con arroz basmati, ají de gallina fit, merluza empanada con patata asada, etc.).
   - PROHIBIDO el salmón cocinado en platos calientes (en comidas calientes usar únicamente atún al natural o merluza empanada del Mercadona). El salmón solo se permite crudo, marinado o ahumado en frío (ej. poke bowl o ensalada fría).
   - En tomas previas al entrenamiento de CrossFit (17:30 Merienda), SOLO alimentos de vaciado gástrico rápido estricto (ej: tortitas de arroz con fiambre de pavo / jamón serrano), SIN legumbres ni grasas pesadas para evitar molestias digestivas.
   - Todos los alimentos que se cocinan (arroz, pasta, patata, pollo, ternera, merluza) deben especificarse obligatoriamente con su PESO EN CRUDO ('g' o 'ml').
4. FORMATO DE INGREDIENTES PARA LA LISTA DE LA COMPRA AUTOMÁTICA:
   - En los campos "fede" y "arantxa", separa cada alimento con el símbolo "+" (ej: "120g pan masa madre + 80g jamón serrano + 50g tomate triturado + 80g aguacate").
   - Todos los alimentos deben incluir obligatoriamente su cantidad y unidad en crudo al inicio ('g', 'ml' o 'ud'). NUNCA dejes un alimento sin su cantidad.
   - Usa nombres consistentes para consolidar la despensa semanal: "pan masa madre", "jamón serrano", "tomate triturado", "aguacate", "pechuga de pollo", "ternera", "merluza empanada Mercadona", "atún al natural", "tortitas de arroz", "fiambre de pavo", "huevos", "claras de huevo", "arroz basmati", "patatas", "boniato", "copos de avena", "AOVE".
5. SALIDA JSON ESTRICTA: Responde ÚNICAMENTE con un array JSON válido sin texto previo ni posterior, cubriendo los 7 días (Lunes a Domingo) con 4 comidas por día (Desayuno, Comida, Merienda/Pre-WOD, Cena).
Campos obligatorios por objeto:
{
  "dia": "Lunes",
  "ventana": "08:30 Desayuno",
  "plato": "Tostadas de masa madre con jamón serrano, tomate y aguacate",
  "fede": "120g pan masa madre + 80g jamón serrano + 50g tomate triturado + 80g aguacate",
  "macrosFede": "P: 50g | CH: 65g | G: 20g | 640 kcal",
  "arantxa": "80g pan masa madre + 50g jamón serrano + 30g tomate triturado + 40g aguacate",
  "macrosArantxa": "P: 35g | CH: 55g | G: 14g | 486 kcal"
}`;
    },

    /**
     * COMPARATIVA SEMANAL BIOMÉTRICA (Semana Actual vs Semana Anterior)
     * Calcula diferencias exactas (+/-) para peso, cintura, cadera, pecho, brazo, muslo
     * y genera el diagnóstico evolutivo de avance o atraso.
     */
    obtenerComparativaSemanalAtleta(atletaNombre, targetSemanaId = null) {
      const esFede = this.normalizar(atletaNombre) === 'fede';
      const nombreLimpio = esFede ? 'Fede' : 'Arantxa';
      const hist = this.historicoAtleta(nombreLimpio);

      // Filtrar registros que tengan al menos peso numérico > 0 o alguna medida corporal
      const registros = hist.filter(r => {
        const p = parseFloat(r.peso);
        return (!isNaN(p) && p > 0) || r.cintura || r.pecho || r.cadera || r.brazo || r.muslo;
      });

      // Si el formulario actual tiene datos introducidos para este atleta, incorporarlos/actualizarlos
      if (this.normalizar(this.form.atleta) === this.normalizar(nombreLimpio) && this.form.peso && parseFloat(this.form.peso) > 0) {
        const semId = this.form.semana_id;
        const semNom = this.form.semana || (semId ? `Semana ${semId}` : 'Semana Actual');
        const itemForm = {
          semana_id: semId,
          semana: semNom,
          peso: this.form.peso.toString(),
          pecho: (this.form.pecho || '').toString(),
          cintura: (this.form.cintura || '').toString(),
          cadera: (this.form.cadera || '').toString(),
          brazo: (this.form.brazo || '').toString(),
          muslo: (this.form.muslo || '').toString()
        };
        const idxExistente = registros.findIndex(r => r.semana_id === semId || r.semana === semNom);
        if (idxExistente !== -1) {
          registros[idxExistente] = { ...registros[idxExistente], ...itemForm };
        } else {
          registros.push(itemForm);
        }
      }

      // Si no hubiera ningún registro, tomar el de respaldo base
      if (registros.length === 0) {
        const resp = DATOS_SEMANA1_RESPALDO[nombreLimpio] || { peso: '93.5', pecho: '108', cintura: '95', cadera: '100', brazo: '37', muslo: '58' };
        registros.push({
          semana_id: 1,
          semana: 'Semana 1',
          ...resp
        });
      }

      // Determinar la semana actual a evaluar
      let idxActual = -1;
      const semBuscada = targetSemanaId || this.form.semana_id || this.semanaActivaId;
      if (semBuscada) {
        idxActual = registros.findIndex(r => r.semana_id === semBuscada);
      }
      if (idxActual === -1) {
        idxActual = registros.length - 1;
      }

      const actual = registros[idxActual];
      const anterior = idxActual > 0 ? registros[idxActual - 1] : null;

      // Cálculo de deltas numéricos y formateados
      const calcDelta = (valAct, valAnt) => {
        const numAct = parseFloat(valAct);
        const numAnt = parseFloat(valAnt);
        if (isNaN(numAct) || isNaN(numAnt)) return null;
        const diff = Math.round((numAct - numAnt) * 10) / 10;
        return {
          actual: numAct,
          anterior: numAnt,
          diff,
          str: diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`
        };
      };

      const deltaPeso = calcDelta(actual ? actual.peso : null, anterior ? anterior.peso : null);
      const deltaCintura = calcDelta(actual ? actual.cintura : null, anterior ? anterior.cintura : null);
      const deltaCadera = calcDelta(actual ? actual.cadera : null, anterior ? anterior.cadera : null);
      const deltaPecho = calcDelta(actual ? actual.pecho : null, anterior ? anterior.pecho : null);
      const deltaBrazo = calcDelta(actual ? actual.brazo : null, anterior ? anterior.brazo : null);
      const deltaMuslo = calcDelta(actual ? actual.muslo : null, anterior ? anterior.muslo : null);

      let estado = 'inicial';
      let diagnostico = '';
      let ajusteSugerido = 0;
      let chSugerido = 0;

      if (!anterior) {
        diagnostico = `Línea base inicial registrada para ${actual ? actual.semana : 'Semana 1'}. No existe semana previa para comparar diferencias. Se mantienen pautas base.`;
      } else if (esFede) {
        const dP = deltaPeso ? deltaPeso.diff : 0;
        const dC = deltaCintura ? deltaCintura.diff : 0;
        const dB = deltaBrazo ? deltaBrazo.diff : 0;

        if (dP < 0) {
          if (dB <= -0.5) {
            estado = 'alerta_musculo';
            ajusteSugerido = 100;
            chSugerido = 25;
            diagnostico = `AVANCE CON ALERTA: Bajada de ${dP} kg en ${actual.semana} vs ${anterior.semana}, pero con caída en perímetro de brazo (${dB} cm). Riesgo de pérdida de glucógeno o masa muscular. Asegurar 200g P fija y carbohidratos complejos suficientes.`;
          } else if (dP < -0.8) {
            estado = 'bajada_rapida';
            ajusteSugerido = 80;
            chSugerido = 20;
            diagnostico = `AVANCE RÁPIDO: Pérdida pronunciada de ${dP} kg en 1 semana. Ritmo algo agresivo para ultratrail. Modular déficit moderado para evitar fatiga en tiradas y CrossFit.`;
          } else {
            estado = 'avance_optimo';
            ajusteSugerido = 0;
            chSugerido = 0;
            diagnostico = `AVANCE POSITIVO ÓPTIMO: Bajada controlada de ${dP} kg hacia los 87.5 kg${deltaCintura ? `, cintura reducida (${deltaCintura.str} cm)` : ''} y masa muscular preservada. Mantener estructura y calorías actuales.`;
          }
        } else if (dP === 0) {
          if (dC < 0) {
            estado = 'avance_recomposicion';
            ajusteSugerido = 0;
            chSugerido = 0;
            diagnostico = `AVANCE (Recomposición): Peso idéntico pero cintura reducida (${deltaCintura ? deltaCintura.str : ''} cm). Pérdida de grasa con ganancia o mantenimiento muscular. Mantener calorías.`;
          } else {
            estado = 'estancamiento';
            ajusteSugerido = -180;
            chSugerido = -45;
            diagnostico = `ATRASO / ESTANCAMIENTO: Peso estancado (${actual.peso} kg) sin reducción en cintura. Se requiere recorte de -180 kcal/día (-45g CH en crudo) manteniendo intactos los 200g de proteína.`;
          }
        } else {
          estado = 'atraso_subida';
          ajusteSugerido = -200;
          chSugerido = -50;
          diagnostico = `ATRASO (Aumento de peso): Subida de ${deltaPeso ? deltaPeso.str : ''} kg respecto a ${anterior.semana}. Se requiere recorte en carbohidratos en crudo (-200 kcal/día / -50g CH) manteniendo proteína fija en 200g.`;
        }
      } else {
        const dP = deltaPeso ? deltaPeso.diff : 0;
        const dC = deltaCintura ? deltaCintura.diff : 0;
        const pAct = parseFloat(actual ? actual.peso : 0) || 66;

        if (pAct < 64.5 || dP < -0.6) {
          estado = 'alerta_bajo_peso';
          ajusteSugerido = 100;
          chSugerido = 25;
          diagnostico = `ALERTA: Peso por debajo del rango óptimo de fuerza (${actual.peso} kg, bajada de ${dP} kg). Subir +100 kcal/día (+25g CH) para blindar la fuerza en CrossFit.`;
        } else if (dP > 0.3 && dC > 0.3) {
          estado = 'atraso_superavit';
          ajusteSugerido = -100;
          chSugerido = -25;
          diagnostico = `ATRASO (Ligero superávit): Subida de peso (${deltaPeso ? deltaPeso.str : ''} kg) y cintura (${deltaCintura ? deltaCintura.str : ''} cm). Reducir levemente carbohidratos (-100 kcal/día / -25g CH) con proteína intacta en ~140g.`;
        } else if (dC <= 0 && Math.abs(dP) <= 0.4) {
          estado = 'avance_optimo';
          ajusteSugerido = 0;
          chSugerido = 0;
          diagnostico = `AVANCE POSITIVO ÓPTIMO: Recomposición corporal impecable en ~65 kg, cintura bajo control y fuerza en CrossFit protegida. Mantener calorías y macros intactos.`;
        } else {
          estado = 'avance_estable';
          ajusteSugerido = 0;
          chSugerido = 0;
          diagnostico = `EVOLUCIÓN ESTABLE: Métricas en rango para Arantxa (${actual.peso} kg). Mantener calorías y macronutrientes.`;
        }
      }

      return {
        atleta: nombreLimpio,
        semanaActual: actual ? actual.semana : 'Semana Actual',
        semanaAnterior: anterior ? anterior.semana : null,
        actual,
        anterior,
        deltaPeso,
        deltaCintura,
        deltaCadera,
        deltaPecho,
        deltaBrazo,
        deltaMuslo,
        estado,
        diagnostico,
        ajusteSugerido,
        chSugerido
      };
    },

    /**
     * GENERADOR INTELIGENTE DE PROMPT PARA GEMINI (Integra pesaje viernes + entrenos domingo)
     */
    generarPromptGemini() {
      const adjF = (this.ajustesMetabolicos && this.ajustesMetabolicos.fede) || 0;
      const adjA = (this.ajustesMetabolicos && this.ajustesMetabolicos.arantxa) || 0;

      // Obtener comparativa semanal exhaustiva (Semana Actual vs Semana Anterior)
      const compFede = this.obtenerComparativaSemanalAtleta('Fede');
      const compAra = this.obtenerComparativaSemanalAtleta('Arantxa');

      const fmtDelta = (d, unidad = 'cm') => {
        if (!d) return '--';
        return `${d.actual} ${unidad} (Δ ${d.str} ${unidad} vs ${d.anterior} ${unidad})`;
      };

      let textoDias = '';
      this.diasSemana.forEach(dia => {
        const dNorm = this.normalizar(dia);
        const planDia = (this.entrenosPlanificador && this.entrenosPlanificador[dNorm]) || { fede: '', arantxa: '' };
        const entF = planDia.fede && planDia.fede.trim() ? planDia.fede.trim() : 'CrossFit 17:30';
        const entA = planDia.arantxa && planDia.arantxa.trim() ? planDia.arantxa.trim() : 'CrossFit 17:30';
        const of = this.calcularMacrosObjetivo(entF, 'fede');
        const oa = this.calcularMacrosObjetivo(entA, 'arantxa');

        textoDias += `  - **${dia}**:\n`;
        textoDias += `    * Sesión FEDE: "${entF}" → Objetivo: ${of.kcal} kcal | ${of.p}g P | ${of.ch}g CH | ${of.g}g G\n`;
        textoDias += `    * Sesión ARANTXA: "${entA}" → Objetivo: ${oa.kcal} kcal | ${oa.p}g P | ${oa.ch}g CH | ${oa.g}g G\n`;
      });

      return `Actúa con tu rol de skill "nutricionista-deportivo" para Kinetix:

=== 1. CONTROL BIOMÉTRICO Y EVOLUCIÓN (Pesaje Viernes: ${compFede.semanaActual}${compFede.semanaAnterior ? ` vs ${compFede.semanaAnterior}` : ''}) ===

* FEDE (Objetivo: 87.5 kg para ultratrail preservando masa muscular | Proteína fija: 200g P | Grasa fija saludable: 75-80g G):
  - Semana evaluada: ${compFede.semanaActual}${compFede.semanaAnterior ? ` (vs ${compFede.semanaAnterior})` : ' (Línea base inicial)'}
  - Peso: ${compFede.actual ? compFede.actual.peso : '--'} kg${compFede.deltaPeso ? ` (Δ ${compFede.deltaPeso.str} kg vs ${compFede.deltaPeso.anterior} kg)` : ''}
  - Cintura: ${fmtDelta(compFede.deltaCintura, 'cm')}
  - Cadera: ${fmtDelta(compFede.deltaCadera, 'cm')}
  - Pecho: ${fmtDelta(compFede.deltaPecho, 'cm')}
  - Brazo: ${fmtDelta(compFede.deltaBrazo, 'cm')}
  - Muslo: ${fmtDelta(compFede.deltaMuslo, 'cm')}
  - Diagnóstico de evolución: ${compFede.diagnostico}
  - Ajuste metabólico semanal aplicado en app: ${adjF >= 0 ? '+' : ''}${adjF} kcal/día en carbohidratos.

* ARANTXA (Objetivo: Recomposición corporal en ~65 kg y fuerza CrossFit | Proteína fija: ~140g P | Grasa fija saludable: 50-55g G):
  - Semana evaluada: ${compAra.semanaActual}${compAra.semanaAnterior ? ` (vs ${compAra.semanaAnterior})` : ' (Línea base inicial)'}
  - Peso: ${compAra.actual ? compAra.actual.peso : '--'} kg${compAra.deltaPeso ? ` (Δ ${compAra.deltaPeso.str} kg vs ${compAra.deltaPeso.anterior} kg)` : ''}
  - Cintura: ${fmtDelta(compAra.deltaCintura, 'cm')}
  - Cadera: ${fmtDelta(compAra.deltaCadera, 'cm')}
  - Pecho: ${fmtDelta(compAra.deltaPecho, 'cm')}
  - Brazo: ${fmtDelta(compAra.deltaBrazo, 'cm')}
  - Muslo: ${fmtDelta(compAra.deltaMuslo, 'cm')}
  - Diagnóstico de evolución: ${compAra.diagnostico}
  - Ajuste metabólico semanal aplicado en app: ${adjA >= 0 ? '+' : ''}${adjA} kcal/día en carbohidratos.

=== 2. PLANIFICACIÓN DE ENTRENAMIENTOS DE LA SEMANA (Domingo) ===
(Configurado para cada atleta de forma independiente: solo CrossFit, solo correr, doble sesión o descanso total):
${textoDias}

=== 3. REGLAS DIETÉTICAS INMUTABLES (rules.md) ===
1. OLLA COMÚN: Ambos atletas comen EXACTAMENTE el mismo plato/receta en cada ventana del día (08:30 Desayuno, 14:00 Comida, 17:30 Merienda y 21:30 Cena) para cocinar juntos. La ÚNICA diferencia entre Fede y Arantxa son los GRAMOS EN CRUDO para clavar matemáticamente sus calorías y macros según su entrenamiento del día.
2. REGLA ESTRICTA DE GRASAS (G) Y FÓRMULA CALÓRICA MATEMÁTICA:
   - PROHIBIDO TERMINANTEMENTE copiar o igualar el valor de las grasas (G) a las proteínas (P). Las grasas son una variable independiente calculada a 0.8g - 0.85g por kg de peso corporal:
     * Fede: Grasa fija diaria saludable entre 75g y 80g G (NUNCA poner 200g de grasa).
     * Arantxa: Grasa fija diaria saludable entre 50g y 55g G (NUNCA poner 140g de grasa).
   - En CADA comida y en el total del día, las calorías DEBEN sumar exactamente con la fórmula:
     Kcal = (Proteína * 4) + (Carbohidratos * 4) + (Grasas * 9).
     Por ejemplo: 200g P + 320g CH + 75g G = 800 + 1280 + 675 = 2.755 kcal (cualquier total de más de 3.500 kcal en días normales es un error matemático que debe evitarse).
3. DESAYUNO: Priorizar tostadas de pan de masa madre con tomate triturado, jamón serrano y aguacate. CERO proteína en polvo / batidos en la pauta habitual (eliminar suplementación de whey).
4. RECETAS SABROSAS: Enfoque de platos sabrosos estilo peruano/latino/fit (ej: lomo saltado fit de pollo o ternera con arroz basmati, ají de gallina fit, merluza empanada con patata asada, etc.).
5. CERO SALMÓN COCINADO EN CALIENTE: En comidas calientes usar únicamente atún al natural o merluza empanada Mercadona. El salmón solo se permite crudo, marinado o ahumado en frío.
6. MERIENDA PRE-CROSSFIT (17:30): Vaciado gástrico rápido estricto pre-WOD (ej: tortitas de arroz con fiambre de pavo / jamón serrano), sin legumbres ni grasas pesadas para evitar molestias digestivas.
7. MODULACIÓN DE HIDRATOS: Modular los carbohidratos en crudo según si el día es de solo correr, solo CrossFit, doble sesión o descanso.
8. PESOS EN CRUDO: Todos los alimentos que se cocinan (arroz basmati, patata, pasta, pollo, merluza, ternera) expresados obligatoriamente con su PESO EN CRUDO ('g' o 'ml').
9. FORMATO PARA LISTA DE LA COMPRA AUTOMÁTICA: En "fede" y "arantxa" separa CADA alimento OBLIGATORIAMENTE con el símbolo "+" (NUNCA con comas). Cada alimento debe empezar por su cantidad y unidad (ej: "120g pan masa madre + 80g jamón serrano + 50g tomate triturado + 80g aguacate").

=== 4. FORMATO OBLIGATORIO DE RESPUESTA (JSON) ===
Devuelve ÚNICAMENTE un array JSON válido (28 tomas, 4 tomas por día de Lunes a Domingo) con esta estructura exacta:
[
  {
    "dia": "Lunes",
    "ventana": "08:30 Desayuno",
    "plato": "Tostadas de masa madre con jamón serrano, tomate y aguacate",
    "fede": "120g pan masa madre + 80g jamón serrano + 50g tomate triturado + 80g aguacate",
    "macrosFede": "P: 50g | CH: 65g | G: 20g | 640 kcal",
    "arantxa": "80g pan masa madre + 50g jamón serrano + 30g tomate triturado + 40g aguacate",
    "macrosArantxa": "P: 35g | CH: 55g | G: 14g | 486 kcal"
  }
]`;
    },

    async copiarPromptGemini() {
      const texto = this.generarPromptGemini();
      try {
        await navigator.clipboard.writeText(texto);
        this.promptCopiado = true;
        this.anunciar('Prompt con objetivos y entrenamientos copiado');
        setTimeout(() => { this.promptCopiado = false; }, 4000);
      } catch (e) {
        alert("Selecciona y copia el texto del prompt manualmente.");
      }
    },

    /**
     * CONSULTA EN TIEMPO REAL LOS MODELOS DE TEXTO SOPORTADOS POR LA API KEY
     */
    async obtenerModelosValidosCuenta() {
      if (!this.geminiApiKey || !this.geminiApiKey.trim()) {
        throw new Error("Por favor introduce tu Gemini API Key en Ajustes.");
      }

      if (this.modelosDetectados && this.modelosDetectados.length > 0) {
        return this.modelosDetectados;
      }

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.geminiApiKey.trim()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg = (errData.error && errData.error.message) ? errData.error.message : `HTTP ${res.status}`;
        throw new Error(`Error de validación con Google AI Studio: ${msg}`);
      }

      const data = await res.json();
      const todos = data.models || [];

      // Filtrar estrictamente modelos que admitan generateContent y excluir voz (tts), audio, embeddings
      const validos = todos
        .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name.replace(/^models\//, ''))
        .filter(name => {
          const n = name.toLowerCase();
          return !n.includes('tts') && !n.includes('audio') && !n.includes('embed') && !n.includes('aqa') && !n.includes('imagen');
        });

      if (validos.length === 0) {
        throw new Error("No se detectaron modelos de generación de texto disponibles para esta API Key.");
      }

      this.modelosDetectados = validos;
      return validos;
    },

    /**
     * AUTODETECTA Y CONFIGURA EL MEJOR MODELO PARA LA CUENTA DEL USUARIO
     */
    async autodetectarModelosCuenta() {
      if (!this.geminiApiKey || !this.geminiApiKey.trim()) {
        alert("Introduce tu API Key primero para autodetectar los modelos de tu cuenta.");
        return;
      }
      this.detectandoModelos = true;
      try {
        this.modelosDetectados = []; // Forzar refresco
        const modelosTexto = await this.obtenerModelosValidosCuenta();

        // Priorizar modelos Flash (gratuitos en AI Studio con alta cuota)
        const seleccionado = modelosTexto.find(m => m.includes('flash') && !m.includes('lite'))
          || modelosTexto.find(m => m.includes('flash'))
          || modelosTexto.find(m => m.includes('pro'))
          || modelosTexto[0];

        this.geminiModelo = seleccionado;
        localStorage.setItem('hybrid_gemini_modelo', seleccionado);
        this.anunciar(`Modelo configurado: ${seleccionado}`);
        alert(`¡Modelos detectados con éxito en tu cuenta de Google!\n\nModelo asignado: ${seleccionado}\n\nModelos de texto activos en tu cuenta:\n- ${modelosTexto.slice(0, 8).join('\n- ')}`);
      } catch (e) {
        alert("Error al consultar modelos disponibles: " + e.message);
      } finally {
        this.detectandoModelos = false;
      }
    },

    /**
     * CONEXIÓN RESILIENTE CON FALLBACK EN VIVO SOBRE MODELOS REALMENTE ACTIVOS
     */
    async llamarGeminiConFallback(promptUsuario, systemPrompt) {
      this.estadoGeneracionIA = "1/4 Consultando modelos activos en tu cuenta de Google AI Studio...";
      const modelosCuenta = await this.obtenerModelosValidosCuenta();

      // Construir candidatos usando ÚNICAMENTE modelos devueltos por Google para esta clave
      let candidatos = [];

      // 1. Si el usuario seleccionó un modelo y está activo en su cuenta, va primero
      if (this.geminiModelo && modelosCuenta.includes(this.geminiModelo)) {
        candidatos.push(this.geminiModelo);
      }

      // 2. Separar por categorías para probar primero los gratuitos Flash más estables
      const flashModels = modelosCuenta.filter(m => {
        const n = m.toLowerCase();
        return n.includes('flash') && !n.includes('lite');
      });
      const flashLiteModels = modelosCuenta.filter(m => m.toLowerCase().includes('flash-lite'));
      const proModels = modelosCuenta.filter(m => m.toLowerCase().includes('pro'));
      const otros = modelosCuenta.filter(m => !flashModels.includes(m) && !flashLiteModels.includes(m) && !proModels.includes(m));

      candidatos = [...candidatos, ...flashModels, ...flashLiteModels, ...proModels, ...otros];
      candidatos = [...new Set(candidatos)];

      let ultimoError = null;

      for (let i = 0; i < candidatos.length; i++) {
        const mod = candidatos[i];
        this.estadoGeneracionIA = `2/4 Generando menú con ${mod} (intento ${i + 1}/${candidatos.length})...`;

        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${mod}:generateContent?key=${this.geminiApiKey.trim()}`;
          const bodyPayload = {
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: promptUsuario }] }],
            generationConfig: {
              temperature: 0.2,
              response_mime_type: "application/json"
            }
          };

          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyPayload)
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            const msg = (errData.error && errData.error.message) ? errData.error.message : `HTTP ${res.status}`;
            console.warn(`Aviso: modelo ${mod} no respondió OK (${msg}). Probando alternativa...`);
            ultimoError = new Error(`Error en ${mod}: ${msg}`);
            continue; // Prueba el siguiente candidato automáticamente
          }

          const data = await res.json();
          const candidates = data.candidates;
          if (!candidates || candidates.length === 0 || !candidates[0].content) {
            ultimoError = new Error(`El modelo ${mod} no devolvió contenido.`);
            continue;
          }

          // Éxito: fijar este modelo como el principal
          this.geminiModelo = mod;
          localStorage.setItem('hybrid_gemini_modelo', mod);
          return { data, modeloUsado: mod };
        } catch (err) {
          console.warn(`Error en ${mod}:`, err);
          ultimoError = err;
          // Continúa con el siguiente candidato
        }
      }

      throw ultimoError || new Error("No se pudo generar el plan con ninguno de los modelos activos en tu cuenta.");
    },

    /**
     * GENERACIÓN AUTOMÁTICA CON LA API DE GEMINI (PRO / FLASH)
     */
    async generarDietaConGeminiAPI() {
      if (!this.geminiApiKey || !this.geminiApiKey.trim()) {
        this.mostrarConfigIA = true;
        alert("Introduce tu Gemini API Key en el panel de configuración para generar la dieta con 1 clic.");
        return;
      }

      this.generandoConGemini = true;
      this.estadoGeneracionIA = `1/4 Conectando con Gemini e inyectando la skill nutricionista-deportivo...`;

      try {
        const promptUsuario = this.generarPromptGemini();
        const systemPrompt = this.systemPromptNutricionista();

        const { data, modeloUsado } = await this.llamarGeminiConFallback(promptUsuario, systemPrompt);

        const textoJSON = data.candidates[0].content.parts[0].text;
        this.estadoGeneracionIA = `3/4 Validando reglas dietéticas (rules.md) generadas por ${modeloUsado}...`;

        let comidas;
        try {
          let limpio = textoJSON.trim();
          if (limpio.startsWith('```')) {
            limpio = limpio.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
          }
          comidas = JSON.parse(limpio);
        } catch(e) {
          throw new Error("La respuesta recibida no es un JSON válido: " + e.message);
        }

        this.jsonNuevaDieta = JSON.stringify(comidas, null, 2);
        const val = this.validarJsonDieta();
        if (!val || !val.valido) {
          throw new Error("La dieta generada no superó la validación: " + (val ? val.error : "Estructura inválida"));
        }

        this.estadoGeneracionIA = "4/4 Creando nueva semana activa y guardando en Supabase...";
        await this.ejecutarPublicacionEnSupabase(comidas);

        this.anunciar(`¡Semana generada exitosamente con ${modeloUsado} y publicada en Supabase!`);
      } catch (err) {
        console.error("Error al generar dieta con Gemini:", err);
        alert(err.message || "Error al comunicar con la API de Gemini.");
      } finally {
        this.generandoConGemini = false;
        this.estadoGeneracionIA = '';
      }
    },

    /**
     * PUBLICACIÓN EN SUPABASE (Reutilizable para API y manual)
     */
    async ejecutarPublicacionEnSupabase(comidas) {
      if (!supabaseClient) {
        throw new Error("Cliente de Supabase no disponible.");
      }

      // 1. Determinar ID de semana objetivo
      let nuevaSemanaId = null;

      // Si la semana activa actual aún no tiene comidas (ej. se creó el viernes para el pesaje), usamos esa
      if (this.semanaActivaId && (!this.dietaCompleta || this.dietaCompleta.length === 0)) {
        nuevaSemanaId = this.semanaActivaId;
        // Limpiar registros previos de comida/resumen por si acaso
        await supabaseClient.from('dieta_diaria').delete().eq('semana_id', nuevaSemanaId);
        await supabaseClient.from('resumen_semanal').delete().eq('semana_id', nuevaSemanaId);
        await supabaseClient.from('estado_app').delete().eq('semana_id', nuevaSemanaId);
      } else {
        // Desactivar semanas activas previas
        await supabaseClient
          .from('semanas')
          .update({ activa: false })
          .eq('activa', true);

        const numeroSemana = (this.semanasDisponibles.length || 0) + 1;
        const nombreSemana = `Semana ${numeroSemana}`;
        const fechaInicio = this.claveSemanaActual();

        const { data: nuevaSemana, error: semErr } = await supabaseClient
          .from('semanas')
          .insert([{
            nombre: nombreSemana,
            fecha_inicio: fechaInicio,
            activa: true
          }])
          .select()
          .single();

        if (semErr) throw semErr;
        nuevaSemanaId = nuevaSemana.id;
      }

      // 3. Insertar comidas en dieta_diaria
      const filasDieta = comidas.map(item => ({
        semana_id: nuevaSemanaId,
        dia: item.dia,
        ventana: item.ventana,
        plato: item.plato,
        fede_detalles: item.fede,
        arantxa_detalles: item.arantxa,
        macros_fede: item.macrosFede || '',
        macros_arantxa: item.macrosArantxa || ''
      }));

      const { error: dietaErr } = await supabaseClient
        .from('dieta_diaria')
        .insert(filasDieta);

      if (dietaErr) throw dietaErr;

      // 4. Calcular e insertar resumen_semanal con los entrenos del planificador
      const filasResumen = [];
      const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

      dias.forEach(dia => {
        const dNorm = this.normalizar(dia);
        const comidasDia = comidas.filter(c => this.normalizar(c.dia) === dNorm);
        const planDia = this.entrenosPlanificador[dNorm] || { fede: 'CrossFit 17:30', arantxa: 'CrossFit 17:30' };

        // Macros sumados Fede con validación estricta de grasas saludables (75-80g, nunca 200g)
        let sumPFede = 0, sumCHFede = 0, sumGFede = 0, sumKcalFede = 0;
        comidasDia.forEach(c => {
          const m = this.parsearMacrosDeColumnaExcel(c.macrosFede);
          sumPFede += m.p; sumCHFede += m.ch; sumGFede += m.g; sumKcalFede += m.kcal;
        });
        const entFede = (planDia.fede && planDia.fede.trim()) ? planDia.fede.trim() : 'CrossFit 17:30';
        const objFede = this.calcularMacrosObjetivo(entFede, 'fede');
        let pFede = sumPFede > 0 ? Math.round(sumPFede) : objFede.p;
        let chFede = sumCHFede > 0 ? Math.round(sumCHFede) : objFede.ch;
        // Si las grasas sumadas son anómalas (>85g o igualan a las proteínas), fijar las saludables
        let gFede = (sumGFede > 0 && sumGFede <= 85 && sumGFede < pFede * 0.9) ? Math.round(sumGFede) : objFede.g;
        let kcalFede = Math.round((pFede * 4) + (chFede * 4) + (gFede * 9));

        filasResumen.push({
          semana_id: nuevaSemanaId,
          atleta: 'Fede',
          dia: dia,
          entrenamiento: entFede,
          p: pFede,
          ch: chFede,
          g: gFede,
          kcal: kcalFede
        });

        // Macros sumados Arantxa con validación estricta de grasas saludables (50-55g, nunca 140g)
        let sumPAra = 0, sumCHAra = 0, sumGAra = 0, sumKcalAra = 0;
        comidasDia.forEach(c => {
          const m = this.parsearMacrosDeColumnaExcel(c.macrosArantxa);
          sumPAra += m.p; sumCHAra += m.ch; sumGAra += m.g; sumKcalAra += m.kcal;
        });
        const entAra = (planDia.arantxa && planDia.arantxa.trim()) ? planDia.arantxa.trim() : 'CrossFit 17:30';
        const objAra = this.calcularMacrosObjetivo(entAra, 'arantxa');
        let pAra = sumPAra > 0 ? Math.round(sumPAra) : objAra.p;
        let chAra = sumCHAra > 0 ? Math.round(sumCHAra) : objAra.ch;
        // Si las grasas sumadas son anómalas (>60g o igualan a las proteínas), fijar las saludables
        let gAra = (sumGAra > 0 && sumGAra <= 60 && sumGAra < pAra * 0.9) ? Math.round(sumGAra) : objAra.g;
        let kcalAra = Math.round((pAra * 4) + (chAra * 4) + (gAra * 9));

        filasResumen.push({
          semana_id: nuevaSemanaId,
          atleta: 'Arantxa',
          dia: dia,
          entrenamiento: entAra,
          p: pAra,
          ch: chAra,
          g: gAra,
          kcal: kcalAra
        });
      });

      const { error: resumenErr } = await supabaseClient
        .from('resumen_semanal')
        .insert(filasResumen);

      if (resumenErr) throw resumenErr;

      // 5. Inserte un nuevo registro vacío {} en estado_app (semana limpia)
      const estadosLimpios = [
        { semana_id: nuevaSemanaId, clave: 'comidasCompletadas', valor_json: {} },
        { semana_id: nuevaSemanaId, clave: 'swapsActivos', valor_json: {} },
        { semana_id: nuevaSemanaId, clave: 'cargasEntreno', valor_json: {} },
        { semana_id: nuevaSemanaId, clave: 'permutacionesDias', valor_json: {} },
        { semana_id: nuevaSemanaId, clave: 'cenasSocialesPorDia', valor_json: {} },
        { semana_id: nuevaSemanaId, clave: 'ajustesMetabolicos', valor_json: { fede: 0, arantxa: 0 } }
      ];

      const { error: estErr } = await supabaseClient
        .from('estado_app')
        .insert(estadosLimpios);

      if (estErr) throw estErr;

      // 6. Limpiar memoria local y cache
      this.mensajeDietaActualizada = true;
      this.jsonNuevaDieta = '';
      this.cargasEntreno = {};
      this.permutacionesDias = {};
      this.swapsActivos = {};
      this.cenasSocialesPorDia = {};
      this.cenaSocialActiva = false;
      this.comidasCompletadas = {};
      this.ajustesMetabolicos = { fede: 0, arantxa: 0 };

      localStorage.removeItem('hybrid_cargas_entreno');
      localStorage.removeItem('hybrid_permutaciones_dias');
      localStorage.removeItem('hybrid_swaps_activos');
      localStorage.removeItem('hybrid_cenas_sociales');
      localStorage.removeItem('hybrid_comidas_completadas');
      localStorage.removeItem('hybrid_ajustes_metabolicos');

      await this.cargarDatos();

      setTimeout(() => {
        this.mensajeDietaActualizada = false;
        this.cambiarTab('dieta');
      }, 1600);
    },

    async enviarCheckin() {
      if (!supabaseClient) {
        alert("Cliente de Supabase no disponible.");
        return;
      }
      this.enviando = true;
      try {
        let targetSemanaId = this.form.semana_id;
        if (!targetSemanaId) {
          const encontrada = this.semanasDisponibles.find(s => 
            (s.nombre && this.normalizar(s.nombre) === this.normalizar(this.form.semana)) ||
            this.normalizar(`Semana ${s.id}`) === this.normalizar(this.form.semana)
          );
          targetSemanaId = encontrada ? encontrada.id : this.semanaActivaId;
        }

        if (!targetSemanaId) {
          throw new Error("No hay una semana activa o seleccionada para guardar las medidas.");
        }

        const payload = {
          semana_id: targetSemanaId,
          atleta: this.form.atleta,
          peso: this.form.peso ? parseFloat(this.form.peso) : null,
          pecho: this.form.pecho ? parseFloat(this.form.pecho) : null,
          cintura: this.form.cintura ? parseFloat(this.form.cintura) : null,
          cadera: this.form.cadera ? parseFloat(this.form.cadera) : null,
          brazo: this.form.brazo ? parseFloat(this.form.brazo) : null,
          muslo: this.form.muslo ? parseFloat(this.form.muslo) : null
        };

        const { error: bioErr } = await supabaseClient
          .from('biometria')
          .upsert(payload, { onConflict: 'semana_id,atleta' });

        if (bioErr) throw bioErr;

        if (this.form.fecha) {
          await supabaseClient
            .from('semanas')
            .update({ fecha_inicio: this.form.fecha })
            .eq('id', targetSemanaId);
        }

        this.mensajeExito = true;
        this.anunciar(`Medidas de ${this.form.semana} (${this.form.atleta}) guardadas correctamente en Supabase`);
        await this.cargarDatos();
        setTimeout(() => { this.mensajeExito = false; }, 3500);
      } catch (e) {
        alert("Error al guardar en Supabase: " + (e.message || e));
      }
      this.enviando = false;
    },

    async importarDietaGemini() {
      let limpio = (this.jsonNuevaDieta || '').trim();
      if (limpio.startsWith('```')) {
        limpio = limpio.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      }
      this.jsonNuevaDieta = limpio;

      const val = this.validarJsonDieta();
      if (!val || !val.valido) {
        alert("Revisa el formato del JSON antes de publicar: " + (val ? val.error : 'JSON vacío'));
        return;
      }
      this.enviando = true;
      try {
        const comidas = JSON.parse(this.jsonNuevaDieta);
        await this.ejecutarPublicacionEnSupabase(comidas);
        this.anunciar('Plan nutricional semanal publicado con éxito en Supabase');
        alert("¡Plan publicado con éxito en Supabase! Ya tienes tu nueva semana activa con el menú limpio.");
      } catch (e) {
        alert("Error al publicar en Supabase: " + (e.message || e));
      }
      this.enviando = false;
    }
  };
}
