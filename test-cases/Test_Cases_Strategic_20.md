# ELAIA — Test Cases Estratégicos
## 20 Casos de Prueba Seleccionados para Automatización
**v1.1 · Marzo 2026 · Repositorio: elaia-qa-portfolio**

> Selección de los 20 casos más estratégicos del backlog completo (61 TCs).
> El archivo completo con todos los casos está en `test-cases/Elaia_TestCases_v1_1.xlsx`.
> Trazabilidad completa en `static-tests/refinamiento_HU.md`.

---

## Criterios de selección

| Criterio | Descripción |
|---|---|
| **Cobertura de disciplinas** | QA Funcional · Automation · API Testing · LLM/AI Quality |
| **Diferenciación de portfolio** | Payload inspection, cifrado local, context engineering, offline-first |
| **Automatizabilidad** | 16 automatizados con Playwright + MSW · 4 ejecución manual documentada |
| **Trazabilidad** | Cada TC referencia HU v1.1 y hallazgos de revisión estática (HAL) |

---

## Índice por Bloque

| Bloque | TCs | Automatización |
|---|---|---|
| 🔐 EP1 — Autenticación | TC-001, TC-003, TC-005, TC-006, TC-010, TC-026 | 5 auto · 1 manual |
| 📓 EP3 — Journal | TC-019, TC-020, TC-021, TC-022, TC-056 | 5 auto |
| 💬 EP4 — Chat + LLM | TC-023, TC-024, TC-025, TC-029, TC-030 | 4 auto · 1 manual |
| 🧘 EP5 — Relax / Contextual AI | TC-036, TC-037 | 2 manual |
| 🔒 Seguridad | TC-057, TC-058 | 2 auto |

---

## 🔐 EP1 — Autenticación

---

### TC-001 — Registro exitoso con email y contraseña válidos

| Campo | Detalle |
|---|---|
| **Épica** | EP1 – Auth |
| **Tipo** | Funcional |
| **Automatización** | ✅ Playwright |
| **US** | US-001 |
| **HAL Ref.** | HAL-001 |

**Objetivo**
Verificar que un usuario nuevo puede registrarse con email único y contraseña que cumple política de seguridad, creando cuenta en Firebase y redirigiendo a HomeScreen.

**Prerequisitos / Setup**
Ambiente staging activo. Email `qa_new_001@elaia.test` no registrado en Firebase.

**Datos de prueba**
- Email: `qa_new_001@elaia.test`
- Contraseña: `Test@1234`
- Nombre: `QA Tester`

**Pasos de ejecución**
1. Navegar a AuthScreen.
2. Seleccionar "Registrarse".
3. Ingresar nombre, email y contraseña.
4. Activar toggle "Recordarme".
5. Presionar "Registrarse".

**Resultados esperados**
- Cuenta creada en Firebase Auth.
- Redirección a HomeScreen.
- Nombre visible en saludo.
- Sesión persiste al reabrir navegador (Recordarme activo).

---

### TC-003 — Registro rechazado — política de contraseña (AVL + particiones)

| Campo | Detalle |
|---|---|
| **Épica** | EP1 – Auth |
| **Tipo** | Funcional |
| **Automatización** | ✅ Playwright |
| **US** | US-001 |
| **HAL Ref.** | HAL-001 |

**Objetivo**
Verificar validación de política de contraseña con análisis de valores límite: 8 chars mínimo, 1 mayúscula, 1 número, 1 especial.

**Prerequisitos / Setup**
AuthScreen accesible.

**Datos de prueba**

| Contraseña | Condición | Resultado esperado |
|---|---|---|
| `Test@12` | 7 caracteres | ❌ Rechazada |
| `Test@123` | 8 caracteres (límite exacto) | ✅ Aceptada |
| `test@1234` | Sin mayúscula | ❌ Rechazada |
| `Test@abcd` | Sin número | ❌ Rechazada |
| `TestABCD1` | Sin especial | ❌ Rechazada |

**Pasos de ejecución**
1. Ir a AuthScreen → "Registrarse".
2. Ingresar email válido no registrado.
3. Probar cada contraseña de la tabla.
4. Presionar "Registrarse" y observar resultado.

**Resultados esperados**
- Contraseñas inválidas muestran validación en línea con motivo específico.
- Solo `Test@123` es aceptada (límite exacto: 8 chars + todos los requisitos).

---

