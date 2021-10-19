import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EmailFromJWTPipes implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any {
        console.log(metadata);
    }
}