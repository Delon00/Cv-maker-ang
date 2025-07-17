import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-simple',
  imports: [],
  templateUrl: './simple.component.html',
  styleUrl: './simple.component.scss'
})
export class SimpleComponent {
    @Input() lastName!: string;
    @Input() firstName!: string;
    @Input() email!: string;
    @Input() phone!: string;
    @Input() title!: string;
    @Input() city!: string;

    @Input() profile!: string;

    @Input() experiences!: {
      date: string;
      title: string;
      company: string;
      startDate: string;
      endDate: string;
      location: string;
      missions: string[];
    }[];

    @Input() education!: {
      date: string;
      title: string;
      school: string;
      location: string;
    }[];

    @Input() skills!: string[];

    @Input() languages!: string[];
    @Input() interests!: string;
    @Input() linkedin!: string;
    @Input() certifications!: string;
}
