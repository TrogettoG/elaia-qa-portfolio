# 🔍 Hallazgos — Revisión Estática · Elaia v1.0

> Documento generado a partir de la revisión estática de las 31 Historias de Usuario y el Plan de Pruebas de Elaia v1.0.  
> Total de hallazgos: **56** · Fuente de verdad: `hallazgos_revision_estatica_elaia_v1.csv`

---

## 📊 Resumen Ejecutivo

### Por Severidad

| Severidad | Cantidad |
|---|---|
| 🔴 Crítica | 5 |
| 🟠 Alta | 17 |
| 🟡 Media | 27 |
| 🔵 Baja | 5 |
| **Total** | **56** |

### Por Tipo de Defecto

| Tipo | Cantidad |
|---|---|
| ⬜ Omisión | 24 |
| 🔶 Ambigüedad | 20 |
| ❌ Contradicción | 5 |
| 🚫 No Testable | 4 |
| 📝 Terminología | 2 |
| ♻️ Duplicado | 1 |

---

## 🔴 Hallazgos Críticos

> Estos hallazgos bloquean la escritura de test cases válidos o representan riesgos de seguridad para el usuario.

### HAL-026 — 🔶 Ambigüedad / Omisión · US-015

**Problema:** El CA principal dice 'más de N mensajes sin resumir' pero el valor de N no está definido en la US. El Plan de Pruebas (sección 10) identifica esto como ambigüedad y asume N=50, pero dicho supuesto no ha sido incorporado a la US.

**Impacto:** QA no puede escribir casos de prueba de frontera sin el valor exacto de N; el supuesto de N=50 puede ser incorrecto.

**Recomendación:** Definir explícitamente el valor de N en la US-015. Si N=50 es el valor acordado, documentarlo en el CA: 'Dado que tengo más de 50 mensajes sin resumir desde el último summary...'

---

### HAL-035 — ⬜ Omisión · US-019

**Problema:** El panic button es una funcionalidad de seguridad crítica pero no se especifica qué sucede si el número de línea de crisis está hardcodeado y el usuario está en un país diferente al configurado. No hay CA para manejo multi-región.

**Impacto:** Usuarios de otras regiones pueden llamar a una línea de crisis incorrecta durante una emergencia.

**Recomendación:** Agregar CA o nota de diseño: 'El número de línea de crisis es configurable por región/idioma. Si no existe un número configurado para la región del usuario, se muestra el número por defecto con indicación del país de cobertura.' Coordinar con PO.

---

### HAL-041 — ⬜ Omisión · US-024

**Problema:** No se especifica la validación del número de teléfono al agregar un contacto de emergencia. Un número inválido podría resultar en una llamada fallida durante una situación de crisis.

**Impacto:** Riesgo crítico de seguridad del usuario: un número mal ingresado podría ser inutilizable en una emergencia.

**Recomendación:** Agregar CA: 'El campo de teléfono valida que el número sea un número de teléfono válido (formato internacional o local) antes de guardar. Si el formato es inválido, se muestra un error en línea y no se guarda el contacto.'

---

### HAL-045 — ❌ Contradicción · US-026

**Problema:** El CA dice 'SupportScreen no se muestra como overlay en las pantallas fullscreen (Chat, Breathing, Panic)'. Sin embargo, la nota técnica de US-024 dice que SupportScreen 'no es una ruta — es un overlay controlado por isSupportOpen'. El CA de US-026 incluye Chat como pantalla donde el overlay no está disponible, pero ChatScreen sí muestra el header global según US-005 (navigation pill con 5 tabs incluyendo Chat).

**Impacto:** Comportamiento inconsistente e indeterminado del acceso a soporte desde el chat; puede ser un riesgo de seguridad si el usuario no puede acceder a soporte durante una conversación de crisis.

**Recomendación:** Clarificar: ¿ChatScreen muestra el header global con el ícono ShieldAlert? Si sí, el overlay DEBE estar disponible desde Chat (especialmente en una app de salud mental). Alinear US-026 con el comportamiento real del header en ChatScreen.

---

### HAL-049 — ⬜ Omisión · US-029

**Problema:** La US describe qué datos se envían a Langfuse por plan, pero no especifica si el usuario puede optar por no enviar datos (opt-out) ni si existe una política de retención o eliminación de datos en Langfuse.

**Impacto:** Riesgo de cumplimiento regulatorio (GDPR/LGPD) si no existe mecanismo de opt-out o eliminación de datos del usuario.

**Recomendación:** Agregar CA: 'El usuario dispone de información clara sobre si puede optar por no enviar datos a Langfuse. Si aplica regulación GDPR/LGPD, se provee enlace a política de privacidad y mecanismo de solicitud de eliminación de datos.'

---

## 📋 Todos los Hallazgos

