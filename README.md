# LeafPro

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)

**La hoja, carácter por carácter.** Una aplicación para enseñar y aprender la morfología de la hoja: sus partes
(en la dicotiledónea y en el pasto), hojas simples y compuestas con el truco de la yema axilar, la filotaxia con un
simulador del ángulo de oro, un atlas de más de 110 términos ilustrados (formas, ápices, bases, márgenes, nervaduras,
composición, inserción y superficies), un constructor de hojas con descripción botánica redactada, autoevaluación
generativa y un modo clase para proyectar e imprimir. Los ocho bloques están completos (versión 1.0.0).

Todos los dibujos los genera un **motor paramétrico de hojas** dentro de la propia aplicación: cada término del atlas,
cada hoja del constructor y cada pregunta de la autoevaluación se dibujan al momento a partir de un modelo
(forma × ápice × base × margen × lobulación × nervadura), no hay fotografías ni imágenes fijas.

*English summary below.*

## Cómo abrirla

1. Haz doble clic en **`index.html`**. Se abre en tu navegador, en la portada. Todo funciona desde la copia local,
   sin servidor y sin conexión a internet.
2. Si tu institución bloquea las páginas abiertas como archivo, haz doble clic en **`Open LeafPro.bat`** (o ejecuta
   `server.ps1` con PowerShell): inicia un pequeño servidor en tu computadora y abre `http://localhost:9500`.
3. Las pruebas se abren igual: `tests/index.html` (todas deben salir en verde) y `tests/gallery.html` (la galería
   con todas las láminas dibujadas por el motor).

## Los ocho bloques

| Bloque | Contenido |
|---|---|
| 1 | Portada: los caracteres de la hoja, cada uno con su color en toda la app; desfile de hojas dibujadas por el motor y diagrama interactivo de las partes |
| 2 | Partes de la hoja: la hoja completa de una dicotiledónea y la hoja de un pasto (vaina, lígula, aurículas), etiqueta por etiqueta, con las funciones de cada parte y las formas de inserción en el tallo |
| 3 | Simple y compuesta: el truco de la yema axilar, el continuo de entera a compuesta (lobada → partida → secta → folíolos) y los ocho tipos de hoja compuesta |
| 4 | Filotaxia: alterna espiralada y dística, opuesta y decusada, verticilada, en roseta y fasciculada, en vista lateral y superior, más el simulador del ángulo de divergencia (por qué 137.5°) |
| 5 | Atlas morfológico: más de 110 términos, una lámina por término, con definición, ejemplos con especies de México y cultivos, y el carácter resaltado en su color; búsqueda y diálogo con la lámina en grande |
| 6 | Arma una hoja: elige cada carácter y mira la hoja redibujarse al instante con su descripción botánica redactada; hoja al azar y descarga en SVG |
| 7 | Autoevaluación: tres modos generados por el motor (¿qué término es?, encuentra la hoja, describe la hoja), diez preguntas por ronda con corrección y explicación inmediatas |
| 8 | Modo clase: presentación a pantalla completa que pregunta antes de revelar la respuesta (en español e inglés), y fichas de estudio o de examen para imprimir |

## Qué corre dónde

Todo se calcula y se dibuja en el navegador con JavaScript simple: no hay servidor, no se sube nada y nada de lo que
haces sale de tu computadora. No usa bibliotecas de terceros: las hojas las genera el propio código a partir de los
modelos.

## Fuentes

La terminología sigue los glosarios y manuales clásicos de morfología vegetal (Ellis *et al.*, *Manual of Leaf
Architecture*; Harris y Harris, *Plant Identification Terminology*; Hickey 1973 para la arquitectura foliar; Moreno,
*Glosario botánico ilustrado*; Font Quer, *Diccionario de botánica*; Beentje, *The Kew Plant Glossary*; Simpson,
*Plant Systematics*). Es material de enseñanza: los dibujos muestran el término en su forma típica.

## Cómo citarla

Barrera-Guzmán, L. Á. (2026). *LeafPro: la hoja, carácter por carácter* (versión 1.0.0) [Software].
https://github.com/luisangelbg/LeafPro

## Licencia

Software libre bajo la GNU General Public License v3.0 o posterior (archivo [LICENSE](LICENSE)).

---

## English summary

**LeafPro — the leaf, character by character** is a self-contained, bilingual (Spanish/English) web application for
teaching leaf morphology: the parts of the dicot and grass leaf, simple versus compound leaves with the axillary-bud
trick, phyllotaxy with a golden-angle simulator, an atlas of 110+ illustrated terms (blade shapes, apices, bases,
margins, venation patterns, composition, attachment and surfaces), a leaf builder that writes the botanical
description as you combine characters, generative self-assessment and a classroom mode for projecting and printing.
Every drawing is produced by a parametric leaf engine inside the app; there are no photographs or fixed images.
Open `index.html` with a double click — everything runs in the browser, offline.