### TC-005 — Login exitoso con email/contraseña — sesión con y sin Recordarme

| Campo | Detalle |
|---|---|
| **Épica** | EP1 – Auth |
| **Tipo** | Funcional |
| **Automatización** | ✅ Playwright |
| **US** | US-002 |
| **HAL Ref.** | HAL-003 |

**Objetivo**
Verificar redirección a HomeScreen y comportamiento de persistencia de sesión según toggle Recordarme.

**Prerequisitos / Setup**
Usuario `qa_free@elaia.test` registrado con contraseña `Test@1234`.

**Datos de prueba**
- Email: `qa_free@elaia.test`
- Contraseña: `Test@1234`

**Pasos de ejecución**
1. AuthScreen → "Iniciar sesión".
2. Ingresar credenciales con "Recordarme" activo.
3. Verificar HomeScreen.
4. Cerrar y reabrir navegador → verificar sesión.
5. Repetir con "Recordarme" inactivo.

**Resultados esperados**
- Con Recordarme: sesión persiste tras reapertura del navegador.
- Sin Recordarme: debe re-autenticarse.
- En ambos casos: redirección correcta a HomeScreen.

---

### TC-006 — Login fallido con credenciales incorrectas

| Campo | Detalle |
|---|---|
| **Épica** | EP1 – Auth |
| **Tipo** | Funcional |
| **Automatización** | ✅ Playwright |
| **US** | US-002 |
| **HAL Ref.** | HAL-005 |

**Objetivo**
Verificar mensajes de error diferenciados para email inexistente y contraseña incorrecta.

**Prerequisitos / Setup**
Usuario `qa_free@elaia.test` registrado.

**Datos de prueba**
- Caso A: Email `noexiste@elaia.test` / Contraseña `Test@1234`
- Caso B: Email `qa_free@elaia.test` / Contraseña `WrongPass@1`

**Pasos de ejecución**
1. AuthScreen → "Iniciar sesión".
2. Ingresar credenciales de cada caso.
3. Verificar mensaje de error.

**Resultados esperados**
- Caso A: error "usuario no encontrado".
- Caso B: error "contraseña incorrecta".
- Sin redirección a HomeScreen en ningún caso.

---

### TC-010 — Cierre de sesión exitoso — redirección y persistencia de datos locales

| Campo | Detalle |
|---|---|
| **Épica** | EP1 – Auth |
| **Tipo** | Funcional |
| **Automatización** | ✅ Playwright |
| **US** | US-004 |
| **HAL Ref.** | HAL-004 |

**Objetivo**
Verificar que el logout redirige a AuthScreen, limpia estado UI y mantiene datos encriptados en secureStorage.

**Prerequisitos / Setup**
Sesión activa con `qa_free@elaia.test`. Al menos 1 entrada de journal.

**Datos de prueba**
N/A

**Pasos de ejecución**
1. Navegar a ProfileScreen.
2. Presionar "Cerrar sesión".
3. Confirmar acción.
4. Verificar pantalla resultante.
5. DevTools → Application → localStorage → verificar datos.
6. Intentar navegar a `/home`.

**Resultados esperados**
- Redirección a AuthScreen.
- Estado UI limpio (sin nombre ni foto del usuario).
- Datos journal persisten en localStorage (encriptados, namespaceados por UID).
- `/home` redirige a AuthScreen.

---

### TC-026 — Chat — redirección a AuthScreen con token Firebase expirado

| Campo | Detalle |
|---|---|
| **Épica** | EP1 – Auth / EP4 – Chat |
| **Tipo** | Funcional |
| **Automatización** | 🖐 Manual — token revocado vía Firebase Console no es scripteable |
| **US** | US-012 |
| **HAL Ref.** | HAL-019 |

**Objetivo**
Verificar que al enviar mensaje con token expirado se muestra aviso de re-autenticación y se redirige a AuthScreen.

**Prerequisitos / Setup**
Revocar manualmente token de `qa_free@elaia.test` en Firebase Console.

**Datos de prueba**
- Mensaje: `Mensaje con token expirado`

**Pasos de ejecución**
1. Login con `qa_free@elaia.test`.
2. Revocar token en Firebase Console.
3. Sin cerrar app, ir a `/chat`.
4. Enviar mensaje.
5. Observar respuesta.

**Resultados esperados**
- Aviso de sesión expirada visible.
- Redirección a AuthScreen.

