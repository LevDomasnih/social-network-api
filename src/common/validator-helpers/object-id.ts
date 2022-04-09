import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Types } from 'mongoose';

@ValidatorConstraint()
export class IsObjectIds implements ValidatorConstraintInterface {
    public async validate(ids: string[], args: ValidationArguments) {
        const isValid = ids.map(id => Types.ObjectId.isValid(id))
        return !isValid.includes(false)
    }
}

@ValidatorConstraint()
export class IsObjectId implements ValidatorConstraintInterface {
    public async validate(id: string, args: ValidationArguments) {
        return Types.ObjectId.isValid(id)
    }
}