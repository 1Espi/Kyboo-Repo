// server/actions/books/createBook.ts
"use server";

import { db } from "@/db";
import { books } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createBookAction(formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return { success: false, error: "No autorizado" };
    }

    // Extracción de datos del FormData
    const title = formData.get("title") as string;
    const author = formData.get("author") as string;
    const publisher = formData.get("publisher") as string;
    const yearRaw = formData.get("year") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const genresRaw = formData.get("genres") as string;

    // Procesamiento y Validación
    // Convertimos la cadena de géneros separada por comas en un Array limpio
    const genresArray = genresRaw
      ? genresRaw
          .split(",")
          .map((g) => g.trim())
          .filter((g) => g.length > 0)
      : [];

    const year = yearRaw ? parseInt(yearRaw, 10) : null;

    // Inserción en DB con Drizzle
    await db.insert(books).values({
      id: crypto.randomUUID(), // Generamos UUID para el ID del libro
      ownerId: user.id,
      title,
      author,
      publisher,
      year,
      description,
      imageUrl,
      genres: genresArray, // Drizzle maneja la conversión a formato Array de Postgres
      status: "disponible",
    });

    // Revalidación de Caché
    // Esto es crucial: le dice a Next.js que purgue la caché de la home page
    // para que el nuevo libro aparezca sin necesidad de recargar manualmente.
    revalidatePath("/");

    // Redirección o feedback
    return { success: true };
  } catch (error) {
    console.error("Error al crear libro:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al crear el libro",
    };
  }
}

