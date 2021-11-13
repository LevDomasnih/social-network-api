import { PartialType } from '@nestjs/swagger';
import { ProfileModel } from '../profile.model';

export class GetProfileResponseDto extends PartialType(ProfileModel) { }