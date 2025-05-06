import type { SweetAlertOptions } from 'sweetalert2';

export const triggerForm = (swalObject: SweetAlertOptions) => {
    import('sweetalert2' /* webpackChunkName: "sweetalert2" */).then(
        ({ default: Swal }) => {
            Swal.fire({
                ...swalObject,
            });
        }
    );
};