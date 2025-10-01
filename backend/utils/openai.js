import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analizarDescripcion(descripcion) {
  const prompt = `Dada la siguiente descripción de una propiedad inmobiliaria: "${descripcion}"
                  Respondé **exclusivamente** con un **array JSON válido** de etiquetas como:
                  ["vista al río", "cerca del parque", "apto crédito"]
                  No agregues ningún texto extra ni explicación.`;

  const chatCompletion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Sos un asistente que clasifica propiedades inmobiliarias y respondés solo con JSON.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
  });

  const respuestaBruta = chatCompletion.choices[0].message.content.trim();
  console.log("🧠 Respuesta bruta:", respuestaBruta);

  // Extraer el array con regex (para evitar errores de formato)
  const jsonMatch = respuestaBruta.match(/\[.*\]/s);
  if (!jsonMatch) {
    throw new Error("La respuesta no contiene un JSON válido.");
  }

  const jsonString = jsonMatch[0];
  return JSON.parse(jsonString);
}
