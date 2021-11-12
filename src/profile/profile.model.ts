import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { ApiProperty } from '@nestjs/swagger';

export interface ProfileModel extends Base {
}

export class ProfileModel extends TimeStamps {
    @ApiProperty()
    @prop({ default: '' })
    status: string;

    @ApiProperty()
    @prop({ default: '' })
    about: string;

    @ApiProperty()
    @prop({ default: '' })
    dateOfBirth: string;

    @ApiProperty()
    @prop({ default: '' })
    country: string;

    @ApiProperty()
    @prop({ default: '' })
    city: string;

    @ApiProperty()
    @prop({ default: '' })
    brothersAndSisters: string;

    @ApiProperty()
    @prop({ default: '' })
    school: string;
}