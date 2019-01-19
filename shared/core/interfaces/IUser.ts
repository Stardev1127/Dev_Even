import IGeoLocation, { IGeoLocationCreateObject } from './IGeoLocation';
import { DBCreateObject, DBRawObject, PyroObjectId } from '../@pyro/db';

export interface IUserInitializeObject extends DBCreateObject {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	image?: string;
	socialIds?: string[];
	isRegistrationCompleted?: boolean;
	hash?: string;
}

export interface IUserCreateObject extends IUserInitializeObject {
	geoLocation: IGeoLocationCreateObject;
	devicesIds?: string[];
	apartment?: string;
	stripeCustomerId?: string;
}

export interface IResponseGenerate1000Customers {
	success: boolean;
	message: string;
}

interface IUser extends IUserCreateObject, IUserInitializeObject, DBRawObject {
	_id: PyroObjectId;
	geoLocation: IGeoLocation;
	devicesIds: string[];
}

export default IUser;
