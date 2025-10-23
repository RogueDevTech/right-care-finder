import { Controller, Post, Body, Version } from "@nestjs/common";
import { InvitationService } from "./invitation.service";
import { Public } from "../auth/decorators/public.decorator";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Invitations")
@Controller("v1/invitations")
export class InvitationsController {
  constructor(private readonly invitationService: InvitationService) {}

  @Version("v1")
  @Post("accept")
  @Public()
  @ApiOperation({
    summary: "Accept invitation",
    description: "Accepts an invitation and creates a user account",
  })
  @ApiResponse({
    status: 200,
    description: "Invitation accepted successfully",
  })
  @ApiResponse({
    status: 400,
    description: "Invalid invitation or user already exists",
  })
  async acceptInvitation(
    @Body() body: { token: string; password: string; phoneNumber?: string }
  ) {
    try {
      const result = await this.invitationService.acceptInvitation(
        body.token,
        body.password,
        body.phoneNumber
      );
      return {
        success: true,
        message:
          "Invitation accepted successfully. User account created with OWNER role.",
        data: result,
      };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "An error occurred",
      };
    }
  }
}
