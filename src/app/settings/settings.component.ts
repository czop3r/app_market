import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Company } from '../market/company.model';
import { SettingsService } from './settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
  }

  onCreateCompany(
    symbol: string,
    price: string,
    volume: string,
    change: string,
    changePercent: string
  ) {
    const company = new Company(
      symbol,
      price,
      volume,
      change,
      changePercent
    );
    this.settingsService.onAddCompany(company)
  }

  onSearch(f: NgForm) {
    console.log(f.form.value.search);
    this.settingsService.onFetchSearch(f.form.value.search).subscribe(
      sub => {
        console.log(sub)
      }
    );
  }

  onSubmit(f: NgForm) {
    const value = f.form.value
    this.onCreateCompany(
      value.symbol,
      value.price,
      value.volume,
      value.change,
      value.changePercent
    )
  }

}
