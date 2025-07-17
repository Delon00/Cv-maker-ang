import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import { LocalStorageService } from '@services/local-storage.service';
import { Router,RouterLink } from '@angular/router';
import Register from '@interfaces/register.interface';
import { ConfirmPasswordValidator } from '@utils/confirmPasswordValidator';
import FormErrorChecker from '@utils/formErrorChecker';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  errorChecker = FormErrorChecker();
  formErrors: { [key: string]: string } = {};
  formRegister!: FormGroup;
  errorMessage: string = '';
  emailError: string = '';
  passwordError: string = '';
  isLoading: boolean = false;
  userRegister: Register = {
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  private router = inject(Router) ;
  private userService = inject(UserService) ;
  private localStorage = inject(LocalStorageService);

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
  if (this.formRegister.valid) {
    this.isLoading = true;
    this.userRegister = this.formRegister.value;

    this.userService.register(this.userRegister).subscribe({
      next: (response: any) => {
        if (response && response.message === 'Utilisateur créé avec succès') {
          this.localStorage.createToken(response.token);
          this.userService.saveUserData(response.user);
          this.userService.loadUser();
          this.router.navigate(['/dashboard']);
        } else {
          console.error('Réponse inattendue', response);
          this.errorMessage = response.message || "Réponse inattendue du serveur.";
        }
      },
      error: (error: any) => {
        console.log(error.status, error.message);
        if (error.status === 409) {
          this.errorMessage = 'Cet email est déjà enregistré. Veuillez utiliser un autre email.';
          this.isLoading = false;
        } else {
          this.errorMessage = "Erreur serveur. Veuillez réessayer plus tard.";
          this.isLoading = false;
        }
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  } else {
    this.formRegister.markAllAsTouched();
    this.formErrors = {};
    this.errorChecker.checkRegisterFormErrors(this.formRegister, this.formErrors);
    this.errorMessage = "Veuillez corriger les erreurs du formulaire.";
  }
}


  LinkedinLog(){

  }

}

