# ELAIA — Mental Health & Wellness App
## Historias de Usuario — Backlog Completo
**v1.1 · Marzo 2026 · 31 Historias · 9 Épicas**

> **Changelog v1.0 → v1.1:** Refinamiento post revisión estática — 56 hallazgos procesados.
> Ver trazabilidad completa en `static-tests/refinamiento_HU.md`

---

## 📖 Glosario de Términos de Almacenamiento

> **Nuevo en v1.1 — HAL-052:** Se unifica la terminología de almacenamiento en todo el documento.

| Término | Definición |
|---|---|
| **secureStorage** | Wrapper AES-256 sobre `localStorage` implementado en `secureStorage.ts`. Cuando los CA o notas mencionan `localStorage`, se refieren a `secureStorage` a menos que se indique explícitamente lo contrario. |
| **secureStorage namespaceado** | Datos almacenados bajo la clave `elaia_{entidad}_{firebaseUid}`, accesibles solo tras autenticación. |
| **localStorage plano** | Solo para datos no sensibles: preferencia de idioma, estado de instalación PWA, streakData. |

---

## Resumen de Épicas

| # | Épica | Stack / Tecnología | US |
|---|---|---|---|
| 1 | Autenticación y Sesión | Firebase Auth | 4 |
| 2 | Home & Mood Tracker | HomeScreen.tsx + secureStorage | 3 |
| 3 | Journal Emocional | JournalScreen.tsx + AES | 4 |
| 4 | Chat con Elaia — Core | ChatScreen.tsx + API Gemini | 6 |
| 5 | Relax — Breathing & Panic | BreathingExercise + PanicButton | 3 |
| 6 | Insights y Métricas | InsightsScreen + insightsCalculations | 3 |
| 7 | Support — Contactos | SupportScreen + @dnd-kit | 3 |
| 8 | Perfil y Configuración | ProfileScreen + Firebase Storage | 3 |
| 9 | PWA & Instalación | Service Worker + manifest.json | 2 |
| | **TOTAL** | | **31** |

> **Nota v1.1 — HAL-053:** La ruta de la épica 6 se unifica como `/insights` en toda la documentación.
> La ruta `/analysis` mencionada en v1.0 queda deprecada. Actualizar el router y los tests E2E.

---

## Épica 1 — Autenticación y Sesión · Firebase Auth

### US-001 · Registro de usuario con email y contraseña · SP: 3

**Como** visitante
**Quiero** registrarme en Elaia con un email válido y una contraseña segura
**Para** crear mi cuenta y acceder a las herramientas de bienestar mental

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en la pantalla de registro
> Cuando ingreso un email válido y una contraseña que cumple los requisitos de seguridad y presiono Registrarse
> Entonces Firebase crea la cuenta, AuthContext setea currentUser y la app muestra HomeScreen

**Reglas de negocio**

- No se permite el registro con un email ya existente en Firebase; se muestra el mensaje de error correspondiente.
- ~~Si el email tiene formato inválido o la contraseña tiene menos de 8 caracteres~~ **[HAL-001]** Si el email tiene formato inválido o la contraseña no cumple los requisitos (mínimo 8 caracteres, al menos 1 mayúscula, 1 número y 1 carácter especial), se muestran errores descriptivos en línea antes de enviar el formulario.
- Tras el registro exitoso, la persistencia de sesión queda configurada según la opción "Recordarme" seleccionada. **[HAL-003]** El toggle "Recordarme" es un checkbox visible en el formulario, inactivo por defecto. Si está activo: `browserLocalPersistence`; si está inactivo: `browserSessionPersistence`.
- **[HAL-002 — NUEVO]** Si Firebase no responde durante el registro (timeout o error de red), se muestra un mensaje de error genérico y el formulario conserva todos los datos ingresados para permitir el reintento.

**Dependencias:** Firebase Auth, AuthContext.tsx

**Notas técnicas:** Usar `firebase.auth().createUserWithEmailAndPassword()`. Manejar error código `auth/email-already-in-use`. La política de contraseña incluye: mínimo 8 caracteres, 1 mayúscula, 1 número, 1 carácter especial. La persistencia se configura con `setPersistence(browserLocalPersistence)` o `browserSessionPersistence` según el toggle `rememberMe`.

---

### US-002 · Inicio de sesión con email y contraseña · SP: 2

**Como** usuario registrado
**Quiero** iniciar sesión con mi email y contraseña
**Para** acceder a mi cuenta y retomar mi historial de journal y chat sin perder mis datos

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en la pantalla de inicio de sesión
> Cuando ingreso credenciales válidas y presiono Ingresar
> Entonces Firebase autentica al usuario, AuthContext setea currentUser y la app navega a HomeScreen

**Reglas de negocio**

- Si las credenciales son incorrectas, se muestra un mensaje de error claro ("Email o contraseña incorrectos") sin revelar cuál campo es inválido.
- Si el campo email o contraseña está vacío al enviar, se muestra validación en línea antes de llamar a Firebase.
- Con "Recordarme" activo, la sesión persiste al cerrar y reabrir el navegador; sin él, expira al cerrar el tab.
- **[HAL-005 — NUEVO]** Si el email corresponde a una cuenta registrada únicamente con Google OAuth, se muestra el mensaje: "Esta cuenta fue creada con Google. Por favor usá el botón Continuar con Google para ingresar."
- **[HAL-006 — NUEVO]** Después de 5 intentos fallidos consecutivos de login, el formulario se bloquea por 5 minutos y se muestra un mensaje indicando el tiempo de espera. ⚠️ *Pendiente confirmación del equipo de seguridad sobre los valores exactos.*

**Dependencias:** Firebase Auth, AuthContext.tsx

**Notas técnicas:** Usar `signInWithEmailAndPassword()`. Manejar errores `auth/user-not-found` y `auth/wrong-password`. La persistencia se aplica antes del signIn con `setPersistence()`. El contador de intentos fallidos se gestiona en el cliente con timestamp en `localStorage`.

---

### US-003 · Inicio de sesión con Google OAuth · SP: 3

**Como** visitante
**Quiero** iniciar sesión o registrarme con mi cuenta de Google con un solo clic
**Para** acceder a Elaia sin tener que recordar otra contraseña

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en la pantalla de autenticación
> Cuando presiono "Continuar con Google" y completo el flujo OAuth de Google
> Entonces Firebase autentica al usuario con GoogleAuthProvider, se crea o vincula la cuenta, y la app muestra HomeScreen

**Reglas de negocio**