| ID | Tipo | US | Severidad | Descripción resumida |
|---|---|---|---|---|
| HAL-001 | Ambigüedad | US-001 | 🟠 Alta | La frase 'contraseña segura' en el enunciado principal no define qué se entiende por segur… |
| HAL-002 | Omisión | US-001 | 🟠 Alta | No se especifica qué sucede si Firebase no está disponible durante el registro (error de r… |
| HAL-003 | Ambigüedad | US-001 | 🟡 Media | La nota técnica menciona 'browserSessionPersistence según el toggle rememberMe', pero los … |
| HAL-004 | Contradicción | US-001 / US-004 | 🟡 Media | US-001 CA dice 'datos locales encriptados (journal, chat, memory cards) permanecen en loca… |
| HAL-005 | Omisión | US-002 | 🟠 Alta | No se especifica qué ocurre cuando un usuario intenta iniciar sesión con una cuenta creada… |
| HAL-006 | Omisión | US-002 | 🟠 Alta | No se define un límite de intentos fallidos de login. La nota técnica menciona manejar aut… |
| HAL-007 | Ambigüedad | US-003 | 🟠 Alta | El CA dice 'se crea o vincula la cuenta' pero no especifica qué sucede si el email de Goog… |
| HAL-008 | No Testable | US-003 | 🟡 Media | El CA 'El nombre y foto de perfil de Google se recuperan del displayName y photoURL del Us… |
| HAL-009 | Omisión | US-004 | 🟡 Media | No se especifica el comportamiento cuando el cierre de sesión falla (por ejemplo, error de… |
| HAL-010 | Ambigüedad | US-004 | 🟡 Media | El CA dice 'Cuando presiono el botón Cerrar sesión y confirmo la acción' pero el criterio … |
| HAL-011 | Ambigüedad | US-005 | 🟠 Alta | El CA principal dice 'accesos a las demás secciones' sin especificar cuáles secciones dist… |
| HAL-012 | Contradicción | US-005 / US-022 | 🟠 Alta | US-005 dice 'se muestra el contador de días consecutivos en el dashboard (cuando el compon… |
| HAL-013 | Contradicción | US-006 / US-007 | 🟡 Media | US-006 CA dice: 'Si el usuario no escribe texto pero selecciona un mood e intenta guardar,… |
| HAL-014 | Ambigüedad | US-006 | 🟡 Media | El CA dice 'el latestEntry se actualiza en estado global y queda disponible como contexto … |
| HAL-015 | Omisión | US-008 | 🟠 Alta | No se especifica el comportamiento cuando la desencriptación falla (clave AES incorrecta o… |
| HAL-016 | Ambigüedad | US-009 | 🔵 Baja | La nota técnica dice 'addEntry() genera un ID único para cada entrada' pero no especifica … |
| HAL-017 | Omisión | US-010 | 🟡 Media | No se define qué ocurre si se edita una entrada que está siendo usada como latestEntry en … |
| HAL-018 | No Testable | US-011 | 🟡 Media | El CA 'Al recuperar la conexión, no se requiere sincronización ya que los datos son 100% l… |
| HAL-019 | Omisión | US-012 | 🟠 Alta | No se especifica el comportamiento del chat cuando el usuario está autenticado pero la ses… |
| HAL-020 | Ambigüedad | US-012 | 🟡 Media | La nota técnica dice 'Respuesta se renderiza con typing indicator via streaming o delays a… |
| HAL-021 | Contradicción | US-012 / US-013 | 🟠 Alta | US-012 CA dice 'FREE retiene 200 msgs, PRO retiene 5000 msgs'. US-013 dice 'Dado que envié… |
| HAL-022 | Ambigüedad | US-013 | 🔵 Baja | El CA dice 'El mensaje de error distingue entre límite de usuario y límite de IP' pero la … |
| HAL-023 | Omisión | US-013 | 🟡 Media | No se especifica qué sucede con el mensaje del usuario cuando el rate limit activa: ¿se de… |
| HAL-024 | Ambigüedad | US-014 | 🟠 Alta | El CA dice 'el LLM extrae ese hecho como memory card' pero no especifica en qué momento ex… |
| HAL-025 | Ambigüedad | US-014 | 🟠 Alta | El CA de contradicción de memory cards dice 'reemplaza a la anterior manteniendo la confia… |
| HAL-026 | Ambigüedad / Omisión | US-015 | 🔴 Crítica | El CA principal dice 'más de N mensajes sin resumir' pero el valor de N no está definido e… |
| HAL-027 | No Testable | US-015 | 🟡 Media | El CA 'Cada summary almacena fromMessageId y toMessageId para evitar procesar el mismo ran… |
| HAL-028 | Omisión | US-016 | 🟡 Media | No se define la duración máxima de grabación de audio. Tampoco se especifica qué ocurre si… |
| HAL-029 | Omisión | US-016 | 🟡 Media | No se especifica si el texto transcrito del audio aparece visible en el chat como mensaje … |
| HAL-030 | Ambigüedad | US-016 | 🔵 Baja | La nota técnica dice 'Solo últimos 30 msgs guardan audioData'. No está claro si audioData … |
| HAL-031 | Omisión | US-017 | 🔵 Baja | No se especifica qué sucede si el usuario reproduce TTS y luego cierra la pantalla de chat… |
| HAL-032 | Omisión | US-017 | 🟡 Media | No se define la duración máxima de texto que puede procesarse con TTS. Respuestas muy larg… |
| HAL-033 | Ambigüedad | US-018 | 🟡 Media | Los 'ciclos configurables' del ejercicio de respiración se mencionan en el CA principal pe… |
| HAL-034 | Ambigüedad | US-018 | 🟡 Media | El CA dice 'El botón de regreso lleva al usuario a /relax sin interrumpir abruptamente — e… |
| HAL-035 | Omisión | US-019 | 🔴 Crítica | El panic button es una funcionalidad de seguridad crítica pero no se especifica qué sucede… |
| HAL-036 | No Testable | US-020 | 🟡 Media | El CA 'Si se añaden nuevas herramientas de relajación en el futuro, el hub las integra aut… |
| HAL-037 | Ambigüedad | US-021 | 🟡 Media | El CA dice 'con al menos 3 entradas de journal' en el Given pero no especifica si esas 3 e… |
| HAL-038 | Omisión | US-021 | 🟡 Media | No se define qué tipo de promedio se usa para calcular el mood promedio del período (media… |
| HAL-039 | Ambigüedad | US-022 | 🟠 Alta | El CA dice 'si la racha se rompe (más de 24 horas sin actividad)'. No está definido qué cu… |
| HAL-040 | Ambigüedad | US-022 | 🟡 Media | El CA usa 'período seleccionado' para emoción dominante pero no está claro si el período a… |
| HAL-041 | Omisión | US-024 | 🔴 Crítica | No se especifica la validación del número de teléfono al agregar un contacto de emergencia… |
| HAL-042 | Omisión | US-024 | 🟡 Media | No se define el número máximo de contactos personales que un usuario puede agregar. Sin es… |
| HAL-043 | Ambigüedad | US-024 | 🟡 Media | La US cubre agregar, editar, eliminar y reordenar en un solo ticket (SP:5). Los CA de edit… |
| HAL-044 | Omisión | US-025 | 🟠 Alta | El número de la línea de crisis está 'hardcodeado en la config o translations' según la no… |
| HAL-045 | Contradicción | US-026 | 🔴 Crítica | El CA dice 'SupportScreen no se muestra como overlay en las pantallas fullscreen (Chat, Br… |
| HAL-046 | Omisión | US-027 | 🟡 Media | No se especifica el tamaño máximo ni los formatos de archivo permitidos para la foto de pe… |
| HAL-047 | Omisión | US-027 | 🟡 Media | No se especifica si el nombre de perfil tiene restricciones (longitud mínima/máxima, carac… |
| HAL-048 | Omisión | US-028 | 🟡 Media | No se especifica el comportamiento del idioma del sistema de prompts enviados al LLM (Gemi… |
| HAL-049 | Omisión | US-029 | 🔴 Crítica | La US describe qué datos se envían a Langfuse por plan, pero no especifica si el usuario p… |
| HAL-050 | Ambigüedad | US-030 | 🟡 Media | El CA dice 'Dado que uso Elaia desde un navegador compatible con PWA (Chrome, Safari iOS, … |
| HAL-051 | Omisión | US-030 | 🔵 Baja | No se define el comportamiento si el usuario ya instaló la PWA y vuelve a acceder desde el… |
| HAL-052 | Terminología | Múltiples US | 🟠 Alta | Se usan indistintamente los términos 'localStorage', 'secureStorage' y 'secureStorage.ts' … |
| HAL-053 | Terminología | US-013 / US-021 | 🟠 Alta | La épica 6 (Insights) y US-021 referencian la ruta '/analysis' pero el sumario de épicas (… |
| HAL-054 | Duplicado | US-006 / US-009 | 🟡 Media | Tanto US-006 (Registrar mood desde Home) como US-009 (Crear nueva entrada de journal) desc… |
| HAL-055 | Omisión | Todas las US con datos sensibles | 🟠 Alta | Ninguna US especifica el comportamiento cuando el usuario borra los datos del navegador (C… |
| HAL-056 | Omisión | US-014 / US-015 / US-029 | 🟠 Alta | No existe ninguna US ni CA que cubra la eliminación de memory cards o summaries por parte … |

---

## 📝 Detalle Completo por Hallazgo

### 🔴 Crítica (5 hallazgos)

#### HAL-026 · US-015

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad / Omisión |
| **Severidad** | 🔴 Crítica |
| **US Afectada** | US-015 |

**Descripción del Problema**

El CA principal dice 'más de N mensajes sin resumir' pero el valor de N no está definido en la US. El Plan de Pruebas (sección 10) identifica esto como ambigüedad y asume N=50, pero dicho supuesto no ha sido incorporado a la US.

**Impacto Potencial**

QA no puede escribir casos de prueba de frontera sin el valor exacto de N; el supuesto de N=50 puede ser incorrecto.

**Recomendación**

Definir explícitamente el valor de N en la US-015. Si N=50 es el valor acordado, documentarlo en el CA: 'Dado que tengo más de 50 mensajes sin resumir desde el último summary...'

---

#### HAL-035 · US-019

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🔴 Crítica |
| **US Afectada** | US-019 |

**Descripción del Problema**

El panic button es una funcionalidad de seguridad crítica pero no se especifica qué sucede si el número de línea de crisis está hardcodeado y el usuario está en un país diferente al configurado. No hay CA para manejo multi-región.

**Impacto Potencial**

Usuarios de otras regiones pueden llamar a una línea de crisis incorrecta durante una emergencia.

**Recomendación**

Agregar CA o nota de diseño: 'El número de línea de crisis es configurable por región/idioma. Si no existe un número configurado para la región del usuario, se muestra el número por defecto con indicación del país de cobertura.' Coordinar con PO.

---

#### HAL-041 · US-024

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🔴 Crítica |
| **US Afectada** | US-024 |

**Descripción del Problema**

No se especifica la validación del número de teléfono al agregar un contacto de emergencia. Un número inválido podría resultar en una llamada fallida durante una situación de crisis.

**Impacto Potencial**

Riesgo crítico de seguridad del usuario: un número mal ingresado podría ser inutilizable en una emergencia.

**Recomendación**

Agregar CA: 'El campo de teléfono valida que el número sea un número de teléfono válido (formato internacional o local) antes de guardar. Si el formato es inválido, se muestra un error en línea y no se guarda el contacto.'

---

#### HAL-045 · US-026

| Campo | Detalle |
|---|---|
| **Tipo** | ❌ Contradicción |
| **Severidad** | 🔴 Crítica |
| **US Afectada** | US-026 |

**Descripción del Problema**

El CA dice 'SupportScreen no se muestra como overlay en las pantallas fullscreen (Chat, Breathing, Panic)'. Sin embargo, la nota técnica de US-024 dice que SupportScreen 'no es una ruta — es un overlay controlado por isSupportOpen'. El CA de US-026 incluye Chat como pantalla donde el overlay no está disponible, pero ChatScreen sí muestra el header global según US-005 (navigation pill con 5 tabs incluyendo Chat).

**Impacto Potencial**

Comportamiento inconsistente e indeterminado del acceso a soporte desde el chat; puede ser un riesgo de seguridad si el usuario no puede acceder a soporte durante una conversación de crisis.

**Recomendación**

Clarificar: ¿ChatScreen muestra el header global con el ícono ShieldAlert? Si sí, el overlay DEBE estar disponible desde Chat (especialmente en una app de salud mental). Alinear US-026 con el comportamiento real del header en ChatScreen.

---

#### HAL-049 · US-029

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🔴 Crítica |
| **US Afectada** | US-029 |

**Descripción del Problema**

La US describe qué datos se envían a Langfuse por plan, pero no especifica si el usuario puede optar por no enviar datos (opt-out) ni si existe una política de retención o eliminación de datos en Langfuse.

**Impacto Potencial**

Riesgo de cumplimiento regulatorio (GDPR/LGPD) si no existe mecanismo de opt-out o eliminación de datos del usuario.

**Recomendación**

Agregar CA: 'El usuario dispone de información clara sobre si puede optar por no enviar datos a Langfuse. Si aplica regulación GDPR/LGPD, se provee enlace a política de privacidad y mecanismo de solicitud de eliminación de datos.'

---

### 🟠 Alta (18 hallazgos)

#### HAL-001 · US-001

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-001 |

**Descripción del Problema**

La frase 'contraseña segura' en el enunciado principal no define qué se entiende por segura. El CA solo especifica mínimo 8 caracteres pero no menciona requisitos de complejidad (mayúsculas

**Impacto Potencial**

 números

**Recomendación**

Desarrollo puede implementar políticas de contraseña inconsistentes; QA no puede definir casos de prueba de frontera completos.

---

#### HAL-002 · US-001

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-001 |

**Descripción del Problema**

No se especifica qué sucede si Firebase no está disponible durante el registro (error de red / timeout). Solo se cubre el error de email duplicado y validaciones del formulario.

**Impacto Potencial**

El usuario puede perder datos del formulario sin feedback claro en caso de falla de infraestructura.

**Recomendación**

Agregar CA: 'Si Firebase no responde (timeout, error de red), se muestra un mensaje de error genérico y el formulario conserva los datos ingresados para reintentar.'

---

#### HAL-005 · US-002

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-002 |

**Descripción del Problema**

No se especifica qué ocurre cuando un usuario intenta iniciar sesión con una cuenta creada por Google OAuth (US-003). El sistema podría no tener contraseña asociada y la respuesta de error no está documentada.

**Impacto Potencial**

Experiencia de usuario confusa para usuarios OAuth que intentan acceder con email/password; posible exposición de información de proveedor.

**Recomendación**

Agregar CA: 'Si el email corresponde a una cuenta registrada únicamente con Google OAuth, se muestra un mensaje indicando que debe usar el método de autenticación correcto.'

---

#### HAL-006 · US-002

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-002 |

**Descripción del Problema**

No se define un límite de intentos fallidos de login. La nota técnica menciona manejar auth/user-not-found y auth/wrong-password pero no hay bloqueo de cuenta ni CAPTCHA después de N intentos fallidos.

**Impacto Potencial**

Riesgo de ataque de fuerza bruta; el Plan de Pruebas (sección Seguridad) menciona OWASP ZAP pero la US no define el requisito.

**Recomendación**

Definir política de bloqueo: 'Después de X intentos fallidos consecutivos se bloquea el intento por Y minutos o se muestra CAPTCHA.' Coordinar con el equipo de seguridad.

---

#### HAL-007 · US-003

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-003 |

**Descripción del Problema**

El CA dice 'se crea o vincula la cuenta' pero no especifica qué sucede si el email de Google ya existe en Firebase con proveedor email/password (cuenta mixta). Solo cubre el caso de cuenta Google ya vinculada.

**Impacto Potencial**

Comportamiento indeterminado para cuentas con múltiples proveedores; puede generar duplicación o error no controlado.

**Recomendación**

Agregar CA explícito: 'Si el email de Google ya existe como cuenta email/password en Firebase, el sistema ofrece vinculación de proveedores o muestra un mensaje indicando el método de login original.'

---

#### HAL-011 · US-005

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-005 |

**Descripción del Problema**

El CA principal dice 'accesos a las demás secciones' sin especificar cuáles secciones distintas a journal y mood tracker están accesibles desde HomeScreen. La nota de racha dice 'cuando el componente visual esté implementado — ítem pendiente del roadmap', lo que implica un requisito no terminado en producción.

**Impacto Potencial**

QA no puede verificar qué secciones deben estar presentes. El ítem pendiente del roadmap introduce ambigüedad sobre la completitud del criterio.

**Recomendación**

Listar explícitamente todas las secciones accesibles desde HomeScreen. Mover el CA de racha a una US futura o marcarlo claramente como condicional con fecha de implementación.

---

#### HAL-012 · US-005 / US-022

| Campo | Detalle |
|---|---|
| **Tipo** | ❌ Contradicción |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-005 / US-022 |

**Descripción del Problema**

US-005 dice 'se muestra el contador de días consecutivos en el dashboard (cuando el componente visual esté implementado — ítem pendiente)'. US-022 documenta el cálculo de racha como funcionalidad completa. No es claro si la racha en Home está o no implementada en v1.0.

**Impacto Potencial**

Confusión sobre el scope de la versión v1.0. QA puede marcar como defecto algo que es trabajo pendiente intencionalmente.

**Recomendación**

Clarificar explícitamente en US-005 si la racha en HomeScreen está incluida en v1.0 o es deuda técnica. Si es deuda, eliminar el CA o moverlo a una US separada del roadmap.

---

#### HAL-015 · US-008

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-008 |

**Descripción del Problema**

No se especifica el comportamiento cuando la desencriptación falla (clave AES incorrecta o datos corruptos en secureStorage). El sistema podría mostrar datos ilegibles o crashear.

**Impacto Potencial**

Pérdida de datos visible para el usuario; puede revelar datos corruptos sin feedback adecuado.

**Recomendación**

Agregar CA: 'Si la desencriptación de una o más entradas falla, esa entrada se omite del timeline mostrando un indicador de error en su lugar, sin crashear la pantalla.'

---

#### HAL-019 · US-012

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-012 |

**Descripción del Problema**

No se especifica el comportamiento del chat cuando el usuario está autenticado pero la sesión de Firebase ha expirado (token revocado). El endpoint /api/chat/text probablemente valida el token.

**Impacto Potencial**

Llamadas al chat con token expirado sin manejo de error; el usuario puede no saber que su sesión expiró.

**Recomendación**

Agregar CA: 'Si el token de sesión Firebase ha expirado al enviar un mensaje, se muestra un aviso solicitando re-autenticación y se redirige a AuthScreen.'

---

#### HAL-021 · US-012 / US-013

| Campo | Detalle |
|---|---|
| **Tipo** | ❌ Contradicción |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-012 / US-013 |

**Descripción del Problema**

US-012 CA dice 'FREE retiene 200 msgs, PRO retiene 5000 msgs'. US-013 dice 'Dado que envié más de 10 requests en los últimos 60 segundos'. El rate limit de 10 req/min en US-013 aplica por 'anonymousUserId' pero US-012 implica que el chat requiere autenticación Firebase. No está definido cómo se relaciona anonymousUserId con firebaseUid.

**Impacto Potencial**

Implementación y QA pueden interpretar de forma diferente qué identidad se usa para el rate limiting; posible bypass del rate limit con sesión autenticada.

**Recomendación**

Clarificar si anonymousUserId es el firebaseUid del usuario autenticado o un ID separado para usuarios no autenticados. Especificar si el rate limit de 10 req/min aplica también a usuarios autenticados PRO.

---

#### HAL-024 · US-014

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-014 |

**Descripción del Problema**

El CA dice 'el LLM extrae ese hecho como memory card' pero no especifica en qué momento exacto ocurre la extracción: ¿después de cada mensaje, de manera periódica, o al final de la sesión?

**Impacto Potencial**

QA no puede definir el escenario preciso para verificar cuándo una memory card es creada; el comportamiento asíncrono puede causar falsos negativos en pruebas.

**Recomendación**

Especificar el trigger de extracción: 'Tras cada intercambio usuario-Elaia, el sistema evalúa asincrónicamente si hay hechos relevantes para extraer como memory cards.'

---

#### HAL-025 · US-014

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-014 |

**Descripción del Problema**

El CA de contradicción de memory cards dice 'reemplaza a la anterior manteniendo la confianza más alta entre ambas'. Si la nueva card tiene confianza más alta que la anterior que reemplaza, ¿se toma la confianza de la nueva o de la anterior? La redacción es ambigua.

**Impacto Potencial**

Comportamiento indeterminado del sistema de memoria; puede generar respuestas inconsistentes de Elaia.

**Recomendación**

Reformular: 'Si una nueva memory card contradice una existente y tiene mayor confianza, reemplaza a la anterior con la confianza de la nueva card. Si tiene menor confianza, se descarta la nueva.'

---

#### HAL-039 · US-022

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-022 |

**Descripción del Problema**

El CA dice 'si la racha se rompe (más de 24 horas sin actividad)'. No está definido qué cuenta como 'actividad' para la racha: ¿solo entradas de journal, cualquier interacción con la app, uso del chat, breathing, etc.?

**Impacto Potencial**

El cálculo de racha puede diferir entre lo esperado por el usuario y lo implementado; QA no puede definir escenarios de prueba precisos.

**Recomendación**

Definir explícitamente qué acciones cuentan como actividad para mantener la racha: p.ej., 'La racha se mantiene si el usuario crea al menos una entrada de journal en el día calendario (00:00-23:59 hora local).'

---

#### HAL-044 · US-025

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-025 |

**Descripción del Problema**

El número de la línea de crisis está 'hardcodeado en la config o translations' según la nota técnica, pero no existe ningún CA que especifique cuál es el número configurado, el país de cobertura o cómo se actualiza si la línea cambia.

**Impacto Potencial**

QA no tiene referencia para verificar que el número correcto está configurado; el Plan de Pruebas (sección 10) también señala esta ambigüedad.

**Recomendación**

Especificar en la US: el número de línea de crisis de referencia, el país/región de cobertura y el mecanismo de actualización (variable de entorno, archivo de configuración). Alternativamente referenciar el documento de configuración.

---

#### HAL-052 · Múltiples US

| Campo | Detalle |
|---|---|
| **Tipo** | 📝 Terminología |
| **Severidad** | 🟠 Alta |
| **US Afectada** | Múltiples US |

**Descripción del Problema**

Se usan indistintamente los términos 'localStorage', 'secureStorage' y 'secureStorage.ts' para referirse al mismo mecanismo de almacenamiento local encriptado. No está claro si secureStorage es un wrapper sobre localStorage, IndexedDB u otro mecanismo.

**Impacto Potencial**

Confusión entre desarrollo y QA sobre qué API de almacenamiento inspeccionar durante pruebas; los CA que dicen 'localStorage' pueden referirse en realidad a secureStorage encriptado.

**Recomendación**

Definir un glosario de términos en el documento de US: 'secureStorage: wrapper AES sobre localStorage. Cuando los CA o notas mencionan localStorage, se refieren al secureStorage a menos que se indique explícitamente lo contrario.'

---

#### HAL-053 · US-013 / US-021

| Campo | Detalle |
|---|---|
| **Tipo** | 📝 Terminología |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-013 / US-021 |

**Descripción del Problema**

La épica 6 (Insights) y US-021 referencian la ruta '/analysis' pero el sumario de épicas (tabla de épicas) la llama 'InsightsScreen' y la tab de navegación se llama 'Insights'. La ruta '/analysis' no aparece en el listado de rutas de la navigation pill (Home/Journal/Chat/Relax/Insights).

**Impacto Potencial**

Inconsistencia en la nomenclatura de rutas que puede causar implementación incorrecta del router y pruebas E2E fallidas.

**Recomendación**

Unificar la nomenclatura: definir si la ruta es '/insights' o '/analysis' y usarla consistentemente en todas las US, la navigation pill y el router de la aplicación.

---

#### HAL-055 · Todas las US con datos sensibles

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟠 Alta |
| **US Afectada** | Todas las US con datos sensibles |

**Descripción del Problema**

Ninguna US especifica el comportamiento cuando el usuario borra los datos del navegador (Clear site data) o cuando localStorage alcanza su cuota (estimada en 5-10 MB). El Plan de Pruebas menciona 'localStorage lleno' en US-009 pero solo como error de guardado, no como estrategia general.

**Impacto Potencial**

Pérdida total de datos de usuario sin previo aviso; comportamiento indeterminado del sistema ante falta de espacio.

**Recomendación**

Agregar una US o CA transversal: 'Cuando el almacenamiento local supera el 80% de su cuota, la app muestra una advertencia al usuario. Cuando se supera el 100%, muestra un error y permite al usuario exportar sus datos antes de que sean eliminados.'

---

#### HAL-056 · US-014 / US-015 / US-029

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟠 Alta |
| **US Afectada** | US-014 / US-015 / US-029 |

**Descripción del Problema**

No existe ninguna US ni CA que cubra la eliminación de memory cards o summaries por parte del usuario. US-029 menciona privacidad pero solo en términos de lo que se envía a Langfuse, no en términos de borrado de datos locales por el usuario.

**Impacto Potencial**

El usuario no tiene control sobre su historial de memoria de IA; potencial problema de privacidad y control de datos personales (GDPR Art. 17).

**Recomendación**

Agregar US o CA: 'El usuario puede eliminar individualmente sus memory cards y puede borrar todos sus summaries desde la sección de privacidad en ProfileScreen.'

---

### 🟡 Media (28 hallazgos)

#### HAL-003 · US-001

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-001 |

**Descripción del Problema**

La nota técnica menciona 'browserSessionPersistence según el toggle rememberMe', pero los CA dicen 'opción Recordarme seleccionada'. No queda claro si 'Recordarme' es un checkbox visible o una opción implícita; tampoco si existe por defecto activo o inactivo.

**Impacto Potencial**

El comportamiento de sesión puede diferir entre lo diseñado y lo implementado; genera inconsistencia con US-002 que también referencia 'Recordarme'.

**Recomendación**

Especificar: (1) Estado por defecto del toggle Recordarme (activo/inactivo). (2) Si el elemento es visible en el formulario de registro.

---

#### HAL-004 · US-001 / US-004

| Campo | Detalle |
|---|---|
| **Tipo** | ❌ Contradicción |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-001 / US-004 |

**Descripción del Problema**

US-001 CA dice 'datos locales encriptados (journal, chat, memory cards) permanecen en localStorage'. US-004 Notas técnicas dice 'datos están namespaceados por firebaseUid y se recuperan al volver a iniciar sesión'. Sin embargo en US-001 no existe el escenario de logout durante registro — es una historia de registro. El CA de persistencia de datos al logout está duplicado en la US equivocada.

**Impacto Potencial**

Confusión entre desarrollo y QA sobre qué historia cubre el comportamiento de datos al cerrar sesión. Riesgo de defecto en limpieza de datos.

**Recomendación**

El CA '● Al cerrar sesión, los datos locales encriptados permanecen en localStorage' pertenece exclusivamente a US-004. Debe eliminarse de US-001 o aclararse el contexto.

---

#### HAL-008 · US-003

| Campo | Detalle |
|---|---|
| **Tipo** | 🚫 No Testable |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-003 |

**Descripción del Problema**

El CA 'El nombre y foto de perfil de Google se recuperan del displayName y photoURL del User object de Firebase' describe comportamiento interno de Firebase y no un comportamiento observable desde el usuario.

**Impacto Potencial**

El QA no puede verificar directamente los campos internos del objeto User sin acceso a consola o herramientas de desarrollo; el CA mezcla implementación con comportamiento.

**Recomendación**

Reformular como comportamiento de usuario observable: 'Tras el login con Google, el nombre de perfil visible en HomeScreen coincide con el nombre de la cuenta Google, y la foto de perfil muestra la imagen de Google.'

---

#### HAL-009 · US-004

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-004 |

**Descripción del Problema**

No se especifica el comportamiento cuando el cierre de sesión falla (por ejemplo, error de red al llamar a auth.signOut()). Tampoco se cubre el caso de sesión ya expirada cuando el usuario presiona 'Cerrar sesión'.

**Impacto Potencial**

El usuario puede quedar en un estado inconsistente (UI muestra sesión activa pero Firebase ya la cerró).

**Recomendación**

Agregar CA: 'Si auth.signOut() falla por error de red, se muestra un mensaje de error y el usuario permanece en ProfileScreen con sesión activa.'

---

#### HAL-010 · US-004

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-004 |

**Descripción del Problema**

El CA dice 'Cuando presiono el botón Cerrar sesión y confirmo la acción' pero el criterio de regla de negocio dice 'No se muestra la pantalla de confirmación de cierre si el botón está deshabilitado'. No queda claro cuándo el botón está deshabilitado ni bajo qué condiciones.

**Impacto Potencial**

QA no puede cubrir el flujo de confirmación completo sin saber cuándo el botón se deshabilita.

**Recomendación**

Especificar las condiciones exactas bajo las cuales el botón 'Cerrar sesión' aparece deshabilitado. Si no hay casos, eliminar ese CA para evitar confusión.

---

#### HAL-013 · US-006 / US-007

| Campo | Detalle |
|---|---|
| **Tipo** | ❌ Contradicción |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-006 / US-007 |

**Descripción del Problema**

US-006 CA dice: 'Si el usuario no escribe texto pero selecciona un mood e intenta guardar, se muestra un aviso indicando que el texto es requerido.' US-007 CA dice: 'Si el usuario intenta guardar sin seleccionar un mood, se bloquea la acción.' Esto implica que texto Y mood son ambos requeridos, pero cada US cubre solo la ausencia del otro campo. No existe CA para el caso donde AMBOS campos están vacíos.

**Impacto Potencial**

Casos de prueba incompletos; el comportamiento con formulario completamente vacío no está especificado.

**Recomendación**

Agregar en ambas US (o en una US consolidada) el CA: 'Si tanto el texto como el mood están vacíos al intentar guardar, se muestran ambas validaciones en línea simultáneamente.'

---

#### HAL-014 · US-006

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-006 |

**Descripción del Problema**

El CA dice 'el latestEntry se actualiza en estado global y queda disponible como contexto para el siguiente request al chat de Elaia (máximo 300 caracteres)'. No se especifica si el truncado a 300 chars ocurre en el momento de guardar o en el momento de enviar al chat.

**Impacto Potencial**

Comportamiento diferente en almacenamiento vs. envío al LLM; puede afectar la integridad de los datos del journal.

**Recomendación**

Especificar explícitamente en qué momento se aplica el truncado de 300 caracteres: '...se trunca a 300 caracteres antes de incluirse en el AppContextPack, pero el texto completo se conserva en secureStorage.'

---

#### HAL-017 · US-010

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-010 |

**Descripción del Problema**

No se define qué ocurre si se edita una entrada que está siendo usada como latestEntry en el chat en tiempo real (mientras el usuario tiene el chat abierto en otra tab o sección).

**Impacto Potencial**

Estado inconsistente entre el contexto del chat y los datos del journal; potencial confusión del LLM.

**Recomendación**

Agregar CA: 'Si se edita la entrada que actúa como latestEntry, el contexto del chat se actualiza con el contenido editado en el próximo request.'

---

#### HAL-018 · US-011

| Campo | Detalle |
|---|---|
| **Tipo** | 🚫 No Testable |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-011 |

**Descripción del Problema**

El CA 'Al recuperar la conexión, no se requiere sincronización ya que los datos son 100% locales' no es testable como criterio de aceptación — describe una justificación arquitectónica, no un comportamiento observable.

**Impacto Potencial**

QA no puede ejecutar un caso de prueba contra esta afirmación; es documentación de diseño disfrazada de CA.

**Recomendación**

Reformular como comportamiento testable: 'Al recuperar la conexión a internet, el journal muestra las mismas entradas locales sin cambios ni mensajes de sincronización.'

---

#### HAL-020 · US-012

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-012 |

**Descripción del Problema**

La nota técnica dice 'Respuesta se renderiza con typing indicator via streaming o delays artificiales'. No está definido si la implementación usa streaming real de la API Gemini o delays simulados, lo que impacta los CA sobre el tiempo de respuesta.

**Impacto Potencial**

QA no puede validar si el behavior de typing es real o simulado; impacta pruebas de performance y UX.

**Recomendación**

Definir en el CA si la respuesta usa streaming real o simulado: esto afecta pruebas de corte de conexión durante la respuesta, manejo de errores parciales y tiempo de primera respuesta visible.

---

#### HAL-023 · US-013

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-013 |

**Descripción del Problema**

No se especifica qué sucede con el mensaje del usuario cuando el rate limit activa: ¿se descarta, se encola, o se conserva en el input para reenvío manual?

**Impacto Potencial**

El usuario puede perder el mensaje escrito si no hay manejo de estado del input al recibir un 429.

**Recomendación**

Agregar CA: 'Al recibir HTTP 429, el mensaje del usuario permanece en el campo de texto del chat para que pueda reenviarlo manualmente una vez que el límite se haya restablecido.'

---

#### HAL-027 · US-015

| Campo | Detalle |
|---|---|
| **Tipo** | 🚫 No Testable |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-015 |

**Descripción del Problema**

El CA 'Cada summary almacena fromMessageId y toMessageId para evitar procesar el mismo rango dos veces' es una restricción de implementación interna no observable por el usuario ni verificable via UI.

**Impacto Potencial**

QA solo puede verificar el efecto del comportamiento (que no se generan summaries duplicados)

**Recomendación**

Media

---

#### HAL-028 · US-016

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-016 |

**Descripción del Problema**

No se define la duración máxima de grabación de audio. Tampoco se especifica qué ocurre si el usuario graba en silencio (audio sin voz detectable).

**Impacto Potencial**

Grabaciones de larga duración pueden generar payloads que superen límites del endpoint; audio en silencio puede generar errores no controlados.

**Recomendación**

Agregar CA: 'La grabación tiene un límite máximo de X segundos. Si se supera, la grabación se detiene automáticamente. Si el audio no contiene voz detectable, se muestra el mensaje de error correspondiente.'

---

#### HAL-029 · US-016

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-016 |

**Descripción del Problema**

No se especifica si el texto transcrito del audio aparece visible en el chat como mensaje del usuario (igual que un mensaje de texto) o solo la respuesta de Elaia es visible.

**Impacto Potencial**

Comportamiento de UX indeterminado; el usuario no puede revisar si su mensaje de voz fue transcrito correctamente.

**Recomendación**

Agregar CA: 'La transcripción del audio aparece en el chat como un mensaje del usuario con un indicador de ícono de micrófono, permitiendo al usuario verificar que fue entendido correctamente.'

---

#### HAL-032 · US-017

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-017 |

**Descripción del Problema**

No se define la duración máxima de texto que puede procesarse con TTS. Respuestas muy largas del LLM pueden generar peticiones al endpoint /api/chat/tts con payloads excesivamente grandes.

**Impacto Potencial**

Posibles errores de timeout o fallo del endpoint para respuestas largas sin feedback claro al usuario.

**Recomendación**

Agregar CA: 'Si el texto de la respuesta supera X caracteres, el TTS procesa solo los primeros X caracteres e indica al usuario que el texto fue truncado para la reproducción.'

---

#### HAL-033 · US-018

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-018 |

**Descripción del Problema**

Los 'ciclos configurables' del ejercicio de respiración se mencionan en el CA principal pero no se especifica quién los configura (el usuario en tiempo real, o valores predefinidos en el sistema), ni cuáles son los valores por defecto.

**Impacto Potencial**

QA no puede definir qué valores de ciclo probar ni si existe una UI de configuración que deba verificarse.

**Recomendación**

Especificar: (1) Si los ciclos son configurables por el usuario via UI o son valores fijos del sistema. (2) Los valores por defecto (p.ej., inhala 4s, sostén 4s, exhala 4s). (3) Rango permitido si es configurable.

---

#### HAL-034 · US-018

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-018 |

**Descripción del Problema**

El CA dice 'El botón de regreso lleva al usuario a /relax sin interrumpir abruptamente — el estado de la sesión se marca como completada.' No está claro si presionar el botón de regreso antes de terminar todos los ciclos también marca la sesión como completada o como interrumpida.

**Impacto Potencial**

Comportamiento indeterminado en el AppContextPack enviado al chat; Elaia podría decir que el usuario completó un ejercicio que en realidad abandonó.

**Recomendación**

Distinguir dos casos: (1) Completar todos los ciclos → sesión marcada como 'completada'. (2) Salir antes de completar → sesión marcada como 'interrumpida'. Especificar qué se registra en AppContextPack para cada caso.

---

#### HAL-036 · US-020

| Campo | Detalle |
|---|---|
| **Tipo** | 🚫 No Testable |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-020 |

**Descripción del Problema**

El CA 'Si se añaden nuevas herramientas de relajación en el futuro, el hub las integra automáticamente siguiendo el mismo patrón de cards' describe comportamiento futuro hipotético, no un requisito testable en v1.0.

**Impacto Potencial**

No puede verificarse en el sprint actual; mezcla requisitos de arquitectura con criterios de aceptación de la US.

**Recomendación**

Mover este criterio a documentación de arquitectura o a un ADR (Architecture Decision Record). Reemplazar en la US por el CA específico de v1.0: 'El hub muestra exactamente dos cards: Breathing Exercise y Panic Button.'

---

#### HAL-037 · US-021

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-021 |

**Descripción del Problema**

El CA dice 'con al menos 3 entradas de journal' en el Given pero no especifica si esas 3 entradas deben estar dentro del período seleccionado (semana/mes actual) o en total histórico. Ya existe otro CA que dice 'si hay menos de 3 entradas en el período seleccionado, se muestra estado informativo', lo que implica que el requisito mínimo es por período y no global.

**Impacto Potencial**

Ambigüedad en el pre-condición del escenario principal; QA puede configurar datos de prueba incorrectos.

**Recomendación**

Aclarar el Given del escenario: 'Dado que navego a /analysis con al menos 3 entradas de journal dentro del período seleccionado actualmente...' Eliminar la contradicción con el CA de fallback.

---

#### HAL-038 · US-021

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-021 |

**Descripción del Problema**

No se define qué tipo de promedio se usa para calcular el mood promedio del período (media aritmética simple). Si un día tiene múltiples entradas con moods diferentes no se especifica si se promedian por día primero o se usan todos los valores directamente.

**Impacto Potencial**

Resultados de gráfico inconsistentes según la implementación elegida; puede generar defectos que sean difíciles de reproducir.

**Recomendación**

Especificar: 'El mood promedio del período se calcula como la media aritmética de todos los valores de mood (1-5) de las entradas del período, sin agrupar previamente por día.'

---

#### HAL-040 · US-022

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-022 |

**Descripción del Problema**

El CA usa 'período seleccionado' para emoción dominante pero no está claro si el período aquí hace referencia al mismo selector semana/mes de US-021 o si es un período fijo (todo el historial, últimos 30 días, etc.).

**Impacto Potencial**

Inconsistencia en la experiencia: el gráfico puede mostrar datos de semana mientras la emoción dominante muestra datos de todo el historial.

**Recomendación**

Especificar explícitamente: 'La emoción dominante, total de entradas y promedio de mood se calculan para el mismo período seleccionado (semana/mes) que el gráfico de barras.'

---

#### HAL-042 · US-024

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-024 |

**Descripción del Problema**

No se define el número máximo de contactos personales que un usuario puede agregar. Sin este límite no se pueden definir pruebas de frontera.

**Impacto Potencial**

QA no puede realizar pruebas de límite; desarrollo puede no implementar control de capacidad y generar problemas de rendimiento en secureStorage.

**Recomendación**

Especificar el máximo de contactos permitidos: 'El usuario puede agregar hasta X contactos personales. Si intenta agregar más, se muestra un mensaje indicando que se alcanzó el límite.'

---

#### HAL-043 · US-024

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-024 |

**Descripción del Problema**

La US cubre agregar, editar, eliminar y reordenar en un solo ticket (SP:5). Los CA de editar son escasos: solo dice 'editar sus datos con el mismo bottom sheet' sin especificar qué campos son editables (nombre, teléfono, ambos) ni si se pueden dejar campos vacíos al editar.

**Impacto Potencial**

CA de edición incompletos; QA no puede verificar validaciones de campos editados.

**Recomendación**

Ampliar los CA de edición: 'Al editar un contacto, ambos campos (nombre y teléfono) son editables. Las mismas validaciones de creación aplican. No se permiten campos vacíos al guardar la edición.'

---

#### HAL-046 · US-027

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-027 |

**Descripción del Problema**

No se especifica el tamaño máximo ni los formatos de archivo permitidos para la foto de perfil. El CA de error menciona 'archivo muy grande, formato no soportado' pero no define los límites concretos.

**Impacto Potencial**

QA no puede probar casos de frontera de tamaño y formato; el error puede mostrarse con mensajes genéricos sin guía al usuario.

**Recomendación**

Especificar: 'La foto de perfil acepta formatos JPG, PNG y WebP con un tamaño máximo de X MB. El mensaje de error especifica el motivo (tamaño excedido o formato no soportado).'

---

#### HAL-047 · US-027

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-027 |

**Descripción del Problema**

No se especifica si el nombre de perfil tiene restricciones (longitud mínima/máxima, caracteres permitidos, si puede estar vacío). Un nombre vacío podría romper el saludo en HomeScreen.

**Impacto Potencial**

Comportamiento indeterminado del saludo en HomeScreen si el nombre es vacío o contiene solo espacios.

**Recomendación**

Agregar CA: 'El nombre de perfil tiene un mínimo de 2 caracteres y un máximo de 50 caracteres. No puede guardarse vacío ni con solo espacios. Si el campo está vacío al guardar, se muestra validación en línea.'

---

#### HAL-048 · US-028

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-028 |

**Descripción del Problema**

No se especifica el comportamiento del idioma del sistema de prompts enviados al LLM (Gemini) cuando cambia el idioma. La US dice que el idioma se incluye en AppContextPack pero no define si el system prompt de Elaia también cambia de idioma o solo las instrucciones al LLM.

**Impacto Potencial**

Elaia puede responder en el idioma incorrecto si el system prompt está hardcodeado en un idioma.

**Recomendación**

Especificar: 'Al cambiar el idioma, el system prompt enviado al LLM incluye instrucciones en el idioma seleccionado para que Elaia responda en ese idioma. El idioma del system prompt es gestionado por translations.ts.'

---

#### HAL-050 · US-030

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-030 |

**Descripción del Problema**

El CA dice 'Dado que uso Elaia desde un navegador compatible con PWA (Chrome, Safari iOS, Edge) por primera vez'. No está definido qué significa 'por primera vez': ¿primera visita al dominio, primera sesión del navegador, primera vez que se cumplen los criterios de instalación (mínimo tiempo en app, visitas múltiples)?

**Impacto Potencial**

QA no puede reproducir consistentemente el trigger del prompt de instalación.

**Recomendación**

Especificar las condiciones exactas bajo las cuales se muestra el InstallPrompt: 'El CTA de instalación se muestra la primera vez que el evento beforeinstallprompt se dispara, siempre que el usuario no lo haya descartado previamente (verificado en localStorage).'

---

#### HAL-054 · US-006 / US-009

| Campo | Detalle |
|---|---|
| **Tipo** | ♻️ Duplicado |
| **Severidad** | 🟡 Media |
| **US Afectada** | US-006 / US-009 |

**Descripción del Problema**

Tanto US-006 (Registrar mood desde Home) como US-009 (Crear nueva entrada de journal) describen el proceso de guardar una entrada encriptada con mood, usando el mismo hook useJournal y la misma key de storage. Los CA son casi idénticos pero la UI es diferente (Home vs. /journal). No se documenta qué diferencia funcional existe entre ambas rutas de creación.

**Impacto Potencial**

Riesgo de comportamiento divergente si ambas US se implementan de forma separada sin componente compartido; duplicación de lógica de validación.

**Recomendación**

Documentar explícitamente las diferencias funcionales entre el 'quick entry' de Home y el 'full entry' de /journal (p.ej., prompt de reflexión guiada, tags, longitud mínima requerida). Si son idénticos funcionalmente, consolidarlos en una sola US con dos puntos de entrada.

---

### 🔵 Baja (5 hallazgos)

#### HAL-016 · US-009

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🔵 Baja |
| **US Afectada** | US-009 |

**Descripción del Problema**

La nota técnica dice 'addEntry() genera un ID único para cada entrada' pero no especifica el mecanismo de generación (UUID, timestamp-based, incremental). Esto impacta el comportamiento en escenarios de concurrencia (múltiples tabs abiertas).

**Impacto Potencial**

Posibles colisiones de ID si el mecanismo no es robusto; comportamiento indeterminado con múltiples tabs.

**Recomendación**

Especificar el mecanismo de generación de IDs (recomendado: crypto.randomUUID() o nanoid) para garantizar unicidad incluso en múltiples instancias.

---

#### HAL-022 · US-013

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🔵 Baja |
| **US Afectada** | US-013 |

**Descripción del Problema**

El CA dice 'El mensaje de error distingue entre límite de usuario y límite de IP' pero la nota técnica dice que el cliente debe mostrar el campo reason del body (user_rate_limit o ip_rate_limit). No se describe el texto exacto del mensaje ni el diseño del aviso para cada caso.

**Impacto Potencial**

QA no puede verificar correctitud del mensaje; desarrollo puede implementar textos ambiguos o sin distinción real.

**Recomendación**

Especificar el texto exacto (o al menos el tono/contenido mínimo) de cada mensaje de rate limit para que QA pueda validarlo: p.ej., 'Has enviado demasiados mensajes. Espera X segundos.' vs 'Se detectó demasiada actividad desde tu red.'

---

#### HAL-030 · US-016

| Campo | Detalle |
|---|---|
| **Tipo** | 🔶 Ambigüedad |
| **Severidad** | 🔵 Baja |
| **US Afectada** | US-016 |

**Descripción del Problema**

La nota técnica dice 'Solo últimos 30 msgs guardan audioData'. No está claro si audioData es el audio binario, la transcripción o ambos. Tampoco se define qué se conserva cuando se supera este límite.

**Impacto Potencial**

Comportamiento indeterminado del historial de audio; puede impactar el contexto enviado al LLM.

**Recomendación**

Especificar qué contiene audioData (binario, URL, transcripción) y qué ocurre con los mensajes de audio más antiguos al superar el límite de 30: '...los mensajes de audio anteriores al mensaje #30 conservan solo la transcripción de texto, sin el dato de audio.'

---

#### HAL-031 · US-017

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🔵 Baja |
| **US Afectada** | US-017 |

**Descripción del Problema**

No se especifica qué sucede si el usuario reproduce TTS y luego cierra la pantalla de chat antes de que finalice la reproducción. ¿El audio continúa o se detiene?

**Impacto Potencial**

Experiencia de usuario inesperada si el audio continúa reproduciéndose fuera de la pantalla de chat.

**Recomendación**

Agregar CA: 'Al navegar fuera de ChatScreen mientras hay audio TTS reproduciéndose, la reproducción se detiene automáticamente.'

---

#### HAL-051 · US-030

| Campo | Detalle |
|---|---|
| **Tipo** | ⬜ Omisión |
| **Severidad** | 🔵 Baja |
| **US Afectada** | US-030 |

**Descripción del Problema**

No se define el comportamiento si el usuario ya instaló la PWA y vuelve a acceder desde el navegador. ¿Se muestra nuevamente el CTA de instalación?

**Impacto Potencial**

Experiencia de usuario confusa: el CTA de instalación puede aparecer innecesariamente para usuarios que ya instalaron la app.

**Recomendación**

Agregar CA: 'Si la app ya está instalada en el dispositivo (modo standalone activo), el CTA de instalación no se muestra.'

---

## ℹ️ Metadata

| Campo | Valor |
|---|---|
| Documento revisado | Elaia User Stories v1.0 + Plan de Pruebas v1.0 |
| Fecha de revisión | Marzo 2026 |
| Revisado por | Gian — QA Engineer |
| Total hallazgos | 56 |
| Estado | 🟡 Pendiente refinamiento de HU |