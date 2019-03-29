import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from 'app/@theme';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SetupMerchantsComponent } from './merchants.component';
import { NbStepperModule } from '@nebular/theme';
import { MerchantsSetupInstructionsComponent } from './instructions/instructions.component';

const routes: Routes = [
	{
		path: '',
		component: SetupMerchantsComponent
	}
];

@NgModule({
	imports: [
		CommonModule,
		ThemeModule,
		RouterModule.forChild(routes),
		TranslateModule.forChild(),
		NbStepperModule
	],
	declarations: [SetupMerchantsComponent, MerchantsSetupInstructionsComponent]
})
export class SetupMerchantsModule {}
