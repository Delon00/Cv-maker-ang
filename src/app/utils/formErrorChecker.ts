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

    return {
        checkRegisterFormErrors,
        checkLoginFormErrors
    };
}
