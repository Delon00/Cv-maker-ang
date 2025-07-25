// login.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import { LocalStorageService } from '@services/local-storage.service';
import { Router,RouterLink } from '@angular/router';
import FormErrorChecker from '@utils/formErrorChecker';
import decodeJwt from '@app/utils/decodeJwt';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink]
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  errorMessage: string = '';
  emailError: string = '';
  passwordError: string = '';
  isLoading: boolean = false;


  private router = inject(Router);
  private userService = inject(UserService);
  private localStorage = inject(LocalStorageService);


  ngOnInit(): void {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onLogin() {
    if (this.formLogin.valid) {
      this.isLoading = true;
      this.userService.login(this.formLogin.value).subscribe({
        next: (response: any) => {
          const userPlan = response.user?.plan;
          if (userPlan === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/templates']);
          }
          this.isLoading = false;
        },
        error: (error: any) => {
          if (error.status === 400) {
            this.errorMessage = error.message;
          } else if (error.status === 401) {
            this.errorMessage = error.message;
          } else if (error.status === 500) {
            this.errorMessage = "Erreur serveur, veuillez réessayer plus tard.";
          } else {
            this.errorMessage = "Échec de la connexion. Veuillez vérifier vos informations.";
            console.log('Erreur inattendue:', error);
          }
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = "Veuillez remplir correctement le formulaire.";
    }
  }

  LinkedinLog(){

  }
}
