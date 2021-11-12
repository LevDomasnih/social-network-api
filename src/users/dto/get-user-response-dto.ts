import { PartialType } from '@nestjs/swagger';
import { UserModel } from '../user.model';

export class GetUserResponseDto extends PartialType(UserModel) {}