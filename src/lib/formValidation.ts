/**
 * Reglas de validación compartidas para todos los formularios.
 */

// Solo letras y espacios, nombre y apellido requeridos, cada palabra inicia con mayúscula, máx 50 chars
export function validateNombre(value: string, required = true): string {
  if (!value.trim()) return required ? 'El nombre es requerido' : '';
  if (/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]/.test(value)) return 'Solo letras, sin números ni caracteres especiales';
  if (value.length > 50) return 'Máximo 50 caracteres';

  const words = value.trim().split(/\s+/);

  // Requiere al menos nombre y apellido
  if (words.length < 2) return 'Ingresa nombre y apellido';

  // Cada palabra mínimo 2 letras
  const shortWord = words.find(w => w.length < 2);
  if (shortWord) return 'Cada nombre debe tener al menos 2 letras';

  // Cada palabra inicia con mayúscula
  const badCase = words.find(w => !/^[A-ZÁÉÍÓÚÜÑ]/.test(w));
  if (badCase) return `Cada palabra debe iniciar con mayúscula ("${badCase}")`;

  // No caracteres repetidos 3+ veces seguidas (Aaaa, Bbbb, etc.)
  const nonsense = words.find(w => /(.)\1{2,}/i.test(w));
  if (nonsense) return 'El nombre no parece válido';

  // Cada palabra debe tener al menos una vocal (descarta combinaciones sin sentido)
  const vowels = /[aeiouáéíóúüAEIOUÁÉÍÓÚÜ]/;
  const noVowel = words.find(w => !vowels.test(w));
  if (noVowel) return 'El nombre no parece válido';

  // No más de 3 consonantes seguidas (evita cadenas sin sentido como "Brtxkl")
  const tooManyConsonants = words.find(w => /[^aeiouáéíóúüAEIOUÁÉÍÓÚÜ]{4,}/i.test(w));
  if (tooManyConsonants) return 'El nombre no parece válido';

  return '';
}

// Correo con dominios .com, .mx o .org
export function validateCorreo(value: string, required = true): string {
  if (!value.trim()) return required ? 'El correo es requerido' : '';
  if (!/^[^\s@]+@[^\s@]+\.(com|mx|org)$/i.test(value))
    return 'Formato inválido (ej: nombre@empresa.com)';
  return '';
}

// Empresa/razón social: sin caracteres especiales
export function validateEmpresa(value: string, required = false): string {
  if (!value.trim()) return required ? 'La empresa es requerida' : '';
  if (/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s.,&\-()'"/]/.test(value))
    return 'No se permiten caracteres especiales';
  return '';
}

// Razón social del cotizador: letras/números/puntos/comas/guiones, máx 40 chars, mínimo lógico
export function validateRazonSocial(value: string): string {
  if (!value.trim()) return 'La razón social es requerida';
  if (value.length > 40) return 'Máximo 40 caracteres';
  if (/[^a-zA-ZáéíóúüñÁÉÍÓÚÜÑ0-9\s.,&\-()'"/]/.test(value))
    return 'No se permiten caracteres especiales';
  if (!/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(value))
    return 'Debe contener al menos una letra';
  if (value.trim().length < 3) return 'Mínimo 3 caracteres';
  return '';
}

// RFC mexicano: 12 (persona moral) o 13 (persona física) chars alfanuméricos en mayúsculas
export function validateRFC(value: string): string {
  if (!value.trim()) return 'El RFC es requerido';
  if (/[^A-Z0-9]/.test(value)) return 'Solo letras mayúsculas y números';
  if (value.length < 12) return 'Mínimo 12 caracteres';
  if (value.length > 13) return 'Máximo 13 caracteres';
  return '';
}

// Convierte RFC a mayúsculas y filtra caracteres no válidos
export function filterRFC(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 13);
}

// Mensaje / notas: máx 500 chars, sin caracteres especiales
export function validateMensaje(value: string, required = true): string {
  if (!value.trim()) return required ? 'El mensaje es requerido' : '';
  if (value.length > 500) return 'Máximo 500 caracteres';
  if (/[<>{}|\\^`[\]@#$%*+=~]/.test(value)) return 'No se permiten caracteres especiales';
  return '';
}

// Teléfono: solo dígitos, mínimo 10, máximo 15
export function validateTelefono(value: string, required = false): string {
  if (!value.trim()) return required ? 'El teléfono es requerido' : '';
  if (!/^\d+$/.test(value)) return 'Solo se permiten números';
  if (value.length < 10) return 'Mínimo 10 dígitos';
  if (value.length > 15) return 'Máximo 15 dígitos';
  return '';
}

// Filtrar entrada de teléfono: solo acepta dígitos
export function filterTelefono(value: string): string {
  return value.replace(/\D/g, '').slice(0, 15);
}
