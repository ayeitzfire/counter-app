import { DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);

  searchTerm = '';
  sortBy: 'newest' | 'name' | 'value' = 'newest';
  valueFilter: 'all' | 'positive' | 'negative' = 'all';

  get totalValue(): number {
    return this.counterService
      .counters()
      .reduce((sum, counter) => sum + counter.value, 0);
  }

  get visibleCounters(): SavedCounter[] {
    const search = this.searchTerm.trim().toLocaleLowerCase();
    const filtered = this.counterService
      .counters()
      .filter((counter) =>
        search ? counter.name.toLocaleLowerCase().includes(search) : true,
      )
      .filter((counter) => {
        if (this.valueFilter === 'positive') return counter.value > 0;
        if (this.valueFilter === 'negative') return counter.value < 0;
        return true;
      });

    return [...filtered].sort((first, second) => {
      if (this.sortBy === 'name') {
        return first.name.localeCompare(second.name, 'cs');
      }
      if (this.sortBy === 'value') return second.value - first.value;
      return second.createdAt.localeCompare(first.createdAt);
    });
  }

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  setSort(value: string | undefined): void {
    if (value === 'name' || value === 'value' || value === 'newest') {
      this.sortBy = value;
    }
  }

  setValueFilter(value: unknown): void {
    if (
      typeof value === 'string' &&
      (value === 'positive' || value === 'negative' || value === 'all')
    ) {
      this.valueFilter = value;
    }
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    await this.presentToast('Počítadlo bylo odstraněno.');
  }

  async confirmClear(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Vymazat historii?',
      message: 'Tato akce odstraní všechna uložená počítadla.',
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        {
          text: 'Vymazat',
          role: 'destructive',
          handler: () => void this.clear(),
        },
      ],
    });
    await alert.present();
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
    await this.presentToast('Historie byla vymazána.');
  }

  private async presentToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 1800,
      position: 'bottom',
    });
    await toast.present();
  }
}
