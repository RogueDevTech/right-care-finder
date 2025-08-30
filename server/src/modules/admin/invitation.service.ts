import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Invitation, InvitationStatus } from "./entities/invitation.entity";
import { User } from "../users/entities/user.entity";
import { CareHome } from "../healthcare-homes/entities/care-home.entity";
import { CreateInvitationDto } from "./dto/invitation.dto";
import { EmailService } from "../core/services/email.service";
import { randomBytes } from "crypto";

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(CareHome)
    private careHomeRepository: Repository<CareHome>,
    private emailService: EmailService
  ) {}

  async createInvitation(
    createInvitationDto: CreateInvitationDto,
    invitedByUserId: string
  ) {
    // Check if user already exists with this email
    const existingUser = await this.userRepository.findOne({
      where: { email: createInvitationDto.email },
    });

    if (existingUser) {
      throw new BadRequestException(
        "A user with this email address already exists"
      );
    }

    // Check if invitation already exists for this email
    const existingInvitation = await this.invitationRepository.findOne({
      where: { email: createInvitationDto.email },
    });

    if (existingInvitation) {
      // If invitation exists and is pending, allow resending
      if (existingInvitation.status === InvitationStatus.PENDING) {
        // Check if invitation is expired
        const isExpired = existingInvitation.expiresAt < new Date();

        // Generate new token and extend expiration
        const newToken = randomBytes(32).toString("hex");
        const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        existingInvitation.token = newToken;
        existingInvitation.expiresAt = newExpiresAt;
        existingInvitation.firstName = createInvitationDto.firstName;
        existingInvitation.lastName = createInvitationDto.lastName;
        existingInvitation.phoneNumber = createInvitationDto.phoneNumber;
        existingInvitation.careHomeId = createInvitationDto.careHomeId;
        existingInvitation.message = createInvitationDto.message;

        // If it was expired, update status back to pending
        if (isExpired) {
          existingInvitation.status = InvitationStatus.PENDING;
        }

        const updatedInvitation =
          await this.invitationRepository.save(existingInvitation);

        // Send new invitation email
        await this.sendInvitationEmail(updatedInvitation);

        return this.mapToResponseDto(updatedInvitation);
      } else if (existingInvitation.status === InvitationStatus.EXPIRED) {
        // Allow resending expired invitations
        const newToken = randomBytes(32).toString("hex");
        const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        existingInvitation.token = newToken;
        existingInvitation.expiresAt = newExpiresAt;
        existingInvitation.status = InvitationStatus.PENDING;
        existingInvitation.firstName = createInvitationDto.firstName;
        existingInvitation.lastName = createInvitationDto.lastName;
        existingInvitation.phoneNumber = createInvitationDto.phoneNumber;
        existingInvitation.careHomeId = createInvitationDto.careHomeId;
        existingInvitation.message = createInvitationDto.message;

        const updatedInvitation =
          await this.invitationRepository.save(existingInvitation);

        // Send new invitation email
        await this.sendInvitationEmail(updatedInvitation);

        return this.mapToResponseDto(updatedInvitation);
      } else {
        throw new BadRequestException(
          "An invitation has already been sent to this email address and has been accepted"
        );
      }
    }

    // Generate invitation token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days

    const invitation = this.invitationRepository.create({
      ...createInvitationDto,
      token,
      expiresAt,
      invitedByUserId,
      status: InvitationStatus.PENDING,
    });

    const savedInvitation = await this.invitationRepository.save(invitation);

    // TODO: Send invitation email here
    await this.sendInvitationEmail(savedInvitation);

    return this.mapToResponseDto(savedInvitation);
  }

  async getInvitations(
    page: number = 1,
    limit: number = 10,
    status?: InvitationStatus
  ) {
    const queryBuilder = this.invitationRepository
      .createQueryBuilder("invitation")
      .leftJoinAndSelect("invitation.invitedByUser", "invitedByUser")
      .leftJoinAndSelect("invitation.acceptedByUser", "acceptedByUser")
      .orderBy("invitation.createdAt", "DESC");

    if (status) {
      queryBuilder.andWhere("invitation.status = :status", { status });
    }

    const [invitations, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      invitations: invitations.map((invitation) =>
        this.mapToResponseDto(invitation)
      ),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async getInvitationById(id: string) {
    const invitation = await this.invitationRepository.findOne({
      where: { id },
      relations: ["invitedByUser", "acceptedByUser"],
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    return this.mapToResponseDto(invitation);
  }

  async resendInvitation(id: string) {
    const invitation = await this.invitationRepository.findOne({
      where: { id },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException(
        "Cannot resend invitation that is not pending"
      );
    }

    // Generate new token and extend expiration
    const newToken = randomBytes(32).toString("hex");
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    invitation.token = newToken;
    invitation.expiresAt = newExpiresAt;

    const updatedInvitation = await this.invitationRepository.save(invitation);

    // Send new invitation email
    await this.sendInvitationEmail(updatedInvitation);

    return this.mapToResponseDto(updatedInvitation);
  }

  async cancelInvitation(id: string) {
    const invitation = await this.invitationRepository.findOne({
      where: { id },
    });

    if (!invitation) {
      throw new NotFoundException("Invitation not found");
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException(
        "Cannot cancel invitation that is not pending"
      );
    }

    await this.invitationRepository.remove(invitation);

    return { message: "Invitation cancelled successfully" };
  }

  async acceptInvitation(token: string, userId: string) {
    const invitation = await this.invitationRepository.findOne({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException("Invalid invitation token");
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException("Invitation is no longer valid");
    }

    if (invitation.expiresAt < new Date()) {
      invitation.status = InvitationStatus.EXPIRED;
      await this.invitationRepository.save(invitation);
      throw new BadRequestException("Invitation has expired");
    }

    // Update invitation status
    invitation.status = InvitationStatus.ACCEPTED;
    invitation.acceptedAt = new Date();
    invitation.acceptedByUserId = userId;

    await this.invitationRepository.save(invitation);

    return this.mapToResponseDto(invitation);
  }

  async cleanupExpiredInvitations() {
    const expiredInvitations = await this.invitationRepository
      .createQueryBuilder("invitation")
      .where("invitation.status = :status", {
        status: InvitationStatus.PENDING,
      })
      .andWhere("invitation.expiresAt < :now", { now: new Date() })
      .getMany();

    for (const invitation of expiredInvitations) {
      invitation.status = InvitationStatus.EXPIRED;
    }

    if (expiredInvitations.length > 0) {
      await this.invitationRepository.save(expiredInvitations);
    }

    return { expiredCount: expiredInvitations.length };
  }

  private async sendInvitationEmail(invitation: Invitation) {
    const invitationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/accept-invitation?token=${invitation.token}`;

    // Get care home details if careHomeId is provided
    let careHomeDetails = "";
    if (invitation.careHomeId) {
      const careHome = await this.careHomeRepository.findOne({
        where: { id: invitation.careHomeId },
      });
      if (careHome) {
        careHomeDetails = `
          <p><strong>Care Home:</strong> ${careHome.name}</p>
          <p><strong>Address:</strong> ${careHome.addressLine1}, ${careHome.city} ${careHome.postcode}</p>
        `;
      }
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Care Home Owner Invitation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1c7c8a; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #1c7c8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .highlight { background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Right Care Finder</h1>
            <p>You've been invited to manage your care home</p>
          </div>
          <div class="content">
            <h2>Hello ${invitation.firstName} ${invitation.lastName},</h2>
            
            <p>You have been invited to join Right Care Finder as a care home owner. This platform will help you manage your care home more effectively and connect with families looking for care.</p>
            
            ${careHomeDetails}
            
            <div class="highlight">
              <h3>What you'll be able to do:</h3>
              <ul>
                <li>Manage your care home profile and information</li>
                <li>Handle enquiries and bookings from families</li>
                <li>Update availability and pricing</li>
                <li>Manage reviews and ratings</li>
                <li>Access business analytics and reports</li>
                <li>Ensure compliance with regulations</li>
              </ul>
            </div>
            
            <p>To accept this invitation and set up your account, please click the button below:</p>
            
            <div style="text-align: center;">
              <a href="${invitationUrl}" class="button">Accept Invitation</a>
            </div>
            
            <p><strong>Important:</strong> This invitation will expire on ${new Date(invitation.expiresAt).toLocaleDateString()}. If you don't accept it by then, you'll need to request a new invitation.</p>
            
            ${invitation.message ? `<div class="highlight"><p><strong>Personal Message:</strong><br>${invitation.message}</p></div>` : ""}
            
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>The Right Care Finder Team</p>
          </div>
          <div class="footer">
            <p>This email was sent to ${invitation.email}</p>
            <p>If you didn't expect this invitation, please ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.emailService.sendEmail({
        to: invitation.email,
        subject:
          "You're Invited to Join Right Care Finder as a Care Home Owner",
        html: htmlContent,
      });

      console.log(`Invitation email sent successfully to ${invitation.email}`);
    } catch {
      // Don't throw error here to avoid breaking the invitation creation process
      // The invitation is still created even if email fails
    }
  }

  private mapToResponseDto(invitation: Invitation) {
    return {
      id: invitation.id,
      email: invitation.email,
      firstName: invitation.firstName,
      lastName: invitation.lastName,
      phoneNumber: invitation.phoneNumber,
      careHomeId: invitation.careHomeId,
      careHomeName: invitation.careHome?.name,
      careHomeAddress: invitation.careHome
        ? `${invitation.careHome.addressLine1}, ${invitation.careHome.city} ${invitation.careHome.postcode}`
        : undefined,
      message: invitation.message,
      status: invitation.status,
      invitedByUserId: invitation.invitedByUserId,
      invitedByUserName: invitation.invitedByUser
        ? `${invitation.invitedByUser.firstName} ${invitation.invitedByUser.lastName}`
        : "Unknown",
      expiresAt: invitation.expiresAt,
      acceptedAt: invitation.acceptedAt,
      createdAt: invitation.createdAt,
      updatedAt: invitation.updatedAt,
    };
  }
}
