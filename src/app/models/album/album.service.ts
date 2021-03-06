import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { Album } from './album.model';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private _http: HttpClient) {}

  /** Returns 4 Albums from 100 */
  getAll(): Observable<Album[]> {
    const url = 'https://jsonplaceholder.typicode.com/albums';
    return this._http.get<Album[]>(url)
    .pipe(map((albums: Album[]) => {
      return albums.slice(8, 12);
    }));
  }

  getAllAsFormArray(): Observable<FormArray> {
    return this.getAll().pipe(map((albums: Album[]) => {
      // Maps all the albums into a formGroup defined in tge album.model.ts
      const fgs = albums.map(Album.asFormGroup);
      return new FormArray(fgs);
    }));
  }
}
