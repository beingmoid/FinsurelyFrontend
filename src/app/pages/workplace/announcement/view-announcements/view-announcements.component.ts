import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-announcements',
  templateUrl: './view-announcements.component.html',
  styleUrls: ['./view-announcements.component.scss']
})
export class ViewAnnouncementsComponent implements OnInit {
  isVisible = false;
  isEditMode = false;

  constructor() { }

  ngOnInit(): void {
  }


  openModal() {
    this.isVisible = true;
    this.isEditMode= false;
  }
  closeModal() {
    this.isVisible = false;
  }
}