> **Nota de automatización:** Para cobertura automatizada de este flujo, usar MSW interceptando `/api/chat/text` con respuesta 401. Ese enfoque testea el manejo del error en el cliente pero no el flujo real de expiración de token Firebase.

---

## 📓 EP3 — Journal

---

### TC-019 — Crear nueva entrada de journal — flujo completo

| Campo | Detalle |
|---|---|
| **Épica** | EP3 – Journal |
| **Tipo** | Funcional |
| **Automatización** | ✅ Playwright |
| **US** | US-009 |
| **HAL Ref.** | — |

**Objetivo**
Verificar creación de entrada con texto, mood y guardado encriptado en secureStorage.

**Prerequisitos / Setup**
Sesión activa. Journal vacío o con entradas previas.

**Datos de prueba**
- Texto: `Entrada de prueba completa con reflexión del día.`
- Mood: `2`

**Pasos de ejecución**
1. Navegar a `/journal`.
2. Presionar botón de nueva entrada.
3. Ingresar texto y seleccionar mood 2.
4. Presionar "Guardar".
5. Verificar entrada en timeline.
6. DevTools → Application → localStorage → verificar clave encriptada.

**Resultados esperados**
- Entrada en timeline con texto y mood correctos.
- Valor en localStorage encriptado (no texto plano).
- `latestEntry` actualizado.

---

### TC-020 — Editar entrada de journal existente

| Campo | Detalle |
|---|---|
| **Épica** | EP3 – Journal |
| **Tipo** | Funcional |
| **Automatización** | ✅ Playwright |
| **US** | US-010 |
| **HAL Ref.** | HAL-017 |

**Objetivo**
Verificar que los campos de una entrada existente son editables y los cambios persisten encriptados.

**Prerequisitos / Setup**
Sesión activa. TC-019 completado (entrada existente en journal).

**Datos de prueba**
- Texto editado: `Texto modificado para prueba de edición.`
- Mood: `5`

**Pasos de ejecución**
1. `/journal` → seleccionar entrada de TC-019.
2. Presionar editar.
3. Modificar texto y mood.
4. Presionar "Guardar".
5. Verificar actualización en timeline.

**Resultados esperados**
- Entrada muestra texto y mood actualizados.
- Valor en localStorage actualizado (encriptado).
- Si era `latestEntry`, el chat usará el contenido editado en el próximo request.

---

### TC-021 — Eliminar entrada de journal

| Campo | Detalle |
|---|---|
| **Épica** | EP3 – Journal |
| **Tipo** | Funcional |
| **Automatización** | ✅ Playwright |
| **US** | US-009 |
| **HAL Ref.** | — |

**Objetivo**
Verificar eliminación de entrada y su remoción del timeline y secureStorage.

**Prerequisitos / Setup**
Sesión activa. TC-019 completado.

**Datos de prueba**
- ID de la entrada creada en TC-019.

**Pasos de ejecución**
1. `/journal` → seleccionar entrada de TC-019.
2. Opción de eliminar → confirmar.
3. Verificar timeline.
4. DevTools → Application → localStorage → verificar que la clave no existe.

**Resultados esperados**
- Entrada desaparece del timeline.
- Clave eliminada de localStorage.
- Demás entradas intactas.

---

### TC-022 — Journal offline — crear y visualizar entradas sin conexión

| Campo | Detalle |
|---|---|
| **Épica** | EP3 – Journal |
| **Tipo** | Funcional / Offline-first |
| **Automatización** | ✅ Playwright (`context.setOffline(true)`) |
| **US** | US-011 |
| **HAL Ref.** | HAL-018 |

**Objetivo**
Verificar funcionamiento offline-first: entradas visibles y creación nueva sin red; sin sincronización al reconectar.

**Prerequisitos / Setup**
Sesión activa. ≥3 entradas pre-cargadas en el journal.

**Datos de prueba**
- Texto offline: `Entrada creada sin conexión a internet.`
- Mood: `3`

**Pasos de ejecución**
1. DevTools → Network → "Offline".
2. Navegar a `/journal`.
3. Verificar entradas existentes visibles.
4. Crear nueva entrada con texto y mood.
5. Verificar en timeline.
6. Restaurar red.
7. Verificar que el timeline no cambia.

**Resultados esperados**
- Entradas existentes visibles offline.
- Nueva entrada creada y guardada correctamente.
- Al reconectar: mismo contenido, sin mensajes de sincronización.

