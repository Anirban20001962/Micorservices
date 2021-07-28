import { Document, Model, Schema, model } from 'mongoose';
import { Order } from '../modals/order';
import { OrderStatus } from '@anirbantickets/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface QueryEvent {
	id: string;
	version: number;
}

interface TicketAttrs {
	id: string;
	title: string;
	price: number;
}

export interface TicketDoc extends Document {
	title: string;
	price: number;
	version: number;
	isReserved(): Promise<boolean>;
}

interface TicketModel extends Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
	findByEvent(event: QueryEvent): Promise<TicketDoc | null>;
}

const ticketSchema = new Schema<any, any, TicketAttrs>(
	{
		title: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket({
		_id: attrs.id,
		title: attrs.title,
		price: attrs.price,
	});
};
ticketSchema.statics.findByEvent = async (data: QueryEvent) => {
	const ticket = await Ticket.findOne({
		_id: data.id,
		version: data.version - 1,
	});
	return ticket;
};

ticketSchema.methods.isReserved = async function () {
	// Run querry to look at all orders. Find an order where the ticket
	// is the ticket we just found *and* the orders status is *not* cancelled.
	// If we find an order from that means the ticket *is* reserved
	const existingOrder = await Order.findOne({
		ticket: this,
		status: {
			$in: [
				OrderStatus.Created,
				OrderStatus.AwaitingPayment,
				OrderStatus.Complete,
			],
		},
	});
	return !!existingOrder;
};

export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);
