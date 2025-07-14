const API_BASE_URL = 'http://localhost:5000/api';

export interface Glucosa {
  valor?: number;
  unidad?: string;
  tipo?: string;
  notas?: string;
  dispositivo?: Dispositivo;
}

export interface PresionArterial {
  sistolica?: number;
  diastolica?: number;
  pulso?: number;
  posicion?: string;
  brazo?: string;
  notas?: string;
  dispositivo?: Dispositivo;
}

export interface Oxigenacion {
  valor?: number;
  notas?: string;
  dispositivo?: Dispositivo;
}

export interface Temperatura {
  valor?: number;
  unidad?: string;
  notas?: string;
  dispositivo?: Dispositivo;
}

export interface Peso {
  valor?: number;
  notas?: string;
  dispositivo?: Dispositivo;
}

export interface CircunferenciaCintura {
  valor?: number;
  notas?: string;
  dispositivo?: Dispositivo;
}

export interface Pulso {
  valor?: number;
  notas?: string;
  dispositivo?: Dispositivo;
}

export interface Sintoma {
  nombre: string;
  intensidad?: string;
  duracion?: string;
}

export interface SignosVitales {
  glucosa?: Glucosa;
  presionArterial?: PresionArterial;
  oxigenacion?: Oxigenacion;
  temperatura?: Temperatura;
  peso?: Peso;
  circunferenciaCintura?: CircunferenciaCintura;
  pulso?: Pulso;
  sintomas?: Sintoma[];
  notas?: string;
  ubicacion?: string;
  fecha?: string;
}

export interface SignosVitalesResponse extends SignosVitales {
  _id: string;
  alertas?: string[];
  imc?: number;
  clasificacionIMC?: string;
  estadoGlucosa?: string;
  estadoPresion?: string;
  estadoOxigenacion?: string;
  createdAt: string;
  updatedAt: string;
  fecha: string;
}

export interface Dispositivo {
  marca?: string;
  modelo?: string;
  tipo?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Registrar nuevos signos vitales
  async registrarSignosVitales(data: SignosVitales): Promise<SignosVitalesResponse> {
    return this.request<SignosVitalesResponse>('/signos-vitales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Obtener historial de signos vitales
  async obtenerHistorial(limit: number = 50): Promise<SignosVitalesResponse[]> {
    const response = await this.request<any>(`/signos-vitales?limit=${limit}`);
    return response.data;
  }

  // Obtener estadísticas
  async obtenerEstadisticas(): Promise<any> {
    return this.request<any>('/signos-vitales/estadisticas');
  }

  // Obtener alertas
  async obtenerAlertas(): Promise<any> {
    return this.request<any>('/signos-vitales/alertas');
  }

  // Eliminar registro
  async eliminarRegistro(id: string): Promise<void> {
    return this.request<void>(`/signos-vitales/${id}`, {
      method: 'DELETE',
    });
  }

  // Actualizar registro
  async actualizarRegistro(id: string, data: SignosVitales): Promise<SignosVitalesResponse> {
    return this.request<SignosVitalesResponse>(`/signos-vitales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
export default apiService; 