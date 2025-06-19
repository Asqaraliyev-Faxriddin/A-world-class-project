import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/common/models/user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private NewUserService:typeof User){}


async  findAll() {

  let data = await this.NewUserService.findAll()
  
  return data
  }


}
