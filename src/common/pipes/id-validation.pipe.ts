import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ID_VALIDATION_ERROR } from './id-validation.constans';

@Injectable()
export class IdValidationPipe implements PipeTransform {
	transform(value: string, metadata: ArgumentMetadata) {
		if (metadata.type !== 'param') {
			return value
		}
		if (!this.checkIfValidUUID(value)) {
			throw new BadRequestException(ID_VALIDATION_ERROR)
		}
		return value
	}

	checkIfValidUUID(str: string) {
		const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

		return regexExp.test(str);
	}
}
