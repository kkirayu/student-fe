import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './schemas/student.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name)
    private studentModel: Model<Student>
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = new this.studentModel(createStudentDto);
    return student.save();
  }

  async findAll(query: any = {}): Promise<any> {
    const { page = 1, limit = 10, search = '', status, class: className } = query;
    
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nim: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) filter.status = status;
    if (className) filter.class = className;

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      this.studentModel.find(filter).skip(skip).limit(Number(limit)).exec(),
      this.studentModel.countDocuments(filter).exec()
    ]);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentModel.findById(id).exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.studentModel
      .findByIdAndUpdate(id, updateStudentDto, {
        new: true,
        runValidators: true
      })
      .exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async remove(id: string): Promise<Student> {
    const student = await this.studentModel.findByIdAndDelete(id).exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async updateProfilePicture(id: string, profilePictureUrl: string): Promise<Student> {
    const student = await this.studentModel
      .findByIdAndUpdate(id, { profilePicture: profilePictureUrl }, { new: true })
      .exec();
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }
}
