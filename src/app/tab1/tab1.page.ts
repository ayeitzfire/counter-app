import { Component, inject } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonTitle,
  ToastController,
  IonToolbar,
} from '@ionic/angular';
import { CounterComponent } from '../components/counter/counter.component';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CounterComponent, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class Tab1Page {
  private readonly counterService = inject(CounterService);
  private readonly toastController = inject(ToastController);

  async onSaved(counter: SavedCounter): Promise<void> {
    await this.counterService.add(counter);
    const toast = await this.toastController.create({
      message: 'Počítadlo bylo uloženo.',
      duration: 1800,
      position: 'bottom',
    });
    await toast.present();
  }
}
