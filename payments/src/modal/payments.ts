import { model, Model, Schema, Document } from 'mongoose';

interface PaymentAttrs {
	orderId: string;
	stripeId: string;
}

interface PaymentDoc extends Document {
	orderId: string;
	stripeId: string;
}

interface PaymentModal extends Model<PaymentDoc> {
	build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new Schema<any, any, PaymentAttrs>(
	{
		orderId: {
			required: true,
			type: String,
		},
		stripeId: {
			required: true,
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
	return new Payment(attrs);
};

export const Payment = model<PaymentDoc, PaymentModal>(
	'Payment',
	paymentSchema
);