- Si el usuario cancela el popup de Google, la pantalla de autenticación permanece visible sin mostrar error.
- Si la cuenta de Google ya está vinculada a una cuenta existente de Elaia, se inicia sesión en esa cuenta sin crear un duplicado.
- **[HAL-007 — NUEVO]** Si el email de Google ya existe en Firebase como cuenta email/password, el sistema muestra el mensaje: "Ya tenés una cuenta con este email. Iniciá sesión con tu contraseña o vinculá tu cuenta de Google desde el perfil."
- ~~El nombre y foto de perfil de Google se recuperan del displayName y photoURL del User object de Firebase.~~ **[HAL-008]** Tras el login con Google, el nombre de perfil visible en HomeScreen coincide con el nombre de la cuenta Google, y la foto de perfil muestra la imagen de Google asociada.

**Dependencias:** Firebase Auth (GoogleAuthProvider), AuthContext.tsx

**Notas técnicas:** Usar `signInWithPopup(auth, new GoogleAuthProvider())`. Manejar error `auth/popup-closed-by-user` silenciosamente. `displayName` y `photoURL` del objeto User se usan para el perfil inicial.

---

### US-004 · Cierre de sesión · SP: 1

**Como** usuario autenticado
**Quiero** cerrar sesión desde mi perfil
**Para** proteger mi privacidad al alejarme del dispositivo

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en ProfileScreen con sesión activa
> Cuando presiono el botón "Cerrar sesión" y confirmo la acción
> Entonces Firebase cierra la sesión, AuthContext setea currentUser a null y la app muestra AuthScreen

**Reglas de negocio**

