import {
	Publisher,
	ExpirationCompleteEvent,
	Subjects,
} from '@anirbantickets/common';

export class ExpirationCompletePublish extends Publisher<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
