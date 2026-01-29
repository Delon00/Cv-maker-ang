import { Component, OnInit, inject, effect } from '@angular/core';
import { FormControl, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

// Services
import { UserService } from '@services/user.service';
import { TemplatesService } from '@services/templates.service';
import { CvService } from '@services/cv.service';

// Utils & UI
import FormErrorChecker from '@app/utils/formErrorChecker';
import { NavbarComponent } from '@layout/navbar/navbar.component';
import { SelectModule } from 'primeng/select';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Dialog } from 'primeng/dialog';
import { Toast } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-cv-editor',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NavbarComponent, 
    SelectModule, 
    Toast, 
    ButtonModule, 
    Dialog
  ],
  templateUrl: './cv-editor.component.html',
  styleUrls: ['./cv-editor.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class CvEditorComponent implements OnInit {
  // États de l'interface
  visible: boolean = false;
  templateId!: string;
  templateName = '';
  componentToRender: any;
  isLoading = false;

  // Formulaire & Données
  formCvSimple!: FormGroup;
  previewData: any = {};
  formErrors: { [key: string]: string } = {};
  errorChecker = FormErrorChecker();
  
  // User Context
  currentYear: number = new Date().getFullYear();
  userId: string | null = null;

  // Listes déroulantes (Options)
  langues = [
    {name: 'Allemand', value: 'Allemand'}, {name: 'Anglais', value: 'Anglais'},
    {name: 'Arabe', value: 'Arabe'}, {name: 'Chinois', value: 'Chinois'},
    {name: 'Coréen', value: 'Coréen'}, {name: 'Espagnol', value: 'Espagnol'},
    {name: 'Français', value: 'Français'}, {name: 'Hindi', value: 'Hindi'},
    {name: 'Italien', value: 'Italien'}, {name: 'Japonais', value: 'Japonais'},
    {name: 'Néerlandais', value: 'Néerlandais'}, {name: 'Portugais', value: 'Portugais'},
    {name: 'Russe', value: 'Russe'}, {name: 'Suédois', value: 'Suédois'},
    {name: 'Turc', value: 'Turc'}
  ];

  langLevel = [
    {level:'A1',value:'A1'}, {level:'A2',value:'A2'}, {level:'B1',value:'B1'},
    {level:'B2',value:'B2'}, {level:'C1',value:'C1'}, {level:'C2',value:'C2'},
    {level:'Langue maternelle',value:'Langue maternelle'}
  ];

  month = [
    { name: 'Janvier', value: '01' }, { name: 'Février', value: '02' },
    { name: 'Mars', value: '03' }, { name: 'Avril', value: '04' },
    { name: 'Mai', value: '05' }, { name: 'Juin', value: '06' },
    { name: 'Juillet', value: '07' }, { name: 'Août', value: '08' },
    { name: 'Septembre', value: '09' }, { name: 'Octobre', value: '10' },
    { name: 'Novembre', value: '11' }, { name: 'Décembre', value: '12' }
  ];

  // Injections
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private templateService = inject(TemplatesService);
  private cvService = inject(CvService);
  private messageService = inject(MessageService);

  constructor() {
    // ✅ Utilisation de l'effect pour réagir aux changements de l'utilisateur (Signal)
    effect(() => {
      const user = this.userService.currentUser();
      if (user) {
        this.userId = user.id;
        // Pré-remplissage du formulaire si disponible
        if (this.formCvSimple) {
          this.formCvSimple.patchValue({
            lastName: user.lastName ?? '',
            firstName: user.firstName ?? '',
            email: user.email ?? '',
          }, { emitEvent: false }); // emitEvent: false évite de déclencher valueChanges inutilement
        }
      } else {
        this.userId = null;
      }
    });
  }

  ngOnInit(): void {
    // 1. Initialisation du Formulaire
    this.initForm();

    // 2. Récupération du Template via l'URL
    this.templateId = this.route.snapshot.paramMap.get('templateId')!;
    if (this.templateId) {
      this.loadTemplateInfo(this.templateId);
    }

    // 3. Abonnement aux changements pour la preview en temps réel
    this.formCvSimple.valueChanges.subscribe(val => {
      this.updatePreviewData(val);
    });
  }

  private initForm() {
    this.formCvSimple = new FormGroup({
      cvName: new FormControl('', Validators.required), // Ajout Validator recommandé
      lastName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl(''),
      resume: new FormControl(''),
      city: new FormControl(''),
      profile: new FormControl(''),
      linkedIn: new FormControl(''),
      website: new FormControl(''),
      experiences: new FormArray([]),
      skills: new FormArray([]),
      educations: new FormArray([]),
      languages: new FormArray([]),
      certifications: new FormArray([]),
      interests: new FormArray([]),
    });
  }

  private loadTemplateInfo(id: string) {
    this.templateService.getTemplateById(id).subscribe({
      next: (template) => {
        this.templateName = template.name;
        const comp = this.templateService.getTemplateComponent(template.name);
        if (comp) {
          this.componentToRender = comp;
        } else {
          console.error('Aucun composant trouvé pour :', template.name);
        }
      },
      error: (err) => console.error('Erreur chargement template:', err)
    });
  }

  private updatePreviewData(val: any) {
    this.previewData = {
      ...val,
      // Transformation des missions (string vers array si nécessaire pour l'affichage)
      experiences: val.experiences?.map((exp: any) => ({
        ...exp,
        missions: typeof exp.missions === 'string'
          ? exp.missions.split('\n').filter((line: string) => line.trim() !== '')
          : exp.missions ?? []
      })) ?? []
    };
  }

  // --- GETTERS POUR LE HTML ---
  get experiences(): FormArray { return this.formCvSimple.get('experiences') as FormArray; }
  get educations(): FormArray { return this.formCvSimple.get('educations') as FormArray; }
  get skills(): FormArray { return this.formCvSimple.get('skills') as FormArray; }
  get languages(): FormArray { return this.formCvSimple.get('languages') as FormArray; }
  get certifications(): FormArray { return this.formCvSimple.get('certifications') as FormArray; }
  get interests(): FormArray { return this.formCvSimple.get('interests') as FormArray; }

  getMissions(expIndex: number): FormArray {
    return this.experiences.at(expIndex).get('missions') as FormArray;
  }

  // --- ACTIONS ---

  onSave() {
    if (!this.userId) {
      this.messageService.add({severity: 'warn', summary: 'Non connecté', detail: 'Connectez-vous pour sauvegarder.'});
      return;
    }

    if (this.formCvSimple.valid) {
      this.isLoading = true;
      const formData = {
        ...this.formCvSimple.value,
        userId: this.userId, // On assure l'envoi de l'ID utilisateur
        templateId: this.templateId,
      };

      this.cvService.createCv(formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'CV sauvegardé !' });
          this.visible = false;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur sauvegarde :', error);
          this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de sauvegarder.' });
          this.isLoading = false;
        }
      });
    } else {
      this.formCvSimple.markAllAsTouched();
      this.errorChecker.checkCvEditorFormErrors(this.formCvSimple, this.formErrors);
      this.messageService.add({ severity: 'error', summary: 'Formulaire invalide', detail: 'Vérifiez les champs rouges.' });
    }
  }

  onConfirm() {
    this.visible = true;
  }

  onDownload() {
    // Logique de téléchargement PDF à implémenter
    console.log('Download trigger');
  }

  // --- GESTION DES FORM ARRAYS ---

  addExperience() {
    const experienceGroup = new FormGroup({
      jobTitle: new FormControl(''),
      company: new FormControl(''),
      location: new FormControl(''),
      startMonth: new FormControl(''),
      startYear: new FormControl(''),
      endMonth: new FormControl(''),
      endYear: new FormControl(''),
      missions: new FormArray([new FormControl('')]) // Initialiser avec une mission vide
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

  addSkill() {
    this.skills.push(new FormGroup({
      name: new FormControl('')
    }));
  }

  addCertification() {
    this.certifications.push(new FormGroup({
      title: new FormControl(''),
      institution: new FormControl(''),
      date: new FormControl('')
    }));
  }

  addLanguage() {
    this.languages.push(new FormGroup({
      name: new FormControl(''),
      level: new FormControl('')
    }));
  }

  addInterest() {
    this.interests.push(new FormGroup({
      name_interest: new FormControl('')
    }));
  }

  addMission(expIndex: number) {
    this.getMissions(expIndex).push(new FormControl(''));
  }

  removeExperience(index: number) { this.experiences.removeAt(index); }
  removeEducation(index: number) { this.educations.removeAt(index); }
  removeSkill(index: number) { this.skills.removeAt(index); }
  removeLanguage(index: number) { this.languages.removeAt(index); }
  removeCertification(index: number) { this.certifications.removeAt(index); }
  removeInterest(index: number) { this.interests.removeAt(index); }
  
  removeMission(expIndex: number, missionIndex: number) {
    this.getMissions(expIndex).removeAt(missionIndex);
  }
}