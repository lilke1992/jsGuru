import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsDecimal, IsInt } from 'class-validator';

export class CreateProduct {
  @ApiProperty({
    example: 'product 1',
    description:
      'Product name. It must be a unique name for user. Might be that same product name exist for multiple users but their userId will be different',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Product description goes here',
    description: 'The description of the product',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 20,
    description: 'Price of the product. it is an decimal value',
  })
  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 2,
    description:
      'Quantity of the product. It must be an integer value greater then 0',
  })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Quantity must be a valid integer number' })
  @IsNotEmpty()
  quantity: number;
}
