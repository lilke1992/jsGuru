import { Global, Module } from '@nestjs/common';
import { DbprismaService } from './dbprisma.service';

@Global()
@Module({
  providers: [DbprismaService],
  exports: [DbprismaService],
})
export class DbprismaModule {}
