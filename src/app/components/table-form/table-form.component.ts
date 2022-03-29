import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { AlbumService } from 'src/app/models/album/album.service';
import { User } from 'src/app/models/user/user.model';
import { UserService } from 'src/app/models/user/user.service';

@Component({
  selector: 'app-table-form',
  templateUrl: './table-form.component.html',
  styleUrls: ['./table-form.component.scss']
})
export class TableFormComponent implements OnInit {

  @ViewChild(MatTable) userTable!: MatTable<any>;

  form!: FormGroup;
  addCounter: number | null = null;
  users: User[] = [];
  displayedColumns = ['id', 'userId', 'title'];

  constructor(
    private _albumService: AlbumService,
    private _userService: UserService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this._formBuilder.group({
      albums: this._formBuilder.array([])
    });
    this._albumService.getAllAsFormArray().subscribe(albums => {
      this.form.setControl('albums', albums);
      console.log(albums.value);

      let albumValues = albums.value;
      for (let i = 0; i < albumValues.length; i++) {
        let album = albumValues[i];

        if (this.addCounter === null || this.addCounter <= album.id) {
          this.addCounter = album.id;
        }
      }
    });
    this._userService.getAll().subscribe(users => {
      this.users = users;
    });
  }

  get albums(): FormArray {
    return this.form.get('albums') as FormArray;
  }

  // On user change I clear the title of that album
  onUserChange(event: any, album: FormGroup) {
    const title = album.get('title');

    if (title) {
    title.setValue(null);
    title.markAsUntouched();
    // Notice the ngIf at the title cell definition. The user with id 3 can't set the title of the albums
    }
  }

  add() {
    if (this.addCounter === null) { this.addCounter = 1; }
    this.addCounter += 1;

    let add = this._formBuilder.group({
      id: [this.addCounter],
      userId: [0],
      title: ['']
    });

    this.albums.push(add);

    this.userTable.renderRows();
  }

}
