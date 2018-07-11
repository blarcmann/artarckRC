import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  providers: [DataService]
})
export class MessageComponent implements OnInit {

  constructor( private data: DataService) { }

  ngOnInit() {
  }

}
