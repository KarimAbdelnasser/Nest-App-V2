import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
