import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-simple',
  imports: [],
  templateUrl: './simple.component.html',
  styleUrl: './simple.component.scss'
})
export class SimpleComponent {

  @Input() lastName?: string;
  @Input() firstName?: string;
  @Input() email?: string;
  @Input() profile?: string;
  @Input() website?: string;
  @Input() phone?: string;
  @Input() linkedIn?: string;
  @Input() title?: string;
  @Input() city?: string;
  @Input() resume?: string;

  @Input() experiences?: {
    date:         string;
    jobTitle:        string;
    company:      string;
    startMonth:   string;
    startYear:    string;
    endMonth:     string;
    endYear:      string;
    location:     string;
    missions:     string[];
  }[];

  @Input() educations?: {
    school: string;
    location: string;
    field: string;
    startYear: string;
    endYear  : string;
  }[];

  @Input() languages?: {
    name: string;
    level: string;
  }[];

  @Input() interests?: {
    name_interest: string;
  }[];

  @Input() skills?:{
    name:string;
  }[];


  @Input() certifications?: {
    title: string;
    date: string;
  }[];
}
