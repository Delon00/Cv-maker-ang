import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // Recommandé pour les directives comme @if ou ngClass
import { UserService } from '@services/user.service';
import Register from '@interfaces/register.interface';
import { ConfirmPasswordValidator } from '@utils/confirmPasswordValidator';
import FormErrorChecker from '@utils/formErrorChecker';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // Utils
  errorChecker = FormErrorChecker();
  
  // Form & State
  formRegister!: FormGroup;
  formErrors: { [key: string]: string } = {};
  errorMessage: string = '';
  isLoading: boolean = false;
  
  // Data Model
  userRegister: Register = {
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  // Injections
  private router = inject(Router);
  private userService = inject(UserService);

  ngOnInit(): void {
    this.formRegister = new FormGroup({
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      passwordConfirm: new FormControl('', [Validators.required]),
    }, { validators: ConfirmPasswordValidator });
  }

  onRegister() {
    this.errorMessage = ''; // Reset error msg

    if (this.formRegister.valid) {
      this.isLoading = true;
      this.userRegister = this.formRegister.value;

      this.userService.register(this.userRegister).subscribe({
        next: () => {
          // ✅ SUCCÈS : 
          // Avec les cookies HttpOnly, le token est géré par le navigateur.
          // On redirige vers les templates (si auto-login) ou vers login.
          // Ici, on suppose un auto-login ou une redirection directe.
          this.router.navigate(['/templates']);
        },
        error: (error: any) => {
          this.isLoading = false;
          
          // Gestion spécifique UX : Email déjà pris
          if (error.status === 409) {
            this.errorMessage = 'Cet email est déjà utilisé. Veuillez en choisir un autre.';
            // On peut aussi marquer le champ email en erreur manuellement si besoin
            this.formRegister.get('email')?.setErrors({ notUnique: true });
          } else {
            // Les autres erreurs (500, etc.) sont loggées par l'Interceptor,
            // mais on affiche un message générique ici pour l'utilisateur.
            this.errorMessage = "Impossible de créer le compte. Veuillez vérifier vos informations.";
          }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      // Gestion des erreurs de formulaire (champs vides, etc.)
      this.formRegister.markAllAsTouched();
      this.formErrors = {};
      this.errorChecker.checkRegisterFormErrors(this.formRegister, this.formErrors);
      this.errorMessage = "Veuillez corriger les erreurs indiquées en rouge.";
    }
  }

  LinkedinLog() {
    console.log('LinkedIn Registration logic here');
    // Idéalement : Redirection vers une URL backend qui gère OAuth
    // window.location.href = `${environment.authUrl}/linkedin`;
  }
}