// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import { LocalStorageService } from '@services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  errorMessage: string = '';
  emailError: string = '';
  passwordError: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private localStorage: LocalStorageService
  ) {}

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
          this.userService.saveUserData(response.user);
          this.localStorage.createToken(response.token);
          console.log(this.localStorage.getToken());


          const userPlan = this.userService.getUserPlan();
          if (userPlan === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
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
}
