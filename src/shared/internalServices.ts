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

export const validateRequired = (value: string) => {
    let error;
    if (!value) {
        error = "Required";
    }

    return error;
};

export const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
};
export function extractTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

export function formatTime(dateInput: string | Date): string {
    const date = new Date(dateInput);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}
