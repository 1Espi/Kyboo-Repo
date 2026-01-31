"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface UpdateProfileData {
  name?: string;
  username?: string;
  preferences?: string[];
}

export async function updateUserProfile(data: UpdateProfileData) {
  try {
    const user = await getCurrentUser();

    if (!user || !user.id) {
      return { success: false, error: "No autorizado" };
    }

    // Check if username is taken (if updating username)
    if (data.username) {
      const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, data.username))
        .limit(1);

      if (existingUser && existingUser.id !== user.id) {
        return { success: false, error: "El nombre de usuario ya está en uso" };
      }
    }

    // Update user profile
    const updateData: Partial<typeof users.$inferInsert> = {};
    
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.username !== undefined) updateData.username = data.username.trim();
    if (data.preferences !== undefined) updateData.preferences = data.preferences;

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: "No hay datos para actualizar" };
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, user.id));

    revalidatePath("/profile");
    revalidatePath("/home");

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al actualizar perfil",
    };
  }
}
