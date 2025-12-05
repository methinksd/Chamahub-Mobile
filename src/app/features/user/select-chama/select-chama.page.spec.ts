import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectChamaPage } from './select-chama.page';

describe('SelectChamaPage', () => {
  let component: SelectChamaPage;
  let fixture: ComponentFixture<SelectChamaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChamaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
