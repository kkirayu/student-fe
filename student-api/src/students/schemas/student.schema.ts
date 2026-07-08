import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ required: true, unique: true })
  nim: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  class: string;

  @Prop({ required: true })
  year: number;

  @Prop({
    required: true,
    min: 0,
    max: 4
  })
  gpa: number;

  @Prop({
    required: true,
    enum: ['active', 'graduated', 'dropout'],
    default: 'active'
  })
  status: string;

  @Prop()
  profilePicture?: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
