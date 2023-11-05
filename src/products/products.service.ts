import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProduct } from './dto';
import { Product, User } from '@prisma/client';
import { DbprismaService } from 'src/dbprisma/dbprisma.service';

@Injectable()
export class ProductsService {
  constructor(private dbPrisma: DbprismaService) {}

  async createProduct(dto: CreateProduct, user: User): Promise<Product> {
    const doExist = await this.dbPrisma.product.findFirst({
      where: {
        name: dto.name,
        userId: user.id,
      },
    });
    if (doExist) {
      throw new ConflictException('Same product already exist');
    }
    const createdProduct = await this.dbPrisma.product.create({
      data: {
        userId: user.id,
        description: dto.description,
        name: dto.name,
        price: dto.price,
        quantity: dto.quantity,
      },
    });
    return createdProduct;
  }

  async getWithPagination(page: number, perPage: number): Promise<Product[]> {
    const list = await this.dbPrisma.product.findMany({
      take: perPage,
      skip: perPage * page,
    });
    return list;
  }

  async getProductById(id: number): Promise<Product | null> {
    const product = await this.dbPrisma.product.findUnique({
      where: {
        id: id,
      },
    });
    return product;
  }

  async deleteProductById(id: number, userId: number): Promise<boolean> {
    try {
      await this.dbPrisma.product.delete({
        where: {
          id: id,
          userId: userId,
        },
      });
      return true;
    } catch {
      throw new InternalServerErrorException(
        'An error has occured while deleting. Try again later',
      );
    }
  }
}
