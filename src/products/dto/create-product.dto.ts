import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsDecimal, IsInt } from 'class-validator';

export class CreateProduct {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Quantity must be a valid integer number' })
  @IsNotEmpty()
  quantity: number;
}
