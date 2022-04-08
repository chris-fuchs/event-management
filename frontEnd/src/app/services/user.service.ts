import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
const API_URL = 'http://localhost:8080/api/test/';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  demoteOrgToUser(id: any) {
    return this.http.put(API_URL + 'demoteOrgToUser/' + id, { responseType: 'text' });
  }
  demoteModToUser(id: any) {
    return this.http.put(API_URL + 'demoteModToUser/' + id, { responseType: 'text' });
  }
  deleteUser(id: any) {
    console.log("delete: ",id);
    return this.http.delete(API_URL + 'delete/' + id, { responseType: 'text' });
  }
  promoteUserToOrganizer(id: any) {
    return this.http.put(API_URL + 'user2org/' + id, { responseType: 'text' });
  }
  promoteUserToModerator(id: any) {
    console.log("promote2mod: ",id);
    return this.http.put(API_URL + 'user2mod/' + id, { responseType: 'text' });
  }
  constructor(private http: HttpClient) { }
  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }
  getAdminBoard(): Observable<any> {
    return this.http.get<User[]>(API_URL + 'admin');
  }

  getFavouriteEventList(id: any) {
    return this.http.get<String[]>(API_URL + 'favEventList/' + id);
  }

  addFavEvent(id: any) {
    return this.http.put(API_URL + 'addFavEvent/' + id, { responseType: 'text' });
  }

  removeFavEvent(id: any) {
    return this.http.put(API_URL + 'removeFavEvent/' + id, { responseType: 'text' });
  }

  updateUser(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URL}user/update/${id}`, data);
  }

  getProfilePicture(id: any) {
    return this.http.get(API_URL + 'profilePicture/' + id, { responseType: 'text' });
  }
}