---

### TC-056 — Seguridad — datos en localStorage encriptados con AES

| Campo | Detalle |
|---|---|
| **Épica** | Seguridad |
| **Tipo** | Seguridad |
| **Automatización** | ✅ Playwright |
| **US** | Todas |
| **HAL Ref.** | HAL-052, HAL-055 |

**Objetivo**
Verificar que todos los valores sensibles en localStorage están encriptados y no contienen PII legible.

**Prerequisitos / Setup**
Sesión activa con entradas de journal y memory cards.

**Datos de prueba**
- Texto de prueba: `Texto de prueba visible`

**Pasos de ejecución**
1. Login con `qa_free@elaia.test`.
2. Crear entrada de journal con el texto de prueba.
3. DevTools → Application → Local Storage.
4. Inspeccionar todos los valores de las claves `elaia_*`.

**Resultados esperados**
- Ningún valor muestra `Texto de prueba visible` en texto plano.
- Claves de storage pueden ser visibles pero valores siempre encriptados (cipher AES).

---

## 💬 EP4 — Chat + LLM

---

### TC-023 — Chat — enviar mensaje y recibir respuesta con typing indicator

| Campo | Detalle |
|---|---|
| **Épica** | EP4 – Chat |
| **Tipo** | Funcional |
| **Automatización** | 🖐 Manual — depende de Gemini API real (latencia variable, costo de API) |
| **US** | US-012 |
| **HAL Ref.** | HAL-019 |

**Objetivo**
Verificar que el mensaje se envía, el typing indicator aparece y Elaia responde en el idioma configurado.

**Prerequisitos / Setup**
Sesión activa. Red activa. Gemini API disponible en staging.

**Datos de prueba**
- Mensaje: `Hola Elaia, ¿cómo puedes ayudarme hoy?`

**Pasos de ejecución**
1. Navegar a `/chat`.
2. Ingresar mensaje.
3. Presionar "Enviar".
4. Observar typing indicator.
5. Esperar respuesta completa.

**Resultados esperados**
- Burbuja de usuario visible con el texto enviado.
- Typing indicator durante procesamiento.
- Respuesta de Elaia en español.
- Historial actualizado con ambos mensajes.

> **Nota de automatización:** Flaky por latencia variable de Gemini. Cubrir como smoke manual en staging o con contrato de API separado con respuesta mockeada.

---

### TC-024 — Rate limiting — límite de 10 requests/min; mensaje permanece en input

| Campo | Detalle |
|---|---|
| **Épica** | EP4 – Chat |
| **Tipo** | Funcional / API |
| **Automatización** | ✅ Playwright + MSW |
| **US** | US-013 |
| **HAL Ref.** | HAL-021, HAL-023 |

**Objetivo**
Verificar HTTP 429 con `reason: user_rate_limit` al superar 10 requests en 60s; el mensaje permanece en el input para reenvío.

**Prerequisitos / Setup**
Sesión activa. Upstash Redis activo en staging.

**Datos de prueba**
- Mensaje corto: `test` (repetir 11 veces en < 60s)

**Pasos de ejecución**
1. `/chat` → enviar 10 mensajes consecutivos en < 60s.
2. Intentar enviar mensaje número 11.
3. Observar respuesta del sistema.

**Resultados esperados**
- En intento 11: error de rate limit con indicación `user_rate_limit`.
- Mensaje permanece en el campo de texto para reenvío manual.
- No se realiza llamada al LLM.

---

### TC-025 — Rate limiting — distinción user_rate_limit vs ip_rate_limit

| Campo | Detalle |
|---|---|
| **Épica** | EP4 – Chat |
| **Tipo** | Funcional / API |
| **Automatización** | ✅ Playwright + MSW |
| **US** | US-013 |
| **HAL Ref.** | HAL-022 |

**Objetivo**
Verificar que los mensajes de error de rate limit distinguen entre límite de usuario y límite de IP con textos diferenciados.

**Prerequisitos / Setup**
Mock del endpoint `/api/chat/text` con MSW configurado para retornar ambos tipos de 429.

**Datos de prueba**
- Mock 1: `{ status: 429, body: { reason: 'user_rate_limit' } }`
- Mock 2: `{ status: 429, body: { reason: 'ip_rate_limit' } }`

