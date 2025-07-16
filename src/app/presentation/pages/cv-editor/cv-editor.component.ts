import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import FormErrorChecker from '@app/utils/formErrorChecker';

@Component({
  selector: 'app-cv-editor',
  templateUrl: './cv-editor.component.html',
  styleUrls: ['./cv-editor.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class CvEditorComponent implements OnInit {
  formCvSimple!: FormGroup;
  errorChecker = FormErrorChecker();
  formErrors: { [key: string]: string } = {};

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.formCvSimple = new FormGroup({
      lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.userService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.formCvSimple.patchValue({
            lastName: user.lastName || '',
            firstName: user.firstName || '',
            email: user.email || ''
          });
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des informations utilisateur:', err);
      }
    });
    
  }

  onSave() {
    if (this.formCvSimple.valid) {

      console.log('Form is valid, proceed with saving or downloading the CV');
    } else {
      this.formCvSimple.markAllAsTouched();
      // this.errorChecker.checkCvEditorFormErrors(this.formCvSimple, this.formErrors);
    }
  }
}
