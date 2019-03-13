import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouteReuseStrategy } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CommonModule } from '@modules/client.common.angular2';
import { MenuModule } from '../components/menu/menu.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Logger } from 'angular2-logger/core';
import { environment } from '../environments/environment';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { FileUploadModule } from 'ng2-file-upload';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';
import { Mixpanel } from '@ionic-native/mixpanel/ngx';
import { Intercom } from '@ionic-native/intercom/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { GraphQLModule } from '../graphql/apollo.config';
import { Camera } from '@ionic-native/camera/ngx';
import { Store } from '../services/store.service';
import { UserMutationModule } from '../@shared/user/mutation/user-mutation.module';
import { GoogleMapsLoader } from '@modules/client.common.angular2/services/googleMapsLoader';
import { MaintenanceService } from '@modules/client.common.angular2/services/maintenance.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PagesModuleGuard } from '../pages/pages.module.guard';
import { MaintenanceModuleGuard } from './+maintenance-info/maintenance-info.module.guard';
import { ServiceWorkerModule } from '@angular/service-worker';
import { Network } from '@ionic-native/network/ngx';
import { Device } from '@ionic-native/device/ngx';
import { first } from 'rxjs/operators';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MenuModule,
		HttpLinkModule,
		IonicModule.forRoot(),
		IonicStorageModule.forRoot(),
		GraphQLModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		CommonModule.forRoot({
			apiUrl: environment.SERVICES_ENDPOINT
		}),
		FileUploadModule,
		UserMutationModule,
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production
		})
	],
	entryComponents: [AppComponent],
	providers: [
		InAppBrowser,
		SplashScreen,
		StatusBar,
		Network,
		Device,
		GoogleMapsLoader,
		{
			provide: APP_INITIALIZER,
			useFactory: googleMapsLoaderFactory,
			deps: [GoogleMapsLoader],
			multi: true
		},
		MaintenanceService,
		{
			provide: APP_INITIALIZER,
			useFactory: maintenanceFactory,
			deps: [MaintenanceService],
			multi: true
		},
		// { provide: ErrorHandler, useClass: IonicErrorHandler },
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
		Logger,
		PagesModuleGuard,
		MaintenanceModuleGuard,
		Store,
		CallNumber,
		EmailComposer,
		Globalization,
		GoogleAnalytics,
		Intercom,
		Mixpanel,
		ScreenOrientation,
		Camera,
		BarcodeScanner
	],
	bootstrap: [AppComponent]
})
export class AppModule {
	constructor(
		private readonly http: HttpClient,
		private readonly store: Store
	) {
		this.checkServerConnection();
	}

	private async checkServerConnection() {
		try {
			await this.http
				.get(environment.SERVICES_ENDPOINT)
				.pipe(first())
				.toPromise();
		} catch (error) {
			this.store.serverConnection = error.status;
		}
	}
}

export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function googleMapsLoaderFactory(provider: GoogleMapsLoader) {
	return () => provider.load(environment.GOOGLE_MAPS_API_KEY);
}

export function maintenanceFactory(provider: MaintenanceService) {
	return () =>
		provider.load(
			environment['SETTINGS_APP_TYPE'],
			environment['SETTINGS_MAINTENANCE_API_URL']
		);
}
