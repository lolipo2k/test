import { Controller } from '@nestjs/common';
import { PersonalAccountService } from '../service/personal-account.service';

@Controller('personal-account')
export class PersonalAccountController {
  constructor(private readonly personalAccountService: PersonalAccountService) {}
}
