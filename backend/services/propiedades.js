import supabase from '../database/config.js';

export async function getAllPropiedades() {
    const { data, error } = await supabase
        .from('departamentos_alquiler')
        .select('*');
    if (error) throw error;
    return data;
}

export async function filtrarDepartamentos({ zona, minAmbientes, maxPrecio }) {
    let q = supabase
        .from('departamentos_alquiler')
        .select('*', { count: 'exact' })
        .order('fecha_creacion', { ascending: false });

    if (zona) {
        q = q.eq('zona', zona);
    }

    if (
        minAmbientes !== undefined &&
        minAmbientes !== null &&
        minAmbientes !== ''
    ) {
        q = q.gte('cant_ambientes', Number(minAmbientes));
    }

    if (maxPrecio !== undefined && maxPrecio !== null && maxPrecio !== '') {
        q = q.lte('precio', Number(maxPrecio));
    }

    const { data, count, error } = await q;
    if (error) throw error;

    return {
        total: count ?? 0,
        departamentos: data,
    };
}

export async function buscarDepartamentosPorFiltros({
    zona,
    minAmbientes,
    maxPrecio,
    moneda,
    requierePileta,
    vista,
    cant_banos,
    cant_dormitorios,
    sup_total_min,
}) {
    let q = supabase
        .from('departamentos_alquiler')
        .select('*', { count: 'exact' })
        .order('fecha_creacion', { ascending: false });

    if (zona) q = q.eq('zona', zona);

    if (isNum(minAmbientes)) q = q.gte('cant_ambientes', Number(minAmbientes));
    if (isNum(cant_banos)) q = q.gte('cant_banos', Number(cant_banos));
    if (isNum(cant_dormitorios))
        q = q.gte('cant_dormitorios', Number(cant_dormitorios));
    if (isNum(sup_total_min)) q = q.gte('sup_total', Number(sup_total_min));

    if (isNum(maxPrecio)) q = q.lte('precio', Number(maxPrecio));
    if (moneda) q = q.eq('moneda', moneda);

    if (vista && vista !== 'no_especifica') {
        q = q.ilike('tipo_de_vista', `%${vista}%`);
    }

    // Pileta: no hay columna; buscar en titulo/descripcion
    if (requierePileta) {
        q = q.or('titulo.ilike.%pileta%,descripcion.ilike.%pileta%');
    }

    const { data, count, error } = await q;
    if (error) throw error;

    return {
        total: count ?? 0,
        productos: data ?? [],
    };
}

function isNum(v) {
    return v !== undefined && v !== null && v !== '' && !isNaN(Number(v));
}
