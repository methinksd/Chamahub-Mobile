import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonBadge, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cloudOffline, wifi } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { NativeService } from '../../../core/services/native.service';

@Component({
  selector: 'app-network-status',
  templateUrl: './network-status.component.html',
  styleUrls: ['./network-status.component.scss'],
  standalone: true,
  imports: [CommonModule, IonBadge, IonIcon]
})
export class NetworkStatusComponent implements OnInit, OnDestroy {
  isOnline = true;
  connectionType = 'unknown';
  private networkSubscription?: Subscription;

  constructor(private nativeService: NativeService) {
    addIcons({ cloudOffline, wifi });
  }

  async ngOnInit() {
    // Get initial status
    const status = await this.nativeService.getNetworkStatus();
    this.isOnline = status.connected;
    this.connectionType = status.connectionType;

    // Subscribe to status changes
    this.networkSubscription = this.nativeService.getNetworkStatus$().subscribe(status => {
      this.isOnline = status.connected;
      this.connectionType = status.connectionType;
    });
  }

  ngOnDestroy() {
    this.networkSubscription?.unsubscribe();
  }
}
