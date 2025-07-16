export default function FormErrorChecker() {
    
    const checkRegisterFormErrors = (form: any, errorMessages: { [key: string]: string }) => {
        const controls = form.controls;
        Object.keys(controls).forEach(controlName => {
            const control = controls[controlName];
            if (control.errors) {
                if (control.errors['required']) {
                    errorMessages[controlName] = `${controlName} est requis.`;
                } else if (control.errors['minlength']) {
                    errorMessages[controlName] = `${controlName} doit avoir au moins ${control.errors['minlength'].requiredLength} caractères.`;
                } else if (controlName === 'email' && control.errors['email']) {
                    errorMessages[controlName] = 'Veuillez entrer un email valide.';
                }
            }
        });

        if (form.errors && form.errors['passwordMismatch']) {
            errorMessages['passwordConfirm'] = 'Les mots de passe ne correspondent pas.';
        }
    };

    const checkLoginFormErrors = (form: any, errorMessages: { [key: string]: string }) => {
        const controls = form.controls;
        Object.keys(controls).forEach(controlName => {
            const control = controls[controlName];
            if (control.errors) {
                if (control.errors['required']) {
                    errorMessages[controlName] = `${controlName} est requis.`;
                } else if (control.errors['minlength']) {
                    errorMessages[controlName] = `${controlName} doit avoir au moins ${control.errors['minlength'].requiredLength} caractères.`;
                } else if (controlName === 'email' && control.errors['email']) {
                    errorMessages[controlName] = 'Veuillez entrer un email valide.';
                }
            }
        });
    };

    const checkCvEditorFormErrors = (form: any, errorMessages: { [key: string]: string }) => {
        const controls = form.controls;

        Object.keys(controls).forEach(controlName => {
        const control = controls[controlName];

        // Check simple FormControls
        if (control && control.errors) {
            if (control.errors['required']) {
            errorMessages[controlName] = `${controlName} est requis.`;
            } else if (control.errors['minlength']) {
            errorMessages[controlName] = `${controlName} doit avoir au moins ${control.errors['minlength'].requiredLength} caractères.`;
            }
        }

        // Check FormArray (e.g. experiences, skills, etc.)
        if (control && control.controls && Array.isArray(control.controls)) {
            control.controls.forEach((group: any, index: number) => {
            Object.keys(group.controls).forEach(fieldName => {
                const fieldControl = group.controls[fieldName];
                if (fieldControl.errors) {
                if (fieldControl.errors['required']) {
                    errorMessages[`${controlName}.${index}.${fieldName}`] = `${fieldName} est requis (élément ${index + 1}).`;
                } else if (fieldControl.errors['minlength']) {
                    errorMessages[`${controlName}.${index}.${fieldName}`] =
                    `${fieldName} doit avoir au moins ${fieldControl.errors['minlength'].requiredLength} caractères (élément ${index + 1}).`;
                }
                }
            });
            });
        }
        });
    };

    return {
        checkRegisterFormErrors,
        checkLoginFormErrors,
        checkCvEditorFormErrors
    };
}
