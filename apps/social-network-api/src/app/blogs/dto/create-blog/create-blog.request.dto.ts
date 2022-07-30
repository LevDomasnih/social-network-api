import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { InlineStyleRanges } from '@app/nest-postgre';
import { plainToClass, Transform, Type } from 'class-transformer';

class InlineStyleRangesDto implements InlineStyleRanges {
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    length: number;
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    offset: number;
    @ApiProperty()
    @IsString()
    @IsOptional()
    style: string;
}

class TextBlocks {
    @ApiProperty()
    @IsObject()
    data: {};

    @ApiProperty()
    @IsNumber()
    depth: number;

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    entityRanges: string[];

    @ApiProperty()
    @IsArray()
    @Type(() => InlineStyleRangesDto)
    @ValidateNested({ each: true })
    inlineStyleRanges: Array<InlineStyleRangesDto>;

    @ApiProperty()
    @IsString()
    key: string;

    @ApiProperty()
    @IsString()
    text: string;

    @ApiProperty()
    @IsString()
    type: string;
}

export class CreateBlogRequestDto {
    @ApiProperty({ type: () => [TextBlocks] })
    @ValidateNested({ each: true })
    @Transform(({ value }) => JSON.parse(value).map((v: TextBlocks) => plainToClass(TextBlocks, v)))
    textBlocks: TextBlocks[];
    @ApiProperty()
    @Transform(({ value }) => JSON.parse(value))
    @IsObject()
    entityMap: {};
}
