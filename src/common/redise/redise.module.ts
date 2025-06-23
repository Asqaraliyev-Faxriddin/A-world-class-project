import { Global, Module } from '@nestjs/common';
import { RediseService } from './redise.service';

@Global()
@Module({
  providers: [RediseService],
  exports:[RediseService]
})
export class RediseModule {}