**Pasos de ejecución**
1. Configurar MSW con `user_rate_limit`.
2. Enviar mensaje → verificar texto del error en pantalla.
3. Reconfigurar MSW con `ip_rate_limit`.
4. Enviar mensaje → verificar texto del error en pantalla.

**Resultados esperados**
- `user_rate_limit`: mensaje de límite personal (ej: "Enviaste demasiados mensajes...").
- `ip_rate_limit`: mensaje de actividad excesiva desde la red.
- Ambos textos son distintos y comprensibles para el usuario.

---

### TC-029 — Memory card — usuario FREE no recibe inyección en contextPack

| Campo | Detalle |
|---|---|
| **Épica** | EP4 – Chat |
| **Tipo** | Funcional / LLM Quality |
| **Automatización** | ✅ Playwright (Network interception) |
| **US** | US-014 |
| **HAL Ref.** | — |

**Objetivo**
Verificar que usuarios FREE no tienen memory cards en el payload enviado al LLM — validación de contrato de API saliente.

**Prerequisitos / Setup**
Sesión activa con `qa_free@elaia.test` (plan FREE).

**Datos de prueba**
- Mensaje: `Me llamo Ana y soy médica.`

**Pasos de ejecución**
1. `/chat` con usuario FREE.
2. DevTools → Network → abrir log de requests.
3. Enviar mensaje.
4. Inspeccionar payload del request a `/api/chat/text`.

**Resultados esperados**
- Payload no contiene sección `memoryCards` o la contiene vacía.
- Elaia responde normalmente pero sin contexto de memoria personal.

---

### TC-030 — Summary — generación al superar 50 mensajes; sin duplicados para el mismo rango

| Campo | Detalle |
|---|---|
| **Épica** | EP4 – Chat |
| **Tipo** | Funcional / LLM Quality |
| **Automatización** | ✅ Playwright (pre-seeded state) |
| **US** | US-015 |
| **HAL Ref.** | HAL-026, HAL-027 |

**Objetivo**
Verificar generación de summary tras 50 mensajes sin resumir y que no se generan summaries duplicados para el mismo rango.

**Prerequisitos / Setup**
Usuario PRO con exactamente 49 mensajes sin summary previo (estado pre-cargado en fixture).

**Datos de prueba**
- Mensaje 50: `Este es el mensaje número 50.`
- Mensaje 51: `Este es el mensaje número 51.`

**Pasos de ejecución**
1. `/chat` con usuario PRO (49 mensajes pre-cargados en secureStorage).
2. Enviar mensaje 50 → verificar summary en localStorage.
3. Enviar mensaje 51 → verificar que no existe segundo summary para el mismo rango.

**Resultados esperados**
- Summary encriptado creado en localStorage tras superar 50 mensajes.
- Summary cubre rango `fromMessageId → toMessageId`.
- No se genera duplicado para el mismo rango al enviar el mensaje 51.

---

## 🧘 EP5 — Relax / Contextual AI

---

### TC-036 — Breathing Exercise — completar ciclos; sesión marcada como completada en AppContextPack

| Campo | Detalle |
|---|---|
| **Épica** | EP5 – Relax |
| **Tipo** | Funcional / LLM Context |
| **Automatización** | 🖐 Manual — ejercicio dura 70s reales (5 ciclos × 14s), invasivo de mockear |
| **US** | US-018 |
| **HAL Ref.** | HAL-034 |

**Objetivo**
Verificar flujo completo del ejercicio y que el AppContextPack registra la sesión como `completada`.

**Prerequisitos / Setup**
Sesión activa.

**Datos de prueba**
- Ciclos: 5 (4s inhala / 4s sostén / 6s exhala = 70s total por sesión)

**Pasos de ejecución**
1. `/relax` → "Breathing Exercise".
2. Completar todos los ciclos sin interrumpir.
3. Verificar redirección a `/relax`.
4. `/chat` → enviar mensaje → inspeccionar payload en Network tab.

**Resultados esperados**
- Redirección a `/relax` tras completar todos los ciclos.
- AppContextPack contiene `breathingSession: { status: "completada" }`.
- Elaia puede referenciar el ejercicio completado en su respuesta.

> **Nota de automatización:** Mockear el timer de ciclos requiere exponer una variable de entorno `VITE_BREATHING_CYCLE_MS` en el código de producción. Decisión de arquitectura pendiente con Dev.

---

### TC-037 — Breathing Exercise — abandonar a mitad; sesión marcada como interrumpida

