"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { type SupabaseClient } from "@supabase/supabase-js";
import OpenAI from "openai";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
};

export const addDeviceAction = async (data: FormData) => {
  const client = await createClient();

  const isAuthenticated = authGuard(client);
  if (!isAuthenticated) return redirect("/sign-in");

  const typeId = data.get("typeId");
  const name = data.get("name");

  const model = {
    name: name?.toString(),
    typeId: parseInt(typeId?.toString() ?? "1"),
  };

  await client.from("Devices").insert(model);

  revalidatePath("/dashboard/devices");
  revalidatePath("/dashboard");

  return redirect("/dashboard/devices");
};

export const updateDeviceAction = async (data: FormData) => {
  const client = await createClient();

  const isAuthenticated = authGuard(client);
  if (!isAuthenticated) return redirect("/sign-in");

  const id = data.get("id");
  const name = data.get("name");

  const model = {
    id: parseInt(id?.toString() ?? "0"),
    name: name?.toString(),
  };

  console.log(model);

  const { error } = await client
    .from("Devices")
    .update(model)
    .eq("id", id?.toString());

  console.log(error);

  revalidatePath("/dashboard/devices");
  revalidatePath("/dashboard");

  return redirect("/dashboard/devices");
};

const authGuard = async (client: SupabaseClient<any, "public", any>) => {
  const { error } = await client.auth.getUser();
  if (error) return false;

  return true;
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemMessage: AiState = {
  role: "system",
  content: `You are a helpful water consumption assistant that provide short answers. 
  Only use provided functions. You help people with questions about their water consumption and how to minimize them. 
  If a user asks for something other than what you can provide, 
  please politely reply that you can't help with that.`,
};

const aiMessages: AiState[] = [systemMessage];

export async function processAiMessage(
  prevState: AiState[],
  formData: FormData
) {
  const userMessage = formData.get("message")?.toString().trim();

  const clear = formData.get("clear")?.toString();

  if (clear === "true") {
    aiMessages.splice(1, aiMessages.length);
    return aiMessages;
  }

  aiMessages.push({
    role: "user",
    content: userMessage!,
  });

  // we will use a loop in case we need to provide some functions to the ai agent
  for (let i = 0; i < 5; i++) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: aiMessages,
        // tools: [],
        max_completion_tokens: 500,
      });

      const { finish_reason, message } = response.choices[0];

      if (finish_reason === "tool_calls" && message.tool_calls) {
      } else if (finish_reason === "stop") {
        aiMessages.push({
          role: "system",
          content: message.content!,
        });

        return aiMessages;
      }
    } catch (err: any) {
      if (err.code === "insufficient_quota") {
        aiMessages.push({
          role: "system",
          content:
            "I'm sorry, i can't help you right now.<br/><p class='text-sm text-muted-foreground font-semibold'>(Reason: Q-404)</p>",
        });
      }
      return aiMessages;
    }
  }

  return aiMessages;
}

export type AiState = {
  role?: string;
  content: string;
  name?: string;
};

