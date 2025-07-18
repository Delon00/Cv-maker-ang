import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '@services/user.service';
import FormErrorChecker from '@app/utils/formErrorChecker';
import { TemplatesService } from '@services/templates.service';
import { NavbarComponent } from '@layout/navbar/navbar.component';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-cv-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent,SelectModule ],
  templateUrl: './cv-editor.component.html',
  styleUrls: ['./cv-editor.component.scss']
})
export class CvEditorComponent implements OnInit {
  formCvSimple!: FormGroup;
  templateId!: string;
  componentToRender: any;
  previewData: any = {};
  templateName = '';
  errorChecker = FormErrorChecker();
  formErrors: { [key: string]: string } = {};
  currentYear: number = new Date().getFullYear();

month: { name: string; value: string }[] = [ 
  { name: 'Janvier', value: '01' },
  { name: 'Février', value: '02' },
  { name: 'Mars', value: '03' },
  { name: 'Avril', value: '04' },
  { name: 'Mai', value: '05' },
  { name: 'Juin', value: '06' },
  { name: 'Juillet', value: '07' },
  { name: 'Août', value: '08' },
  { name: 'Septembre', value: '09' },
  { name: 'Octobre', value: '10' },
  { name: 'Novembre', value: '11' },
  { name: 'Décembre', value: '12' }
];



  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private templateService = inject(TemplatesService);

  ngOnInit(): void {
    this.templateId = this.route.snapshot.paramMap.get('templateId')!;
    this.templateService.getTemplateById(this.templateId).subscribe({
      next: (template) => {
        this.templateName = template.name;
        const comp = this.templateService.getTemplateComponent(template.name);
        if (comp) {
          this.componentToRender = comp;
        } else {
          console.error('Aucun composant trouvé pour la clé :', template.name);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du template:', err);
      }
    });
    this.formCvSimple = new FormGroup({
      lastName: new FormControl(''),
      firstName: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      title: new FormControl(''),
      linkedin: new FormControl(''),
      profile: new FormControl(''),
      city: new FormControl(''),
      experiences: new FormArray([]),
      educations: new FormArray([]),
      languages: new FormArray([]),
      certifications: new FormArray([]),
      interests: new FormArray([]),
    });



    this.formCvSimple.valueChanges.subscribe(val => {
      this.previewData = {
        ...val,
        experiences: val.experiences?.map((exp: any) => ({
          ...exp,
          missions: typeof exp.missions === 'string'
            ? exp.missions.split('\n').filter((line: string) => line.trim() !== '')
            : exp.missions ?? []
        })) ?? []
      };
    });



    this.userService.getUser().subscribe({
      next: (user) => {
        if (user) {
          this.formCvSimple.patchValue({
            lastName: user.lastName || '',
            firstName: user.firstName || '',
            email: user.email || '',
          });
        }
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des informations utilisateur:', err);
      }
    });
    
  }

  get experiences(): FormArray {return this.formCvSimple.get('experiences') as FormArray;}
  get educations(): FormArray {return this.formCvSimple.get('educations') as FormArray;}
  get languages(): FormArray {return this.formCvSimple.get('languages') as FormArray;}
  get certifications(): FormArray {return this.formCvSimple.get('certifications') as FormArray;}
  get interests(): FormArray {return this.formCvSimple.get('interests') as FormArray;}
  
  getMissions(expIndex: number): FormArray {
    return this.experiences.at(expIndex).get('missions') as FormArray;
  }

  onSave() {
    if (this.formCvSimple.valid) {
      console.log('Formulaire valide ! Données :', this.formCvSimple.value);
    } else {
      this.formCvSimple.markAllAsTouched();
      this.errorChecker.checkCvEditorFormErrors(this.formCvSimple, this.formErrors);
    }
  }





    addExperience() {
    const experienceGroup = new FormGroup({
      title: new FormControl(''),
      company: new FormControl(''),
      location: new FormControl(''),
      startMonth: new FormControl(''),
      startYear: new FormControl(''),
      endMonth: new FormControl(''),
      endYear: new FormControl(''),
      missions: new FormArray([new FormControl('')])

    });
    this.experiences.push(experienceGroup);
  }

  addEducation() {
    const educationGroup = new FormGroup({
      school: new FormControl(''),
      location: new FormControl(''),
      field: new FormControl(''),
      startYear: new FormControl(''),
      endYear: new FormControl('')
    });
    this.educations.push(educationGroup);
  }

  addCertification() {
  const certGroup = new FormGroup({
      title: new FormControl(''),
      institution: new FormControl(''),
      date: new FormControl('')
    });
    this.certifications.push(certGroup);
  }

  addLanguage() {
    const languageGroup = new FormGroup({
      name: new FormControl(''),
      level: new FormControl('')
    });
    this.languages.push(languageGroup);
  }

  addInterest() {
    const interestGroup = new FormGroup({
      name_interest: new FormControl(''),
    });
    this.interests.push(interestGroup);
  }

  addMission(expIndex: number) {
    this.getMissions(expIndex).push(new FormControl(''));
  }

  removeExperience(index: number) {this.experiences.removeAt(index);}
  removeEducation(index: number) {this.educations.removeAt(index);}
  removeLanguage(index: number) {this.languages.removeAt(index);}
  removeCertification(index: number) {this.certifications.removeAt(index);}
  removeInterest(index: number) {this.interests.removeAt(index);}
  removeMission(expIndex: number, missionIndex: number) {this.getMissions(expIndex).removeAt(missionIndex);}
}
