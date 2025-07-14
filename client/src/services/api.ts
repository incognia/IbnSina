const API_BASE_URL = 'http://localhost:5000/api';

const apiService = {
  async registrarSignosVitales(datos: any) {
    const res = await fetch(`${API_BASE_URL}/signos-vitales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!res.ok) throw new Error('Error al registrar signos vitales');
    return res.json();
  },
  async obtenerHistorial(limit = 50) {
    const res = await fetch(`${API_BASE_URL}/signos-vitales?limit=${limit}`);
    if (!res.ok) throw new Error('Error al obtener historial');
    return res.json().then(r => r.data || []);
  },
  async eliminarRegistro(id: string) {
    const res = await fetch(`${API_BASE_URL}/signos-vitales/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar registro');
    return res.json();
  }
};

export default apiService; 