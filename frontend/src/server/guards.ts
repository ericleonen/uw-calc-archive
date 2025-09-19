import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser } from "./auth";

/**
 * If a user is logged in, returns the User. Otherwise, redirects to "/login".
 */
export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return user;
}

/**
 * If a user is logged in, redirects to "/search". Otherwise, does nothing.
 */
export async function requireNoUser() {
    const user = await getCurrentUser();

    if (user) redirect("/search");
}