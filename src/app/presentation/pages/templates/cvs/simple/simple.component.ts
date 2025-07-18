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
    @Input() phone?: string;
    @Input() title?: string;
    @Input() city?: string;

    @Input() profile?: string;

    @Input() experiences?: {
      date:         string;
      title:        string;
      company:      string;
      startMonth:   string;
      startYear:    string;
      endMonth:     string;
      endYear:      string;
      location:     string;
      missions:     string[];
    }[];

    @Input() education?: {
      date: string;
      title: string;
      school: string;
      location: string;
    }[];

    @Input() languages?: {
      name: string;
      level: string;
    }[];

    @Input() interests?: {
      name_interest: string;
    }[];


    @Input() skills?: string[];



    @Input() linkedin?: string;
    @Input() certifications?: string;
}
