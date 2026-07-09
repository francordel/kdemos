# Análisis: Rallly vs KDemos, por qué triunfó y qué copiamos

**Fecha:** 8 de julio de 2026
**Fuentes:** rallly.co, support.rallly.co, github.com/lukevella/rallly (código clonado y verificado), lukevella.com, entrevista Southern Oregon Business Journal, HN/Product Hunt/selfh.st.

---

## 1. La respuesta a "¿por qué él triunfó y yo no?"

**No fue de la noche a la mañana. Fue una década:**

| Año | Hito |
|---|---|
| 2015 | Crea Rallly (clon open source de Doodle). Su Show HN saca **4 puntos**. Fracaso. |
| 2015-2021 | **7 años** como side project gratuito, sin ingresos, creciendo solo por boca-oreja |
| 2022 | Reescritura completa (v2) y apuesta en serio. Empieza la era Docker/self-hosted |
| **2023** | **Primer euro de ingresos, 8 años después de crear el producto** (Rallly Pro, 5$/mes) |
| 2024 | 45.000 usuarios, a tiempo completo, "cero marketing" |
| 2026 | 182.000 usuarios, 300.000 encuestas, 5.154 estrellas GitHub. Y aún itera el modelo de negocio |

**Sus canales reales (por orden):**
1. **El producto ES el canal**: cada encuesta compartida expone la marca a N participantes sin fricción de registro. KDemos tiene exactamente el mismo loop.
2. **La comunidad open source / self-hosted**: AGPL + Docker (1,35M pulls) + awesome-selfhosted + selfh.st. Distribución gratuita continua.
3. **SEO contra el dominante**: landings `/best-doodle-alternative`, `/when2meet-alternative`, `/free-scheduling-poll`, localizadas. Su cuña: privacidad (Doodle gratis = anuncios + 144 trackers).
4. Lo que NO le funcionó: Hacker News (4 puntos), Product Hunt (marginal), X/build-in-public (**457 seguidores**).

**Traducción para KDemos:** no hay magia que nos falte, hay 10 años de compounding que aún no tenemos. Los tres canales son replicables y dos ya los tenemos en marcha (loop del producto + landings SEO en 13 idiomas). El tercero (comunidad open source) es una decisión pendiente: publicar el repo de KDemos con buen README + Docker + listarse en awesome-selfhosted.

---

## 2. Su modelo free vs Pro (verificado en el código)

Pro: 7 $/mes o 56 $/año. Las palancas de pago:

| Feature Pro de Rallly | Estado en KDemos |
|---|---|
| **Finalizar fecha** (elegir ganadora + invitación de calendario) | ✅ **Ya implementado GRATIS** (día definitivo + .ics + Google Calendar, sin emails porque no hay cuentas) |
| **Vida ilimitada de encuestas** (las gratis se borran a los 30 días de inactividad) | ✅ **KDemos nunca caduca**, ya lo gritamos en las landings |
| Duplicar encuesta | ⏳ Roadmap (fácil) |
| Ocultar votos hasta votar (anti-sesgo) | ⏳ Roadmap (media) |
| Ocultar nombres de participantes | ❓ Dudoso, va contra nuestra transparencia |
| Exigir email para votar | ❌ Nunca, va contra la esencia |
| Custom branding / Spaces B2B | ❌ No aplica sin cuentas |

Lo gratis de Rallly que nos faltaba y ya está: **exportar CSV** (implementado hoy).
Lo gratis de Rallly que nos falta aún: **comentarios** (dudoso: nuestro chat es WhatsApp) y **notificaciones email** (→ siguiente fase con login Google opcional).

## 3. Legalidad de copiar sus features de pago

- ✅ **Las funcionalidades no tienen copyright**: reimplementar "finalizar fecha", "duplicar", etc. con nuestro código y diseño es 100% legal. Es lo que él hizo con Doodle.
- ❌ **Su código es AGPL-3.0**: copiar código del repo obligaría a relicenciar KDemos entero como AGPL (y la cláusula de red obliga a publicar el fuente a todo usuario del SaaS). **No copiar ni una línea.**
- ❌ Marca y textos literales: tampoco.

## 4. Estrategia de blog (la suya, y la nuestra)

Su blog NO es SEO: es un **changelog de anuncios de producto** (4-6 posts/año: "Introducing Dark Mode", "Introducing Spaces"...). Su SEO vive en landings por keyword, **el mismo modelo que ya tenemos en KDemos** (alternativa-doodle, when2meet, rallly, encuesta-doodle-gratis + 11 landings de idioma). Conclusión: no estamos por detrás en modelo SEO; estamos por detrás en **antigüedad y autoridad**. Añadir al blog posts de anuncio de features (como el "día definitivo") completa la réplica.

## 5. Implementado hoy en KDemos (gratis, sin perder la esencia)

1. **Día definitivo**: cualquiera del grupo marca el día elegido (📌 en el diálogo del día); banner verde con la fecha; se guarda en el calendario para todos.
2. **Añadir al calendario**: descarga .ics + enlace directo Google Calendar desde el banner, la joya Pro de Rallly, sin necesitar email ni cuenta.
3. **Exportar CSV** de la disponibilidad de todos (botón en compartir).
4. Fix de robustez: los guardados ya no machacan campos del documento (updateMask).

## 6. Roadmap derivado (por orden)

1. **Login Google OPCIONAL + notificaciones email** cuando alguien vota (la única feature que justifica cuenta; votar seguirá sin registro). Requiere: Firebase Auth (solo Google) + proveedor de email (Resend, gratis hasta 100/día, verificar dominio kdemos.com) + párrafo de privacidad (RGPD aplica igualmente al guardar emails).
2. Duplicar calendario.
3. Ocultar votos hasta votar (toggle al crear).
4. Publicar el repo como open source (MIT) con README + Docker → awesome-selfhosted (el canal nº 2 de Rallly).
5. Mercado DACH: landing alemana ya existe; considerar más contenido de.
