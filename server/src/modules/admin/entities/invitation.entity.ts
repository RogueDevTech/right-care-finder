import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { CareHome } from "../../healthcare-homes/entities/care-home.entity";

export enum InvitationStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  EXPIRED = "expired",
}

@Entity("invitations")
export class Invitation {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  careHomeId: string;

  @ManyToOne(() => CareHome, { nullable: true })
  @JoinColumn({ name: "careHomeId" })
  careHome: CareHome;

  @Column({ type: "text", nullable: true })
  message: string;

  @Column({
    type: "enum",
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  acceptedAt: Date;

  @Column({ nullable: true })
  acceptedByUserId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "acceptedByUserId" })
  acceptedByUser: User;

  @Column()
  invitedByUserId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "invitedByUserId" })
  invitedByUser: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
