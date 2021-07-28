import { Schema, model, Model, Document } from 'mongoose';
import { Password } from '../services/password';
// An interface that describes the properties
// That are required to create a new user
interface UserAttrs {
	email: string;
	password: string;
}

// An interface that describes the properties
// that a user model has

interface UserModel extends Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has

interface UserDoc extends Document {
	email: string;
	password: string;
}

const userSchema = new Schema<any, any, UserAttrs>(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
				delete ret.__v;
			},
		},
	}
);

userSchema.pre('save', function (done) {
	if (this.isModified('password')) {
		const hashed = Password.toHash(this.get('password'));
		this.set('password', hashed);
	}
	done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

export const User = model<UserDoc, UserModel>('User', userSchema);
