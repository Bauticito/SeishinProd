import Swal from 'sweetalert2';

/**
 * SweetAlert2 pre-configurado con el tema del proyecto.
 * Respeta data-theme="dark" / "light" en el documentElement.
 */
function isDark() {
  return document.documentElement.getAttribute('data-theme') !== 'light';
}

function base() {
  const dark = isDark();
  return Swal.mixin({
    background:          dark ? '#1c1c1c' : '#ffffff',
    color:               dark ? '#f5f5f5' : '#3A3A3A',
    confirmButtonColor:  '#E31E24',
    cancelButtonColor:   dark ? '#3A3A3A' : '#B1B3B6',
    iconColor:           '#E31E24',
    buttonsStyling:      true,
    customClass: {
      popup:          'swal-seishin',
      confirmButton:  'swal-btn-confirm',
      cancelButton:   'swal-btn-cancel',
    },
  });
}

export const SwalSuccess = (title: string, text?: string) =>
  base().fire({ icon: 'success', title, text, iconColor: '#22C55E', timer: 3500, timerProgressBar: true, showConfirmButton: false });

export const SwalError = (title: string, text?: string) =>
  base().fire({ icon: 'error', title, text });

export const SwalWarning = (title: string, text?: string) =>
  base().fire({ icon: 'warning', title, text });

export const SwalInfo = (title: string, text?: string) =>
  base().fire({ icon: 'info', title, text });
