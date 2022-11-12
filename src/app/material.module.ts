import { NgModule } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatNativeDateModule } from '@angular/material/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import { MatButton, MatButtonModule } from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper'
import {MatListModule} from '@angular/material/list';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatTableModule} from '@angular/material/table';
const MODULES = [
    
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatStepperModule,
    MatListModule,
    DragDropModule 
    
]
@NgModule({
    imports: [...MODULES],
    exports: [...MODULES],
    providers: [    {
        provide: STEPPER_GLOBAL_OPTIONS,
        useValue: { displayDefaultIndicatorType: false,
            showError: true }
      }
  ],
})
export class MaterialModule { }
