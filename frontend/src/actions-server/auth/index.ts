"use server";

import { ISession, IUser } from "@/interfaces";
import { defaultSession, sessionOptions } from "@/libs/custom-auth";
import { getIronSession } from "iron-session";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getSession = async () => {
  try {
    const session = await getIronSession<ISession>(
      await cookies(),
      sessionOptions
    );
    if (!session?.isLoggedIn) {
      session.isLoggedIn = defaultSession?.isLoggedIn;
    }

    const plainSession: ISession = {
      isLoggedIn: session?.isLoggedIn || defaultSession.isLoggedIn,
    };
    if (session?.user) {
      plainSession.user = session.user;
    }
    if (session?.token) {
      plainSession.token = session.token;
    }
    return plainSession;
  } catch {
    return defaultSession;
  }
};

export const createSession = async (sessionData: {
  user: IUser;
  token: string;
}) => {
  const session = await getIronSession<ISession>(
    await cookies(),
    sessionOptions
  );
  session.isLoggedIn = true;
  session.user = sessionData?.user;
  session.token = sessionData?.token;
  await session.save();
  revalidatePath("");
  return { ok: true };
};

export const logout = async () => {
  const session = await getIronSession<ISession>(
    await cookies(),
    sessionOptions
  );
  session.destroy();
  revalidatePath("");
  redirect("/");
};

export const updateSessionData = async (user: IUser) => {
  const session = await getIronSession<ISession>(
    await cookies(),
    sessionOptions
  );
  session.user = user;
  session.isLoggedIn = true;
  session.token = session.token;

  await session.save();
  return { ok: true };
};
