import {
	Component,
	OnDestroy,
	Input,
	Output,
	EventEmitter,
} from '@angular/core';
import Order from '@modules/server.common/entities/Order';
import { getCountryName } from '@modules/server.common/entities';
import { CallNumber } from '@ionic-native/call-number';
import Warehouse from '@modules/server.common/entities/Warehouse';
import { Store } from 'app/services/store.service';
import { ModalController } from '@ionic/angular';
import { CallPage } from '../../../+call/call.page';

@Component({
	selector: 'e-cu-order-takeaway-info-store-info',
	templateUrl: './store-info.component.html',
	styleUrls: ['./store-info.component.scss'],
})
export class TakeawayStoreInfoComponent implements OnDestroy {
	@Input()
	order: Order;

	get warehouse(): Warehouse {
		if (this.order && this.order.warehouse) {
			return this.order.warehouse as Warehouse;
		} else {
			return null;
		}
	}

	@Input()
	lessInfo: boolean;

	@Output()
	openMap = new EventEmitter<boolean>();

	public modalChange: EventEmitter<boolean>;

	constructor(
		private store: Store,
		public modalController: ModalController
	) {}

	get inStore() {
		return this.store.inStore;
	}

	get storeFullAddress(): string {
		if (this.order && this.order.warehouse) {
			const store = this.order.warehouse;

			return (
				`${store['geoLocation'].city}, ${store['geoLocation'].streetAddress} ` +
				`${store['geoLocation'].house}, ${
					store['geoLocation'].postcode
						? store['geoLocation'].postcode + ', '
						: ''
				} ${getCountryName(store['geoLocation'].countryId)}`
			);
		}
		return;
	}

	async attemptCall(phone) {
		try {
			await CallNumber.callNumber(phone, true);
		} catch (err) {
			// TODO: implement popup notification
			const modal = this.modalController.create({
				component: CallPage,
				cssClass: 'order-info-modal',
				componentProps: { modalChange: this.modalChange },
			});
			return (await modal).present();
			// console.warn('Call Was Unsuccessful!');
		}
	}

	ngOnDestroy(): void {}
}
