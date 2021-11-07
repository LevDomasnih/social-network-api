import {
    ArrayMinSize,
    IsArray,
    IsNotEmpty,
    IsString, Validate, ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint()
export class IsObjectId implements ValidatorConstraintInterface {
    public async validate(ids: string[], args: ValidationArguments) {
        const isValid = ids.map(id => Types.ObjectId.isValid(id))
        return !isValid.includes(false)
    }
}

export class CreateDialogDto {

    @IsString()
    text: string

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @Validate(IsObjectId, {
        message: 'Id can be a 24 character hex string'
    })
    otherOwners: Types.ObjectId[]

    // image: string
    //
    // file: string
}