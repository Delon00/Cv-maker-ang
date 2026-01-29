import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// Services
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule]
})
export class LoginComponent implements OnInit {

  formLogin!: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  private router = inject(Router);
  private userService = inject(UserService);


  ngOnInit(): void {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false)
    });
  }

  onLogin() {

    this.errorMessage = '';

    if (this.formLogin.valid) {
      this.isLoading = true;
      
      this.userService.login(this.formLogin.value).subscribe({
        next: (response: any) => {
          const userPlan = response.user?.plan || this.userService.userPlan();
          
          const target = userPlan === 'admin' ? '/admin' : '/templates';
          this.router.navigate([target]);
          
          this.isLoading = false;
        },
        error: (error: any) => {
          this.isLoading = false;
          

          if (error.status === 401 || error.status === 400) {
            this.errorMessage = "Email ou mot de passe incorrect.";
          } else if (error.status === 500) {
            this.errorMessage = "Erreur serveur, veuillez réessayer plus tard.";
          } else {
            this.errorMessage = "Impossible de se connecter. Vérifiez votre réseau.";
          }
        }
      });
    } else {
      this.formLogin.markAllAsTouched();
      this.errorMessage = "Veuillez remplir correctement tous les champs.";
    }
  }

  LinkedinLog() {
    console.log('LinkedIn Login initiated');
  }
}