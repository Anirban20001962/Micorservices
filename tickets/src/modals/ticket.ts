import { Document, Model, Schema, model } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
	title: string;
	price: number;
	userId: string;
	orderId?: string;
}

interface TicketDoc extends Document {
	title: string;
	price: number;
	userId: string;
	version: number;
	orderId?: string;
}

interface TicketModal extends Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
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
		},
		userId: {
			type: String,
			required: true,
		},
		orderId: {
			type: String,
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

ticketSchema.statics.build = (attr: TicketAttrs) => {
	return new Ticket(attr);
};

export const Ticket = model<TicketDoc, TicketModal>('Ticket', ticketSchema);
