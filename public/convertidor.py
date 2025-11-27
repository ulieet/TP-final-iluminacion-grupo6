import pandas as pd
import json

def convertir_csv_a_json(nombre_archivo_csv, nombre_archivo_json):
    """
    Lee el archivo CSV de iluminación, corrige el formato numérico 
    (coma decimal a punto decimal) y lo exporta a formato JSON.
    """
    
    # 1. Cargar el dataset, especificando el delimitador (;)
    try:
        df = pd.read_csv(nombre_archivo_csv, delimiter=';')
    except FileNotFoundError:
        print(f"Error: El archivo '{nombre_archivo_csv}' no se encontró.")
        return
    
    # 2. Limpiar y convertir columnas numéricas
    columnas_numericas = ['superficie_m2', 'lumenes_requeridos_lm']
    
    for columna in columnas_numericas:
        # Reemplazar la coma (,) por el punto (.) para usar formato float estándar
        # y convertir la columna al tipo numérico (float).
        df[columna] = df[columna].str.replace(',', '.', regex=False).astype(float)
        
        # Opcional: Redondear los lúmenes a enteros, ya que es el formato usado en el simulador
        if columna == 'lumenes_requeridos_lm':
            df[columna] = df[columna].round().astype(int)

    # 3. Renombrar columnas para usar camelCase en JSON (estilo JS)
    df.columns = ['tipo_ambiente', 'superficie_m2', 'tecnologia', 'lumenes_requeridos_lm']

    # 4. Convertir el DataFrame a una lista de diccionarios (JSON)
    # orientation='records' genera una lista de objetos [{"col1": val, "col2": val}, ...]
    datos_json = df.to_dict(orient='records')
    
    # 5. Exportar a archivo JSON
    with open(nombre_archivo_json, 'w', encoding='utf-8') as f:
        # Usamos indent=4 para que el archivo JSON sea legible
        json.dump(datos_json, f, indent=4, ensure_ascii=False)
    
    print(f"\n✅ Conversión exitosa. Se han procesado {len(df)} registros.")
    print(f"Archivo JSON guardado como '{nombre_archivo_json}'")

# --- Ejecución del script ---
if __name__ == "__main__":
    CSV_INPUT = "04 - Iluminacion.csv"
    JSON_OUTPUT = "datos_iluminacion_historicos.json"
    
    convertir_csv_a_json(CSV_INPUT, JSON_OUTPUT)