- Al cerrar sesión, los datos locales encriptados (journal, chat, memory cards) permanecen en secureStorage con el namespace del userId — no se borran. *(Nota: este comportamiento aplica a US-004, no a US-001 — ver HAL-004)*
- **[HAL-010]** El botón "Cerrar sesión" se muestra habilitado únicamente cuando existe una sesión activa (`currentUser !== null`). No existe otro estado de deshabilitado.
- El botón de cierre de sesión se muestra en color rojo coral (#FF6B6B) como indicador visual de acción destructiva.
- **[HAL-009 — NUEVO]** Si `auth.signOut()` falla por error de red, se muestra un mensaje de error y el usuario permanece en ProfileScreen con la sesión activa.

**Dependencias:** Firebase Auth, AuthContext.tsx, ProfileScreen.tsx

**Notas técnicas:** Usar `auth.signOut()`. No limpiar secureStorage al hacer logout — los datos están namespaceados por `firebaseUid` y se recuperan al volver a iniciar sesión con la misma cuenta.

---

## Épica 2 — Home & Mood Tracker · HomeScreen.tsx + secureStorage

### US-005 · Ver dashboard principal · SP: 2

**Como** usuario autenticado
**Quiero** ver un dashboard de bienvenida al abrir la app
**Para** tener un punto de entrada claro hacia todas las funciones de Elaia

#### Criterios de Aceptación

**Escenario principal**

> Dado que inicié sesión exitosamente
> Cuando la app carga HomeScreen
> Entonces se muestra el saludo personalizado con el nombre del usuario, el mood tracker, acceso rápido al journal y accesos a las secciones: Journal, Chat, Relax e Insights

**Reglas de negocio**

- **[HAL-011]** Las secciones accesibles desde HomeScreen son: Journal (`/journal`), Chat (`/chat`), Relax (`/relax`) e Insights (`/insights`). La navigation pill muestra los 5 tabs: Home, Journal, Chat, Relax, Insights.
- **[HAL-012]** El contador de racha de días consecutivos **no está incluido en v1.0** — es deuda técnica pendiente. Su implementación se trackea en una US separada del roadmap. El CA de racha en HomeScreen queda excluido del scope actual.
- El fondo animado con los tres blobs (peach, lavender, teal) se renderiza correctamente en todos los tamaños de pantalla.
- La navigation pill glassmorphism se muestra en la parte inferior con los 5 tabs: Home, Journal, Chat, Relax, Insights.

**Dependencias:** HomeScreen.tsx, Navigation.tsx, AuthContext.tsx

**Notas técnicas:** El nombre del usuario se obtiene de `currentUser.displayName`. Los blobs se definen como keyframes en `tailwind.config.js`.

---

### US-006 · Registrar estado de ánimo desde Home · SP: 3

**Como** usuario autenticado
**Quiero** seleccionar mi estado de ánimo actual desde la pantalla principal
**Para** registrar rápidamente cómo me siento sin tener que navegar al journal completo

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en HomeScreen
> Cuando selecciono uno de los 5 estados emocionales del mood selector (muy bien, bien, neutral, mal, muy mal)
> Entonces el mood queda seleccionado visualmente con su emoji y color correspondiente

**Reglas de negocio**

- Al guardar la entrada junto con el mood, el entry se encripta mediante useJournal y se almacena en secureStorage namespaceado por firebaseUid.
- Si el usuario no escribe texto pero selecciona un mood e intenta guardar, se muestra un aviso indicando que el texto es requerido.
- Si el usuario intenta guardar sin seleccionar un mood, se bloquea la acción y se indica que debe elegir un estado emocional.
- **[HAL-013 — NUEVO]** Si tanto el texto como el mood están vacíos al intentar guardar, se muestran ambas validaciones en línea simultáneamente.
- **[HAL-014]** El texto completo se conserva íntegro en secureStorage. El truncado a 300 caracteres se aplica únicamente al momento de construir el AppContextPack para enviar al chat, no en el momento de guardar.
- El latestEntry se actualiza en estado global tras guardar.

**Dependencias:** HomeScreen.tsx, useJournal.ts, secureStorage.ts

**Notas técnicas:** El mood se mapea a 5 valores (1-5). El entry se encripta con crypto-js AES usando `VITE_APP_SECRET_KEY`. La key de storage es `elaia_journal_{firebaseUid}`. `buildAppContextPack()` aplica el truncado a 300 chars al leer latestEntry.

---

### US-007 · Prompt rápido de journal desde Home · SP: 2

**Como** usuario autenticado
**Quiero** escribir una entrada de diario rápida directamente desde la pantalla principal
**Para** registrar mis pensamientos sin perder tiempo navegando a la sección de journal

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en HomeScreen
> Cuando escribo texto en el textarea de entrada rápida y presiono Guardar con un mood seleccionado
> Entonces la entrada se guarda encriptada, el textarea se limpia y se muestra confirmación visual de guardado

**Reglas de negocio**

- La entrada guardada aparece inmediatamente al navegar a `/journal` en la posición más reciente del timeline.
- Si el usuario intenta guardar sin seleccionar un mood, se bloquea la acción y se indica que debe elegir un estado emocional.
- Si tanto el texto como el mood están vacíos al intentar guardar, se muestran ambas validaciones en línea simultáneamente.
- Después de guardar, latestEntry se propaga como contexto al módulo de chat (truncado a 300 caracteres al construir AppContextPack).

> **Nota v1.1 — HAL-054:** US-006 y US-007 comparten el mismo hook `useJournal` y lógica de validación. La diferencia funcional es únicamente el punto de entrada (mood selector integrado en Home vs. textarea rápido). No se consolidan en una sola US para mantener trazabilidad de los puntos de entrada.

**Dependencias:** US-006 (mood tracker), useJournal.ts, HomeScreen.tsx

**Notas técnicas:** `addEntry()` del hook useJournal recibe `{ content, mood, timestamp }`. La propagación a ChatScreen ocurre a través de `buildAppContextPack()` que lee latestEntry del storage.

---

## Épica 3 — Journal Emocional · JournalScreen.tsx + secureStorage AES

### US-008 · Ver timeline de entradas del journal · SP: 2

**Como** usuario autenticado
**Quiero** ver todas mis entradas de diario ordenadas cronológicamente
**Para** revisar mi historial emocional y reflexionar sobre mi progreso

#### Criterios de Aceptación

**Escenario principal**

> Dado que navego a `/journal` con al menos una entrada guardada
> Cuando JournalScreen se carga
> Entonces se muestra un timeline vertical con todas las entradas desencriptadas, cada una con su emoji de mood, fecha/hora y texto

**Reglas de negocio**

- Si no hay entradas guardadas, se muestra un estado vacío con un CTA para crear la primera entrada.
- Las entradas se desencriptan en el cliente usando secureStorage — nunca se transmiten al servidor.
- Las entradas se muestran de más reciente a más antigua (orden descendente por timestamp).
- **[HAL-015 — NUEVO]** Si la desencriptación de una o más entradas falla (clave AES incorrecta o datos corruptos), esa entrada se omite del timeline mostrando un indicador de error en su lugar ("Entrada no disponible"), sin crashear la pantalla.
- **[HAL-055 — NUEVO]** Cuando el secureStorage supera el 80% de su cuota estimada (4MB de 5MB), se muestra una advertencia al usuario sugiriendo exportar o eliminar entradas antiguas.

**Dependencias:** JournalScreen.tsx, useJournal.ts, secureStorage.ts

**Notas técnicas:** `getEntries()` en useJournal desencripta con `CryptoJS.AES.decrypt` usando `VITE_APP_SECRET_KEY`. Los emoji orbs de mood se mapean en el componente según el valor numérico (1-5). Los errores de desencriptación se capturan con try/catch por entrada individual.

---

### US-009 · Crear nueva entrada de journal · SP: 2

**Como** usuario autenticado
**Quiero** crear una entrada de diario con texto libre y estado de ánimo desde la pantalla de journal
**Para** documentar mis emociones y pensamientos del día de forma estructurada

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en `/journal`
> Cuando presiono el botón de nueva entrada, escribo texto, selecciono mood y guardo
> Entonces la entrada se encripta con AES, se guarda en secureStorage bajo la clave `elaia_journal_{uid}`, y aparece en el timeline

**Reglas de negocio**

- El timestamp se genera automáticamente en el momento de guardar — el usuario no puede modificarlo.
- Se permite texto de longitud libre; el sistema no impone un máximo visible en el journal (el truncado a 300 chars solo aplica cuando se envía como contexto al chat).
- Si falla el guardado por error de storage (por ejemplo, localStorage lleno), se muestra un mensaje de error y no se pierde el texto del usuario.
- **[HAL-016]** Los IDs de entrada se generan con `crypto.randomUUID()` para garantizar unicidad incluso con múltiples tabs abiertas simultáneamente.

**Dependencias:** US-006 (mood selector), useJournal.ts, secureStorage.ts

**Notas técnicas:** `addEntry()` genera un ID único con `crypto.randomUUID()`. El objeto `{id, content, mood, timestamp}` se serializa a JSON antes de encriptar con `CryptoJS.AES.encrypt`.

---

### US-010 · Editar o eliminar una entrada de journal · SP: 3

**Como** usuario autenticado
**Quiero** editar o eliminar entradas de mi diario
**Para** corregir errores o eliminar información que ya no quiero conservar

#### Criterios de Aceptación

**Escenario principal — Editar**

> Dado que veo una entrada en el timeline del journal
> Cuando presiono la opción de editar, modifico el texto o mood y guardo
> Entonces la entrada se actualiza en secureStorage manteniendo el timestamp original y se refleja en el timeline

**Escenario principal — Eliminar**

> Dado que selecciono eliminar una entrada y confirmo
> Cuando acepto el diálogo de confirmación
> Entonces la entrada se elimina permanentemente de secureStorage y desaparece del timeline

**Reglas de negocio**

- La acción de eliminar requiere confirmación explícita del usuario para prevenir borrados accidentales.
- Si se elimina el latestEntry que estaba siendo usado como contexto en el chat, el campo queda vacío hasta la próxima entrada.
- **[HAL-017 — NUEVO]** Si se edita la entrada que actúa como latestEntry mientras el chat está activo, el contexto del chat se actualiza con el contenido editado en el próximo request al LLM.

**Dependencias:** US-008 (timeline), useJournal.ts, secureStorage.ts

**Notas técnicas:** `updateEntry(id, changes)` y `deleteEntry(id)` en useJournal. Usar modal propio para confirmar eliminación.

---

### US-011 · Funcionamiento offline del journal · SP: 2

**Como** usuario autenticado sin conexión a internet
**Quiero** crear y ver entradas de mi journal sin conexión
**Para** mantener el hábito de journaling incluso cuando no tengo internet disponible

#### Criterios de Aceptación

**Escenario principal**

> Dado que no tengo conexión a internet y abro la app
> Cuando navego a `/journal`
> Entonces puedo ver todas mis entradas guardadas y crear nuevas entradas que se almacenan localmente sin errores

**Reglas de negocio**

- El journal funciona completamente offline porque todos los datos residen en secureStorage — no hay llamadas de red para esta funcionalidad.
- **[HAL-018]** Al recuperar la conexión a internet, el journal muestra las mismas entradas locales sin cambios ni mensajes de sincronización (los datos son 100% locales, no existe backend de journal).
- El Service Worker de la PWA sirve los assets estáticos de JournalScreen desde caché, permitiendo su uso sin conexión.

**Dependencias:** Service Worker (PWA), useJournal.ts, secureStorage.ts

**Notas técnicas:** El Service Worker está configurado para cachear los assets de Vite build. No requiere lógica especial de sincronización.

---

## Épica 4 — Chat con Elaia — Core · ChatScreen.tsx + API Gemini

### US-012 · Enviar mensaje de texto a Elaia · SP: 5

**Como** usuario autenticado
**Quiero** enviar mensajes de texto a Elaia y recibir respuestas empáticas
**Para** tener un espacio de conversación seguro donde procesar mis emociones

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en `/chat` con conexión a internet
> Cuando escribo un mensaje y presiono Enviar
> Entonces el mensaje aparece en el chat, se muestra el indicador de typing de Elaia, y en segundos llega la respuesta del modelo Gemini

**Reglas de negocio**

- Los mensajes se envían a `/api/chat/text` con el historial de la sesión y el AppContextPack (journal, streak, breathing history).
- Si la API devuelve error (timeout, 500, etc.), se muestra un mensaje de error en el chat con opción de reintentar, sin perder el mensaje del usuario.
- El historial se persiste encriptado en secureStorage después de cada intercambio — FREE retiene 200 msgs, PRO retiene 5000 msgs (sliding window FIFO).
- **[HAL-019 — NUEVO]** Si el token de sesión Firebase ha expirado al enviar un mensaje, se muestra un aviso: "Tu sesión expiró. Por favor iniciá sesión nuevamente." y se redirige a AuthScreen.
- **[HAL-020]** El typing indicator usa streaming real de la API Gemini. En caso de falla de streaming, se usa un delay simulado como fallback. El manejo de errores cubre corte de conexión durante respuesta parcial mostrando el texto recibido hasta ese momento con indicador de error.

**Dependencias:** ChatScreen.tsx, secureStorage.ts, API `/api/chat/text`

**Notas técnicas:** `sendMessage()` construye el payload con historial + contextPack. El historial se trunca a los N mensajes más recientes según plan antes de enviar.

---

### US-013 · Límite de frecuencia de mensajes (Rate Limiting) · SP: 2

**Como** usuario autenticado
**Quiero** recibir un mensaje claro cuando envío demasiados mensajes en poco tiempo
**Para** entender por qué no puedo enviar más mensajes y cuándo podré hacerlo

#### Criterios de Aceptación

**Escenario principal**

> Dado que envié más de 10 requests en los últimos 60 segundos desde mi sesión
> Cuando intento enviar otro mensaje
> Entonces la API responde con HTTP 429 y el chat muestra un aviso amigable indicando que debo esperar antes de continuar

**Reglas de negocio**

- **[HAL-021]** El rate limit aplica a dos niveles: 10 req/min por `firebaseUid` (usuario autenticado) y 30 req/min por IP. El campo `anonymousUserId` en la API corresponde al `firebaseUid` del usuario autenticado. Ambos límites aplican a usuarios FREE y PRO.
- **[HAL-022]** Los mensajes de error son: para límite de usuario: *"Enviaste demasiados mensajes. Esperá unos segundos antes de continuar."* — para límite de IP: *"Se detectó demasiada actividad desde tu red. Intentá de nuevo en un momento."*
- **[HAL-023 — NUEVO]** Al recibir HTTP 429, el mensaje del usuario permanece en el campo de texto del chat para que pueda reenviarlo manualmente una vez restablecido el límite.
- Si Upstash no responde (error transitorio), el request pasa de todas formas (política fail-open) y se registra un warning en el log del servidor.

> **Nota v1.1 — HAL-053:** La ruta referenciada en esta US es `/insights`, no `/analysis`. Ver nota en Resumen de Épicas.

**Dependencias:** US-012 (envío de mensajes), API middleware (Upstash Redis)

**Notas técnicas:** El rate limiting está implementado en el middleware de la API con `@upstash/redis`. El cliente maneja el status 429 y muestra el campo `reason` del body (`user_rate_limit` o `ip_rate_limit`).

---

### US-014 · Sistema de Memory Cards · SP: 8

**Como** usuario autenticado
**Quiero** que Elaia recuerde hechos importantes sobre mí a lo largo de las conversaciones
**Para** recibir respuestas personalizadas que demuestren que Elaia me conoce

#### Criterios de Aceptación

**Escenario principal**

> Dado que tengo plan PRO y llevo varios intercambios en el chat
> Cuando menciono un hecho personal relevante (nombre, profesión, situación emocional)
> Entonces el LLM extrae ese hecho como memory card, lo deduplica con Jaccard (threshold 0.45) y lo guarda encriptado (máx 25 cards)

**Reglas de negocio**

- **[HAL-024]** La extracción de memory cards ocurre de forma asíncrona tras cada intercambio usuario-Elaia. El usuario puede continuar chateando mientras la extracción se procesa en segundo plano.
- En el próximo request, las top 5 memory cards por confianza se inyectan en el contexto del LLM — Elaia usa esa información en su respuesta.
- En plan FREE, las memory cards se extraen y guardan localmente pero NO se inyectan en el LLM — Elaia no las usa activamente.
- **[HAL-025]** Si una nueva memory card contradice una existente: si la nueva tiene mayor confianza, reemplaza a la anterior adoptando la confianza de la nueva. Si la nueva tiene menor o igual confianza, se descarta la nueva y se conserva la existente.
- **[HAL-056 — NUEVO]** El usuario puede eliminar individualmente sus memory cards desde la sección de privacidad en ProfileScreen.

**Dependencias:** US-012 (chat), memoryCards.ts, secureStorage.ts, US-029 (planes)

**Notas técnicas:** `extractMemoryCardsFromConversation()` corre async con lock para evitar race conditions. Jaccard similarity compara tokens de las cards. El contenido de las cards nunca se envía a Langfuse.

---

### US-015 · Sistema de Summaries (PRO) · SP: 8

**Como** usuario con plan PRO
**Quiero** que Elaia recuerde el contexto de sesiones anteriores de chat
**Para** tener conversaciones con continuidad real sin repetir mi historia cada vez

#### Criterios de Aceptación

**Escenario principal**

> Dado que soy usuario PRO y tengo más de 50 mensajes nuevos sin resumir desde el último summary
> Cuando envío un mensaje nuevo
> Entonces `shouldGenerateSummary()` detecta el umbral y genera un resumen estructurado de los últimos 200 mensajes, guardado encriptado en secureStorage

**Reglas de negocio**

- **[HAL-026 — CRÍTICO]** El umbral de generación de summary es **N = 50 mensajes** sin resumir. Este valor está definido como constante en `summaries.ts`.
- El summary más reciente se inyecta en el contexto de cada request — Elaia responde con conocimiento de conversaciones anteriores.
- **[HAL-027]** Si ya existe un summary que cubre el rango actual de mensajes (mismo `fromMessageId` a `toMessageId`), no se genera un nuevo summary duplicado para ese mismo rango.
- En plan FREE no se generan ni inyectan summaries — cada sesión comienza sin memoria de sesiones pasadas.
- **[HAL-056 — NUEVO]** El usuario puede eliminar todos sus summaries desde la sección de privacidad en ProfileScreen.

**Dependencias:** US-014 (memory cards), summaries.ts, secureStorage.ts, US-029 (planes)

**Notas técnicas:** `appendEncryptedSummary()` guarda con rango de mensajes. El summary se genera con una llamada separada al LLM. `MAX_SUMMARIES` cap evita overflow de storage.

---

### US-016 · Entrada de voz (Audio Input) · SP: 5

**Como** usuario autenticado
**Quiero** enviar mensajes de voz a Elaia en lugar de escribir
**Para** comunicarme de forma más natural y expresiva cuando no quiero o puedo escribir

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en `/chat` con micrófono disponible y conexión a internet
> Cuando presiono el botón de grabación, hablo, y detengo la grabación
> Entonces el audio se envía a `/api/chat/audio`, se transcribe y la respuesta de Elaia aparece en el chat

**Reglas de negocio**

- Si el usuario deniega el permiso del micrófono en el navegador, se muestra un mensaje explicativo sobre cómo habilitarlo.
- Si la API de audio falla o el audio no es inteligible, se muestra un error indicando que no se pudo procesar la voz.
- **[HAL-028 — NUEVO]** La grabación tiene un límite máximo de 120 segundos. Si se supera, se detiene automáticamente y se procesa el audio grabado hasta ese momento. Si el audio no contiene voz detectable, se muestra: "No se detectó voz. Intentá de nuevo."
- **[HAL-029 — NUEVO]** La transcripción del audio aparece en el chat como un mensaje del usuario con un ícono de micrófono 🎤, permitiendo verificar que fue entendido correctamente.
- **[HAL-030]** `audioData` contiene la transcripción de texto del mensaje de voz (no el binario de audio). Solo los últimos 30 mensajes conservan `audioData`. Los mensajes de audio anteriores al #30 conservan únicamente la transcripción de texto sin el indicador de ícono de micrófono.

**Dependencias:** US-012 (chat), API `/api/chat/audio`, ChatScreen.tsx

**Notas técnicas:** WebRTC API para grabación en el cliente. El audio se envía como blob al endpoint. La política de `Permissions-Policy` en `vercel.json` permite `microphone=(self)`.

---

### US-017 · Text-to-Speech (TTS) · SP: 3

**Como** usuario autenticado
**Quiero** escuchar las respuestas de Elaia en voz alta
**Para** tener una experiencia más inmersiva y accesible sin necesidad de leer la pantalla

#### Criterios de Aceptación

**Escenario principal**

> Dado que Elaia responde un mensaje en el chat
> Cuando presiono el ícono de reproducción junto a la respuesta
> Entonces `speakMessage()` envía el texto a `/api/chat/tts` y el audio se reproduce en el dispositivo del usuario

**Reglas de negocio**

- Si ya hay audio reproduciéndose, presionar el botón TTS en otro mensaje detiene el anterior e inicia el nuevo.
- Si la API de TTS falla (timeout, error), se muestra un ícono de error junto al botón de reproducción.
- El botón TTS muestra estado visual diferenciado: idle, loading, playing y error.
- **[HAL-031 — NUEVO]** Al navegar fuera de ChatScreen mientras hay audio TTS reproduciéndose, la reproducción se detiene automáticamente.
- **[HAL-032 — NUEVO]** Si el texto de la respuesta supera 1000 caracteres, el TTS procesa solo los primeros 1000 caracteres e indica al usuario: "Reproduciendo fragmento — el texto completo es más largo."

**Dependencias:** US-012 (chat), API `/api/chat/tts`, ChatScreen.tsx

**Notas técnicas:** `speakMessage()` llama al endpoint TTS y usa la Web Audio API o un elemento `<audio>` para reproducción. El CSP en `vercel.json` debe permitir el dominio de la API.

---

## Épica 5 — Relax — Breathing & Panic Button · BreathingExercise.tsx + PanicButton.tsx

### US-018 · Ejercicio de respiración guiada · SP: 3

**Como** usuario autenticado
**Quiero** realizar un ejercicio de respiración guiada con instrucciones visuales
**Para** reducir mi ansiedad y estrés mediante técnicas validadas de control de la respiración

#### Criterios de Aceptación

**Escenario principal**

> Dado que navego a `/relax/breathing`
> Cuando la pantalla fullscreen carga
> Entonces se muestra la animación de respiración guiada (inhala/exhala/sostén) con ciclos configurables y sin el header ni la navigation global

**Reglas de negocio**

- El ejercicio funciona completamente offline — no requiere llamadas de red.
- **[HAL-033]** Los ciclos de respiración son valores fijos del sistema (no configurables por el usuario en v1.0): inhala 4s, sostén 4s, exhala 6s (técnica 4-4-6). El número de ciclos por sesión es 5 por defecto.
- **[HAL-034]** Al completar todos los ciclos configurados → la sesión se registra como `status: "completada"` en AppContextPack. Al salir antes de completar (botón de regreso) → la sesión se registra como `status: "interrumpida"`. Elaia usa este estado para contextualizar su respuesta.
- Al guardar la sesión de breathing, se incluye en el AppContextPack: `{ duration, date, status }` para que Elaia tenga contexto.

**Dependencias:** RelaxScreen.tsx, BreathingExercise.tsx, AppContextPack (`buildAppContextPack`)

**Notas técnicas:** `isExerciseRoute` en `App.tsx` oculta header y navigation cuando la ruta es `/relax/breathing`. La sesión de breathing se guarda en localStorage y se lee en `buildAppContextPack()` como `lastBreathingSession`.

---

### US-019 · Protocolo de crisis — Panic Button · SP: 3

**Como** usuario autenticado en situación de crisis
**Quiero** activar un protocolo de crisis con técnicas de grounding inmediatas
**Para** recibir ayuda estructurada durante un ataque de pánico o momento de alta ansiedad

#### Criterios de Aceptación

**Escenario principal**

> Dado que navego a `/relax/panic`
> Cuando la pantalla fullscreen carga
> Entonces se muestra el protocolo de grounding en formato paso a paso, con diseño calmante en color rojo coral atenuado y sin distracciones de navegación

**Reglas de negocio**

- El panic button registra si fue usado hoy y esta semana — `wasUsedToday` y `wasUsedThisWeek` se incluyen en el AppContextPack para que Elaia lo sepa.
- La pantalla funciona completamente offline — es crítico que esté disponible sin conexión en momentos de crisis.
- El botón de llamada de emergencia directo a la línea de crisis es accesible desde esta pantalla con `href tel:` sin pasos adicionales.
- **[HAL-035 — CRÍTICO]** El número de línea de crisis es configurable por idioma/región en el archivo de configuración (`translations.ts`). Si no existe un número configurado para el idioma activo del usuario, se muestra el número por defecto (Argentina: 135 — Centro de Asistencia al Suicida) con indicación del país de cobertura. ⚠️ *Requiere decisión del PO para definir números por región.*

**Dependencias:** PanicButton.tsx, RelaxScreen.tsx, AppContextPack, US-020 (Support)

**Notas técnicas:** `isExerciseRoute` oculta nav. `wasUsedToday` se calcula comparando el timestamp guardado con la fecha actual. El service worker cachea esta pantalla con prioridad alta.

---

### US-020 · Hub de relajación · SP: 2

**Como** usuario autenticado
**Quiero** ver todas las herramientas de bienestar disponibles desde un hub central
**Para** elegir fácilmente la herramienta que mejor se adapte a mi estado emocional del momento

#### Criterios de Aceptación

**Escenario principal**

> Dado que navego a `/relax`
> Cuando RelaxScreen carga
> Entonces se muestran exactamente dos cards: Breathing Exercise y Panic Button, con descripciones breves y navegación clara a sus rutas

**Reglas de negocio**

- Cada herramienta muestra su estado de uso reciente (ej: "Último uso: hace 2 horas") si está disponible localmente.
- **[HAL-036]** En v1.0, el hub muestra exactamente dos herramientas: Breathing Exercise (`/relax/breathing`) y Panic Button (`/relax/panic`). La integración automática de nuevas herramientas es una decisión de arquitectura para versiones futuras, fuera del scope de v1.0.
- La pantalla `/relax` sí muestra el header global y la navigation — solo `/relax/breathing` y `/relax/panic` son fullscreen sin nav.

**Dependencias:** RelaxScreen.tsx, Navigation.tsx, BreathingExercise.tsx, PanicButton.tsx

**Notas técnicas:** `isExerciseRoute` se define como un array de rutas exactas (`/relax/breathing`, `/relax/panic`) en `App.tsx`. `/relax` por sí sola no es `isExerciseRoute`.

---

## Épica 6 — Insights y Métricas Emocionales · InsightsScreen.tsx + insightsCalculations.ts

> **Nota v1.1 — HAL-053:** La ruta de esta épica es `/insights`. La ruta `/analysis` mencionada en v1.0 queda deprecada.

### US-021 · Ver gráfico de mood por período · SP: 3

**Como** usuario autenticado
**Quiero** ver un gráfico de barras con mis estados de ánimo agrupados por semana o mes
**Para** identificar patrones emocionales y tendencias en mi bienestar a lo largo del tiempo

#### Criterios de Aceptación

**Escenario principal**

> Dado que navego a `/insights` con al menos 3 entradas de journal dentro del período seleccionado actualmente
> Cuando InsightsScreen carga
> Entonces se muestra un gráfico de barras con los moods promedio agrupados por el período seleccionado (semana/mes)

**Reglas de negocio**

- El usuario puede alternar entre vista semanal y mensual — el gráfico se actualiza dinámicamente con los datos filtrados.
- **[HAL-037]** Si hay menos de 3 entradas dentro del período seleccionado actualmente (no en el historial total), se muestra un estado informativo: "Necesitás al menos 3 registros en este período para ver el gráfico."
- **[HAL-038]** El mood promedio del período se calcula como la media aritmética de todos los valores de mood (1-5) de las entradas del período, sin agrupar previamente por día. Ejemplo: 5 entradas con moods [3,4,2,5,3] → promedio = 3.4.
- Las métricas se calculan localmente por `insightsCalculations.ts` — ningún dato del journal sale del dispositivo para este módulo.

**Dependencias:** InsightsScreen.tsx, insightsCalculations.ts, useJournal.ts

**Notas técnicas:** `insightsCalculations.ts` recibe el array de entries desencriptadas y calcula promedios por período.

---

### US-022 · Ver estadísticas generales y racha · SP: 2

**Como** usuario autenticado
**Quiero** ver un resumen de mis estadísticas emocionales (emoción dominante, total de entradas, racha)
**Para** entender de un vistazo mi consistencia y tendencia emocional general

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en `/insights`
> Cuando la pantalla carga
> Entonces se muestra: emoción dominante del período seleccionado, total de entradas del período, promedio de mood y la racha actual de días consecutivos

**Reglas de negocio**

- **[HAL-039]** La racha se mantiene si el usuario crea al menos una entrada de journal en el día calendario (00:00-23:59 hora local del dispositivo). Solo las entradas de journal cuentan como actividad para la racha.
- Si la racha se rompe (más de 24 horas sin una entrada de journal), el contador vuelve a 0 y se muestra un mensaje de ánimo para retomar el hábito.
- **[HAL-040]** La emoción dominante, total de entradas y promedio de mood se calculan para el mismo período seleccionado (semana/mes) que el gráfico de barras de US-021.
- La emoción dominante se determina por la moda de los valores de mood del período seleccionado y se muestra con su emoji correspondiente.

**Dependencias:** US-021 (gráfico de mood), insightsCalculations.ts, secureStorage.ts (streak data)

**Notas técnicas:** La racha se persiste en localStorage como `streakData: { lastDate, count }`. `updateStreak()` en utils compara la fecha de la última entrada de journal con la fecha actual del dispositivo.

---

### US-023 · Insights sin conexión · SP: 1

**Como** usuario autenticado sin conexión a internet
**Quiero** acceder a mis métricas e insights emocionales sin necesitar internet
**Para** revisar mi progreso emocional en cualquier momento y lugar

#### Criterios de Aceptación

**Escenario principal**

> Dado que no tengo conexión a internet
> Cuando navego a `/insights`
> Entonces InsightsScreen carga y muestra todas las métricas calculadas localmente a partir de los datos del journal en secureStorage

**Reglas de negocio**

- No se muestra ningún error de red — el módulo de insights es 100% local y no depende de ningún endpoint externo.
- El Service Worker cachea los assets de InsightsScreen para garantizar su disponibilidad offline.
- Los datos de insights se actualizan en tiempo real al agregar nuevas entradas de journal, incluso sin conexión.

**Dependencias:** US-021, US-022, Service Worker (PWA), insightsCalculations.ts

**Notas técnicas:** Los insights son puramente client-side. La PWA garantiza disponibilidad de los assets estáticos.

---

## Épica 7 — Support — Contactos de Emergencia · SupportScreen.tsx + @dnd-kit

### US-024 · Ver y gestionar contactos de emergencia personales · SP: 5

**Como** usuario autenticado
**Quiero** agregar, editar, eliminar y reordenar mis contactos de emergencia personales
**Para** tener mis contactos de confianza organizados por prioridad para acceder rápidamente en momentos de crisis

#### Criterios de Aceptación

**Escenario principal**

> Dado que abro SupportScreen desde el ícono ShieldAlert del header
> Cuando el overlay se muestra
> Entonces veo mis contactos personales con nombre, teléfono y opción de llamar directamente mediante `href tel:`

**Reglas de negocio**

- Puedo agregar un nuevo contacto mediante el botón "+" que abre un bottom sheet con formulario de nombre y teléfono.
- **[HAL-041 — CRÍTICO]** El campo de teléfono valida que el número sea un número válido (formato local argentino o internacional E.164) antes de guardar. Si el formato es inválido, se muestra error en línea y no se guarda el contacto.
- **[HAL-042 — NUEVO]** El usuario puede agregar hasta 10 contactos personales. Si intenta agregar más, se muestra: "Alcanzaste el límite de 10 contactos personales."
- **[HAL-043]** Al editar un contacto, ambos campos (nombre y teléfono) son editables. Las mismas validaciones de creación aplican. No se permiten campos vacíos al guardar la edición.
- Puedo eliminar un contacto con confirmación previa.
- Puedo reordenar mis contactos por prioridad mediante drag & drop con @dnd-kit, compatible con touch en mobile y mouse en desktop.

**Dependencias:** SupportScreen.tsx, ContactsContext.tsx, @dnd-kit/sortable

**Notas técnicas:** SupportScreen no es una ruta — es un overlay controlado por `isSupportOpen` en `App.tsx`. Los contactos se persisten en secureStorage.

---

### US-025 · Llamada directa a línea de crisis profesional · SP: 1

**Como** usuario autenticado
**Quiero** llamar a una línea de crisis profesional directamente desde la app con un solo toque
**Para** acceder rápidamente a ayuda profesional en momentos de emergencia sin tener que buscar el número

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en SupportScreen
> Cuando presiono el botón de llamada a la línea de crisis
> Entonces el dispositivo inicia la llamada telefónica mediante `href tel:` al número configurado para el idioma/región activo

**Reglas de negocio**

- La línea de crisis siempre aparece en posición fija y destacada, independientemente del orden de los contactos personales.
- En plataformas donde `href tel:` no es compatible (algunos navegadores de escritorio), se muestra el número de forma clara para marcar manualmente.
- El botón de crisis usa el color rojo coral (#FF6B6B) para máxima visibilidad y urgencia visual.
- **[HAL-044]** El número de línea de crisis por región es: Argentina: **135** (Centro de Asistencia al Suicida, gratuito 24hs). El número se gestiona en `translations.ts` bajo la clave `crisisLine.number` y `crisisLine.description`. Para agregar nuevas regiones, actualizar `translations.ts`.

**Dependencias:** US-024 (SupportScreen), App.tsx (`isSupportOpen`)

**Notas técnicas:** `href tel:` abre la app de llamadas nativa. En desktop puede no activarse automáticamente — mostrar el número como fallback.

---

### US-026 · Acceso rápido a soporte desde cualquier pantalla · SP: 2

**Como** usuario autenticado
**Quiero** abrir el panel de soporte de emergencia desde cualquier pantalla de la app
**Para** tener ayuda siempre accesible sin importar dónde esté dentro de la aplicación

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en cualquier pantalla que muestra el header global (Home, Journal, Chat, Relax, Insights, Perfil)
> Cuando presiono el ícono ShieldAlert en el header
> Entonces SupportScreen se abre como overlay z-50 sobre la pantalla actual sin navegar

**Reglas de negocio**

- **[HAL-045 — CRÍTICO]** ChatScreen **sí** muestra el header global con el ícono ShieldAlert. El overlay de SupportScreen está disponible desde el chat — esto es crítico para una app de salud mental donde el usuario puede necesitar ayuda durante una conversación.
- SupportScreen no se muestra en las pantallas fullscreen de Breathing (`/relax/breathing`) y Panic (`/relax/panic`), ya que éstas ocultan el header. En esas pantallas, el botón de crisis está integrado directamente en la UI.
- Al cerrar SupportScreen con el botón atrás, la pantalla subyacente permanece exactamente donde estaba sin recargar.
- La apertura de SupportScreen no interrumpe la reproducción de TTS ni ninguna interacción activa en pantalla.

**Dependencias:** US-024 (SupportScreen), App.tsx (`isSupportOpen`, `isExerciseRoute`), Navigation.tsx

**Notas técnicas:** `isSupportOpen` se controla con `useState` en `App.tsx`. El header global se renderiza en todas las rutas excepto `isExerciseRoute` (`/relax/breathing`, `/relax/panic`). ChatScreen no es `isExerciseRoute`.

---

## Épica 8 — Perfil y Configuración · ProfileScreen.tsx + Firebase Storage

### US-027 · Ver y editar perfil de usuario · SP: 3

**Como** usuario autenticado
**Quiero** ver y editar mi nombre y foto de perfil
**Para** personalizar mi identidad dentro de la app y tener la experiencia más cercana posible

#### Criterios de Aceptación

**Escenario principal**

> Dado que abro ProfileScreen desde el avatar del header
> Cuando el overlay se muestra
> Entonces veo mi nombre actual, foto de perfil y opciones para editar ambos campos

**Reglas de negocio**

- Al cambiar la foto de perfil, el archivo se sube a Firebase Storage y la URL se actualiza en el perfil del usuario de Firebase Auth.
- **[HAL-046]** La foto de perfil acepta formatos JPG, PNG y WebP con un tamaño máximo de 5 MB. El mensaje de error especifica el motivo: "El archivo supera el tamaño máximo de 5 MB." o "Formato no soportado. Usá JPG, PNG o WebP."
- **[HAL-047 — NUEVO]** El nombre de perfil tiene un mínimo de 2 caracteres y un máximo de 50 caracteres. No puede guardarse vacío ni con solo espacios. Si el campo está vacío al guardar, se muestra validación en línea.
- El nombre actualizado se refleja inmediatamente en el saludo del HomeScreen sin necesidad de recargar la app.

**Dependencias:** ProfileScreen.tsx, Firebase Auth (`updateProfile`), Firebase Storage

**Notas técnicas:** `updateProfile(currentUser, { displayName, photoURL })` de Firebase. La foto se sube a `storage/{uid}/profile.jpg`.

---

### US-028 · Cambiar idioma de la aplicación · SP: 2

**Como** usuario autenticado
**Quiero** cambiar el idioma de la aplicación entre español e inglés
**Para** usar Elaia en el idioma con el que me siento más cómodo

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en ProfileScreen
> Cuando selecciono un idioma diferente al actual (ES → EN o EN → ES)
> Entonces el estado `lang` en `App.tsx` se actualiza y todos los textos de la interfaz cambian al nuevo idioma inmediatamente

**Reglas de negocio**

- El idioma por defecto es español (`lang = "es"`). Al cambiar el idioma, la selección se persiste en localStorage.
- El idioma afecta también a los action chips de navegación del chat.
- **[HAL-048 — NUEVO]** Al cambiar el idioma, el system prompt enviado al LLM incluye instrucciones en el idioma seleccionado para que Elaia responda en ese idioma. El idioma del system prompt es gestionado por `translations.ts` bajo la clave `systemPrompt.language`.
- El idioma seleccionado se incluye en el AppContextPack enviado al LLM.

**Dependencias:** ProfileScreen.tsx, translations.ts, App.tsx (lang state), ChatScreen.tsx (AppContextPack)

**Notas técnicas:** `lang` state en `App.tsx` se pasa por props a cada componente. `const t = translations[lang].section` para acceso tipado.

---

### US-029 · Ver información del plan y privacidad · SP: 2

**Como** usuario autenticado
**Quiero** ver qué plan tengo activo (FREE o PRO) y entender qué datos comparte la app
**Para** tomar decisiones informadas sobre mi privacidad y conocer los beneficios de mi plan

#### Criterios de Aceptación

**Escenario principal**

> Dado que estoy en ProfileScreen
> Cuando navego a la sección de plan y privacidad
> Entonces se muestra el plan activo del usuario (FREE o PRO), un resumen de qué datos se envían a Langfuse según el plan, y las diferencias de funcionalidades

**Reglas de negocio**

- Plan FREE muestra aviso: "Los mensajes de chat se envían a Langfuse de forma completamente anónima para mejorar la calidad de Elaia".
- Plan PRO muestra aviso: "Solo metadata técnica (latencia, tokens) se envía a Langfuse — el contenido de tus conversaciones permanece privado".
- Se muestra claramente que el journal, memory cards y summaries NUNCA salen del dispositivo, independientemente del plan.
- **[HAL-049 — CRÍTICO]** Se provee información clara sobre los derechos del usuario: enlace a la política de privacidad y mecanismo de solicitud de eliminación de datos (cumplimiento GDPR/LGPD). El usuario puede solicitar la eliminación de sus datos de Langfuse desde esta sección. ⚠️ *Requiere definición del proceso de eliminación de datos con el PO.*
- **[HAL-056 — NUEVO]** Desde esta sección el usuario puede: (a) eliminar individualmente sus memory cards, (b) eliminar todos sus summaries. Ambas acciones requieren confirmación y son irreversibles.

**Dependencias:** ProfileScreen.tsx, planUtils.ts, translations.ts

**Notas técnicas:** `planUtils.ts` contiene `getUserPlan()` que determina FREE o PRO.

---

## Épica 9 — PWA & Instalación · Service Worker + manifest.json + InstallPrompt.tsx

### US-030 · Instalar Elaia como PWA en el dispositivo · SP: 3

**Como** usuario autenticado en mobile o desktop
**Quiero** instalar Elaia como aplicación en la pantalla de inicio de mi dispositivo
**Para** acceder a Elaia directamente desde mi home screen como una app nativa sin abrir el navegador

#### Criterios de Aceptación

**Escenario principal**

> Dado que uso Elaia desde un navegador compatible con PWA (Chrome, Safari iOS, Edge)
> Cuando el evento `beforeinstallprompt` se dispara por primera vez y el usuario no lo descartó previamente (verificado en localStorage)
> Entonces `InstallPrompt.tsx` muestra un CTA de instalación en la parte inferior de la pantalla

**Reglas de negocio**

- Al aceptar la instalación, la PWA se agrega a la pantalla de inicio con el ícono, nombre y splash screen definidos en `manifest.json`.
- Si el usuario descarta el CTA de instalación, no vuelve a aparecer en la sesión actual.
- En iOS Safari se muestra un instructivo manual de "Agregar a pantalla de inicio" desde el menú de compartir.
- **[HAL-050]** El CTA de instalación se muestra la primera vez que el evento `beforeinstallprompt` se dispara, siempre que el usuario no lo haya descartado previamente (estado persistido en localStorage bajo la clave `elaia_install_dismissed`).
- **[HAL-051 — NUEVO]** Si la app ya está instalada en el dispositivo (modo standalone activo — `window.matchMedia("(display-mode: standalone)").matches`), el CTA de instalación no se muestra.

**Dependencias:** InstallPrompt.tsx, manifest.json, Service Worker

**Notas técnicas:** El evento `beforeinstallprompt` se captura en window. `manifest.json` define `name: "Elaia"`, `theme_color` con lavender.

---

### US-031 · Uso offline de funciones core · SP: 3

**Como** usuario autenticado sin conexión a internet
**Quiero** usar las funciones principales de Elaia (journal, relax, insights) sin necesitar internet
**Para** mantener el acceso a mis herramientas de bienestar en todo momento, incluso sin conexión

#### Criterios de Aceptación

**Escenario principal**

> Dado que instalé Elaia como PWA y abro la app sin conexión a internet
> Cuando navego entre Home, Journal, Relax e Insights
> Entonces todas estas pantallas cargan correctamente desde el caché del Service Worker sin mostrar errores de red

**Reglas de negocio**

- El chat muestra el historial local guardado sin conexión, pero el input está deshabilitado con un mensaje indicando que se necesita conexión para enviar mensajes nuevos.
- Las funciones offline (journal, relax, insights) muestran un indicador visual sutil de estado "sin conexión" sin interrumpir la experiencia.
- Al recuperar la conexión, el chat se reactiva automáticamente sin necesidad de recargar la app.
- **[HAL-055 — NUEVO]** Cuando secureStorage supera el 80% de su cuota, se muestra advertencia al usuario. Al superar el 100%, se bloquea el guardado y se ofrece la opción de exportar o eliminar datos.

**Dependencias:** US-030 (PWA), Service Worker, ChatScreen.tsx, useJournal.ts, insightsCalculations.ts

**Notas técnicas:** El Service Worker usa estrategia cache-first para assets estáticos y network-only para las llamadas a `/api/*`.

---

## 📅 Control de Versiones

| Versión | Fecha | Descripción |
|---|---|---|
| v1.0 | Marzo 2026 | Versión original — 31 historias, 9 épicas |
| v1.1 | Marzo 2026 | Refinamiento post revisión estática — 56 hallazgos procesados |

## ℹ️ Metadata

| Campo | Valor |
|---|---|
| Autor | Gian — QA Engineer |
| Trazabilidad | `static-tests/refinamiento_HU.md` |
| Hallazgos incorporados | 56 / 56 |
| Estado | ✅ Estable para escritura de test cases |