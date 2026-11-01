const API_URL = "https://script.google.com/macros/s/AKfycbwiBFN8Jo15OC9NppoNY21WA1p88M8M08W4QG4Iwl84VinasRmDUqjK8FUsgAq2UUqB/exec";

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
    mostrarSumaComun: true,
    cargandoDieta: false,
    errorConexion: false,
    enviando: false,
    mensajeExito: false,
    mensajeDietaActualizada: false,
    anuncioAccesible: '',
    filtroCompra: '',
    jsonNuevaDieta: '',
    dietaCompleta: JSON.parse(localStorage.getItem('hybrid_cache_dieta') || '[]'),
    resumenSemanalSheet: JSON.parse(localStorage.getItem('hybrid_cache_resumen') || '[]'),
    progresionFede: JSON.parse(localStorage.getItem('hybrid_cache_prog_fede') || '[]'),
    progresionArantxa: JSON.parse(localStorage.getItem('hybrid_cache_prog_ara') || '[]'),
    swapAbiertoIdx: null,
    swapsActivos: JSON.parse(localStorage.getItem('hybrid_swaps_activos') || '{}'),
    cargasEntreno: JSON.parse(localStorage.getItem('hybrid_cargas_entreno') || '{}'),
    permutacionesDias: JSON.parse(localStorage.getItem('hybrid_permutaciones_dias') || '{}'),
    comidasCompletadas: JSON.parse(localStorage.getItem('hybrid_comidas_completadas') || '{}'),
    itemsComprados: JSON.parse(localStorage.getItem('hybrid_compra_checks') || '{}'),
    form: {
      atleta: 'Fede',
      semana: 'Semana 1',
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
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          const ultimoDiaAbierto = sessionStorage.getItem('hybrid_dia_sesion');
          const hoyReal = this.nombreDiaHoy();
          if (ultimoDiaAbierto !== hoyReal) {
            this.diaSeleccionado = hoyReal;
            sessionStorage.setItem('hybrid_dia_sesion', hoyReal);
          }
        }
      });
      this.sincronizarFechaSemana();
      this.cargarDatos();
    },

    nombreDiaHoy() {
      const mapa = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      return mapa[new Date().getDay()] || 'Lunes';
    },

    irAHoy() {
      const hoy = this.nombreDiaHoy();
      this.diaSeleccionado = hoy;
      sessionStorage.setItem('hybrid_dia_sesion', hoy);
    },

    cambiarTab(nuevaTab) {
      this.tab = nuevaTab;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    cambiarVistaAtleta(modo) {
      this.vistaAtleta = modo;
      localStorage.setItem('hybrid_vista_atleta', modo);
    },

    seleccionarDia(d) {
      this.diaSeleccionado = d;
      this.cenaSocialActiva = false;
      this.swapAbiertoIdx = null;
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
     * Obtiene los Macros y Calorías Oficiales del Día desde RESUMEN_SEMANAL de tu Excel.
     * Si el usuario importó una dieta nueva donde las comidas suman otro valor distinto,
     * usa el valor de RESUMEN_SEMANAL como referencia principal para la semana actual.
     */
    objetivoBaseDia(diaNombre, atletaKey) {
      const diaFuente = this.diaFuenteEfectivo(diaNombre);
      const dNorm = this.normalizar(diaFuente);

      // 1. Buscar primero en RESUMEN_SEMANAL cargado en vivo desde el Sheet (si existe)
      if (this.resumenSemanalSheet && this.resumenSemanalSheet.length > 5) {
        let seccionActual = 'fede';
        for (let i = 0; i < this.resumenSemanalSheet.length; i++) {
          const fila = this.resumenSemanalSheet[i];
          const col0 = this.normalizar(fila[0]);
          if (col0.includes('arantxa')) { seccionActual = 'arantxa'; continue; }
          if (col0.includes('fede')) { seccionActual = 'fede'; continue; }

          if (seccionActual === atletaKey && col0 === dNorm && fila[1]) {
            const p = parseFloat((fila[2] || '0').toString().replace(',', '.'));
            const ch = parseFloat((fila[3] || '0').toString().replace(',', '.'));
            const g = parseFloat((fila[4] || '0').toString().replace(',', '.'));
            const kcalRaw = (fila[5] || '0').toString().replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
            const kcal = parseFloat(kcalRaw);
            if (kcal > 500) {
              return { entreno: fila[1].toString().trim(), p: Math.round(p), ch: Math.round(ch), g: Math.round(g), kcal: Math.round(kcal) };
            }
          }
        }
      }

      // 2. Respaldo exacto de tu tabla RESUMEN_SEMANAL del Excel
      const dic = atletaKey === 'fede' ? RESUMEN_OFICIAL_FEDE : RESUMEN_OFICIAL_ARANTXA;
      return dic[dNorm] || { entreno: "CrossFit 17:30", p: 200, ch: 320, g: 75, kcal: 2755 };
    },

    // Obtiene los Macros y Calorías Efectivos del Día (según si está en modo original "auto" o si se cambió de sesión)
    objetivoEfectivoDia(diaNombre, atletaKey) {
      const base = this.objetivoBaseDia(diaNombre, atletaKey);
      const modoManual = this.obtenerCargaAtleta(diaNombre, atletaKey);
      let obj = { ...base };

      if (modoManual && modoManual !== 'auto' && PERFILES_SESION[atletaKey][modoManual]) {
        const perf = PERFILES_SESION[atletaKey][modoManual];
        obj = { entreno: perf.nombre, p: perf.p, ch: perf.ch, g: perf.g, kcal: perf.kcal };
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
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data.dieta && data.dieta.length > 1) {
          this.dietaCompleta = data.dieta.slice(1).map(row => ({
            dia: row[0],
            ventana: row[1],
            plato: row[2],
            fede: row[3],
            macrosFede: row[4],
            arantxa: row[5],
            macrosArantxa: row[6]
          }));
          localStorage.setItem('hybrid_cache_dieta', JSON.stringify(this.dietaCompleta));
        }
        if (data.resumenSemanal) {
          this.resumenSemanalSheet = data.resumenSemanal;
          localStorage.setItem('hybrid_cache_resumen', JSON.stringify(this.resumenSemanalSheet));
        }
        if (data.progresionFede) {
          this.progresionFede = data.progresionFede;
          localStorage.setItem('hybrid_cache_prog_fede', JSON.stringify(this.progresionFede));
        }
        if (data.progresionArantxa) {
          this.progresionArantxa = data.progresionArantxa;
          localStorage.setItem('hybrid_cache_prog_ara', JSON.stringify(this.progresionArantxa));
        }
        if (data.estadoApp) {
          const fusionar = (claveremota, claveLocal, prop) => {
            if (data.estadoApp[claveremota]) {
              try {
                const rem = JSON.parse(data.estadoApp[claveremota]);
                this[prop] = { ...rem, ...this[prop] };
                localStorage.setItem(claveLocal, JSON.stringify(this[prop]));
              } catch(e) {}
            }
          };
          fusionar('comidasCompletadas', 'hybrid_comidas_completadas', 'comidasCompletadas');
          fusionar('swapsActivos', 'hybrid_swaps_activos', 'swapsActivos');
          fusionar('cargasEntreno', 'hybrid_cargas_entreno', 'cargasEntreno');
          fusionar('permutacionesDias', 'hybrid_permutaciones_dias', 'permutacionesDias');
        }
        this.sincronizarFechaSemana();
      } catch (e) {
        this.errorConexion = true;
      }
      this.cargandoDieta = false;
    },

    async sincronizarEstadoRemoto(clave, objeto) {
      try {
        fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'sync_estado', clave, valor: JSON.stringify(objeto) })
        });
      } catch (e) {}
    },

    claveSemanaActual() {
      const hoy = new Date();
      const dia = hoy.getDay() || 7;
      const lunes = new Date(hoy);
      lunes.setDate(hoy.getDate() - dia + 1);
      return lunes.toISOString().split('T')[0];
    },

    esComidaCompletada(idx) {
      const kSem = this.claveSemanaActual() + '_' + this.diaSeleccionado + '_' + idx;
      const kSimple = this.diaSeleccionado + '_' + idx;
      return !!(this.comidasCompletadas[kSem] || this.comidasCompletadas[kSimple]);
    },

    toggleComidaCompletada(idx) {
      const kSem = this.claveSemanaActual() + '_' + this.diaSeleccionado + '_' + idx;
      const kSimple = this.diaSeleccionado + '_' + idx;
      const nuevo = !this.esComidaCompletada(idx);
      if (nuevo) {
        this.comidasCompletadas[kSem] = true;
        this.comidasCompletadas[kSimple] = true;
      } else {
        delete this.comidasCompletadas[kSem];
        delete this.comidasCompletadas[kSimple];
      }
      this.comidasCompletadas = { ...this.comidasCompletadas };
      localStorage.setItem('hybrid_comidas_completadas', JSON.stringify(this.comidasCompletadas));
      this.sincronizarEstadoRemoto('comidasCompletadas', this.comidasCompletadas);
    },

    contarComidasCompletadas() {
      let count = 0;
      this.comidasDelDia().forEach((_, idx) => { if (this.esComidaCompletada(idx)) count++; });
      return count;
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
     *    normalizados para que la suma de las comidas del día dé EXACTAMENTE las Kcal de `RESUMEN_SEMANAL` (ej. 3.295 kcal el miércoles, 2.707 kcal el jueves).
     * 2. Si el usuario cambia el entrenamiento del día (ej. de 2 sesiones 3.295 kcal a 1 sesión 2.755 kcal),
     *    escala los carbohidratos y las calorías de cada toma para que sumen exactamente el nuevo objetivo (2.755 kcal).
     * 3. Si el usuario intercambia un alimento (ej. Merluza -> Pollo), mantiene INTACTAS las calorías y macros de la toma
     *    y recalcula únicamente los gramos en crudo.
     */
    comidaCalculadaParaDia(diaNombre, comida, idx, atletaKey) {
      const rawTexto = atletaKey === 'fede' ? comida.fede : comida.arantxa;
      const textoOriginal = this.limpiarSuplementosDeTexto(rawTexto);
      const campoMacros = atletaKey === 'fede' ? 'macrosFede' : 'macrosArantxa';

      // Macros escritos en la fila de DIETA para esta comida
      const macrosEscritosFila = this.parsearMacrosDeColumnaExcel(comida[campoMacros]);

      // Suma de los macros escritos en DIETA de todas las comidas reales de ese día
      const todasComidasDia = this.comidasDelDiaPara(diaNombre);
      let sumaP_Dieta = 0, sumaCH_Dieta = 0, sumaG_Dieta = 0, sumaKcal_Dieta = 0;
      todasComidasDia.forEach(c => {
        const m = this.parsearMacrosDeColumnaExcel(c[campoMacros]);
        sumaP_Dieta += m.p; sumaCH_Dieta += m.ch; sumaG_Dieta += m.g; sumaKcal_Dieta += m.kcal;
      });

      // Objetivo oficial del día según RESUMEN_SEMANAL (base) y según la sesión elegida (efectivo)
      const objDiaBase = this.objetivoBaseDia(diaNombre, atletaKey);
      const objDiaEfectivo = this.objetivoEfectivoDia(diaNombre, atletaKey);

      // Peso relativo de esta comida dentro del día
      const numTomas = todasComidasDia.length || 4;
      const pesoP  = sumaP_Dieta > 0    ? (macrosEscritosFila.p / sumaP_Dieta)       : (1 / numTomas);
      const pesoCH = sumaCH_Dieta > 0   ? (macrosEscritosFila.ch / sumaCH_Dieta)     : (1 / numTomas);
      const pesoG  = sumaG_Dieta > 0    ? (macrosEscritosFila.g / sumaG_Dieta)       : (1 / numTomas);
      const pesoK  = sumaKcal_Dieta > 0 ? (macrosEscritosFila.kcal / sumaKcal_Dieta) : (1 / numTomas);

      // Macros de esta comida anclados al total exacto del día en RESUMEN_SEMANAL
      const pBaseComida    = Math.round(objDiaBase.p * pesoP);
      const chBaseComida   = Math.round(objDiaBase.ch * pesoCH);
      const gBaseComida    = Math.round(objDiaBase.g * pesoG);
      const kcalBaseComida = Math.round(objDiaBase.kcal * pesoK);

      // Macros de esta comida tras aplicar cambio de sesiones (si el usuario cambió de 2 sesiones a 1 sesión, etc.)
      let pMetaComida    = Math.round(objDiaEfectivo.p * pesoP);
      let chMetaComida   = Math.round(objDiaEfectivo.ch * pesoCH);
      let gMetaComida    = Math.round(objDiaEfectivo.g * pesoG);
      let kcalMetaComida = Math.round(objDiaEfectivo.kcal * pesoK);

      // Factor de escala de carbohidratos por cambio de entrenamiento (ej. 320 / 450 = 0.711 en Miércoles de 2 sesiones a 1 sesión)
      const factorEntrenoCH = objDiaBase.ch > 0 ? (objDiaEfectivo.ch / objDiaBase.ch) : 1.0;

      // Si el Modo Cena Libre está activo, recorta 35% de CH y G en las comidas previas a la cena
      const esPreCena = this.isPreCena(comida.ventana);
      const factorCena = (this.cenaSocialActiva && esPreCena && diaNombre === this.diaSeleccionado) ? 0.65 : 1.0;

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

      // Si se cambió el número de sesiones o se activó Cena Libre, escalar hidratos secundarios (miel, dátiles, tortitas, plátano)
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

      // Si hay cambio de sesiones o intercambio de ingredientes, recalcular gramos en crudo de los pilares
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
        if (this.esComidaCompletada(idx)) {
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

    desglosarListaIngredientes(str) {
      if (!str) return [];
      return str.split('+').map(p => p.trim()).filter(Boolean).map(parte => {
        const match = parte.match(/^(\d+(?:[.,]\d+)?\s*(?:g|ml|kg|l|latas?|tortitas?|ud)?)\s+(.*)$/i);
        if (match) return { cantidad: match[1].trim(), nombre: match[2].trim() };
        return { cantidad: 'Al gusto', nombre: parte };
      });
    },

    sincronizarFechaSemana() {
      const tabla = (this.form.atleta === 'Fede') ? this.progresionFede : this.progresionArantxa;
      let fechaAsignada = FECHAS_SEMANAS_DEFAULT[this.form.semana] || '';
      let encontradoEnSheet = false;

      if (tabla && tabla.length > 1) {
        for (let i = 1; i < tabla.length; i++) {
          const fila = tabla[i];
          if (this.normalizar(fila[0]) === this.normalizar(this.form.semana)) {
            encontradoEnSheet = true;
            const fechaSheet = this.formatearFechaISO(fila[1]);
            if (fechaSheet) fechaAsignada = fechaSheet;

            this.form.peso = (fila[2] !== undefined && fila[2] !== '') ? fila[2].toString().replace(',', '.') : '';
            this.form.pecho = (fila[3] !== undefined && fila[3] !== '') ? fila[3].toString().replace(',', '.') : '';
            this.form.cintura = (fila[4] !== undefined && fila[4] !== '') ? fila[4].toString().replace(',', '.') : '';
            this.form.cadera = (fila[5] !== undefined && fila[5] !== '') ? fila[5].toString().replace(',', '.') : '';
            this.form.brazo = (fila[6] !== undefined && fila[6] !== '') ? fila[6].toString().replace(',', '.') : '';
            this.form.muslo = (fila[7] !== undefined && fila[7] !== '') ? fila[7].toString().replace(',', '.') : '';
            break;
          }
        }
      }

      if (!encontradoEnSheet || (!this.form.peso && this.form.semana === 'Semana 1')) {
        if (this.form.semana === 'Semana 1' && DATOS_SEMANA1_RESPALDO[this.form.atleta]) {
          const resp = DATOS_SEMANA1_RESPALDO[this.form.atleta];
          this.form.peso = resp.peso; this.form.pecho = resp.pecho; this.form.cintura = resp.cintura;
          this.form.cadera = resp.cadera; this.form.brazo = resp.brazo; this.form.muslo = resp.muslo;
        } else if (!encontradoEnSheet) {
          this.form.peso = ''; this.form.pecho = ''; this.form.cintura = '';
          this.form.cadera = ''; this.form.brazo = ''; this.form.muslo = '';
        }
      }
      this.form.fecha = fechaAsignada;
    },

    historicoAtleta() {
      const tabla = (this.form.atleta === 'Fede') ? this.progresionFede : this.progresionArantxa;
      const lista = [];
      if (tabla && tabla.length > 1) {
        for (let i = 1; i < tabla.length; i++) {
          const r = tabla[i];
          if (!r[0] || !this.normalizar(r[0]).startsWith('semana')) continue;
          const semNombre = r[0].toString().trim();
          const esSem1Vacia = (semNombre === 'Semana 1' && !r[2]);
          const resp = esSem1Vacia ? DATOS_SEMANA1_RESPALDO[this.form.atleta] : null;
          lista.push({
            semana: semNombre,
            fecha: this.formatearFechaISO(r[1]) || FECHAS_SEMANAS_DEFAULT[semNombre] || '',
            peso: resp ? resp.peso : (r[2] ? r[2].toString().replace(',', '.') : ''),
            pecho: resp ? resp.pecho : (r[3] ? r[3].toString().replace(',', '.') : ''),
            cintura: resp ? resp.cintura : (r[4] ? r[4].toString().replace(',', '.') : ''),
            cadera: resp ? resp.cadera : (r[5] ? r[5].toString().replace(',', '.') : ''),
            brazo: resp ? resp.brazo : (r[6] ? r[6].toString().replace(',', '.') : ''),
            muslo: resp ? resp.muslo : (r[7] ? r[7].toString().replace(',', '.') : '')
          });
        }
      }
      if (lista.length === 0) {
        const r1 = DATOS_SEMANA1_RESPALDO[this.form.atleta];
        lista.push({ semana: 'Semana 1', fecha: '2026-10-26', ...r1 });
      }
      return lista;
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

    abrirSwap(idx) { this.swapAbiertoIdx = (this.swapAbiertoIdx === idx) ? null : idx; },

    resetSwap(idx) {
      delete this.swapsActivos[this.diaSeleccionado + '_' + idx];
      this.swapsActivos = { ...this.swapsActivos };
      localStorage.setItem('hybrid_swaps_activos', JSON.stringify(this.swapsActivos));
      this.sincronizarEstadoRemoto('swapsActivos', this.swapsActivos);
    },

    aplicarSwap(idx, tipo, val) {
      const key = this.diaSeleccionado + '_' + idx;
      if (!this.swapsActivos[key]) this.swapsActivos[key] = {};
      this.swapsActivos[key][tipo] = val;
      this.swapsActivos = { ...this.swapsActivos };
      localStorage.setItem('hybrid_swaps_activos', JSON.stringify(this.swapsActivos));
      this.sincronizarEstadoRemoto('swapsActivos', this.swapsActivos);
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

    calcularReparto(strFede, strArantxa) {
      const sumarGramos = (str) => {
        if (!str) return 0;
        let total = 0;
        for (const m of str.matchAll(/(\d+(?:[.,]\d+)?)\s*g\b/gi)) total += parseFloat(m[1].replace(',', '.'));
        return total;
      };
      const gFede = sumarGramos(strFede), gAra = sumarGramos(strArantxa);
      if (gFede + gAra === 0) return 'Individual';
      const pctFede = Math.round((gFede / (gFede + gAra)) * 100);
      return `${pctFede}% Fede · ${100 - pctFede}% Ara`;
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
    },

    async enviarCheckin() {
      this.enviando = true;
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'checkin', ...this.form })
        });
        const result = await res.json();
        if (result.status === 'success') {
          this.mensajeExito = true;
          await this.cargarDatos();
          setTimeout(() => this.mensajeExito = false, 3500);
        }
      } catch (e) {
        alert("Error al guardar en Google Sheets: " + e.message);
      }
      this.enviando = false;
    },

    async importarDietaGemini() {
      this.enviando = true;
      try {
        const comidas = JSON.parse(this.jsonNuevaDieta);
        const res = await fetch(API_URL, {
          method: 'POST',
          body: JSON.stringify({ action: 'actualizar_dieta', comidas })
        });
        const result = await res.json();
        if (result.status === 'success') {
          this.mensajeDietaActualizada = true;
          this.jsonNuevaDieta = '';
          this.cargasEntreno = {};
          this.permutacionesDias = {};
          this.swapsActivos = {};
          localStorage.removeItem('hybrid_cargas_entreno');
          localStorage.removeItem('hybrid_permutaciones_dias');
          localStorage.removeItem('hybrid_swaps_activos');
          await this.cargarDatos();
          setTimeout(() => {
            this.mensajeDietaActualizada = false;
            this.cambiarTab('dieta');
          }, 1800);
        }
      } catch (e) {
        alert("Revisa el formato del JSON pegado: " + e.message);
      }
      this.enviando = false;
    }
  };
}
