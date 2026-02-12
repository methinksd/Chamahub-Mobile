import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  RefresherCustomEvent
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonBadge,
    IonRefresher,
    IonRefresherContent,
    IonSearchbar
  ]
})
export class MembersPage implements OnInit {
  members: any[] = [];
  filteredMembers: any[] = [];
  searchTerm = '';

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    // TODO: Implement actual API call
    this.members = [];
    this.filteredMembers = this.members;
  }

  handleRefresh(event: RefresherCustomEvent) {
    this.loadMembers();
    event.target.complete();
  }

  handleSearch(event: any) {
    this.searchTerm = event.target.value?.toLowerCase() || '';
    this.filteredMembers = this.members.filter(m =>
      m.name?.toLowerCase().includes(this.searchTerm) ||
      m.email?.toLowerCase().includes(this.searchTerm)
    );
  }
}
