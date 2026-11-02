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
  "fideos de arroz":            { tipo: 'ch',   p: 3.5,  ch: 80.0, g: 0.2 }
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
    geminiModelo: localStorage.getItem('hybrid_gemini_modelo') || 'gemini-1.5-pro',
    mostrarConfigIA: false,
    mostrarModoManualIA: false,
    generandoConGemini: false,
    estadoGeneracionIA: '',
    entrenosPlanificador: JSON.parse(localStorage.getItem('hybrid_planificador_entrenos') || JSON.stringify({
      lunes:     { fede: 'CrossFit 17:30',                           arantxa: 'CrossFit 17:30' },
      martes:    { fede: 'Cuestas 8 km (08:30) + Gym Torso (18:30)', arantxa: 'Cuestas 8 km (08:30) + Gym Torso (18:30)' },
      miercoles: { fede: 'Tempo 10 km (08:30) + CrossFit (17:30)',   arantxa: 'Tempo 10 km (08:30) + CrossFit (17:30)' },
      jueves:    { fede: 'Carrera fácil 8 km (18:30)',               arantxa: 'Carrera fácil 8 km (18:30)' },
      viernes:   { fede: 'CrossFit 17:30',                           arantxa: 'CrossFit 17:30' },
      sabado:    { fede: 'Descanso activo (Precarga Trail)',         arantxa: 'Descanso activo (Precarga Trail)' },
      domingo:   { fede: 'Trail 22 km (08:30)',                      arantxa: 'Trail 22 km (08:30)' }
    })),
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
      return str.split('+')
        .map(p => p.trim())
        .filter(parte => {
          const n = this.normalizar(parte);
          if (!n) return false;
          if (/\bcreatina\b|\bgel\b|\bgeles\b|\bisotonico\b|\bsales\b|\belectrolitos\b|\bevocarb\b|\bcafeina\b|\bprobiotico\b/.test(n)) return false;
          if (/^\d+\s*ml\s*agua/.test(n)) return false;
          return true;
        })
        .join(' + ');
    },

    limpiarSuplementosDeTitulo(titulo) {
      if (!titulo) return '';
      return titulo.replace(/\s+y\s+creatina/gi, '').replace(/\s*\+\s*creatina/gi, '').trim();
    },

    // Lee el texto de macros escrito en la pestaña DIETA del Excel (ej. "66g P | 170g CH | 49g G | 1.385 kcal")
    parsearMacrosDeColumnaExcel(txt) {
      if (!txt) return { p: 0, ch: 0, g: 0, kcal: 0 };
      const mP = txt.match(/(\d+(?:[.,]\d+)?)\s*g?\s*P\b/i);
      const mCH = txt.match(/(\d+(?:[.,]\d+)?)\s*g?\s*CH\b/i);
      const mG = txt.match(/(\d+(?:[.,]\d+)?)\s*g?\s*G\b/i);
      const mKcal = txt.match(/(\d+(?:[.,]\d+)?)\s*kcal/i);

      const p = mP ? parseFloat(mP[1].replace(',', '.')) : 0;
      const ch = mCH ? parseFloat(mCH[1].replace(',', '.')) : 0;
      const g = mG ? parseFloat(mG[1].replace(',', '.')) : 0;
      let kcal = 0;
      if (mKcal) {
        kcal = parseFloat(mKcal[1].replace(/\.(?=\d{3}\b)/g, '').replace(',', '.'));
      } else {
        kcal = (p * 4) + (ch * 4) + (g * 9);
      }
      return { p: Math.round(p), ch: Math.round(ch), g: Math.round(g), kcal: Math.round(kcal) };
    },

    /**
     * Obtiene los Macros y Calorías Oficiales del Día desde RESUMEN_SEMANAL (Supabase o Fallback Oficial)
     */
    objetivoBaseDia(diaNombre, atletaKey) {
      const diaFuente = this.diaFuenteEfectivo(diaNombre);
      const dNorm = this.normalizar(diaFuente);

      if (this.resumenSemanal && this.resumenSemanal.length > 0) {
        const fila = this.resumenSemanal.find(r => 
          this.normalizar(r.atleta) === atletaKey && 
          this.normalizar(r.dia) === dNorm
        );
        if (fila && Number(fila.kcal) > 500) {
          return {
            entreno: fila.entrenamiento || '',
            p: Math.round(Number(fila.p) || 0),
            ch: Math.round(Number(fila.ch) || 0),
            g: Math.round(Number(fila.g) || 0),
            kcal: Math.round(Number(fila.kcal) || 0)
          };
        }
      }

      const dic = atletaKey === 'fede' ? RESUMEN_OFICIAL_FEDE : RESUMEN_OFICIAL_ARANTXA;
      return dic[dNorm] || { entreno: "CrossFit 17:30", p: 200, ch: 320, g: 75, kcal: 2755 };
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
        obj.kcal = (obj.p * 4) + (obj.ch * 4) + (obj.g * 9);
      }

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

          // Guardar resumen_semanal
          this.resumenSemanal = resumenRes.data || [];
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
              }
            });
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
      return null;
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

      let partes = textoOriginal.split('+').map(p => p.trim()).filter(Boolean);
      let idxProt = -1, infoProtOrig = null, gramosProtOrig = 0;
      let idxCH = -1, infoCHOrig = null, gramosCHOrig = 0;
      let idxAOVE = -1, mlAOVEOrig = 0;

      partes.forEach((parte, i) => {
        const mAove = parte.match(/^(\d+(?:[.,]\d+)?)\s*ml\s+(aove|aceite)/i);
        if (mAove) {
          idxAOVE = i;
          mlAOVEOrig = parseFloat(mAove[1].replace(',', '.'));
          return;
        }
        const mGramo = parte.match(/^(\d+(?:[.,]\d+)?)\s*g\s+(.*)$/i);
        if (mGramo) {
          const gVal = parseFloat(mGramo[1].replace(',', '.'));
          const idCat = this.identificarAlimentoCatalogo(mGramo[2]);
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
          const nombreMostrarProt = haySwapProt ? swapConfig.prot : partes[idxProt].replace(/^\d+(?:[.,]\d+)?\s*g\s+/i, '');
          partes[idxProt] = `${nuevosGramosProt} g ${nombreMostrarProt}`;
        }
        if (idxCH !== -1 && nuevoCHObj) {
          const nombreMostrarCH = haySwapCH ? swapConfig.ch : partes[idxCH].replace(/^\d+(?:[.,]\d+)?\s*g\s+/i, '');
          partes[idxCH] = `${nuevosGramosCH} g ${nombreMostrarCH}`;
        }
        if (idxAOVE !== -1) {
          partes[idxAOVE] = nuevoMlAOVE > 0 ? `${nuevoMlAOVE} ml AOVE` : '';
        } else if (nuevoMlAOVE > 0 && (haySwapProt || haySwapCH)) {
          partes.push(`${nuevoMlAOVE} ml AOVE`);
        }
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

    desglosarListaIngredientes(str) {
      if (!str) return [];
      return str.split('+').map(p => p.trim()).filter(Boolean).map(parte => {
        const match = parte.match(/^(\d+(?:[.,]\d+)?\s*(?:g|ml|kg|l|latas?|tortitas?|ud)?)\s+(.*)$/i);
        if (match) return { cantidad: match[1].trim(), nombre: match[2].trim() };
        return { cantidad: 'Al gusto', nombre: parte };
      });
    },

    seleccionarUltimaSemanaConPeso(atletaNombre = this.form.atleta) {
      const historial = this.historicoAtleta(atletaNombre);
      const conPeso = historial.filter(h => {
        const p = parseFloat(h.peso);
        return !isNaN(p) && p > 0;
      });

      if (conPeso.length > 0) {
        const target = conPeso[conPeso.length - 1];
        this.form.semana = target.semana;
        this.form.semana_id = target.semana_id;
      } else if (historial.length > 0) {
        const activa = historial.find(h => h.activa) || historial[historial.length - 1];
        this.form.semana = activa.semana;
        this.form.semana_id = activa.semana_id;
      }
      this.sincronizarFechaSemana();
    },

    sincronizarFechaSemana() {
      const historial = this.historicoAtleta(this.form.atleta);
      const fila = historial.find(h => 
        (this.form.semana_id && h.semana_id === this.form.semana_id) ||
        this.normalizar(h.semana) === this.normalizar(this.form.semana)
      );

      if (fila) {
        this.form.semana_id = fila.semana_id;
        this.form.semana = fila.semana;
        this.form.fecha = fila.fecha || '';
        this.form.peso = fila.peso || '';
        this.form.pecho = fila.pecho || '';
        this.form.cintura = fila.cintura || '';
        this.form.cadera = fila.cadera || '';
        this.form.brazo = fila.brazo || '';
        this.form.muslo = fila.muslo || '';
      } else {
        this.form.peso = '';
        this.form.pecho = '';
        this.form.cintura = '';
        this.form.cadera = '';
        this.form.brazo = '';
        this.form.muslo = '';
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
      const base = DATOS_SEMANA1_RESPALDO[this.form.atleta] || { peso: 93.5, cintura: 95, brazo: 37, muslo: 58 };
      const p1 = parseFloat(base.peso), c1 = parseFloat(base.cintura), b1 = parseFloat(base.brazo), m1 = parseFloat(base.muslo);
      const pActual = parseFloat(this.form.peso) || p1;
      const cActual = parseFloat(this.form.cintura) || c1;
      const bActual = parseFloat(this.form.brazo) || b1;
      const mActual = parseFloat(this.form.muslo) || m1;
      return { peso: pActual - p1, cintura: cActual - c1, brazo: bActual - b1, muslo: mActual - m1 };
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
        texto.split('+').forEach(parte => {
          let limpio = parte.trim();
          if (!limpio) return;
          const match = limpio.match(/^(\d+(?:[.,]\d+)?)\s*(g|ml|kg|l|latas?|tortitas?|plátanos?|dátiles?)?\s+(.*)$/i);
          if (match) {
            const cant = parseFloat(match[1].replace(',', '.'));
            const unidad = (match[2] || 'ud').toLowerCase().replace(/s$/, '');
            let nombre = match[3].trim().replace(/\(\d+.*?\)/g, '').trim();
            const clave = unidad + '_' + this.normalizar(nombre);
            if (mapa.has(clave)) mapa.get(clave).cantidad += cant;
            else mapa.set(clave, { cantidad: cant, unidad: match[2] || '', nombre });
          } else {
            const claveTexto = this.normalizar(limpio);
            if (!mapa.has(claveTexto)) mapa.set(claveTexto, { cantidad: null, unidad: '', nombre: limpio });
          }
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
      const esSuplementoORunning = (txt) => /agua|gel|sales|sodio|isotonico|evocarb|creatina|whey|proteina|cafeina|probiotico|\bna\b/.test(this.normalizar(txt));
      const clasificarCategoria = (nombre) => {
        const n = this.normalizar(nombre);
        if (/pollo|pavo|ternera|solomillo|merluza|salmon|atun|jamon|lomo|hamburguesa|cerdo/.test(n)) return 'Carnicería, Pescadería y Charcutería';
        if (/skyr|queso|yogur|leche|huevo|clara|batido|cottage/.test(n)) return 'Lácteos y Huevos';
        if (/arroz|pan|patata|boniato|avena|tortita|pasta|miel|aove|aceite|garbanzo|lenteja|quinoa|cuscus|fideo/.test(n)) return 'Despensa, Panadería y Almidones';
        return 'Fruta y Verdura Fresca';
      };

      this.diasSemana.forEach(diaNombre => {
        const comidasDia = this.comidasDelDiaPara(diaNombre);
        comidasDia.forEach((comida, idx) => {
          const txtFede = this.comidaCalculadaParaDia(diaNombre, comida, idx, 'fede').texto;
          const txtAra = this.comidaCalculadaParaDia(diaNombre, comida, idx, 'arantxa').texto;

          [txtFede, txtAra].forEach(texto => {
            if (!texto) return;
            texto.split('+').forEach(parte => {
              let limpio = parte.trim();
              if (!limpio || esSuplementoORunning(limpio)) return;
              const match = limpio.match(/^(\d+(?:[.,]\d+)?)\s*(g|ml|kg|l|latas?|tortitas?|plátanos?|dátiles?)?\s+(.*)$/i);
              if (match) {
                const cant = parseFloat(match[1].replace(',', '.'));
                const unidadNorm = (match[2] || 'ud').toLowerCase().replace(/s$/, '');
                let nombre = match[3].trim().replace(/\(\d+.*?\)/g, '').trim();
                if (esSuplementoORunning(nombre)) return;
                if (this.filtroCompra && !this.normalizar(nombre).includes(this.normalizar(this.filtroCompra))) return;

                const clave = unidadNorm + '_' + this.normalizar(nombre);
                if (acumulado.has(clave)) acumulado.get(clave).cantidad += cant;
                else acumulado.set(clave, { clave, nombre, unidad: unidadNorm, cantidad: cant, categoria: clasificarCategoria(nombre) });
              }
            });
          });
        });
      });

      const grupos = {};
      acumulado.forEach(item => {
        if (item.unidad === 'g' && item.cantidad >= 1000) item.totalFormateado = (item.cantidad / 1000).toFixed(2) + ' kg';
        else if (item.unidad === 'ud') item.totalFormateado = Math.round(item.cantidad) + ' uds';
        else item.totalFormateado = Math.round(item.cantidad) + ' ' + item.unidad;
        if (!grupos[item.categoria]) grupos[item.categoria] = [];
        grupos[item.categoria].push(item);
      });

      return Object.keys(grupos).sort().map(cat => ({
        categoria: cat,
        items: grupos[cat].sort((a, b) => b.cantidad - a.cantidad)
      }));
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

    actualizarEntrenoPlanificador(diaKey, atletaKey, val) {
      if (!this.entrenosPlanificador[diaKey]) {
        this.entrenosPlanificador[diaKey] = { fede: '', arantxa: '' };
      }
      this.entrenosPlanificador[diaKey][atletaKey] = val;
      this.entrenosPlanificador = { ...this.entrenosPlanificador };
      localStorage.setItem('hybrid_planificador_entrenos', JSON.stringify(this.entrenosPlanificador));
    },

    /**
     * SYSTEM PROMPT OFICIAL: SKILL NUTRICIONISTA-DEPORTIVO PARA KINETIX
     */
    systemPromptNutricionista() {
      return `Actúas como "nutricionista-deportivo", un nutricionista deportivo de precisión de élite para Kinetix, especializado en dos atletas híbridos de alto rendimiento (Trail Running y CrossFit) que viven y cocinan juntos:
- Fede: Bajar de 93.5 kg a 87.5 kg conservando intacta la masa muscular para Ultratrail de 50 km. Proteína fija innegociable: 200g P.
- Arantxa: Recomposición corporal en ~65.0 kg y mejora de fuerza en CrossFit. Proteína fija innegociable: ~140g P.

REGLAS DE ORO INMUTABLES:
1. OLLA COMÚN: Ambos atletas comen EXACTAMENTE el mismo plato/receta en cada ventana del día (08:30 Desayuno, 14:00 Comida, 17:00 Pre-WOD/Merienda y 21:00 Cena) para poder cocinar juntos. La ÚNICA diferencia entre Fede y Arantxa son los GRAMOS EN CRUDO para clavar matemáticamente sus respectivos carbohidratos y calorías según el entrenamiento del día.
2. REGLAS DIETÉTICAS OBLIGATORIAS (rules.md):
   - PROHIBIDO el salmón cocinado en platos calientes (en comidas calientes usar únicamente atún al natural o merluza). El salmón solo se permite crudo, marinado o ahumado en frío (ej. poke bowl o ensalada fría).
   - La merluza debe ser específicamente "merluza empanada del Mercadona".
   - En tomas previas al entrenamiento de CrossFit (17:30), SOLO alimentos de vaciado gástrico rápido (arroz blanco, patata, claras de huevo, pan blanco), SIN legumbres ni grasas pesadas para evitar molestias digestivas.
   - Todos los alimentos que se cocinan (arroz, pasta, patata, pollo, ternera, merluza) deben especificarse obligatoriamente con su PESO EN CRUDO ('g' o 'ml').
3. SALIDA JSON ESTRICTA: Responde ÚNICAMENTE con un array JSON válido sin texto previo ni posterior, cubriendo los 7 días (Lunes a Domingo) con 4 comidas por día (Desayuno, Comida, Merienda/Pre-WOD, Cena).
Campos obligatorios por objeto:
{
  "dia": "Lunes",
  "ventana": "08:30 Desayuno",
  "plato": "Nombre del plato común",
  "fede": "ingredientes con gramos en crudo para Fede",
  "macrosFede": "35g P | 58g CH | 12g G | 480 kcal",
  "arantxa": "ingredientes con gramos en crudo para Arantxa",
  "macrosArantxa": "25g P | 38g CH | 9g G | 333 kcal"
}`;
    },

    /**
     * GENERADOR INTELIGENTE DE PROMPT PARA GEMINI (Integra pesaje viernes + entrenos domingo)
     */
    generarPromptGemini() {
      const adjF = (this.ajustesMetabolicos && this.ajustesMetabolicos.fede) || 0;
      const adjA = (this.ajustesMetabolicos && this.ajustesMetabolicos.arantxa) || 0;

      // Medidas más recientes del pesaje del viernes
      const histFede = this.historicoAtleta('Fede').filter(x => parseFloat(x.peso) > 0);
      const histAra = this.historicoAtleta('Arantxa').filter(x => parseFloat(x.peso) > 0);
      const ultFede = histFede[histFede.length - 1] || { peso: '93.5', cintura: '95' };
      const ultAra = histAra[histAra.length - 1] || { peso: '67.0', cintura: '80' };

      let textoDias = '';
      this.diasSemana.forEach(dia => {
        const dNorm = this.normalizar(dia);
        const planDia = this.entrenosPlanificador[dNorm] || { fede: 'CrossFit 17:30', arantxa: 'CrossFit 17:30' };
        const of = this.objetivoEfectivoDia(dia, 'fede');
        const oa = this.objetivoEfectivoDia(dia, 'arantxa');

        textoDias += `  - **${dia}**:\n`;
        textoDias += `    * Entreno FEDE: "${planDia.fede}" → Objetivo: ${of.kcal} kcal | ${of.p}g P | ${of.ch}g CH | ${of.g}g G\n`;
        textoDias += `    * Entreno ARANTXA: "${planDia.arantxa}" → Objetivo: ${oa.kcal} kcal | ${oa.p}g P | ${oa.ch}g CH | ${oa.g}g G\n`;
      });

      return `Actúa con tu rol de skill "nutricionista-deportivo" para Kinetix:

=== DATOS DE CONTROL Y PESAJE (Viernes) ===
- Fede: Peso actual ${ultFede.peso} kg (Cintura: ${ultFede.cintura || '--'} cm). Ajuste metabólico semanal aplicado: ${adjF >= 0 ? '+' : ''}${adjF} kcal/día en carbohidratos. Proteína fija en 200g.
- Arantxa: Peso actual ${ultAra.peso} kg (Cintura: ${ultAra.cintura || '--'} cm). Ajuste metabólico: ${adjA >= 0 ? '+' : ''}${adjA} kcal/día. Proteína fija en ~140g.

=== PLAN DE ENTRENAMIENTOS DE LA SEMANA (Definido el Domingo) Y METAS EXACTAS ===
${textoDias}

=== REGLAS DIETÉTICAS INMUTABLES (rules.md) ===
1. Misma receta/plato en desayuno, comida, merienda y cena (Olla Común). Solo varían las cantidades en crudo.
2. Cero salmón cocinado en caliente (solo atún natural o merluza empanada Mercadona).
3. Pre-CrossFit (17:30): vaciado gástrico rápido (sin legumbres ni grasas pesadas).
4. Todos los alimentos que se cocinan expresados obligatoriamente con su PESO EN CRUDO ('g' o 'ml').

=== INSTRUCCIÓN DE RESPUESTA ===
Genera el plan completo de Lunes a Domingo (28 tomas en total: 4 por día) en un único array JSON válido.`;
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
     * GENERACIÓN AUTOMÁTICA CON LA API DE GEMINI (PRO / FLASH)
     */
    async generarDietaConGeminiAPI() {
      if (!this.geminiApiKey || !this.geminiApiKey.trim()) {
        this.mostrarConfigIA = true;
        alert("Introduce tu Gemini API Key en el panel de configuración para generar la dieta con 1 clic.");
        return;
      }

      this.generandoConGemini = true;
      const nombreMod = this.geminiModelo === 'gemini-1.5-pro' ? 'Gemini 1.5 Pro' : 'Gemini 2.0 Flash';
      this.estadoGeneracionIA = `1/4 Conectando con ${nombreMod} e inyectando la skill nutricionista-deportivo...`;

      try {
        const promptUsuario = this.generarPromptGemini();
        const systemPrompt = this.systemPromptNutricionista();

        this.estadoGeneracionIA = `2/4 ${nombreMod} está razonando la dieta: cuadrando la olla común y modulando carbohidratos...`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.geminiModelo}:generateContent?key=${this.geminiApiKey.trim()}`;

        const bodyPayload = {
          system_instruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: promptUsuario }]
            }
          ],
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
          throw new Error(`Error de Gemini API: ${msg}`);
        }

        const data = await res.json();
        const candidates = data.candidates;
        if (!candidates || candidates.length === 0 || !candidates[0].content) {
          throw new Error("Gemini no devolvió candidatos válidos.");
        }

        const textoJSON = candidates[0].content.parts[0].text;
        this.estadoGeneracionIA = "3/4 Validando reglas dietéticas (rules.md) y estructura relacional...";

        let comidas;
        try {
          comidas = JSON.parse(textoJSON);
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

        this.anunciar(`¡Semana generada exitosamente con ${nombreMod} y publicada en Supabase!`);
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

      // 1. Desactivar semanas activas previas
      await supabaseClient
        .from('semanas')
        .update({ activa: false })
        .eq('activa', true);

      // 2. Determinar número de semana y fecha
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
      const nuevaSemanaId = nuevaSemana.id;

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

        // Macros sumados Fede
        let sumPFede = 0, sumCHFede = 0, sumGFede = 0, sumKcalFede = 0;
        comidasDia.forEach(c => {
          const m = this.parsearMacrosDeColumnaExcel(c.macrosFede);
          sumPFede += m.p; sumCHFede += m.ch; sumGFede += m.g; sumKcalFede += m.kcal;
        });
        const baseFede = RESUMEN_OFICIAL_FEDE[dNorm] || { entreno: 'CrossFit 17:30', p: 200, ch: 320, g: 75, kcal: 2755 };
        filasResumen.push({
          semana_id: nuevaSemanaId,
          atleta: 'Fede',
          dia: dia,
          entrenamiento: planDia.fede || baseFede.entreno,
          p: sumKcalFede > 0 ? Math.round(sumPFede) : baseFede.p,
          ch: sumKcalFede > 0 ? Math.round(sumCHFede) : baseFede.ch,
          g: sumKcalFede > 0 ? Math.round(sumGFede) : baseFede.g,
          kcal: sumKcalFede > 0 ? Math.round(sumKcalFede) : baseFede.kcal
        });

        // Macros sumados Arantxa
        let sumPAra = 0, sumCHAra = 0, sumGAra = 0, sumKcalAra = 0;
        comidasDia.forEach(c => {
          const m = this.parsearMacrosDeColumnaExcel(c.macrosArantxa);
          sumPAra += m.p; sumCHAra += m.ch; sumGAra += m.g; sumKcalAra += m.kcal;
        });
        const baseAra = RESUMEN_OFICIAL_ARANTXA[dNorm] || { entreno: 'CrossFit 17:30', p: 140, ch: 220, g: 50, kcal: 1890 };
        filasResumen.push({
          semana_id: nuevaSemanaId,
          atleta: 'Arantxa',
          dia: dia,
          entrenamiento: planDia.arantxa || baseAra.entreno,
          p: sumKcalAra > 0 ? Math.round(sumPAra) : baseAra.p,
          ch: sumKcalAra > 0 ? Math.round(sumCHAra) : baseAra.ch,
          g: sumKcalAra > 0 ? Math.round(sumGAra) : baseAra.g,
          kcal: sumKcalAra > 0 ? Math.round(sumKcalAra) : baseAra.kcal
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
      } catch (e) {
        alert("Error al publicar en Supabase: " + (e.message || e));
      }
      this.enviando = false;
    }
  };
}
