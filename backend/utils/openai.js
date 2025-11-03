import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function analizarDescripcion(descripcion) {
    const prompt = `Eres un asistente especializado en interpretación semántica de consultas inmobiliarias en Argentina. 
Tu tarea es convertir una descripción en lenguaje natural realizada por un usuario en una URL de endpoint REST 
que el backend pueda consumir directamente para consultar la base de datos de propiedades.

Base de datos y relaciones:

- region(id_region, nombre)
- partido(id_partido, id_region, nombre)
- inmobiliaria(id_inmobiliaria, nombre, logo, telefono)
- tipo_propiedad(id_tipo_propiedad, nombre)
- tipo_operacion(id_tipo_operacion, nombre)
- precio(id_precio, monto, moneda, fecha)
- propiedad(id_propiedad, id_tipo_propiedad, id_tipo_operacion, id_inmobiliaria, id_partido, id_precio, url, descripcion, antiguedad, dormitorios, banos, cocheras, servicios, imagenes, calle_altura)

Cada propiedad pertenece a una inmobiliaria, una región (a través de partido), un tipo de propiedad, un tipo de operación y un precio.

Tu objetivo:
A partir de la descripción del usuario, generar una única URL correspondiente a uno de los siguientes endpoints válidos:
- /api/propiedades
- /api/inmobiliarias
- /api/partidos
- /api/regiones
- /api/tipo_operacion
- /api/tipo_propiedad
- /api/precios

Si la consulta se refiere a propiedades, siempre usa /api/propiedades.

Formato de salida:
Devuelve únicamente la URL final, sin texto adicional ni explicaciones. Usa los parámetros de filtro en formato querystring (?clave=valor) codificados correctamente en UTF-8.

Ejemplo:
/api/propiedades?tipo_operacion=alquiler&tipo_propiedad=departamento&partido=Palermo&dormitorios=2&cocheras=1&max_precio=300000

Criterios de interpretación:
1. Si menciona una ciudad o barrio → partido.
2. Si menciona una provincia o región → region.
3. Si menciona “departamento”, “casa”, “ph”, “terreno”, “local”, “oficina” → tipo_propiedad.
4. Si menciona “alquiler”, “venta”, “permuta”, “compra” → tipo_operacion.
5. Si dice “menor a”, “hasta” → max_precio. Si dice “mayor a”, “desde” → min_precio. Si dice “entre X e Y” → min y max.
6. Si menciona moneda → moneda=pesos o moneda=usd.
7. “2 dormitorios” → dormitorios=2; “1 baño” → banos=1; “con cochera” → cocheras=1.
8. Servicios: mapear a tokens canónicos en minúsculas. Lista canónica y SINÓNIMOS aceptados:
  - pileta (sinónimos: piscina, pool)
  - jardin (sinónimos: jardín, parque)
  - parrilla (sinónimos: asador, quincho con parrilla)
  - patio
  - balcon (sinónimos: balcón)
  - ascensor (sinónimos: elevador)
  - aire_acondicionado (sinónimos: aire, A/A, climatización)
  - acepta_mascotas (sinónimos: apto mascotas, pet friendly)
  - vista_rio (sinónimos: vista al río)
  - frente_mar (sinónimos: frente al mar, vista al mar)
  NO uses servicios para cochera/cocheras: eso va como cocheras=1..N.
9. Si nombra una inmobiliaria → inmobiliaria=nombre.
10. Devuelve solo la URL que comienza con /api/.

Reglas estrictas:
- Devuelve SIEMPRE IDs numéricos donde aplique: tipo_propiedad, tipo_operacion (1=Venta, 2=Alquiler), region, partido.
- Si el usuario pide “alquiler temporal/temporario”, mapear a tipo_operacion=2 (alquiler) a falta de un tipo específico.
- Evita parámetros no soportados por el backend productivo (por ejemplo, "ambientes" o superficies) salvo que queden como texto en servicios o q. Prioriza: tipo_operacion, tipo_propiedad, partido/region, dormitorios, banos, cocheras, servicios, min/max_precio, moneda.

Usa los siguientes valores y IDs reales extraídos de la base de datos:

---

📘 Tabla tipo_propiedad:
1,quinta
2,local
3,cabana
4,terreno
5,fondo-de-comercio
6,departamento
7,campo
8,casa
9,oficinas
10,galpon
11,ph
12,cochera
13,casa-duplex
14,loft
15,inmueble-productivo
16,complejo-de-cabanas
17,complejo-de-departamentos
18,nave
19,hotel
20,penthouse
21,fabrica
22,deposito
23,edificio

---

📗 Tabla tipo_operacion:
1 = Venta  
2 = Alquiler   

---

📙 Tabla region:
1,Buenos Aires
2,Capital Federal
3,Catamarca
4,Chaco
5,Chubut
6,Corrientes
7,Córdoba
8,Entre Ríos
9,Formosa
10,Jujuy
11,La Pampa
12,La Rioja
13,Mendoza
14,Misiones
15,Neuquen
16,Rio Negro
17,Salta
18,San Juan
19,San Luis
20,Santa Cruz
21,Santa Fe
22,Santiago del Estero
23,Tierra del Fuego
24,Buenos Aires (fuera de GBA)
25,GBA Sur
26,Río Negro
27,Buenos Aires Costa AtlÃ¡ntica
28,GBA Norte


---

📒 Tabla partido (localidades / ciudades):
id_partido,id_region,nombre
1,24,Tandil
2,24,Saavedra
3,24,Las Flores
4,24,Nueve de Julio
5,24,Magdalena
6,24,General Pueyrredón
7,24,General Juan Madariaga
8,24,General Belgrano
9,24,Mercedes
10,24,Daireaux
11,24,Mar Chiquita
12,24,Olavarría
13,24,General Las Heras
14,24,Chascomús
15,24,Azul
16,24,Punta Indio
17,24,San Miguel del Monte
18,24,Maipú
19,24,Bahía San Blas
20,24,Tres Arroyos
21,24,San Antonio de Areco
22,24,Pergamino
23,24,Lobos
24,24,Coronel Dorrego
25,24,Balcarce
26,24,Leandro N. Alem
27,24,Junín
28,24,San Pedro
29,24,General Lavalle
30,24,San Andrés de Giles
31,24,Baradero
32,24,Bahía Blanca
33,24,Chascomús
34,24,Batán
35,24,Ramallo
36,24,Roque Pérez
37,24,Dolores
38,24,Castelli
39,24,Bolívar
40,25,Berazategui
41,25,Quilmes
42,25,La Plata
43,25,Lomas de Zamora
44,25,Presidente Perón
45,25,Berisso
46,25,San Vicente
47,25,Brandsen
48,25,Lanús
49,25,Esteban Echeverría
50,25,Ezeiza
51,25,Almirante Brown
52,25,Avellaneda
53,25,Florencio Varela
54,25,Ensenada
55,4,Barranqueras
56,2,Vélez Sarsfield
57,4,Resistencia
58,8,Concepción del Uruguay
59,8,Colón
60,16,San Carlos de Bariloche
61,16,Cinco Saltos
62,16,Villa Llanquín
63,16,Dina Huapi
64,16,General Fernández Oro
65,16,Allen
66,16,Las Grutas
67,16,El Bolsón
68,16,Cipolletti
69,16,Ingeniero Jacobacci
70,21,Rosario
71,21,Funes
72,21,Rafaela
73,21,Ciudad de Santa Fe
74,21,Ibarlucea
75,21,Pueblo Esther
76,21,Granadero Baigorria
77,21,Villa Gobernador Gálvez
78,21,Roldán
79,21,Arroyo Leyes
80,21,Alvear
81,21,Cañada de Gómez
82,21,Santo Tomé
83,21,San José del Rincón
84,21,San Lorenzo
85,21,Casilda
86,21,Sauce Viejo
87,21,Piñero
88,21,Arroyo Seco
89,21,Lehmann
90,21,Pérez
91,21,Susana
92,21,General Lagos
93,21,Álvarez
94,21,Recreo
95,21,Aurelia
96,21,Luis Palacios
97,21,Bella Italia
98,21,Coronel Rodolfo S. Domínguez
99,21,Arroyo Aguiar
100,21,Capitán Bermúdez
101,21,Fighiera
102,21,Teodelina
103,21,Chabás
104,21,Esperanza
105,21,Villa Constitución
106,21,Pueblo Andino
107,21,Sargento Cabral
108,21,San Antonio
109,21,Zavalla
110,21,Díaz
111,21,Arteaga
112,21,Timbúes
113,21,Puerto General San Martín
114,21,Oliveros
115,21,Coronda
116,21,Santo Tomé
117,21,Presidente Roca
118,21,Colastiné
119,21,San Justo
120,21,Empalme Villa Constitución
121,21,Campo Andino
122,21,Suardi
123,21,Colonia Mascías
124,21,Colonia Bossi
125,21,San Javier
126,21,Las Avispas
127,21,San Cristóbal
128,13,Fray Luis Beltrán
129,13,San Rafael
130,13,Guaymallén
131,13,General San Martín
132,13,Ciudad de Mendoza
133,13,Luján de Cuyo
134,13,Godoy Cruz
135,13,San Roque
136,13,Las Heras
137,13,Potrerillos
138,13,Carrodilla
139,13,El Challao
140,13,Rama Caída
141,13,Dorrego
142,13,Vistalba
143,13,Rodeo de la Cruz
144,13,Mayor Drummond
145,13,Chacras de Coria
146,13,Rivadavia
147,13,Jocolí
148,13,Rodeo del Medio
149,13,Agrelo
150,13,Luzuriaga
151,13,Lavalle
152,13,Cuadro Benegas
153,13,Los Corralitos
154,13,General Gutiérrez
155,13,El Cerrito
156,13,El Sauce
157,13,Tunuyán
158,13,La Primavera
159,13,Russell
160,13,Las Compuertas
161,13,Villa Nueva
162,13,Las Violetas
163,13,Las Paredes
164,13,Las Cañas
165,13,San José
166,13,Colonia Segovia
167,13,Cruz de Piedra
168,13,Lunlunta
169,13,Ingeniero Giagnoni
170,13,El Carrizal
171,13,Chilecito
172,13,Tupungato
173,13,La Puntilla
174,13,Perdriel
175,13,San Carlos
176,13,Uspallata
177,13,Sierras de Encalada
178,13,Santa Rosa
179,13,San Martín
180,13,Cuadro Nacional
181,13,El Nihuil
182,13,Área Fundacional
183,13,Capilla del Rosario
184,13,Kilómetro 11
185,13,La Cieneguita
186,13,La Consulta
187,13,El Algarrobal
188,13,Las Catitas
189,13,Capdevilla
190,13,Colonia Las Rosas
191,13,Vista Flores
192,27,Mar del Plata
193,27,Villa Gesell
194,27,Cariló
195,27,Villarobles
196,27,Pinamar
197,27,Aguas Verdes
198,27,Claromecó
199,27,Valeria del Mar
200,27,Las Toninas
201,27,Santa Clara del Mar
202,27,Costa Esmeralda
203,27,Ostende
204,27,Miramar
205,27,Necochea
206,27,Mar de Ajó
207,27,Santa Teresita
208,27,Costa del Este
209,27,San Clemente del Tuyú
210,27,Nueva Atlantis
211,27,San Bernardo
212,27,Mar del Tuyú
213,2,Caballito
214,2,Pompeya
215,2,Belgrano
216,2,Villa Ortúzar
217,2,Palermo
218,2,Núñez
219,2,Congreso
220,2,Villa Pueyrredón
221,2,Barracas
222,2,Recoleta
223,2,Villa Santa Rita
224,2,Mataderos
225,2,Villa Urquiza
226,2,Chacarita
227,2,Villa Crespo
228,2,Villa del Parque
229,2,Balvanera
230,2,Villa General Mitre
231,2,Flores
232,2,Constitución
233,2,Villa Lugano
234,2,Monserrat
235,2,Villa Devoto
236,2,San Cristóbal
237,2,Almagro
238,2,San Telmo
239,2,Parque Chas
240,2,Colegiales
241,2,San Nicolás
242,2,Retiro
243,2,Tribunales
244,2,Once
245,2,La Paternal
246,2,Villa Luro
247,2,Parque Avellaneda
248,2,Agronomía
249,2,Floresta
250,2,Boedo
251,2,Abasto
252,2,Centro / Microcentro
253,2,Liniers
254,2,Villa Soldati
255,2,Coghlan
256,2,Barrio Norte
257,2,Versalles
258,2,Puerto Madero
259,28,Escobar
260,28,Tigre
261,28,San Isidro
262,28,San Fernando
263,28,Malvinas Argentinas
264,28,Vicente López
265,28,Exaltación de la Cruz
266,28,San Miguel
267,28,Pilar
268,28,José C. Paz
269,28,Campana
270,28,Zárate



---

📕 Tabla inmobiliaria:
1 = Century 21  
 

---

Ejemplos de salida:

Entrada:
"Buscá departamentos en alquiler en Palermo con 2 dormitorios y cochera, que no superen los 300 mil pesos."
Salida:
/api/propiedades?tipo_operacion=2&tipo_propiedad=6&partido=217&dormitorios=2&cocheras=1&max_precio=300000&moneda=pesos

---

Entrada:
"Quiero casas en venta en la región de Santa Fe con pileta y jardín, entre 50 mil y 120 mil dólares."
Salida:
/api/propiedades?tipo_operacion=1&tipo_propiedad=8&region=21&servicios=pileta,jardin&min_precio=50000&max_precio=120000&moneda=usd

---

Entrada:
"Terrenos en venta en Mar del Plata."
Salida:
/api/propiedades?tipo_operacion=1&tipo_propiedad=4&partido=192

---

Entrada:
"Oficinas en alquiler en Córdoba Capital con cochera y 2 baños."
Salida:
/api/propiedades?tipo_operacion=2&tipo_propiedad=9&region=7&cocheras=1&banos=2
`;

    // Llamada a la API
    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-4o', // usa 4o-mini o 4-turbo para menor costo
        messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: descripcion },
        ],
        temperature: 0.2,
    });

    const respuesta = chatCompletion.choices[0].message.content.trim();
    console.log('URL generada:', respuesta);

    // Validar que la respuesta empiece con /api/
    if (!respuesta.startsWith('/api/')) {
        throw new Error('El modelo no devolvió una URL válida: ' + respuesta);
    }

    return respuesta;
}
