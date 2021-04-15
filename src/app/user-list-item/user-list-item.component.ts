import { Component, Input, OnInit } from "@angular/core";
import { User } from "../shared/user";

@Component({
  selector: "tr.c-user-list-item",
  templateUrl: "./user-list-item.component.html"
})
export class UserListItemComponent implements OnInit {
  @Input() user: User;

  constructor() {}

  ngOnInit() {}
}
