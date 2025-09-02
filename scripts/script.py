import pandas as pd
import re
from supabase import create_client
from dotenv import load_dotenv
import os
from datetime import datetime

# Cargar variables de entorno (.env con SUPABASE_URL y SUPABASE_KEY)
load_dotenv()

# Inicializamos la conexión con la base de datos
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# Leer CSV
df = pd.read_csv("./datos/buenos_aires/buenos_aires_fuera_de_GBA.csv")

# Función genérica para obtener o crear ID en tablas auxiliares
def get_or_create_id(table, column, value):
    res = supabase.table(table).select(f"id_{table}").eq(column, value).execute().data
    if res:
        return res[0][f"id_{table}"]
    else:
        new = supabase.table(table).insert({column: value}).execute().data[0]
        return new[f"id_{table}"]

def get_or_create_partido(partido_nombre, region_id):
    res = supabase.table("partido").select("id_partido").eq("nombre", partido_nombre).execute().data
    if res:
        return res[0]["id_partido"]
    else:
        new = supabase.table("partido").insert({
            "nombre": partido_nombre,
            "id_region": region_id
        }).execute().data[0]
        return new["id_partido"]

def parse_antiguedad(anio):
    anio_actual = 2025

    if pd.isna(anio):
        return None

    try:
        anio = float(anio)  # por si viene como '1980.0'
        if anio < 100:
            return int(anio)  # se interpreta como años de antigüedad directamente
        elif 1800 <= anio <= anio_actual:
            return anio_actual - int(anio)  # se interpreta como año de construcción
        else:
            return None  # fuera de rango
    except:
        return None


# Función para parsear precios
def parse_precio(valor):
    moneda = "USD" if "USD" in valor.upper() or "U$S" in valor.upper() else "ARS"
    monto = int(re.sub(r"[^\d]", "", valor))
    return monto, moneda

# Función segura para convertir a int (en caso de NaN o vacío)
def safe_int(value):
    try:
        return int(value)
    except:
        return 0

# Iterar sobre todas las filas del CSV
for _, row in df.iterrows():
    try:
        # IDs de tablas auxiliares
        tipo_prop_id = get_or_create_id("tipo_propiedad", "nombre", row["tipo"])
        tipo_oper_id = get_or_create_id("tipo_operacion", "nombre", row["tipo_operacion"])
        region_id = get_or_create_id("region", "nombre", row["region"])
        partido_id = get_or_create_partido(row["partido"], region_id)

        # Inmobiliaria
        telefono = str(row["whatsapp"]).strip() if pd.notna(row["whatsapp"]) and str(row["whatsapp"]).strip() else "SIN_NUMERO"
        inmob_data = {
            "nombre": row["nombre_inmobiliaria"],
            "logo": row["logo_inmobiliaria"],
            "telefono": telefono
        }

        res = supabase.table("inmobiliaria").select("id_inmobiliaria").eq("telefono", telefono).execute().data
        if res:
            inmob_id = res[0]["id_inmobiliaria"]
        else:
            inmob_id = supabase.table("inmobiliaria").insert(inmob_data).execute().data[0]["id_inmobiliaria"]

        # Precio
        monto, moneda = parse_precio(str(row["precio"]))
        precio_id = supabase.table("precio").insert({"moneda": moneda, "monto": monto}).execute().data[0]["id_precio"]

        # Procesar imágenes
        imagenes = row["imagenes"]
        imagenes_list = [img.strip() for img in imagenes.split(",")] if isinstance(imagenes, str) else []

        # Procesar servicios
        servicios = row["servicios"]
        servicios_list = [s.strip() for s in servicios.split(",")] if isinstance(servicios, str) else []

        # Insertar propiedad
        supabase.table("propiedad").insert({
            "id_tipo_propiedad": tipo_prop_id,
            "id_tipo_operacion": tipo_oper_id,
            "id_partido": partido_id,
            "id_inmobiliaria": inmob_id,
            "id_precio": precio_id,
            "descripcion": row["descripcion"],
            "antiguedad": parse_antiguedad(row["anio_construccion"]),
            "dormitorios": safe_int(row["dormitorios"]),
            "banos": safe_int(row["banos"]),
            "cocheras": safe_int(row["cocheras"]),
            "servicios": servicios_list,
            "imagenes": imagenes_list,
            "calle_altura": row["calle_y_altura"],
            "url": row["url"]  # ✅ NUEVO campo agregado
        }).execute()

        print("✔️ Propiedad insertada correctamente")

    except Exception as e:
        print(f"❌ Error al insertar propiedad: {e}")
