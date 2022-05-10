import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { UIService } from 'src/app/shared/UI.service';

export interface DialogData {
  email: string;
  idToken: string
}

@Component({
  selector: 'app-settings-user-dialog',
  templateUrl: './settings-user-dialog.component.html',
  styleUrls: ['./settings-user-dialog.component.scss']
})
export class SettingsUserDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<SettingsUserDialogComponent>,
    private authService: AuthService,
    private uiService: UIService
  ) { }

  ngOnInit(): void {
  }

  onDeleteUser() {
    this.authService.deleteUser(this.data.idToken)
    .pipe(
      switchMap(() => this.authService.deleteUserData())
    )
    .subscribe(() => {
      this.uiService.openSnackBar('Account deleted!', 'close', 3000);
    });
    this.dialogRef.close();
  }

  onNoClick() {
    this.dialogRef.close();
  }

}
