import { Component } from '@angular/core';

@Component({
  selector: 'app-activities-start',
  templateUrl: './activities-start.component.html',
  styleUrl: './activities-start.component.scss',
})
export class ActivitiesStartComponent {
  protected readonly items = [
    { at: '09:30', title: 'Müşteri araması', detail: 'ACME Ltd.' },
    { at: '11:00', title: 'Demo toplantısı', detail: 'Beta Inc.' },
    { at: '15:15', title: 'Teklif gönderildi', detail: 'Gamma Co.' },
  ];
}
