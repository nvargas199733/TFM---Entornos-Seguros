import json
import os

localidades = {
    '01': 'Usaquén', '02': 'Chapinero', '03': 'Santa Fe', '04': 'San Cristóbal',
    '05': 'Usme', '06': 'Tunjuelito', '07': 'Bosa', '08': 'Kennedy',
    '09': 'Fontibón', '10': 'Engativá', '11': 'Suba', '12': 'Barrios Unidos',
    '13': 'Teusaquillo', '14': 'Los Mártires', '15': 'Antonio Nariño',
    '16': 'Puente Aranda', '17': 'La Candelaria', '18': 'Rafael Uribe Uribe',
    '19': 'Ciudad Bolívar', '20': 'Sumapaz'
}

geojson_path = r'c:\users\juan\Downloads\CAI_GeoJSON.json'
output_sql_path = r'c:\Users\Juan\Videos\TFM---Entornos-Seguros\database\cargar_cais_bogota.sql'

with open(geojson_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

lines = [
    '-- Script de carga masiva de CAIs de Bogotá',
    f'-- Total registros: {len(data["features"])}',
    '-- Esquema: auth_user.cai',
    '',
    'INSERT INTO auth_user.cai (codigo, nombre, direccion, telefono, localidad, latitud, longitud, activo)',
    'VALUES'
]

seen_codigos = set()
val_lines = []

for feat in data['features']:
    props = feat['properties']
    geom = feat.get('geometry', {})
    coords = geom.get('coordinates', [0, 0])
    lng = coords[0] if coords else props.get('CAILONGITU', 0.0)
    lat = coords[1] if coords else props.get('CAILATITUD', 0.0)

    nombre = (props.get('CAIDESCRIP') or 'CAI').strip()
    codigo = (props.get('CAIIDENTIF') or '').strip()
    if not codigo or codigo in seen_codigos:
        cai_nm = props.get('CAIIUCAINM', '')
        if cai_nm:
            codigo = cai_nm + '020'
        if codigo in seen_codigos or not codigo:
            codigo = f'CAI-{len(seen_codigos)+1:03d}'
    seen_codigos.add(codigo)

    direccion = (props.get('CAIDIR_SIT') or '').strip()
    telefono = (props.get('CAITELEFON') or '').strip()
    loc_code = (props.get('CAIIULOCAL') or '').strip()
    localidad = localidades.get(loc_code, f'Localidad {loc_code}')

    dir_sql = f"'{direccion.replace('\'', '\'\'')}'" if direccion else 'NULL'
    tel_sql = f"'{telefono.replace('\'', '\'\'')}'" if telefono else 'NULL'
    nombre_escaped = nombre.replace("'", "''")
    codigo_escaped = codigo.replace("'", "''")
    localidad_escaped = localidad.replace("'", "''")

    val_lines.append(
        f"    ('{codigo_escaped}', '{nombre_escaped}', {dir_sql}, {tel_sql}, '{localidad_escaped}', {lat:.8f}, {lng:.8f}, true)"
    )

lines.append(',\n'.join(val_lines))
lines.append('''ON CONFLICT (codigo) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    direccion = EXCLUDED.direccion,
    telefono = EXCLUDED.telefono,
    localidad = EXCLUDED.localidad,
    latitud = EXCLUDED.latitud,
    longitud = EXCLUDED.longitud,
    activo = EXCLUDED.activo,
    updated_at = NOW();
''')

sql_content = '\n'.join(lines)
with open(output_sql_path, 'w', encoding='utf-8') as f_out:
    f_out.write(sql_content)

print(f"SQL generado exitosamente en '{output_sql_path}' con {len(val_lines)} registros.")
