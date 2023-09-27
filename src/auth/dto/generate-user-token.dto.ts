import { UserRole } from './../../users/entities/usres.entity';
import { ApiProperty } from "@nestjs/swagger";

export class GenerateUserTokenDto {
    @ApiProperty({ type: String, example: '1', nullable: false, description: 'ID' })
    id: string;

    @ApiProperty({ type: String, example: 'test@mail.ru', nullable: false, description: 'E-mail' })
    email: string;

    @ApiProperty({ enum: UserRole, example: UserRole.GUEST, nullable: true, description: 'Роль' })
    role: UserRole;
}
