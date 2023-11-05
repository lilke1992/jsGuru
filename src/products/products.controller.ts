import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../user/decorator';
import { JWTGuard } from '..//user/guard';
import { User } from '@prisma/client';
import { CreateProduct } from './dto';
import { ProductsService } from './products.service';
import { PaginationDto } from 'src/global-dto';

@UseGuards(JWTGuard)
@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createProduct(@GetUser() user: User, @Body() dto: CreateProduct) {
    const createdProduct = await this.productService.createProduct(dto, user);
    return createdProduct;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getProductsWithPagination(
    @Query()
    query: PaginationDto,
  ) {
    const lsitOfPorducts = await this.productService.getWithPagination(
      query.page - 1,
      query.perPage,
    );
    return lsitOfPorducts;
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product with given ID is not found');
    }
    return product;
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteProductById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product with given ID is not found');
    }
    if (product.userId !== user.id) {
      throw new ForbiddenException(
        'You cant delete products created by other users',
      );
    }
    await this.productService.deleteProductById(id, user.id);
    return product;
  }
}