| Campo | Detalle |
|---|---|
| **Épica** | EP5 – Relax |
| **Tipo** | Funcional / LLM Context |
| **Automatización** | 🖐 Manual — misma razón que TC-036 |
| **US** | US-018 |
| **HAL Ref.** | HAL-034 |

**Objetivo**
Verificar que salir antes de completar todos los ciclos registra la sesión como `interrumpida` en el AppContextPack.

**Prerequisitos / Setup**
Sesión activa.

**Datos de prueba**
- N/A (salir durante el primer ciclo)

**Pasos de ejecución**
1. `/relax` → "Breathing Exercise".
2. Iniciar ejercicio.
3. Durante el primer ciclo: presionar botón de regreso.
4. `/chat` → enviar mensaje → inspeccionar payload en Network tab.

**Resultados esperados**
- Redirección a `/relax`.
- AppContextPack contiene `breathingSession: { status: "interrumpida" }` (distinto de TC-036).

---

## 🔒 Seguridad

---

### TC-057 — Seguridad — aislamiento de datos por namespace de firebaseUid

| Campo | Detalle |
|---|---|
| **Épica** | Seguridad |
| **Tipo** | Seguridad |
| **Automatización** | ✅ Playwright (multi-context) |
| **US** | Todas |
| **HAL Ref.** | HAL-004, HAL-052 |

**Objetivo**
Verificar que un usuario no puede acceder a los datos locales de otro usuario en el mismo navegador mediante namespace por `firebaseUid`.

**Prerequisitos / Setup**
Dos cuentas: `qa_free@elaia.test` y `qa_pro@elaia.test`. Mismo navegador.

**Datos de prueba**
- Entrada usuario A: `Entrada privada de usuario A - no debe ser visible para B.`

**Pasos de ejecución**
1. Login con usuario A → crear entrada de journal.
2. Logout.
3. Login con usuario B.
4. `/journal` → verificar que la entrada de A no aparece.

**Resultados esperados**
- Usuario B no ve datos de usuario A en el timeline.
- Namespace `elaia_journal_{firebaseUid}` aísla correctamente los datos entre usuarios.

---

### TC-058 — Seguridad — no exfiltración de datos del journal por red

| Campo | Detalle |
|---|---|
| **Épica** | Seguridad |
| **Tipo** | Seguridad |
| **Automatización** | ✅ Playwright (Network interception) |
| **US** | US-008 / US-009 |
| **HAL Ref.** | HAL-055 |

**Objetivo**
Verificar que las entradas del journal no generan requests de red al visualizar el timeline — arquitectura 100% local.

**Prerequisitos / Setup**
Sesión activa con entradas pre-cargadas en el journal.

**Datos de prueba**
N/A

**Pasos de ejecución**
1. DevTools → Network → limpiar log de requests.
2. Navegar a `/journal` y desplazarse por el timeline completo.
3. Revisar todos los requests de red registrados.

**Resultados esperados**
- Sin requests de red al cargar o visualizar las entradas del journal.
- Solo requests de autenticación Firebase o recursos estáticos (assets del SW).

---

## 📊 Resumen

| Métrica | Valor |
|---|---|
| Total casos estratégicos | 20 |
| Automatizables (Playwright + MSW) | 16 |
| Ejecución manual documentada | 4 |
| Épicas cubiertas | 5 |
| HU referenciadas | 12 |
| HAL refs. incluidas | 15 |

### Distribución por tipo

| Tipo | Cantidad |
|---|---|
| Funcional | 13 |
| Seguridad | 4 |
| LLM / AI Quality | 3 |
| Offline-first | 1 |
| API / Payload Inspection | 2 |

### Por qué estos 20

Los 4 casos manuales (TC-023, TC-026, TC-036, TC-037) no se automatizan por razones técnicas específicas — no por falta de criterio. TC-023 depende de la API de Gemini en staging con latencia variable. TC-026 requiere revocación manual de token en Firebase Console. TC-036 y TC-037 requieren esperar 70 segundos reales de animación o instrumentar el código de producción para exponer el timer, lo cual es invasivo. Documentar estas decisiones es parte del criterio senior en QA.

---

*Test Cases Estratégicos — ELAIA v1.1 · QA Engineer: Gian · Marzo 2026*
*Backlog completo: `test-cases/Elaia_TestCases_v1_1.xlsx`*